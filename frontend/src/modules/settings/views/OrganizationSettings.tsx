import React, { useEffect, useState } from "react";
import cx from "classnames";
import { ManageOrgUsers } from "@/modules/ManageOrgUsers";
import { ManageGroupPermissions } from "@/modules/ManageGroupPermissions";
import { ManageSSO } from "@/modules/ManageSSO";
import { ManageOrgVars } from "@/modules/ManageOrgVars";
import { CopilotSetting } from "@/modules/CopilotSettings";
import FolderList from "@/_ui/FolderList/FolderList";
import { OrganizationList } from "../../OrganizationManager/List";
import { ManageOrgConstants } from "@/modules/ManageOrgConstants";
import { useBreadCrumbContext } from "@/core/context";
import Layout from "@/modules/layouts/Layout";
import { getCurrentSession } from "@/modules/users";
import { authStateObs } from "@/modules/auth/auth-obs";

export function OrganizationSettings(props) {
  const session = getCurrentSession();
  const [admin, setAdmin] = useState(session?.admin);
  const [selectedTab, setSelectedTab] = useState(
    admin ? "Users & permissions" : "manageEnvVars"
  );
  const { updateSidebarNAV }: any = useBreadCrumbContext();

  const sideBarNavs = [
    "Users",
    "Groups",
    "SSO",
    // "Workspace variables",
    "Workspace constants",
  ];
  const defaultOrgName = (groupName) => {
    switch (groupName) {
      case "Users":
        return "Users & permissions";
      case "Groups":
        return "manageGroups";
      case "SSO":
        return "manageSSO";
      case "Workspace variables":
        return "manageEnvVars";
      case "Workspace constants":
        return "manageOrgConstants";
      default:
        return groupName;
    }
  };

  useEffect(() => {
    const subscription = authStateObs.subscribe((newOrd) => {
      setAdmin(newOrd?.isAdmin);
      admin
        ? updateSidebarNAV("Users & permissions")
        : updateSidebarNAV("Workspace variables");
    });

    () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.admin]);

  const goTooOrgConstantsDashboard = () => {
    setSelectedTab("manageOrgConstants");
  };

  return (
    <Layout>
      <div className="wrapper organization-settings-page">
        <div className="row gx-0">
          <div className="organization-page-sidebar col ">
            <div className="workspace-nav-list-wrap">
              {sideBarNavs.map((item, index) => {
                return (
                  (admin ||
                    item == "Workspace variables" ||
                    item == "Copilot" ||
                    item == "Workspace constants") && (
                    <FolderList
                      className="workspace-settings-nav-items"
                      key={`${item}_${index}`}
                      onClick={() => {
                        setSelectedTab(defaultOrgName(item));
                        if (item == "Users")
                          updateSidebarNAV("Users & permissions");
                        else updateSidebarNAV(item);
                      }}
                      selectedItem={selectedTab == defaultOrgName(item)}
                      renderBadgeForItems={["Workspace constants"]}
                      renderBadge={() => (
                        <span
                          style={{
                            width: "40px",
                            textTransform: "lowercase",
                          }}
                          className="badge bg-color-primary badge-pill"
                        >
                          new
                        </span>
                      )}
                      dataCy={item.toLowerCase().replace(/\s+/g, "-")}
                    >
                      {item}
                    </FolderList>
                  )
                );
              })}
            </div>
            <OrganizationList />
          </div>

          <div
            className={cx("col workspace-content-wrapper")}
            style={{ paddingTop: "40px" }}
          >
            <div className="w-100">
              {selectedTab === "Users & permissions" && (
                <ManageOrgUsers darkMode={props.darkMode} />
              )}
              {selectedTab === "manageGroups" && (
                <ManageGroupPermissions darkMode={props.darkMode} />
              )}
              {selectedTab === "manageSSO" && <ManageSSO />}
              {/* {selectedTab === "manageEnvVars" && (
                <ManageOrgVars
                  darkMode={props.darkMode}
                  goTooOrgConstantsDashboard={goTooOrgConstantsDashboard}
                />
              )} */}
              {selectedTab === "manageCopilot" && <CopilotSetting />}
              {selectedTab === "manageOrgConstants" && (
                <ManageOrgConstants darkMode={props.darkMode} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
