import React from "react";
import { authenticationService } from "@/_services";
import Avatar from "@/_ui/Avatar";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { useTranslation } from "react-i18next";
import { ToolTip } from "@/_components/ToolTip";
import SolidIcon from "@/_ui/Icon/SolidIcons";
import { User, getCurrentSession, getCurrentUser } from ".";
import { PresentationModel } from "@externals/decorators";
import { authStateObs } from "@/modules/auth/auth-obs";
import { ClassFC, bindViewModel } from "@externals/decorators/react";
import { auto } from "@externals/observables/react";
import { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";
import { Link } from "../routes/Link";
import { JetRouteName, WorkspaceSettingParam } from "../routes";
import { getThemeMode, isDarkObs } from "../theme/mode";

type ProfileProps = {
  darkMode?: boolean;
  user?: User;
  onLogout?(): void;
  workspaceId?;
};

class ProfileModel extends PresentationModel<ProfileProps> {
  logout = () => {
    authenticationService.logout();
  };

  override call(): ProfileProps {
    const user = getCurrentUser();
    const session = getCurrentSession();
    const themeMode = getThemeMode();

    return {
      user,
      onLogout: this.logout,
      workspaceId: session.workspaceId,
      darkMode: themeMode.isDark,
    };
  }
}

function ProfileComponent(props: ProfileProps) {
  const { darkMode, user, onLogout, workspaceId } = props;

  const { t } = useTranslation();

  const workspaceSettingsParam: WorkspaceSettingParam = {
    workspaceId,
  };

  const renderOverlay = ({
    show,
    arrowProps,
    hasDoneInitialMeasure,
    ...overlayProps
  }: OverlayInjectedProps) => {
    return (
      <div
        className={`profile-card card ${darkMode && "dark-theme"}`}
        {...overlayProps}
      >
        <Link
          to={JetRouteName.settings}
          state={workspaceSettingsParam}
          className="dropdown-item tj-text-xsm"
        >
          <SolidIcon name="user" width="20" />
          <span>{t("header.profile", "Profile")}</span>
        </Link>

        <Link
          prevent
          onClick={onLogout}
          className="dropdown-item text-danger tj-text-xsm"
        >
          <SolidIcon name="logout" width="20" />
          <span>{t("header.logout", "Logout")}</span>
        </Link>
      </div>
    );
  };

  return (
    <OverlayTrigger
      trigger="click"
      placement={"right"}
      rootClose={true}
      overlay={renderOverlay}
    >
      <div className="user-avatar-nav-item cursor-pointer">
        <ToolTip
          message="Profile"
          placement="right"
          trigger={["hover", "focus"]}
        >
          <div className="d-xl-block" data-cy="profile-settings">
            <Avatar
              avatarId={user?.avatar_id}
              text={`${user?.first_name ? user?.first_name[0] : ""}${
                user?.last_name ? user?.last_name[0] : ""
              }`}
            />
          </div>
        </ToolTip>
      </div>
    </OverlayTrigger>
  );
}

@auto(authStateObs, isDarkObs)
class ProfileView extends ClassFC(ProfileComponent) {}

export const Profile = bindViewModel(ProfileView, ProfileModel);
