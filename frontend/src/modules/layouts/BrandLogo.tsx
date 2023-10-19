import React from "react";

import Logo from "@assets/images/rocket.svg";
import { Link } from "@/modules/routes/Link";
import { JetRouteName } from "@/modules/routes";
import { getCurrentSession } from "@/modules/users";

const BrandLogo = () => {
  const session = getCurrentSession();

  return (
    <div className="application-brand" data-cy={`home-page-logo`}>
      <Link
        to={JetRouteName.workspace}
        state={{ workspaceId: session.workspaceId }}
      >
        <Logo />
      </Link>
    </div>
  );
};

export default BrandLogo;
