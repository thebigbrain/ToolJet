import { NavigateFunction, Params, Location } from "react-router-dom";

export interface WithRouterProps {
  params: Readonly<Params<string>>;
  navigate: NavigateFunction;
  location: Location;
}
