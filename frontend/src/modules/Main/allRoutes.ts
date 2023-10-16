import { Navigate, generatePath } from "react-router-dom";

import { HomePage, SwitchWorkspacePage } from "@/modules/HomePage";
import { AuthState, LoginPage } from "@/modules/auth";
import { SignupPage } from "@/modules/SignupPage";
import { TooljetDatabase } from "@/modules/TooljetDatabase";
import { OrganizationInvitationPage } from "@/modules/OrganizationInvite";
import { Authorize as Oauth2 } from "@/modules/Oauth2";
import { Authorize as Oauth } from "@/modules/Oauth";
import { Viewer } from "@/modules/Editor/";
import { OrganizationSettings } from "@/modules/OrganizationSettingsPage";
import { SettingsPage } from "@/modules/SettingsPage/SettingsPage";
import { ForgotPassword } from "@/modules/ForgotPassword";
import { ResetPassword } from "@/modules/ResetPassword";
import { MarketplacePage } from "@/modules/MarketplacePage";
import { GlobalDatasources } from "@/modules/GlobalDatasources";
import { VerificationSuccessInfoScreen } from "@/modules/SuccessInfoScreen";
import "@/_styles/theme.scss";
import { AppLoader } from "@/modules/AppLoader";
import SetupScreenSelfHost from "@/modules/SuccessInfoScreen/SetupScreenSelfHost";

import {
  JetRouteName,
  JetRoute,
  JetRouter,
  NavigateProps,
  routeName2Path,
  getRoutesVisibilityMap,
} from "@/modules/routes";

export const routes: Array<JetRoute> = [
  { name: JetRouteName.login, component: LoginPage },
  { name: JetRouteName.setup, component: SetupScreenSelfHost },
  { name: JetRouteName.sso, component: Oauth },
  { name: JetRouteName.signup, component: SignupPage },
  { name: JetRouteName.forgot_password, component: ForgotPassword },
  { name: JetRouteName.reset_password, component: ResetPassword },
  { name: JetRouteName.invitations, component: VerificationSuccessInfoScreen },
  { name: JetRouteName.confirm_invite, component: OrganizationInvitationPage },

  // private below
  { name: JetRouteName.workspace_apps, component: AppLoader },
  { name: JetRouteName.applications, component: Viewer },
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

export function initRoutes(auth: AuthState) {
  const visibilityConfig = getRoutesVisibilityMap({
    hasLogged: auth.hasLogged,
    isAdmin: auth.isAdmin,
  });

  routes.forEach((r) => {
    r.visible = visibilityConfig[r.name];
  });

  return routes;
}

export class RrJetRouter extends JetRouter {
  static _currentRouteParam: Object;
  static _currentNavigateProps?: NavigateProps<Object>;
  static _currentRoute: JetRoute;

  navigate<P>(navigateProps: NavigateProps<P>): void {
    const route = routes.find((r) => r.name == navigateProps.to);

    if (!route || !route.visible) {
      Navigate({ to: "/" });
      return;
    }

    RrJetRouter._currentRouteParam = navigateProps.state;
    RrJetRouter._currentNavigateProps = navigateProps;
    RrJetRouter._currentRoute = route;

    Navigate({
      to: generatePath(routeName2Path(navigateProps.to), navigateProps.state),
      relative: navigateProps.relative,
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
