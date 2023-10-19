import React from "react";
import SolidIcon from "../Icon/SolidIcons";
import { useBreadCrumbContext } from "@/core/context";
import { JetRouteName } from "@/modules/routes";
import { Link } from "@/modules/routes/Link";

export const Breadcrumbs = ({ darkMode }) => {
  const { sidebarNav } = useBreadCrumbContext();

  return (
    <ol className="breadcrumb breadcrumb-arrows">
      {breadcrumbs.map(({ path, breadcrumb, beta }, i) => {
        if (i == 1 || breadcrumbs?.length == 1) {
          return (
            <div key={breadcrumb} className="tj-dashboard-header-title-wrap">
              <p className=" tj-text-xsm ">{breadcrumb}</p>
              {sidebarNav?.length > 0 && (
                <SolidIcon
                  name="cheveronright"
                  fill={darkMode ? "#FDFDFE" : "#131620"}
                />
              )}
              <li className="breadcrumb-item font-weight-500">
                <Link to={path} data-cy="breadcrumb-page-title">
                  {" "}
                  {sidebarNav}
                </Link>
              </li>
              {beta && (
                <span className="badge bg-color-primary mx-3">beta</span>
              )}
            </div>
          );
        }
      })}
    </ol>
  );
};
// define some custom breadcrumbs for certain routes (optional)
const breadcrumbs: Array<{
  path: JetRouteName;
  breadcrumb: string;
  beta?: boolean;
}> = [
  { path: JetRouteName.workspace, breadcrumb: "Applications" },
  {
    path: JetRouteName.database,
    breadcrumb: "Tables",
    // dataCy: "tables-page-header" ,
  },
  { path: JetRouteName.workspace_settings, breadcrumb: "Workspace settings" },
  { path: JetRouteName.data_sources, breadcrumb: "Data Sources" },
  {
    path: JetRouteName.integrations,
    breadcrumb: "Integrations / plugins",
    beta: true,
  },
];
