import { Service } from "@/core/service";
import { Folder } from "./folder";
import { InviteInfo } from "./invite";
import { JetComponentEntity, JetComponentsMap } from "./jetcomponent";
import { PageId, PagesMap } from "./page";
import { PasswordInfo } from "./password";
import { UserId } from "./user";

export type AppId = string;
export type AccessType = "edit" | "";

type ApplicationIcon = string;

export abstract class ApplicationService implements Service {
  getAll: (page: number, folder?: string, searchKey?: string) => Promise<any>;
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
    org_user_id: UserId,
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

export interface Application {
  icon?: ApplicationIcon;
  id?: AppId;
  name?: string;
  is_maintenance_on?: boolean;
  current_version_id?: VersionId;
  isLoading?: boolean;
  is_public?: boolean;
}

export type VersionId = number;
export function toVersionId(v: string | number): VersionId {
  return Number(v);
}

export interface Version {
  id?: VersionId;
  definition?: ApplicationDefinition;
}

export interface ApplicationDefinition {
  components?: JetComponentsMap;
  selectedComponent?: JetComponentEntity;
  showViewerNavigation?: boolean;
  homePageId?: PageId;
  pages?: PagesMap;
  globalSettings?: {
    hideHeader: boolean;
    appInMaintenance: boolean;
    canvasMaxWidth: number;
    canvasMaxWidthType: string;
    canvasMaxHeight: number;
    canvasBackgroundColor: string;
    backgroundFxQuery: string;
  };
}

export interface ApplicationDefinitionOption {
  skipAutoSave?: boolean;
  skipYmapUpdate?: boolean;
  versionChanged?: boolean;
}

export interface ApplicationOperation {
  selectedApp?: Application;
  selectedFolder?: Folder;
  selectedIcon?: ApplicationIcon;
  isAdding?: boolean;
}
