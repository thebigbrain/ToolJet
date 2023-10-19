import React from "react";
import {
  authenticationService,
  orgEnvironmentVariableService,
  orgEnvironmentConstantService,
  organizationService,
} from "@/_services";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Container } from "./Container";
import { Confirm } from "./Viewer/Confirm";
import { ViewerNavigation } from "./Viewer/ViewerNavigation";
import {
  onComponentOptionChanged,
  onComponentOptionsChanged,
  onComponentClick,
  onQueryConfirmOrCancel,
  onEvent,
  runQuery,
  computeComponentState,
} from "@/core/appUtils";
import queryString from "query-string";
import { DataSourceTypes } from "./DataSourceManager/SourceComponents";
import {
  resolveReferences,
  safelyParseJSON,
  stripTrailingSlash,
  getSubpath,
  excludeWorkspaceIdFromURL,
  isQueryRunnable,
  redirectToDashboard,
  getWorkspaceId,
} from "@externals/helpers/utils";
import { WithTranslation, withTranslation } from "react-i18next";
import _ from "lodash";
import { toast } from "react-hot-toast";
import { withRouter } from "@/_hoc/withRouter";
import { useEditorStore } from "@/_stores/editorStore";
import { setCookie } from "@externals/helpers/cookie";
import { useDataQueriesStore } from "@/_stores/dataQueriesStore";
import { useCurrentStateStore } from "@/_stores/currentStateStore";
import { shallow } from "zustand/shallow";
import { getService } from "@/core/service";
import { WithRouterProps } from "@/interfaces/router";
import { User } from "@/interfaces/user";
import {
  AppId,
  Application,
  ApplicationDefinition,
  ApplicationService,
  VersionId,
  toVersionId,
} from "@/modules/apps";
import { PageHandle, PageId, PagesMap } from "@/interfaces/page";
import { JetComponentEntity } from "@/interfaces/jetcomponent";
import { navigateTo } from "@externals/helpers/routes";
import { JetRouteName, navigate, toLoginPage } from "@/modules/routes";
import { authStateObs } from "@/modules/auth/auth-obs";
import { Subscription } from "@externals/observables";
import {
  LoadingWithCenterdSpinner,
  LoadingWithLogoSpinner,
} from "./_components/Loading";
import { MaintenanceWarning } from "./_components/Maintenance";
import { getThemeMode } from "../theme/mode";
import { tenary } from "@externals/iscripts/operators";
import { getCurrentSession } from "../users";

type ViewerProps = {
  darkMode?: boolean;
  switchDarkMode: (newMode: boolean) => void;
} & {
  currentState;
  setCurrentState;
  currentLayout;
} & WithRouterProps &
  WithTranslation;

interface ViewerState {
  currentUser?: User;
  slug;
  app?: Application;
  appId?: AppId;
  versionId?: VersionId;
  deviceWindowWidth;
  isLoading: boolean;
  users?: Array<User>;
  appDefinition?: ApplicationDefinition;
  queryConfirmationList: Array<any>;
  isAppLoaded: boolean;
  errorAppId?: AppId;
  errorVersionId?: VersionId;
  errorDetails;
  pages?: PagesMap;
  homepage?;
  initialComputationOfStateDone?: boolean;
  currentPageId?: PageId;
  currentSidebarTab?: number;
  canvasWidth?: string | number;
  selectedComponent?: JetComponentEntity;
  dataQueries?;
  handle?: PageHandle;
  name?: string;
  showQuerySearchField?: boolean;
  defaultComponentStateComputed?: boolean;
}

class ViewerComponent extends React.Component<ViewerProps, ViewerState> {
  subscription?: Subscription;

  constructor(props) {
    super(props);

    const deviceWindowWidth = window.screen.width - 5;

    const slug = this.props.params.slug;
    const appId = this.props.params.id;
    const versionId = toVersionId(this.props.params.versionId);

    this.subscription = null;

    this.state = {
      slug,
      appId,
      versionId,
      deviceWindowWidth,
      currentUser: null,
      isLoading: true,
      users: null,
      appDefinition: { pages: new Map() },
      queryConfirmationList: [],
      isAppLoaded: false,
      errorAppId: null,
      errorVersionId: null,
      errorDetails: null,
      pages: new Map(),
      homepage: null,
    };
  }

