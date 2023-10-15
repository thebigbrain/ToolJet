import React, { PropsWithChildren } from "react";

import { JetRoute, routeName2Path } from "@/modules/routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { initRoutes } from "./allRoutes";
import { UnknowPage } from "./UnknowPage";
import { Config } from "@/core/config";
import { ClassFC, bindViewModel } from "@externals/decorators/react";
import { PresentationModel } from "@externals/decorators";
import { authStateObs, getAuthState } from "../auth/auth-obs";
import { auto } from "@externals/observables/react";

type JetRoutesProps = {
  routes?: JetRoute[];
};

class JetRoutesModel extends PresentationModel<JetRoutesProps> {
  override call(): JetRoutesProps {
    const routes = initRoutes(getAuthState());
    return { routes };
  }
}

function JetRoutesComponent(props: JetRoutesProps) {
  return (
    <Routes>
      {props.routes?.map((route) => {
        return (
          route.visible && (
            <Route
              key={route.name}
              path={routeName2Path(route.name)}
              Component={route.component}
            />
          )
        );
      })}
      <Route path="*" Component={UnknowPage} />
    </Routes>
  );
}

@auto(authStateObs)
class JetRoutesView extends ClassFC(JetRoutesComponent) {}

export const JetRoutes = bindViewModel(JetRoutesView, JetRoutesModel);

export function JetRouterProvider(props: PropsWithChildren) {
  const config = Config.getInstance();
  const basename = config?.SUB_PATH || "/";
  return <BrowserRouter basename={basename}>{props.children}</BrowserRouter>;
}
