import React, { Suspense } from "react";

import "@/_styles/theme.scss";
import "react-tooltip/dist/react-tooltip.css";

import { auto } from "@externals/observables/react";
import { isDarkObs } from "../theme/mode";
import { toLoginPage } from "@/modules/routes";
import JetUpdate from "./JetUpdate";
import JetToast from "./JetToast";
import JetSidebar from "./JetSidebar";
import JetThemeWrapper from "./JetThemeWrapper";
import { ClassFC, bindViewModel } from "@externals/decorators/react";
import { PresentationModel } from "@externals/decorators";
import { verify } from "@/modules/auth";
import { authStateObs, getAuthState } from "@/modules/auth/auth-obs";
import { isPathPublic } from "@/modules/routes";
import { JetRouterProvider, JetRoutes } from "./JetRoutes";

type BluejetMainProps = {
  location?: { pathname: string };
};

class BluejetMainModel extends PresentationModel<BluejetMainProps> {
  constructor(props: BluejetMainProps) {
    super();

    this.checkAuth(props.location?.pathname);
  }

  private checkAuth = (pathname: string) => {
    const auth = getAuthState();
    const isPublic = isPathPublic(pathname);
    const passed = verify(auth, isPublic);
    if (!passed) {
      toLoginPage();
    }
  };
}

function BluejetMainComponent() {
  return (
    <>
      <JetThemeWrapper>
        <JetUpdate />
        <JetSidebar>
          <JetRoutes />
        </JetSidebar>
      </JetThemeWrapper>

      <JetToast />
    </>
  );
}

@auto(isDarkObs, authStateObs)
class BluejetMainView extends ClassFC(BluejetMainComponent) {}

const AppWithRouter = bindViewModel(BluejetMainView, BluejetMainModel);

export const BluejetMain = (props: any) => {
  return (
    <Suspense fallback={null}>
      <JetRouterProvider>
        <AppWithRouter {...props} />
      </JetRouterProvider>
    </Suspense>
  );
};
