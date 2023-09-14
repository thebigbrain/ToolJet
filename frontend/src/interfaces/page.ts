import { JetComponentsMap } from "./jetcomponent";

export type PageHandle = string;
export type PageId = string;

interface PageEvent {
  eventId: string;
}

export type Page = {
  components?: JetComponentsMap;
  handle?: PageHandle;
  name?: string;
  variables?: {};
  events?: Array<PageEvent>;
};
export type PagesMap = Map<PageId, Page>;
