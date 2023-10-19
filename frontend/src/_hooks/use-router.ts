import { useMemo } from "react";
import { useParams, useNavigate, useLocation } from "@reach/router";
import queryString from "query-string";

export default function useRouter<P = any>() {
  const params = useParams() as P;
  const location = useLocation();
  const navigate = useNavigate();
  // Return our custom router object
  // Memoize so that a new object is only returned if something changes

  const push = (options: { pathname: string; search: string }) => {
    navigate(`${options.pathname}${options.search || ""}`);
  };

  return useMemo(() => {
    return {
      // For convenience add push(), replace(), pathname at top level
      pathname: location.pathname,
      // Merge params and parsed query string into single 'query' object
      // so that they can be used interchangeably.
      // Example: /:topic?sort=popular -> { topic: 'react', sort: 'popular' }
      query: {
        ...queryString.parse(location.search), // Convert string to object
        ...params,
      },
      // Include match, location, history objects so we have
      // access to extra React Router functionality if needed.
      location,
      navigate,
      push,
      params,
    };
  }, [params, location, navigate]);
}
