import React from "react";
import { ToolTip } from "@/_components/ToolTip";
import { Profile } from "@/modules/users/Profile";
import { NotificationCenter } from "@/_components/NotificationCenter";
import SolidIcon from "@/_ui/Icon/SolidIcons";
import { getCurrentSession } from "@/modules/users";
import { getThemeMode, isDarkObs } from "@/modules/theme/mode";
import { getConfig } from "@/core/config";
import { Link } from "@/modules/routes/Link";
import { JetRouteName, WorkspaceParam, isCurrentRoute } from "@/modules/routes";
import { ClassFC } from "@externals/decorators/react";
import { auto } from "@externals/observables/react";
import { authStateObs } from "@/modules/auth/auth-obs";
import { createObservable } from "@externals/observables";

type IconProps = {
  route: JetRouteName;
  message: string;
  icon: string;
};

const currentSelected = createObservable<JetRouteName>();

function SidebarIcon(props: IconProps) {
  const route = props.route;

  const session = getCurrentSession();
  const params: WorkspaceParam = { workspaceId: session.workspaceId };

  const themeMode = getThemeMode();
  const isSelected = isCurrentRoute(route);

  return (
    <ToolTip message={props.message} placement="right">
      <Link
        to={route}
        state={params}
        className={`tj-leftsidebar-icon-items  ${
          isSelected && `current-seleted-route`
        }`}
        onClick={() => {
          currentSelected.value = route;
        }}
      >
        <SolidIcon
          name={props.icon}
          fill={
            isSelected ? "#3E63DD" : themeMode.isDark ? "#4C5155" : "#C1C8CD"
          }
        />
      </Link>
    </ToolTip>
  );
}

function DashboardIcon() {
  return (
    <SidebarIcon
      message="Dashboard"
      route={JetRouteName.workspace}
      icon="apps"
    />
  );
}

function DatabaseIcon() {
  return (
    <SidebarIcon
      message="Database"
      route={JetRouteName.database}
      icon="table"
    />
  );
}

function DatasourcesIcon() {
  return (
    <SidebarIcon
      message="Data Sources"
      route={JetRouteName.data_sources}
      icon="datasource"
    />
  );
}

function MarketplaceIcon() {
  return (
    <SidebarIcon
      message="Marketplace (Beta)"
      route={JetRouteName.integrations}
      icon="marketplace"
    />
  );
}

function WorkspaceSettingsIcon() {
  return (
    <SidebarIcon
      message="Workspace settings"
      route={JetRouteName.workspace_settings}
      icon="setting"
    />
  );
}

const SideMenusComponent = () => {
  const config = getConfig();
  const themeMode = getThemeMode();

  const session = getCurrentSession();
  const admin = session?.admin;
  const marketplaceEnabled = admin && config?.ENABLE_MARKETPLACE_FEATURE;

  return (
    <ul className="sidebar-inner nav nav-vertical">
      <li className="text-center cursor-pointer">
        <DashboardIcon />
      </li>
      {config?.ENABLE_TOOLJET_DB && admin && (
        <li className="text-center  cursor-pointer" data-cy={`database-icon`}>
          <DatabaseIcon />
        </li>
      )}

      {/* DATASOURCES */}
      {admin && (
        <li className="text-center cursor-pointer">
          <DatasourcesIcon />
        </li>
      )}

      {marketplaceEnabled && (
        <li className="text-center d-flex flex-column">
          <MarketplaceIcon />
        </li>
      )}

      <li className="text-center cursor-pointer">
        <WorkspaceSettingsIcon />
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
          <Profile />
        </ToolTip>
      </li>
    </ul>
  );
};

@auto(isDarkObs, authStateObs)
class SideMenus extends ClassFC(SideMenusComponent) {}

export default SideMenus;
