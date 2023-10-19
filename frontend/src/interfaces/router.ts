type RelativeRoutingType = "route" | "path";

interface NavigateOptions {
  replace?: boolean;
  state?: any;
  preventScrollReset?: boolean;
  relative?: RelativeRoutingType;
}

type To = string | Partial<Path>;
interface NavigateFunction {
  (to: To, options?: NavigateOptions): void;
  (delta: number): void;
}

/**
 * The pathname, search, and hash values of a URL.
 */
interface Path {
  /**
   * A URL pathname, beginning with a /.
   */
  pathname: string;
  /**
   * A URL search string, beginning with a ?.
   */
  search: string;
  /**
   * A URL fragment identifier, beginning with a #.
   */
  hash: string;
}
/**
 * An entry in a history stack. A location contains information about the
 * URL path, as well as possibly some arbitrary state and a key.
 */
interface Location extends Path {
  /**
   * A value of arbitrary data associated with this location.
   */
  state: any;
  /**
   * A unique string associated with this location. May be used to safely store
   * and retrieve data in some other storage API, like `localStorage`.
   *
   * Note: This value is always "default" on the initial location.
   */
  key: string;
}

type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined;
};

export interface WithRouterProps {
  params: Readonly<Params<string>>;
  navigate: NavigateFunction;
  location: Location;
}