  setStateForApp = (app) => {
    const copyDefinition = _.cloneDeep(app.definition);
    const pagesObj = copyDefinition?.pages || {};

    const newDefinition = {
      ...copyDefinition,
      pages: pagesObj,
    };

    this.setState({
      app,
      isLoading: false,
      isAppLoaded: true,
      appDefinition: newDefinition || { components: {} },
    });
  };

  setStateForContainer = async (data) => {
    console.log(data);
    let mobileLayoutHasWidgets = false;

    if (this.props.currentLayout === "mobile") {
      const currentComponents =
        data.definition?.pages[data.definition?.homePageId].components;
      mobileLayoutHasWidgets =
        Object.keys(currentComponents).filter(
          (componentId) => currentComponents[componentId]["layouts"]["mobile"]
        ).length > 0;
    }

    let queryState = {};
    data.data_queries?.forEach((query) => {
      if (query.pluginId || query?.plugin?.id) {
        queryState[query.name] = {
          ...query.plugin.manifestFile.data.source.exposedVariables,
          ...this.props.currentState.queries[query.name],
        };
      } else {
        const dataSourceTypeDetail = DataSourceTypes.find(
          (source) => source.kind === query.kind
        );
        queryState[query.name] = {
          ...dataSourceTypeDetail.exposedVariables,
          ...this.props.currentState.queries[query.name],
        };
      }
    });

    const variables = await this.fetchOrgEnvironmentVariables(
      data.slug,
      data.is_public
    );
    const constants = await this.fetchOrgEnvironmentConstants(
      data.slug,
      data.is_public
    );

    const definition: ApplicationDefinition = data.definition;

    const pages = Object.entries(definition?.pages || {}).map(
      ([pageId, page]) => ({
        id: pageId,
        ...page,
      })
    );
    const homePageId = definition?.homePageId;
    const startingPageHandle = this.props?.params?.pageHandle;
    const currentPageId =
      pages.filter((page) => page.handle === startingPageHandle)[0]?.id ??
      homePageId;
    const currentPage = pages.find((page) => page.id === currentPageId);

    useDataQueriesStore.getState().actions.setDataQueries(data.data_queries);
    this.props.setCurrentState({
      queries: queryState,
      components: {},
      globals: {
        theme: { name: this.props.darkMode ? "dark" : "light" },
        urlparams: JSON.parse(
          JSON.stringify(queryString.parse(this.props.location.search))
        ),
        mode: {
          value: this.state.slug ? "view" : "preview",
        },
      },
      variables: {},
      page: {
        ...currentPage,
        variables: {},
      },
      ...variables,
      ...constants,
    });
    useEditorStore
      .getState()
      .actions.toggleCurrentLayout(
        mobileLayoutHasWidgets ? "mobile" : "desktop"
      );
    this.setState(
      {
        currentSidebarTab: 2,
        canvasWidth:
          this.props.currentLayout === "desktop"
            ? "100%"
            : mobileLayoutHasWidgets
            ? `${this.state.deviceWindowWidth}px`
            : "1292px",
        selectedComponent: null,
        dataQueries: data.data_queries,
        currentPageId: currentPage?.id,
        pages: new Map(),
        homepage:
          this.state.appDefinition?.pages?.[
            this.state.appDefinition?.homePageId
          ]?.handle,
      },
      () => {
        computeComponentState(
          this,
          data?.definition?.pages[currentPage?.id]?.components
        ).then(async () => {
          this.setState({ initialComputationOfStateDone: true });
          console.log("Default component state computed and set");
          this.runQueries(data.data_queries);
          // eslint-disable-next-line no-unsafe-optional-chaining
          const { events } =
            this.state.appDefinition?.pages[this.state.currentPageId] ?? {};
          for (const event of events ?? []) {
            await this.handleEvent(event.eventId, event);
          }
        });
      }
    );
  };

