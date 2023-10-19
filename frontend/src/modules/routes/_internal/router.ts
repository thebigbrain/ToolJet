import { isPublic } from "./public";
import { JetRouteName } from "./name";
import { JetRoute } from "./route";

export type JetNavigateProps<P extends Object> = {
  to?: JetRouteName;
  state?: P;
  search?: string;
  replace?: boolean;
};

export abstract class JetRouter {
  abstract navigate<P>(navigateProps: JetNavigateProps<P>): void;
  abstract getCurrentRouteParam<P>(): P;
  abstract getCurrentRoute(): JetRoute;
}

let _routerDelegate: JetRouter;

export function navigate<P = {}>(
  navigateProps: JetNavigateProps<P> | JetRouteName
) {
  if (typeof navigateProps == "string") {
    _routerDelegate?.navigate({ to: navigateProps });
  } else {
    _routerDelegate?.navigate(navigateProps as JetNavigateProps<P>);
  }
}

export function getCurrentRouteParam<P>(): P {
  return _routerDelegate?.getCurrentRouteParam();
}

export function getCurrentRoute() {
  return _routerDelegate?.getCurrentRoute();
}

export function isCurrentRoute(route: JetRouteName): boolean {
  const current = _routerDelegate?.getCurrentRoute();
  return current != null && current.name === route;
}

export function isCurrentPublic() {
  const route = _routerDelegate?.getCurrentRoute();
  return isPublic(route?.name);
}

export function installRouter(router: JetRouter) {
  _routerDelegate = router;
}

export function toLoginPage() {
  navigate(JetRouteName.login);
}

export function redirectToDashboard() {
  navigate({ to: JetRouteName.dashboard, replace: true });
}
