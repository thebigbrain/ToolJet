import React, { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import {
  getWorkspaceIdFromURL,
  appendWorkspaceId,
  stripTrailingSlash,
  pathnameWithoutSubpath,
} from "@externals/helpers/utils";
import { getSubpath } from "@/core/utils";
import {
  authenticationService,
  tooljetService,
  organizationService,
} from "@/_services";
import { withRouter } from "@/_hoc/withRouter";
import { PrivateRoute, AdminRoute } from "@/_components";
import { HomePage, SwitchWorkspacePage } from "@/modules/HomePage";
import { LoginPage } from "@/modules/LoginPage";
import { SignupPage } from "@/SignupPage";
import { TooljetDatabase } from "@/TooljetDatabase";
import { OrganizationInvitationPage } from "../OrganizationInvite";
import { Authorize } from "@/Oauth2";
import { Authorize as Oauth } from "@/Oauth";
import { Viewer } from "@/Editor";
import { OrganizationSettings } from "@/modules/OrganizationSettingsPage";
import { SettingsPage } from "../../SettingsPage/SettingsPage";
import { ForgotPassword } from "@/modules/ForgotPassword";
import { ResetPassword } from "@/ResetPassword";
import { MarketplacePage } from "@/MarketplacePage";
import { GlobalDatasources } from "@/GlobalDatasources";
import { lt } from "semver";
import Toast from "@/_ui/Toast";
import { VerificationSuccessInfoScreen } from "@/SuccessInfoScreen";
import "@/_styles/theme.scss";
import { AppLoader } from "../AppLoader";
import SetupScreenSelfHost from "../../SuccessInfoScreen/SetupScreenSelfHost";
import "react-tooltip/dist/react-tooltip.css";
import { ToastOptions } from "react-hot-toast";

import { navigateTo } from "@externals/helpers/routes";
import { BreadCrumbContextProvider } from "@/core/context";
import { Config } from "@/core/config";

interface BluejetMainState {
  currentUser?: any;
  fetchedMetadata?: boolean;
  darkMode?: boolean;
  sidebarNav?: string;
  updateAvailable?: boolean;
}

class BluejetMainComponent extends React.Component<{}, BluejetMainState> {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      fetchedMetadata: false,
      darkMode: localStorage.getItem("darkMode") === "true",
    };
  }
  updateSidebarNAV = (val: string) => {
    this.setState({ sidebarNav: val });
  };
  fetchMetadata = () => {
    tooljetService.fetchMetaData().then((data) => {
      localStorage.setItem("currentVersion", data.installed_version);
      if (
        data.latest_version &&
        lt(data.installed_version, data.latest_version) &&
        data.version_ignored === false
      ) {
        this.setState({ updateAvailable: true });
      }
    });
  };

  isThisExistedRoute = () => {
    const existedPaths = [
      "forgot-password",
      "reset-password",
      "invitations",
      "organization-invitations",
      "setup",
      "confirm",
      "confirm-invite",
    ];

    const subpath = getSubpath();
    const subpathArray = subpath
      ? subpath.split("/").filter((path) => path != "")
      : [];
    const pathnames = window.location.pathname
      .split("/")
      ?.filter((path) => path != "");
    const checkPath = () =>
      existedPaths.find(
        (path) => pathnames[subpath ? subpathArray.length : 0] === path
      );
    return pathnames?.length > 0 ? (checkPath() ? true : false) : false;
  };

  componentDidMount() {
    if (!this.isThisExistedRoute()) {
      const workspaceId = getWorkspaceIdFromURL();
      if (workspaceId) {
        this.authorizeUserAndHandleErrors(workspaceId);
      } else {
        const isApplicationsPath =
          window.location.pathname.includes("/applications/");
        const appId = isApplicationsPath
          ? pathnameWithoutSubpath(window.location.pathname).split("/")[2]
          : null;
        authenticationService
          .validateSession(appId)
          .then(({ current_organization_id }) => {
            //check if the page is not switch-workspace, if then redirect to the page
            if (
              window.location.pathname !==
              `${getSubpath() ?? ""}/switch-workspace`
            ) {
              this.authorizeUserAndHandleErrors(current_organization_id);
            } else {
              this.updateCurrentSession({
                current_organization_id,
              });
            }
          })
          .catch(() => {
            if (!this.isThisWorkspaceLoginPage(true) && !isApplicationsPath) {
              this.updateCurrentSession({
                authentication_status: false,
              });
            } else if (isApplicationsPath) {
              this.updateCurrentSession({
                authentication_failed: true,
                load_app: true,
              });
            }
          });
      }
    }

    this.fetchMetadata();
    setInterval(this.fetchMetadata, 1000 * 60 * 60 * 1);
  }

  isThisWorkspaceLoginPage = (justLoginPage = false) => {
    const subpath = window?.appConfig?.SUB_PATH
      ? stripTrailingSlash(window?.appConfig?.SUB_PATH)
      : null;
    const pathname = location.pathname.replace(subpath, "");
    const pathnames = pathname.split("/").filter((path) => path !== "");
    return (
      (justLoginPage && pathnames[0] === "login") ||
      (pathnames.length === 2 && pathnames[0] === "login")
    );
  };

  authorizeUserAndHandleErrors = (workspaceId) => {
    const subpath = getSubpath();
    this.updateCurrentSession({
      current_organization_id: workspaceId,
    });
    authenticationService
      .authorize()
      .then((data) => {
        organizationService.getOrganizations().then((response) => {
          const current_organization_name = response.organizations.find(
            (org) => org.id === workspaceId
          )?.name;
          // this will add the other details like permission and user previlliage details to the subject
          this.updateCurrentSession({
            ...data,
            current_organization_name,
            organizations: response.organizations,
            load_app: true,
          });

          // if user is trying to load the workspace login page, then redirect to the dashboard
          if (this.isThisWorkspaceLoginPage())
            return (window.location = appendWorkspaceId(
              workspaceId,
              "/:workspaceId"
            ));
        });
      })
      .catch((error) => {
        // if the auth token didn't contain workspace-id, try switch workspace fn
        if (error && error?.data?.statusCode === 401) {
          //get current session workspace id
          authenticationService
            .validateSession()
            .then(({ current_organization_id }) => {
              // change invalid or not authorized org id to previous one
              this.updateCurrentSession({
                current_organization_id,
              });

              organizationService
                .switchOrganization(workspaceId)
                .then((data) => {
                  this.updateCurrentSession(data);
                  if (this.isThisWorkspaceLoginPage())
                    return (window.location = appendWorkspaceId(
                      workspaceId,
                      "/:workspaceId"
                    ));
                  this.authorizeUserAndHandleErrors(workspaceId);
                })
                .catch(() => {
                  organizationService.getOrganizations().then((response) => {
                    const current_organization_name =
                      response.organizations.find(
                        (org) => org.id === current_organization_id
                      )?.name;

                    this.updateCurrentSession({
                      current_organization_name,
                      load_app: true,
                    });

                    if (!this.isThisWorkspaceLoginPage()) {
                      navigateTo(`${subpath ?? ""}/login/${workspaceId}`);
                    }
                  });
                });
            })
            .catch(() => this.logout());
        } else if (
          (error && error?.data?.statusCode == 422) ||
          error?.data?.statusCode == 404
        ) {
          navigateTo(
            subpath ? `${subpath}${"/switch-workspace"}` : "/switch-workspace"
          );
        } else {
          if (
            !this.isThisWorkspaceLoginPage() &&
            !this.isThisWorkspaceLoginPage(true)
          )
            this.updateCurrentSession({
              authentication_status: false,
            });
        }
      });
  };

  updateCurrentSession = (newSession) => {
    const currentSession = authenticationService.currentSessionValue;
    authenticationService.updateCurrentSession({
      ...currentSession,
      ...newSession,
    });
  };

  logout = () => {
    authenticationService.logout();
  };

  switchDarkMode = (newMode) => {
    this.setState({ darkMode: newMode });
    localStorage.setItem("darkMode", newMode);
  };

  render() {
    const { updateAvailable, darkMode } = this.state;
    let toastOptions: ToastOptions = {
      style: {
        wordBreak: "break-all",
      },
    };

    if (darkMode) {
      toastOptions = {
        className: "toast-dark-mode",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          wordBreak: "break-all",
        },
      };
    }
    const { sidebarNav } = this.state;
    const { updateSidebarNAV } = this;
    return (
      <>
        <div
          className={`main-wrapper ${darkMode ? "theme-dark dark-theme" : ""}`}
          data-cy="main-wrapper"
        >
          {updateAvailable && (
            <div className="alert alert-info alert-dismissible" role="alert">
              <h3 className="mb-1">Update available</h3>
              <p>A new version of ToolJet has been released.</p>
              <div className="btn-list">
                <a
                  href="https://docs.tooljet.io/docs/setup/updating"
                  target="_blank"
                  className="btn btn-info"
                  rel="noreferrer"
                >
                  Read release notes & update
                </a>
                <a
                  onClick={() => {
                    tooljetService.skipVersion();
                    this.setState({ updateAvailable: false });
                  }}
                  className="btn"
                >
                  Skip this version
                </a>
              </div>
            </div>
          )}
          <BreadCrumbContextProvider value={{ sidebarNav, updateSidebarNAV }}>
            <Routes>
              <Route path="/login/:organizationId" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/setup"
                element={
                  <SetupScreenSelfHost {...this.props} darkMode={darkMode} />
                }
              />
              <Route path="/sso/:origin/:configId" element={<Oauth />} />
              <Route path="/sso/:origin" element={<Oauth />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/invitations/:token"
                element={<VerificationSuccessInfoScreen />}
              />
              <Route
                path="/invitations/:token/workspaces/:organizationToken"
                element={<VerificationSuccessInfoScreen />}
              />
              <Route
                path="/confirm"
                element={<VerificationSuccessInfoScreen />}
              />
              <Route
                path="/organization-invitations/:token"
                element={
                  <OrganizationInvitationPage
                    {...this.props}
                    darkMode={darkMode}
                  />
                }
              />
              <Route
                path="/confirm-invite"
                element={
                  <OrganizationInvitationPage
                    {...this.props}
                    darkMode={darkMode}
                  />
                }
              />
              <Route
                path="/:workspaceId/apps/:id/:pageHandle?/*"
                element={
                  <PrivateRoute>
                    <AppLoader
                      switchDarkMode={this.switchDarkMode}
                      darkMode={darkMode}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/applications/:id/versions/:versionId/:pageHandle?"
                element={
                  <PrivateRoute>
                    <Viewer
                      switchDarkMode={this.switchDarkMode}
                      darkMode={darkMode}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/applications/:slug/:pageHandle?"
                element={
                  <PrivateRoute>
                    <Viewer
                      switchDarkMode={this.switchDarkMode}
                      darkMode={darkMode}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/oauth2/authorize"
                element={
                  <PrivateRoute>
                    <Authorize
                      switchDarkMode={this.switchDarkMode}
                      darkMode={darkMode}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/:workspaceId/workspace-settings"
                element={
                  <PrivateRoute>
                    <OrganizationSettings
                      switchDarkMode={this.switchDarkMode}
                      darkMode={darkMode}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/:workspaceId/settings"
                element={
                  <PrivateRoute>
                    <SettingsPage
                      switchDarkMode={this.switchDarkMode}
                      darkMode={darkMode}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/:workspaceId/data-sources"
                element={
                  <PrivateRoute>
                    <GlobalDatasources
                      switchDarkMode={this.switchDarkMode}
                      darkMode={darkMode}
                    />
                  </PrivateRoute>
                }
              />
              {window.appConfig?.ENABLE_TOOLJET_DB == true && (
                <Route
                  path="/:workspaceId/database"
                  element={
                    <PrivateRoute>
                      <TooljetDatabase
                        switchDarkMode={this.switchDarkMode}
                        darkMode={darkMode}
                      />
                    </PrivateRoute>
                  }
                />
              )}

              {window.appConfig?.ENABLE_MARKETPLACE_FEATURE === true && (
                <Route
                  path="/integrations"
                  element={
                    <AdminRoute>
                      <MarketplacePage
                        switchDarkMode={this.switchDarkMode}
                        darkMode={darkMode}
                      />
                    </AdminRoute>
                  }
                />
              )}
              <Route path="/" element={<Navigate to="/:workspaceId" />} />
              <Route
                path="/switch-workspace"
                element={
                  <PrivateRoute>
                    <SwitchWorkspacePage darkMode={darkMode} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/:workspaceId"
                element={
                  <PrivateRoute>
                    <HomePage
                      switchDarkMode={this.switchDarkMode}
                      darkMode={darkMode}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="*"
                Component={() => {
                  if (
                    authenticationService?.currentSessionValue
                      ?.current_organization_id
                  ) {
                    return <Navigate to="/:workspaceId" />;
                  }
                  return <Navigate to="/login" />;
                }}
              ></Route>
            </Routes>
          </BreadCrumbContextProvider>
        </div>

        <Toast toastOptions={toastOptions} />
      </>
    );
  }
}

const AppWithRouter = withRouter(BluejetMainComponent);

export const BluejetMain = (props) => {
  const config = Config.getInstance();

  return (
    <Suspense fallback={null}>
      <BrowserRouter basename={config?.SUB_PATH || "/"}>
        <AppWithRouter props={props} />
      </BrowserRouter>
    </Suspense>
  );
};
