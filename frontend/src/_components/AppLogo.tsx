import React, { ReactPropTypes } from "react";
import Logo from "@assets/images/rocket.svg";
import { Config } from "@/core/config";

type AppLogoProps = {
  isLoadingFromHeader: boolean;
} & React.HtmlHTMLAttributes<HTMLElement>;

export default function AppLogo({
  isLoadingFromHeader,
  className,
}: AppLogoProps) {
  const url = Config.getInstance()?.WHITE_LABEL_LOGO;

  return (
    <>
      {url ? (
        <img src={url} height={26} />
      ) : (
        <>
          {isLoadingFromHeader ? (
            <Logo />
          ) : (
            <img
              src="assets/images/logo-color.svg"
              height={26}
              className={className}
            />
          )}
        </>
      )}
    </>
  );
}
