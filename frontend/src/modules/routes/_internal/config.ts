import { JetRouteName } from "./name";
import { isAdminOnly, isPublic } from "./public";

const _authedRoutesMap: { [name: string]: boolean } = {};

interface ConfigOption {
  hasLogged: boolean;
  isAdmin: boolean;
}

function setVisibility(name: JetRouteName, options: ConfigOption) {
  _authedRoutesMap[name] =
    isPublic(name) || options.hasLogged || options.isAdmin;

  if (isAdminOnly(name)) _authedRoutesMap[name] = options.isAdmin;
}

class RouteVisibilityConfig {
  static init(options: ConfigOption) {
    Object.entries(JetRouteName).forEach(([key, name]) => {
      setVisibility(name, options);
    });
  }
}

export function getRoutesVisibilityMap(
  options: ConfigOption = { hasLogged: false, isAdmin: false }
) {
  reconfigRoutes(options);
  return _authedRoutesMap;
}

export function reconfigRoutes(options: ConfigOption) {
  RouteVisibilityConfig.init(options);
}
