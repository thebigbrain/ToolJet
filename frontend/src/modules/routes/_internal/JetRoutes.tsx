import React from "react";
import { Route, Routes } from "react-router";

import { JetRoute } from "./route";
import { routeName2Path } from "./name";

type JetRoutesProps = {
  routes: Array<JetRoute>;
  unknown: React.ComponentType;
};

export function JetRoutesView(props: JetRoutesProps) {
  return (
    <Routes>
      {props.routes.map((route) => {
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
      <Route path="*" Component={props.unknown} />

      {/* {window.appConfig?.ENABLE_TOOLJET_DB && (
        <Route
          path="/:workspaceId/database"
          element={
            <PrivateRoute>
              <TooljetDatabase
                switchDarkMode={props.switchDarkMode}
                darkMode={darkMode}
              />
            </PrivateRoute>
          }
        />
      )} */}

      {/* {window.appConfig?.ENABLE_MARKETPLACE_FEATURE && (
        <Route
          path="/integrations"
          element={
            <AdminRoute>
              <MarketplacePage
                switchDarkMode={props.switchDarkMode}
                darkMode={darkMode}
              />
            </AdminRoute>
          }
        />
      )} */}
      {/* <Route path="/" element={<Navigate to="/:workspaceId" />} /> */}
      {/* <Route
        path="/switch-workspace"
        element={
          <PrivateRoute>
            <SwitchWorkspacePage darkMode={darkMode} />
          </PrivateRoute>
        }
      /> */}
      {/* <Route
        path="/:workspaceId"
        element={
          <PrivateRoute>
            <HomePage
              switchDarkMode={props.switchDarkMode}
              darkMode={darkMode}
            />
          </PrivateRoute>
        }
      /> */}
      {/* <Route
        path="*"
        Component={() => {
          if (
            authenticationService?.currentSessionValue?.current_organization_id
          ) {
            return <Navigate to="/:workspaceId" />;
          }
          return <Navigate to="/login" />;
        }}
      /> */}
    </Routes>
  );
}
