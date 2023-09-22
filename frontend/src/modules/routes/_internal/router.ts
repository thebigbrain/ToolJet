import { JetRouteName } from "./name";

export type NavigateProps<P extends Object> = {
  to: JetRouteName;
  state?: P;
  replace?: boolean;
  relative?: "route" | "path";
};

export abstract class JetRouter {
  abstract navigate<P>(navigateProps: NavigateProps<P>): void;
  abstract getCurrentRouteParam<P>(): P;
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

export function installRouter(router: JetRouter) {
  _routerDelegate = router;
}
