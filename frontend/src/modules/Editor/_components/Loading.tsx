import React from "react";

import ViewerLogoIcon from "@assets/Icons/viewer-logo.svg";
import Spinner from "@/_ui/Spinner";

export const LoadingWithLogoSpinner = () => {
  return (
    <div className="tooljet-logo-loader">
      <div>
        <div className="loader-logo">
          <ViewerLogoIcon />
        </div>
        <div className="loader-spinner">
          <Spinner />
        </div>
      </div>
    </div>
  );
};

export const LoadingWithCenterdSpinner = () => {
  return (
    <div className="mx-auto mt-5 w-50 p-5">
      <center>
        <div className="spinner-border text-azure" role="status"></div>
      </center>
    </div>
  );
};
