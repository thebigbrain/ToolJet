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
