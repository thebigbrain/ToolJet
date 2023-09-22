import React from "react";
import { navigate } from "./router";
import { NavigateProps } from "./router";

type LinkProps = React.PropsWithChildren<NavigateProps<Object>>;

export function Link(props: LinkProps) {
  const { children, ...navigateProps } = props;
  return <a onClick={() => navigate(navigateProps)}>props.children</a>;
}
