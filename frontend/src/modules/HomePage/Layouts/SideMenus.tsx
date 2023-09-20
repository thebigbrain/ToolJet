import React from "react";
import { Link } from "react-router-dom";
import useRouter from "@/_hooks/use-router";
import { ToolTip } from "@/_components/ToolTip";
import { Profile } from "@/_components/Profile";
import { NotificationCenter } from "@/_components/NotificationCenter";
import { authenticationService } from "@/_services";
import SolidIcon from "@/_ui/Icon/SolidIcons";
import { getPrivateRoute } from "@/core/routes";
import useGlobalDatasourceUnsavedChanges from "@/_hooks/useGlobalDatasourceUnsavedChanges";
import { Bluejet } from "@/core/bluejet";
import { ThemeMode } from "@/modules/theme";

const SideMenus = () => {
  const jet = Bluejet.getInstance();
  const config = jet.getConfig();
  const themeMode = ThemeMode.getInstance();

  const router = useRouter();
  const currentUserValue = authenticationService.currentSessionValue;
  const admin = currentUserValue?.admin;
  const marketplaceEnabled = admin && config?.ENABLE_MARKETPLACE_FEATURE;

  const { checkForUnsavedChanges } = useGlobalDatasourceUnsavedChanges();

  return (
    <ul className="sidebar-inner nav nav-vertical">
      <li className="text-center cursor-pointer">
        <ToolTip message="Dashboard" placement="right">
          <Link
            to="/"
            onClick={(event) =>
              checkForUnsavedChanges(getPrivateRoute("dashboard"), event)
            }
            className={`tj-leftsidebar-icon-items  ${
              (router.pathname === "/:workspaceId" ||
                router.pathname === getPrivateRoute("dashboard")) &&
              `current-seleted-route`
            }`}
            data-cy="icon-dashboard"
          >
            <SolidIcon
              name="apps"
              fill={
                router.pathname === "/:workspaceId" ||
                router.pathname === getPrivateRoute("dashboard")
                  ? "#3E63DD"
                  : themeMode.isDark
                  ? "#4C5155"
                  : "#C1C8CD"
              }
            />
          </Link>
        </ToolTip>
      </li>
      {config?.ENABLE_TOOLJET_DB && admin && (
        <li className="text-center  cursor-pointer" data-cy={`database-icon`}>
          <ToolTip message="Database" placement="right">
            <Link
              to={getPrivateRoute("database")}
              onClick={(event) =>
                checkForUnsavedChanges(getPrivateRoute("database"), event)
              }
              className={`tj-leftsidebar-icon-items  ${
                router.pathname === getPrivateRoute("database") &&
                `current-seleted-route`
              }`}
              data-cy="icon-database"
            >
              <SolidIcon
                name="table"
                fill={
                  router.pathname === getPrivateRoute("database") &&
                  `current-seleted-route`
                    ? "#3E63DD"
                    : themeMode.isDark
                    ? "#4C5155"
                    : "#C1C8CD"
                }
              />
            </Link>
          </ToolTip>
        </li>
      )}

      {/* DATASOURCES */}
      {admin && (
        <li className="text-center cursor-pointer">
          <ToolTip message="Data Sources" placement="right">
            <Link
              to={getPrivateRoute("data_sources")}
              onClick={(event) =>
                checkForUnsavedChanges(getPrivateRoute("data_sources"), event)
              }
              className={`tj-leftsidebar-icon-items  ${
                router.pathname === getPrivateRoute("data_sources") &&
                `current-seleted-route`
              }`}
              data-cy="icon-global-datasources"
            >
              <SolidIcon
                name="datasource"
                fill={
                  router.pathname === getPrivateRoute("data_sources")
                    ? "#3E63DD"
                    : themeMode.isDark
                    ? "#4C5155"
                    : "#C1C8CD"
                }
              />
            </Link>
          </ToolTip>
        </li>
      )}
      {marketplaceEnabled && (
        <li className="text-center d-flex flex-column">
          <ToolTip message="Marketplace (Beta)" placement="right">
            <Link
              to="/integrations"
              onClick={(event) =>
                checkForUnsavedChanges(getPrivateRoute("integrations"), event)
              }
              className={`tj-leftsidebar-icon-items  ${
                router.pathname === "/integrations" && `current-seleted-route`
              }`}
              data-cy="icon-marketplace"
            >
              <SolidIcon
                name="marketplace"
                fill={
                  router.pathname === "/integrations"
                    ? "#3E63DD"
                    : themeMode.isDark
                    ? "#4C5155"
                    : "#C1C8CD"
                }
              />
            </Link>
          </ToolTip>
        </li>
      )}
      <li className="text-center cursor-pointer">
        <ToolTip message="Workspace settings" placement="right">
          <Link
            to={getPrivateRoute("workspace_settings")}
            onClick={(event) =>
              checkForUnsavedChanges(
                getPrivateRoute("workspace_settings"),
                event
              )
            }
            className={`tj-leftsidebar-icon-items  ${
              router.pathname === getPrivateRoute("workspace_settings") &&
              `current-seleted-route`
            }`}
            data-cy="icon-workspace-settings"
          >
            <SolidIcon
              name="setting"
              fill={
                router.pathname === getPrivateRoute("workspace_settings")
                  ? "#3E63DD"
                  : themeMode.isDark
                  ? "#4C5155"
                  : "#C1C8CD"
              }
            />
          </Link>
        </ToolTip>
      </li>

      <li className="tj-leftsidebar-icon-items-bottom text-center">
        <NotificationCenter darkMode={themeMode.isDark} />
        <ToolTip message="Mode" placement="right">
          <div
            className="cursor-pointer  tj-leftsidebar-icon-items"
            onClick={() => themeMode.switchMode()}
            data-cy="mode-switch-button"
          >
            <SolidIcon name={themeMode.name} fill={themeMode.color} />
          </div>
        </ToolTip>

        <ToolTip message="Profile" placement="right">
          <Profile
            checkForUnsavedChanges={checkForUnsavedChanges}
            darkMode={themeMode.isDark}
          />
        </ToolTip>
      </li>
    </ul>
  );
};

export default SideMenus;
