import React, { PropsWithChildren } from "react";

import {
  JetRoute,
  JetRouteName,
  JetRouter,
  JetNavigateProps,
  getRoutesVisibilityMap,
  routeName2Path,
  findRouteName,
} from "@/modules/routes";
import { UnknowPage } from "./UnknowPage";
import { ClassFC, bindViewModel } from "@externals/decorators/react";
import { PresentationModel } from "@externals/decorators";
import { authStateObs, getAuthState } from "../auth/auth-obs";
import { auto } from "@externals/observables/react";

import { HomePage } from "@/modules/HomePage/views/HomePage";
import { SwitchWorkspacePage } from "@/modules/HomePage/views/SwitchWorkspacePage";
import { AuthState, LoginPage } from "@/modules/auth";
import { SignupPage } from "@/modules/SignupPage";
import { TooljetDatabase } from "@/modules/TooljetDatabase";
import { OrganizationInvitationPage } from "@/modules/OrganizationInvite";
import { Authorize as Oauth2 } from "@/modules/Oauth2";
import { Authorize as Oauth } from "@/modules/Oauth";
import { Viewer } from "@/modules/Editor";
import { OrganizationSettings } from "@/modules/settings/views/OrganizationSettings";
import { SettingsPage } from "@/modules/SettingsPage/SettingsPage";
import { ForgotPassword } from "@/modules/ForgotPassword";
import { ResetPassword } from "@/modules/ResetPassword";
import { MarketplacePage } from "@/modules/MarketplacePage";
import { GlobalDatasources } from "@/modules/GlobalDatasources/GlobalDatasources";
import { VerificationSuccessInfoScreen } from "@/modules/SuccessInfoScreen";
import "@/_styles/theme.scss";
import { AppLoader } from "@/modules/apps/views/AppLoader";
import SetupScreenSelfHost from "@/modules/SuccessInfoScreen/SetupScreenSelfHost";
import { createObservable } from "@externals/observables";
import {
  LocationProvider,
  Router,
  generatePath,
  useLocation,
  useNavigate,
} from "@reach/router";
import { Route } from "@/modules/routes/Route";

const routes: Array<JetRoute> = [
  {
    name: JetRouteName.dashboard,
    component: UnknowPage,
  },

  { name: JetRouteName.login, component: LoginPage },
  { name: JetRouteName.setup, component: SetupScreenSelfHost },
  { name: JetRouteName.sso, component: Oauth },
  { name: JetRouteName.signup, component: SignupPage },
  { name: JetRouteName.forgot_password, component: ForgotPassword },
  { name: JetRouteName.reset_password, component: ResetPassword },
  {
    name: JetRouteName.invitations,
    component: VerificationSuccessInfoScreen,
  },
  {
    name: JetRouteName.confirm_invite,
    component: OrganizationInvitationPage,
  },

  // private below
  { name: JetRouteName.app_editor, component: AppLoader },
  { name: JetRouteName.app_viewer, component: Viewer },
  { name: JetRouteName.app_slug, component: Viewer },
  { name: JetRouteName.oauth2, component: Oauth2 },
  { name: JetRouteName.workspace_settings, component: OrganizationSettings },
  { name: JetRouteName.settings, component: SettingsPage },
  { name: JetRouteName.data_sources, component: GlobalDatasources },

  { name: JetRouteName.database, component: TooljetDatabase },

  { name: JetRouteName.workspace, component: HomePage },
  { name: JetRouteName.switch_workspace, component: SwitchWorkspacePage },

  // admin
  { name: JetRouteName.integrations, component: MarketplacePage },
];

function initRoutes(auth: AuthState) {
  const visibilityConfig = getRoutesVisibilityMap({
    hasLogged: auth.hasLogged,
    isAdmin: auth.isAdmin,
  });

  routes.forEach((r) => {
    r.visible = visibilityConfig[r.name];
  });

  return routes;
}

type JetRoutesProps = {
  routes?: JetRoute[];
};
class JetRoutesModel extends PresentationModel<JetRoutesProps> {
  override call(): JetRoutesProps {
    const routes = initRoutes(getAuthState());
    return { routes };
  }
}

type NavigateProps = {
  to: string;
  state?: any;
  replace?: boolean;
};

const currentRouteNavigatationObs = createObservable<NavigateProps>();

function JetRoutesComponent(props: JetRoutesProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const go = React.useCallback(() => {
    const nav = currentRouteNavigatationObs.value;
    if (nav) navigate(nav.to, nav);
  }, []);

  React.useEffect(() => {
    if (!currentRouteNavigatationObs.value) setCurrentRoute(location?.pathname);

    const subscription = currentRouteNavigatationObs.subscribe(go);

    go();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      {props.routes?.map((route) => {
        return (
          route.visible && (
            <Route
              key={route.name}
              path={routeName2Path(route.name)}
              Component={route.component}
            />
          )
        );
      })}
      <Route default Component={UnknowPage} />
    </Router>
  );
}

@auto(authStateObs)
class JetRoutesView extends ClassFC(JetRoutesComponent) {}

export const JetRoutes = bindViewModel(JetRoutesView, JetRoutesModel);

export function JetRouterProvider(props: PropsWithChildren) {
  return <LocationProvider>{props.children}</LocationProvider>;
}

function setCurrentRoute(pathname: string) {
  const name = findRouteName(pathname);
  const route = routes.find((r) => r.name == name);
  RrJetRouter._currentRoute = route;
}

export class RrJetRouter extends JetRouter {
  static _currentRouteParam: Object;
  static _currentNavigateProps?: JetNavigateProps<Object>;
  static _currentRoute: JetRoute;

  private go(nav: NavigateProps) {
    currentRouteNavigatationObs.value = nav;
  }

  navigate<P>(navigateProps: JetNavigateProps<P>): void {
    const route = routes.find((r) => r.name == navigateProps.to);

    if (!route || !route.visible) {
      this.go({ to: JetRouteName.dashboard });
      return;
    }

    RrJetRouter._currentRouteParam = navigateProps.state;
    RrJetRouter._currentNavigateProps = navigateProps;
    RrJetRouter._currentRoute = route;

    this.go({
      to: generatePath(
        routeName2Path(navigateProps.to) + (navigateProps.search ?? ""),
        navigateProps.state
      ),
      replace: navigateProps.replace,
      state: navigateProps.state,
    });
  }

  getCurrentRouteParam<P>(): P {
    return (RrJetRouter._currentRouteParam ?? {}) as P;
  }

  getCurrentRoute(): JetRoute {
    return RrJetRouter._currentRoute;
  }
}
