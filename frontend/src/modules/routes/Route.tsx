import React from "react";

type RouteProps = {
  path?: string;
  default?: boolean;
  Component?: React.ComponentType<any>;
};

export function Route(props: RouteProps) {
  const { Component, ...rest } = props;
  return <Component {...rest} />;
}
