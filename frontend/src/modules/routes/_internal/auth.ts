import { getCurrentUser } from "@/modules/users";
import { JetRouteName } from "./name";

const _authedRoutesMap: { [name: string]: boolean } = {};

function configRoutesVisibility() {
  const currentUser = getCurrentUser();
  const hasLoggin = currentUser != null;

  _authedRoutesMap[JetRouteName.login] = true;
  _authedRoutesMap[JetRouteName.setup] = true;
  _authedRoutesMap[JetRouteName.sso] = true;
  _authedRoutesMap[JetRouteName.signup] = true;
  _authedRoutesMap[JetRouteName.forgot_password] = true;
  _authedRoutesMap[JetRouteName.reset_password] = true;
  _authedRoutesMap[JetRouteName.invitations] = true;
  _authedRoutesMap[JetRouteName.confirm_invite] = true;

  _authedRoutesMap[JetRouteName.workspace_apps] = hasLoggin;
  _authedRoutesMap[JetRouteName.applications] = hasLoggin;
  _authedRoutesMap[JetRouteName.oauth2] = hasLoggin;
  _authedRoutesMap[JetRouteName.workspace_settings] = hasLoggin;
  _authedRoutesMap[JetRouteName.settings] = hasLoggin;
  _authedRoutesMap[JetRouteName.data_sources] = hasLoggin;
  _authedRoutesMap[JetRouteName.database] = hasLoggin;
  _authedRoutesMap[JetRouteName.workspace] = hasLoggin;
  _authedRoutesMap[JetRouteName.switch_workspace] = hasLoggin;

  _authedRoutesMap[JetRouteName.integrations] = currentUser?.isAdmin;
}

export function getRoutesVisibilityMap() {
  configRoutesVisibility();
  return _authedRoutesMap;
}
