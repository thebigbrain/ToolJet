import { Folder } from "../../interfaces/folder";

import {
  JetComponentEntity,
  JetComponentsMap,
} from "../../interfaces/jetcomponent";
import { PageId, PagesMap } from "../../interfaces/page";

import { User } from "@/modules/users";

export type AppId = string;
export type AccessType = "edit" | "";

type ApplicationIcon = string;

export class Application {
  icon?: ApplicationIcon;
  id?: AppId;
  name?: string;
  is_maintenance_on?: boolean;
  current_version_id?: VersionId;
  isLoading?: boolean;
  is_public?: boolean;
  slug?;
  user?: User;
  editing_version?;
  updated_at?;
  created_at?;
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
