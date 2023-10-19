import { matchPath } from "@reach/router";

export enum JetRouteName {
  login = "/login",
  setup = "/setup",
  sso = "/sso/:origin/:configId",
  signup = "/signup",
  forgot_password = "/forgot-password",
  reset_password = "/reset-password/:token",
  invitations = "/organization-invitations/:token",
  confirm_invite = "/confirm-invite",
  app_editor = "/apps/:workspaceId/:id",
  app_viewer = "/applications/:id/versions/:versionId/:pageHandle?",
  app_slug = "applications/:slug",
  oauth2 = "/oauth2/authorize",
  workspace_settings = "/workspace-settings/:workspaceId",
  settings = "/settings/:workspaceId",
  data_sources = "/data-sources/:workspaceId",
  database = "/database/:workspaceId",
  integrations = "/integrations",
  workspace = "/:workspaceId",
  switch_workspace = "/switch-workspace",

  dashboard = "/",
}

export function routeName2Path(name: JetRouteName): string {
  return name.toString();
}

export function findRouteName(path: string): JetRouteName {
  return Object.values(JetRouteName).find((value) => {
    return matchPath(routeName2Path(value), path || "");
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
  return name == JetRouteName.app_viewer;
}
