export class LoginParam {
  organizationId?: string;
}

export class SsoParam {
  origin?;
  configId?;
}

export class TokenParam {}

export type ResetPasswordParam = TokenParam;
export type ConfirmInviteParam = TokenParam;

export class InvitationParam {
  token?;
  organizationToken?;
}

export class WorkspaceAppParam {
  workspaceId?;
  id?;
  pageHandle?;
}

export class ApplicationParam {
  id?;
  versionId?;
  pageHandle?;
  slug?;
}
export class WorkspaceParam {
  workspaceId?;
}

export type WorkspaceSettingParam = WorkspaceParam;
export type SettingsParam = WorkspaceParam;
export type DatasourcesParam = WorkspaceParam;
export type DatabaseParam = WorkspaceParam;
export class UnknowRouteParam {
  [name: string]: any;
}
