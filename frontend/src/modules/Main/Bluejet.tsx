import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import {
  getWorkspaceIdFromURL,
  appendWorkspaceId,
  stripTrailingSlash,
  pathnameWithoutSubpath,
} from "@externals/helpers/utils";
import { getSubpath } from "@/core/utils";
import { authenticationService, organizationService } from "@/_services";
import { withRouter } from "@/_hoc/withRouter";
import "@/_styles/theme.scss";
import "react-tooltip/dist/react-tooltip.css";

import { navigateTo } from "@externals/helpers/routes";
import { Config } from "@/core/config";
import { observables } from "@externals/observables/react";
import { isDarkObservable } from "../theme/mode";
import { JetRoutesView } from "@/modules/routes";
import { authRoutes, routes } from "./allRoutes";
import JetUpdate from "./JetUpdate";
import JetToast from "./JetToast";
import JetSidebar from "./JetSidebar";
import JetThemeWrapper from "./JetThemeWrapper";
import { UnknowPage } from "./UnknowPage";

class BluejetMainComponent extends React.Component {
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

    authRoutes();

    this.setState({});
  };

  logout = () => {
    authenticationService.logout();
  };

  render() {
    return (
      <>
        <JetThemeWrapper>
          <JetUpdate />
          <JetSidebar>
            <JetRoutesView routes={routes} unknown={UnknowPage} />
          </JetSidebar>
        </JetThemeWrapper>

        <JetToast />
      </>
    );
  }
}

const AppWithRouter = observables(isDarkObservable)(
  withRouter(BluejetMainComponent)
);

export const BluejetMain = (props: any) => {
  const config = Config.getInstance();

  return (
    <Suspense fallback={null}>
      <BrowserRouter basename={config?.SUB_PATH || "/"}>
        <AppWithRouter {...props} />
      </BrowserRouter>
    </Suspense>
  );
};