  runQueries = (data_queries) => {
    data_queries?.forEach((query) => {
      if (query.options.runOnPageLoad && isQueryRunnable(query)) {
        runQuery(this, query.id, query.name, undefined, "view");
      }
    });
  };

  fetchOrgEnvironmentConstants = async (slug, isPublic) => {
    const orgConstants = {};

    let variablesResult;
    if (!isPublic) {
      const { constants } = await orgEnvironmentConstantService.getAll();
      variablesResult = constants;
    } else {
      const { constants } =
        await orgEnvironmentConstantService.getConstantsFromPublicApp(slug);

      variablesResult = constants;
    }

    console.log("--org constant 2.0", { variablesResult });

    if (variablesResult && Array.isArray(variablesResult)) {
      variablesResult.map((constant) => {
        const constantValue = constant.values.find(
          (value) => value.environmentName === "production"
        )["value"];
        orgConstants[constant.name] = constantValue;
      });

      // console.log('--org constant 2.0', { orgConstants });

      return {
        constants: orgConstants,
      };
    }

    return { constants: {} };
  };

  fetchOrgEnvironmentVariables = async (slug, isPublic) => {
    const variables = {
      client: {},
      server: {},
    };

    let variablesResult;
    if (!isPublic) {
      variablesResult = await orgEnvironmentVariableService.getVariables();
    } else {
      variablesResult =
        await orgEnvironmentVariableService.getVariablesFromPublicApp(slug);
    }

    variablesResult.variables.map((variable) => {
      variables[variable.variable_type][variable.variable_name] =
        variable.variable_type === "server"
          ? "HiddenEnvironmentVariable"
          : variable.value;
    });
    return variables;
  };

  get appService() {
    return getService<ApplicationService>(ApplicationService);
  }

  loadDone = () => {
    this.setState({ isLoading: false });
  };

  loadApplicationBySlug = (slug) => {
    this.appService
      .getAppBySlug(slug)
      .then((data) => {
        this.setStateForApp(data);
        this.setStateForContainer(data);
        this.setWindowTitle(data.name);
      })
      .catch((error) => {
        this.setState({
          errorDetails: error,
          errorAppId: slug,
          errorVersionId: null,
        });
      })
      .finally(this.loadDone);
  };

  loadApplicationByVersion = (appId, versionId) => {
    this.appService
      .getAppByVersion(appId, versionId)
      .then((data) => {
        this.setStateForApp(data);
        this.setStateForContainer(data);
      })
      .catch((error) => {
        this.setState({
          errorDetails: error,
          errorAppId: appId,
          errorVersionId: versionId,
        });
      })
      .finally(this.loadDone);
  };

  switchOrganization = (orgId, appId, versionId) => {
    const path = `/applications/${appId}${
      versionId ? `/versions/${versionId}` : ""
    }`;
    const sub_path = window?.appConfig?.SUB_PATH
      ? stripTrailingSlash(window?.appConfig?.SUB_PATH)
      : "";

    organizationService.switchOrganization(orgId).then(
      () => {
        window.location.href = `${sub_path}${path}`;
      },
      () => {
        return (window.location.href = `${sub_path}/login/${orgId}?redirectTo=${path}`);
      }
    );
  };

  handleError = (errorDetails, appId, versionId) => {
    try {
      if (errorDetails?.data) {
        const statusCode = errorDetails.data?.statusCode;
        if (statusCode === 403) {
          const errorObj = safelyParseJSON(errorDetails.data?.message);
          const currentSessionValue = authenticationService.currentSessionValue;
          if (
            errorObj?.organizationId &&
            this.state.currentUser &&
            currentSessionValue.current_organization_id !==
              errorObj?.organizationId
          ) {
            this.switchOrganization(errorObj?.organizationId, appId, versionId);
            return;
          }
          /* router dom Navigate is not working now. so hard reloading */
          redirectToDashboard();
          return;
        } else if (statusCode === 401) {
          navigateTo(
            `${getSubpath() ?? ""}/login${
              !_.isEmpty(getWorkspaceId()) ? `/${getWorkspaceId()}` : ""
            }?redirectTo=${this.props.location.pathname}`
          );
        } else if (statusCode === 404) {
          toast.error(errorDetails?.error ?? "App not found", {
            position: "top-center",
          });
        } else {
          redirectToDashboard();
          return;
        }
      }
    } catch (err) {
      redirectToDashboard();
      return;
    }
  };

