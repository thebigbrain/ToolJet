import { NavigateFunction, Params } from "react-router-dom";

export interface WithRouterParams {
  params: Readonly<Params<string>>;
  navigate: NavigateFunction;
  location: Location;
}
