import React from "react";
import { Link } from "react-router-dom";
import { authenticationService } from "@/_services";
import Avatar from "@/_ui/Avatar";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { useTranslation } from "react-i18next";
import { ToolTip } from "@/_components/ToolTip";
import { getPrivateRoute } from "@/core/routes";
import SolidIcon from "@/_ui/Icon/SolidIcons";
import { User, getCurrentUser } from ".";
import { PresentationModel } from "@externals/decorators";
import { authStateObs } from "@/modules/auth/auth-obs";
import { ClassFC, bindViewModel } from "@externals/decorators/react";
import { auto } from "@externals/observables/react";
import { OverlayInjectedProps } from "react-bootstrap/esm/Overlay";

type ProfileProps = {
  darkMode?: boolean;
  checkForUnsavedChanges?(s: string, event: React.MouseEvent): void;
  user?: User;
  onLogout?(): void;
};

class ProfileModel extends PresentationModel<ProfileProps> {
  logout = () => {
    authenticationService.logout();
  };

  override call(props: ProfileProps): ProfileProps {
    return {
      ...props,
      user: getCurrentUser(),
      onLogout: this.logout,
    };
  }
}

function ProfileComponent(props: ProfileProps) {
  const { darkMode, checkForUnsavedChanges, user } = props;

  const { t } = useTranslation();

  const renderOverlay = ({
    show,
    arrowProps,
    hasDoneInitialMeasure,
    ...props
  }: OverlayInjectedProps) => {
    return (
      <div
        className={`profile-card card ${darkMode && "dark-theme"}`}
        {...props}
      >
        <Link
          data-testid="settingsBtn"
          onClick={(event) =>
            checkForUnsavedChanges(getPrivateRoute("settings"), event)
          }
          to={getPrivateRoute("settings")}
          className="dropdown-item tj-text-xsm"
          data-cy="profile-link"
        >
          <SolidIcon name="user" width="20" />

          <span>{t("header.profile", "Profile")}</span>
        </Link>

        <Link
          data-testid="logoutBtn"
          to="#"
          onClick={props.onLogout}
          className="dropdown-item text-danger tj-text-xsm"
          data-cy="logout-link"
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

@auto(authStateObs)
class ProfileView extends ClassFC(ProfileComponent) {}

export const Profile = bindViewModel(ProfileView, ProfileModel);
