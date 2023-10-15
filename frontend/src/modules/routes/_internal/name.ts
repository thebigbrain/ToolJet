import { matchPath } from "react-router";

export enum JetRouteName {
  home = "/",
  login = "/login",
  setup = "/setup",
  sso = "/sso/:origin/:configId",
  signup = "/signup",
  forgot_password = "/forgot-password",
  reset_password = "/reset-password/:token",
  invitations = "/organization-invitations/:token",
  confirm_invite = "/confirm-invite",
  workspace_apps = "/:workspaceId/apps/:id/:pageHandle?/*",
  applications = "/applications/:id/versions/:versionId/:pageHandle?",
  oauth2 = "/oauth2/authorize",
  workspace_settings = "/:workspaceId/workspace-settings",
  settings = "/:workspaceId/settings",
  data_sources = "/:workspaceId/data-sources",
  database = "/:workspaceId/database",
  integrations = "/integrations",
  workspace = "/:workspaceId",
  switch_workspace = "/switch-workspace",
}

export function routeName2Path(name: JetRouteName): string {
  return name.toString();
}

export function findRouteName(path: string): JetRouteName {
  return Object.values(JetRouteName).find((value) => {
    return matchPath(routeName2Path(value), path);
  });
}

export function isLoginPage(path: string): boolean {
  const name = findRouteName(path);
  return name == JetRouteName.login;
}

export function isSwitchWorkspace(path: string): boolean {
  const name = findRouteName(path);
  return name == JetRouteName.switch_workspace;
}

export function isApplications(path: string): boolean {
  const name = findRouteName(path);
  return name == JetRouteName.applications;
}
