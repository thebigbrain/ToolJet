import React, { useEffect, useState } from "react";
import cx from "classnames";
import Layout from "@/_ui/Layout";
import { ManageOrgUsers } from "@/ManageOrgUsers";
import { ManageGroupPermissions } from "@/ManageGroupPermissions";
import { ManageSSO } from "@/modules/ManageSSO";
import { ManageOrgVars } from "@/ManageOrgVars";
import { authenticationService } from "@/_services";
import { CopilotSetting } from "@/CopilotSettings";
import FolderList from "@/_ui/FolderList/FolderList";
import { OrganizationList } from "../OrganizationManager/List";
import { ManageOrgConstants } from "@/ManageOrgConstants";
import { useBreadCrumbContext } from "@/core/context";

export function OrganizationSettings(props) {
  const [admin, setAdmin] = useState(
    authenticationService.currentSessionValue?.admin
  );
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
    const subscription = authenticationService.currentSession.subscribe(
      (newOrd) => {
        setAdmin(newOrd?.admin);
        admin
          ? updateSidebarNAV("Users & permissions")
          : updateSidebarNAV("Workspace variables");
      }
    );

    () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticationService.currentSessionValue?.admin]);

  const goTooOrgConstantsDashboard = () => {
    setSelectedTab("manageOrgConstants");
  };

  return (
    <Layout switchDarkMode={props.switchDarkMode} darkMode={props.darkMode}>
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
