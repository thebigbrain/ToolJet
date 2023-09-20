import React from "react";
import { Link } from "react-router-dom";

import Logo from "@assets/images/rocket.svg";
import { getPrivateRoute } from "@/core/routes";
import useGlobalDatasourceUnsavedChanges from "@/_hooks/useGlobalDatasourceUnsavedChanges";

const BrandLogo = () => {
  const { checkForUnsavedChanges } = useGlobalDatasourceUnsavedChanges();

  return (
    <div className="application-brand" data-cy={`home-page-logo`}>
      <Link
        to={getPrivateRoute("dashboard")}
        onClick={(event) =>
          checkForUnsavedChanges(getPrivateRoute("dashboard"), event)
        }
      >
        <Logo />
      </Link>
    </div>
  );
};

export default BrandLogo;
