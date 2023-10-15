import { isPublic } from "./public";
import { JetRouteName } from "./name";
import { JetRoute } from "./route";

export type NavigateProps<P extends Object> = {
  to: JetRouteName;
  state?: P;
  replace?: boolean;
  relative?: "route" | "path";
};

export abstract class JetRouter {
  abstract navigate<P>(navigateProps: NavigateProps<P>): void;
  abstract getCurrentRouteParam<P>(): P;
  abstract getCurrentRoute(): JetRoute;
}

let _routerDelegate: JetRouter;

export function navigate<P>(navigateProps: NavigateProps<P> | JetRouteName) {
  if (typeof navigateProps == "string") {
    _routerDelegate?.navigate({ to: navigateProps });
  } else {
    _routerDelegate?.navigate(navigateProps as NavigateProps<P>);
  }
}

export function getCurrentRouteParam<P>(): P {
  return _routerDelegate?.getCurrentRouteParam();
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
