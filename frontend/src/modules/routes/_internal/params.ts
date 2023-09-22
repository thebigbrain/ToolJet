export class LoginParam {
  organizationId?: string;
}

export class SsoParam {
  origin?;
  configId?;
}

export class ResetPasswordParam {
  token?;
}

export class InvitationParam {
  token?;
  organizationToken?;
}

export class ConfirmInviteParam {
  token?;
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

export class WorkspaceSettingParam {
  workspaceId?;
}

export class SettingsParam {
  workspaceId?;
}

export class DatasourcesParam {
  workspaceId?;
}

export class DatabaseParam {
  workspaceId?;
}

export class WorkspaceParam {
  workspaceId?;
}

export class UnknowRouteParam {
  [name: string]: any;
}