  private loadApp() {
    const { params, currentState, setCurrentState } = this.props;
    const { slug, id: appId, versionId } = params;

    const currentSession = getCurrentSession();

    if (slug) {
      this.loadApplicationBySlug(slug);
    } else {
      if (currentSession?.group_permissions) {
        setCurrentState({
          globals: {
            ...currentState.globals,
          },
        });

        this.loadApplicationByVersion(appId, versionId);
      } else {
        toLoginPage();

        this.setState({ isLoading: false });
      }
    }
  }

  setupViewer() {
    this.subscription = authStateObs.subscribe(this.loadApp);

    this.loadApp();
  }

  /**
   *
   * ThandleMessage event listener in the login component fir iframe communication.
   * It now checks if the received message has a type of 'redirectTo' and extracts the redirectPath value from the payload.
   * If the value is present, it sets a cookie named 'redirectPath' with the received value and a one-day expiration.
   * This allows for redirection to a specific path after the login process is completed.
   */
  handleMessage = (event) => {
    const { data } = event;

    if (data?.type === "redirectTo") {
      const redirectCookie = data?.payload["redirectPath"];
      setCookie("redirectPath", redirectCookie, true);
    }
  };

  componentDidMount() {
    this.setupViewer();
    const isMobileDevice = this.state.deviceWindowWidth < 600;
    useEditorStore
      .getState()
      .actions.toggleCurrentLayout(isMobileDevice ? "mobile" : "desktop");
    window.addEventListener("message", this.handleMessage);
  }

  componentDidUpdate(prevProps, prevState) {
    const { location, params } = this.props;
    const { slug, id, versionId, pageHandle } = params;

    if (slug && slug !== prevProps.params.slug) {
      this.setState({ isLoading: true });
      this.loadApplicationBySlug(this.props.params.slug);
    }

    if (this.state.initialComputationOfStateDone) {
      this.handlePageSwitchingBasedOnURLparam();
    }

    if (this.state.homepage !== prevState.homepage && !this.state.isLoading) {
      navigate({
        to: JetRouteName.app_viewer,
        search: pageHandle ? "" : location.search,
        state: { id, versionId, pageHandle: this.state.homepage },
        replace: true,
      });
    }
  }

  handlePageSwitchingBasedOnURLparam() {
    const handleOnURL = this.props.params.pageHandle;
    const pageIdCorrespondingToHandleOnURL = handleOnURL
      ? this.findPageIdFromHandle(handleOnURL)
      : this.state.appDefinition.homePageId;
    const currentPageId = this.state.currentPageId;

    if (pageIdCorrespondingToHandleOnURL != this.state.currentPageId) {
      const targetPage =
        this.state.appDefinition.pages[pageIdCorrespondingToHandleOnURL];
      this.props.setCurrentState({
        globals: {
          ...this.props.currentState.globals,
          urlparams: JSON.parse(
            JSON.stringify(queryString.parse(this.props.location.search))
          ),
        },
        page: {
          ...this.props.currentState.page,
          name: targetPage.name,
          handle: targetPage.handle,
          variables:
            this.state.pages?.[pageIdCorrespondingToHandleOnURL]?.variables ??
            {},
          id: pageIdCorrespondingToHandleOnURL,
        },
      });

      this.setState(
        {
          pages: {
            ...this.state.pages,
            [currentPageId]: {
              ...this.state.pages?.[currentPageId],
              variables: {
                ...this.props.currentState?.page?.variables,
              },
            },
          },
          currentPageId: pageIdCorrespondingToHandleOnURL,
          handle: targetPage.handle,
          name: targetPage.name,
        },
        async () => {
          computeComponentState(
            this,
            this.state.appDefinition?.pages[this.state.currentPageId].components
          ).then(async () => {
            // eslint-disable-next-line no-unsafe-optional-chaining
            const { events } =
              this.state.appDefinition?.pages[this.state.currentPageId];
            for (const event of events ?? []) {
              await this.handleEvent(event.eventId, event);
            }
          });
        }
      );
    }
  }

