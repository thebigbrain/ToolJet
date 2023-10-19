import React, { CSSProperties } from "react";
import { navigate } from "./_internal/router";
import { JetNavigateProps } from "./_internal/router";

type LinkProps = React.PropsWithChildren<JetNavigateProps<Object>> & {
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  prevent?: boolean;
  className?: string;
  style?: CSSProperties;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function Link(props: LinkProps) {
  const { children, prevent, onClick, to, state, replace, ...rest } = props;

  return (
    <a
      {...rest}
      onClick={(event) => {
        if (prevent) event.preventDefault();

        if (onClick) {
          onClick(event);
        }

        if (!prevent) {
          navigate({ to, state, replace });
        }
      }}
    >
      {children}
    </a>
  );
}
