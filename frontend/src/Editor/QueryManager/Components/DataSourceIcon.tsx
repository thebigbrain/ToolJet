import React from "react";
import { getSvgIcon } from "@/core/appUtils";
import RunjsIcon from "@assets/Icons/runjs.svg";
import RunTooljetDbIcon from "@assets/Icons/tooljetdb.svg";
import RunpyIcon from "@assets/Icons/runpy.svg";

const DataSourceIcon = ({ source, height = 25, styles = null }) => {
  const iconFile =
    source?.plugin?.iconFile?.data ?? source?.plugin?.icon_file?.data;
  const Icon = () => getSvgIcon(source.kind, height, height, iconFile, styles);

  switch (source.kind) {
    case "runjs":
      return (
        <RunjsIcon
          style={{ height: height, width: height, marginTop: "-3px" }}
        />
      );
    case "runpy":
      return (
        <RunpyIcon
          style={{ height: height, width: height, marginTop: "-3px" }}
        />
      );
    case "tooljetdb":
      return (
        <RunTooljetDbIcon
          style={{ height: height, width: height, marginTop: "-3px" }}
        />
      );
    default:
      return <Icon />;
  }
};

export default DataSourceIcon;