  findPageIdFromHandle(handle) {
    return (
      Object.entries(this.state.appDefinition.pages).filter(
        ([_id, page]) => page.handle === handle
      )?.[0]?.[0] ?? this.state.appDefinition.homePageId
    );
  }

  getCanvasWidth = () => {
    const canvasBoundingRect = document
      .getElementsByClassName("canvas-area")[0]
      ?.getBoundingClientRect();
    return canvasBoundingRect?.width;
  };

  setWindowTitle(name) {
    document.title = name ?? "My App";
  }

  computeCanvasBackgroundColor = () => {
    const bgColor =
      (this.state.appDefinition.globalSettings?.backgroundFxQuery ||
        this.state.appDefinition.globalSettings?.canvasBackgroundColor) ??
      "#edeff5";
    const resolvedBackgroundColor = resolveReferences(
      bgColor,
      this.props.currentState
    );
    if (["#2f3c4c", "#edeff5"].includes(resolvedBackgroundColor)) {
      return this.props.darkMode ? "#2f3c4c" : "#edeff5";
    }
    return resolvedBackgroundColor;
  };

  changeDarkMode = (newMode) => {
    this.props.setCurrentState({
      globals: {
        ...this.props.currentState.globals,
        theme: { name: newMode ? "dark" : "light" },
      },
    });
    this.setState({
      showQuerySearchField: false,
    });
    this.props.switchDarkMode(newMode);
  };

  switchPage = (id, queryParams = []) => {
    document.getElementById("real-canvas").scrollIntoView();

    if (this.state.currentPageId === id) return;

    const { handle } = this.state.appDefinition.pages[id];

    const queryParamsString = queryParams
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    if (this.state.slug)
      this.props.navigate(
        `/applications/${this.state.slug}/${handle}?${queryParamsString}`
      );
    else
      this.props.navigate(
        `/applications/${this.state.appId}/versions/${this.state.versionId}/${handle}?${queryParamsString}`
      );
  };

  handleEvent = (eventName, options) =>
    onEvent(this, eventName, options, "view");

  computeCanvasMaxWidth = () => {
    const { appDefinition } = this.state;
    let computedCanvasMaxWidth: number | string = 1292;

    if (appDefinition.globalSettings?.canvasMaxWidthType === "px")
      computedCanvasMaxWidth =
        (+appDefinition.globalSettings?.canvasMaxWidth || 1292) -
        (appDefinition?.showViewerNavigation ? 200 : 0);
    else if (appDefinition.globalSettings?.canvasMaxWidthType === "%")
      computedCanvasMaxWidth =
        +appDefinition.globalSettings?.canvasMaxWidth + "%";

    return computedCanvasMaxWidth;
  };

  componentWillUnmount() {
    this.subscription?.unsubscribe();
  }

  render() {
    const {
      app,
      appDefinition,
      isLoading,
      deviceWindowWidth,
      defaultComponentStateComputed,
      dataQueries,
      queryConfirmationList,
      errorAppId,
      errorVersionId,
      errorDetails,
      canvasWidth,
    } = this.state;

    const currentCanvasWidth = canvasWidth;

    const canvasMaxWidth = this.computeCanvasMaxWidth();

    if (isLoading) {
      return <LoadingWithLogoSpinner />;
    }

    if (app?.is_maintenance_on) {
      return <MaintenanceWarning />;
    }

    if (errorDetails) {
      this.handleError(errorDetails, errorAppId, errorVersionId);
    }

    return (
      <EditorViewerComponent
        {...this.state}
        caller={this}
        canvasBackgroundColor={this.computeCanvasBackgroundColor()}
        currentCanvasWidth={currentCanvasWidth}
        canvasMaxWidth={canvasMaxWidth}
        switchPage={this.switchPage}
      />
    );
  }
}

