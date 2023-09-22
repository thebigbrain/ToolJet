import { getThemeMode } from "@/modules/theme/mode";
import React from "react";

export default (props: React.PropsWithChildren) => {
  const isDark = getThemeMode().isDark;
  return (
    <div
      className={`main-wrapper ${isDark ? "theme-dark dark-theme" : ""}`}
      data-cy="main-wrapper"
    >
      {props.children}
    </div>
  );
};
