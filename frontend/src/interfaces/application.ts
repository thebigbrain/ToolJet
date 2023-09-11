import { InviteInfo } from "./invite";
import { PasswordInfo } from "./password";

export type AppId = string;
export type OrgUserId = string;
export type AccessType = "edit" | "";

export interface ApplicationService {
  getConfig: () => Promise<any>;

  getAll: (page: number, folder: string, searchKey: string) => Promise<any>;
  getApp: (id: AppId, accessType?: AccessType) => Promise<any>;
  getAppBySlug: (slug: string) => Promise<any>;
  getAppByVersion: (appId: AppId, versionId: string) => Promise<any>;

  createApp: (body: Object) => Promise<any>;
  cloneApp: (id: AppId) => Promise<any>;
  deleteApp: (id: AppId) => Promise<any>;
  saveApp: (id: AppId, attributes: Object) => Promise<any>;

  exportApp: (id: AppId, versionId: string) => Promise<any>;
  importApp: (body: Object) => Promise<any>;

  getAppUsers: (id: AppId) => Promise<any>;
  createAppUser: (
    app_id: AppId,
    org_user_id: OrgUserId,
    role: string
  ) => Promise<any>;

  setVisibility: (appId: AppId, visibility: boolean) => Promise<any>;

  setSlug: (appId: AppId, slug: string) => Promise<any>;

  setPasswordFromToken: (info: PasswordInfo) => Promise<any>;

  changeIcon: (icon: string, appId: AppId) => Promise<any>;

  setMaintenance: (appId: AppId, value: boolean) => Promise<any>;

  getVersions: (id: AppId) => Promise<any>;

  acceptInvite: (info: InviteInfo) => Promise<any>;
}
