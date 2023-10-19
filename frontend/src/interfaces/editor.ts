import { WithTranslation } from "react-i18next";
import { WithRouterProps } from "./router";
import {
  AppId,
  Application,
  ApplicationDefinition,
  Version,
  VersionId,
} from "../modules/apps/application";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { DragScrollOptions } from "@scena/dragscroll";

import { User } from "./user";
import { Page, PageHandle, PageId, PagesMap } from "./page";
import { JetComponentEntity, JetComponentType } from "./jetcomponent";

interface EditorStoreState {
  queries: {};
  components: {};
  globals: {
    theme: { name: "light" | "dark" };
    urlparams?: URLSearchParams;
  };
  errors: {};
  variables: {};
  client: {};
  server: {};
  page: Page;
  succededQuery: {};
}

interface EditorYMapType {
  editingVersionId?: VersionId;
  newDefinition?: ApplicationDefinition;
}

export type EditorProps = {
  darkMode?: boolean;
  isVersionReleased?: boolean;
  pageHandle?: PageHandle;
  currentState?: EditorStoreState;
  editingVersion?: Version;
  showComments?: boolean;
  currentLayout?: string;
  switchDarkMode?: (newMode: boolean) => void;
} & {
  provider?: WebsocketProvider;
  ymap?: Y.Map<EditorYMapType>;
} & WithTranslation &
  WithRouterProps;

interface PageDeletionConfirmation {
  isOpen: boolean;
  pageId?: PageId;
  isHomePage: boolean;
  pageName?: string;
}

export type EditorState = Partial<{
  defaultComponentStateComputed?: boolean;
  currentLayout?: string;
  isQueryPaneExpanded?: boolean;
  saveError?: boolean;
  isDeletingPage?: boolean;
  showPageDeletionConfirmation?: PageDeletionConfirmation;
  isLoading: boolean;
  currentUser: User;
  app: Application;
  allComponentTypes: Array<JetComponentType>;
  componentTypes: Array<JetComponentType>;
  users: Array<User>;
  appId: AppId;
  showLeftSidebar: boolean;
  zoomLevel: number;
  deviceWindowWidth: number;
  appDefinition: ApplicationDefinition;
  appDefinitionLocalVersion: PageId;
  apps: Array<Application>;
  queryConfirmationList: Array<{ queryName?: string }>;
  isSourceSelected: boolean;
  selectionInProgress: boolean;
  scrollOptions?: DragScrollOptions;
  currentPageId: string;
  pages: PagesMap;
  selectedDataSource: {};
  currentSidebarTab: number;
  selectedComponents: Array<JetComponentEntity>;
  selectedComponent: JetComponentEntity;
  isSaving: boolean;
  editorMarginLeft: number;
  slug: string;
  isQueryPaneDragging?: boolean;
  isDragging?: boolean;
  hoveredComponent?: boolean;
}>;
