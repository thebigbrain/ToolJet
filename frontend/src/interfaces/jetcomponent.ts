export interface JetComponentType {
  name: string;
}

export type JetComponentId = string;

export interface JetComponentEntity {
  id: JetComponentId;
  component?: JetViewComponent;
  parent?: JetComponentId;
}

export interface JetViewComponent {}

export type JetComponentsMap = Map<JetComponentId, JetComponentEntity>;