function EditorViewerComponent(props) {
  const {
    caller,
    appDefinition,
    app,
    queryConfirmationList,
    isLoading,
    isAppLoaded,
    defaultComponentStateComputed,
    currentPageId,
    currentLayout,
    currentCanvasWidth,
    canvasMaxWidth,
    switchPage,
    canvasBackgroundColor,
  } = props;

  const themeMode = getThemeMode();
  const isDark = themeMode.isDark;

  return (
    <div className="viewer wrapper">
      <Confirm
        darkMode={isDark}
        show={queryConfirmationList.length > 0}
        message={"Do you want to run this query?"}
        onConfirm={(queryConfirmationData) =>
          onQueryConfirmOrCancel(caller, queryConfirmationData, true, "view")
        }
        onCancel={() =>
          onQueryConfirmOrCancel(
            caller,
            queryConfirmationList[0],
            false,
            "view"
          )
        }
        queryConfirmationData={queryConfirmationList[0]}
        key={queryConfirmationList[0]?.queryName}
      />
      <DndProvider backend={HTML5Backend}>
        <ViewerNavigation.Header
          showHeader={!appDefinition.globalSettings?.hideHeader && isAppLoaded}
          appName={app?.name ?? null}
          changeDarkMode={themeMode.switchMode}
          darkMode={isDark}
          pages={Object.entries(appDefinition?.pages ?? []) ?? []}
          currentPageId={currentPageId ?? appDefinition?.homePageId}
          switchPage={switchPage}
        />
        <div className="sub-section">
          <div className="main">
            <div className="canvas-container align-items-center">
              <div className="areas d-flex flex-rows justify-content-center">
                {tenary(
                  appDefinition?.showViewerNavigation,
                  <ViewerNavigation
                    isMobileDevice={currentLayout === "mobile"}
                    pages={Object.entries(appDefinition?.pages) ?? []}
                    currentPageId={currentPageId ?? appDefinition?.homePageId}
                    switchPage={switchPage}
                    darkMode={isDark}
                  />
                )}
                <div
                  className="canvas-area"
                  style={{
                    width: currentCanvasWidth,
                    maxWidth: canvasMaxWidth,
                    backgroundColor: canvasBackgroundColor,
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {tenary(
                    defaultComponentStateComputed,
                    tenary(
                      isLoading,
                      <LoadingWithCenterdSpinner />,
                      <EditorViewerContainerComponent {...props} />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    </div>
  );
}

function EditorViewerContainerComponent(props) {
  const {
    caller,
    appDefinition,
    isLoading,
    currentPageId,
    deviceWindowWidth,
    currentCanvasWidth,
  }: any = props;

  const themeMode = getThemeMode();
  const isDark = themeMode.isDark;

  return (
    <Container
      appDefinition={appDefinition}
      snapToGrid={true}
      appLoading={isLoading}
      darkMode={isDark}
      onEvent={(eventName, options) =>
        onEvent(caller, eventName, options, "view")
      }
      mode="view"
      deviceWindowWidth={deviceWindowWidth}
      // selectedComponent={this.state.selectedComponent}
      onComponentClick={(id, component) => {
        caller.setState({
          selectedComponent: { id, component },
        });
        onComponentClick(caller, id, component, "view");
      }}
      onComponentOptionChanged={(component, optionName, value) => {
        return onComponentOptionChanged(caller, component, optionName, value);
      }}
      onComponentOptionsChanged={(component, options) =>
        onComponentOptionsChanged(caller, component, options)
      }
      canvasWidth={currentCanvasWidth}
      // dataQueries={dataQueries}
      currentPageId={currentPageId}
    />
  );
}

const withStore = (Component) => (props) => {
  const currentState = useCurrentStateStore();
  const { currentLayout } = useEditorStore(
    (state) => ({
      currentLayout: state?.currentLayout,
    }),
    shallow
  );

  return (
    <Component
      {...props}
      currentState={currentState}
      setCurrentState={currentState?.actions?.setCurrentState}
      currentLayout={currentLayout}
    />
  );
};

export const Viewer = withTranslation()(withStore(withRouter(ViewerComponent)));
