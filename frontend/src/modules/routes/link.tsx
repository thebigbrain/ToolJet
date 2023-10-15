import React from "react";
import { navigate } from "./_internal/router";
import { NavigateProps } from "./_internal/router";

type LinkProps = React.PropsWithChildren<NavigateProps<Object>>;

export function Link(props: LinkProps) {
  const { children, ...navigateProps } = props;
  return <a onClick={() => navigate(navigateProps)}>props.children</a>;
}
