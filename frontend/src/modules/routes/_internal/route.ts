import { JetRouteName } from "./name";

export interface JetRoute {
  name: JetRouteName;
  visible?: boolean;
  component?: React.ComponentType;
}
