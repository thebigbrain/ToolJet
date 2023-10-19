import React from "react";
import LogoLightMode from "@assets/images/Logomark.svg";
import LogoDarkMode from "@assets/images/Logomark-dark-mode.svg";
import { Link } from "@/modules/routes/Link";
import { JetRouteName } from "@/modules/routes";

function OnboardingNavbar({ darkMode }) {
  const Logo = darkMode ? LogoDarkMode : LogoLightMode;

  return (
    <div className={`onboarding-navbar container-xl`}>
      <Link to={JetRouteName.dashboard}>
        <Logo height="23" width="92" data-cy="page-logo" />
      </Link>
    </div>
  );
}

export default OnboardingNavbar;
