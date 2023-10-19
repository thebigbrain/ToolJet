import { JetRouteName, WorkspaceParam, navigate } from "../routes";
import { authStateObs } from "../auth/auth-obs";
import React from "react";

export class UnknowPage extends React.Component {
  componentDidMount(): void {
    const auth = authStateObs.value;
    if (auth.isTokenValid) {
      navigate<WorkspaceParam>({
        to: JetRouteName.workspace,
        state: { workspaceId: auth.workspaceId },
        replace: true,
      });
    } else {
      navigate(JetRouteName.login);
    }
  }

  render() {
    return null;
  }
}
