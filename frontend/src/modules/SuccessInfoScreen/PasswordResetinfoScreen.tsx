import React from "react";
import { ButtonSolid } from "@/_components/AppButton";
import { JetRouteName, navigate } from "../routes";

export const PasswordResetinfoScreen = function PasswordResetinfoScreen({
  darkMode,
}) {
  return (
    <div className="info-screen-wrapper">
      <div className="password-reset-card">
        <img
          className="info-screen-email-img"
          src={
            darkMode
              ? "assets/images/onboardingassets/Illustrations/reset_password_successfull_dark.svg"
              : "assets/images/onboardingassets/Illustrations/reset_password_successfull.svg"
          }
          alt="password lock"
          loading="lazy"
          data-cy="email-image"
        />
        <h1
          className="common-auth-section-header"
          data-cy="reset-password-page-header"
        >
          Password has been reset
        </h1>
        <p
          className="info-screen-description"
          data-cy="reset-password-page-description"
        >
          Your password has been reset successfully, log into ToolJet to
          continue your session
        </p>
        <ButtonSolid
          variant="secondary"
          onClick={() => navigate(JetRouteName.login)}
          className="reset-password-info-btn"
          data-cy="back-to-login-button"
        >
          Back to log in
        </ButtonSolid>
      </div>
    </div>
  );
};
