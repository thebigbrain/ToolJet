import { Navigate, generatePath } from "react-router-dom";

import { HomePage, SwitchWorkspacePage } from "@/modules/HomePage";
import { LoginPage } from "@/modules/LoginPage";
import { SignupPage } from "@/SignupPage";
import { TooljetDatabase } from "@/TooljetDatabase";
import { OrganizationInvitationPage } from "@/modules/OrganizationInvite";
import { Authorize as Oauth2 } from "@/Oauth2";
import { Authorize as Oauth } from "@/Oauth";
import { Viewer } from "@/Editor";
import { OrganizationSettings } from "@/modules/OrganizationSettingsPage";
import { SettingsPage } from "@/SettingsPage/SettingsPage";
import { ForgotPassword } from "@/modules/ForgotPassword";
import { ResetPassword } from "@/ResetPassword";
import { MarketplacePage } from "@/MarketplacePage";
import { GlobalDatasources } from "@/GlobalDatasources";
import { VerificationSuccessInfoScreen } from "@/SuccessInfoScreen";
import "@/_styles/theme.scss";
import { AppLoader } from "@/modules/AppLoader";
import SetupScreenSelfHost from "@/SuccessInfoScreen/SetupScreenSelfHost";

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

export function authRoutes() {
  const visibilityConfig = getRoutesVisibilityMap();

  routes.forEach((r) => {
    r.visible = visibilityConfig[r.name];
  });
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
}
