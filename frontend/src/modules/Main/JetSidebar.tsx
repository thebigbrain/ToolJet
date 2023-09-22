import { BreadCrumbContextProvider } from "@/core/context";
import React, { useState } from "react";

type JetSidebarProps = React.PropsWithChildren;

export default (props: JetSidebarProps) => {
  const [sidebarNav, setSidebarNav] = useState("");

  return (
    <BreadCrumbContextProvider
      value={{ sidebarNav, updateSidebarNAV: setSidebarNav }}
    >
      {props.children}
    </BreadCrumbContextProvider>
  );
};
