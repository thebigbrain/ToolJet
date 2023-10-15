import { JetRouteName, WorkspaceParam, navigate } from "../routes";
import { authStateObs } from "../auth/auth-obs";

export const UnknowPage = () => {
  const auth = authStateObs.value;
  if (auth.isTokenValid) {
    navigate<WorkspaceParam>({
      to: JetRouteName.workspace,
      state: { workspaceId: auth.workspaceId },
    });
  } else {
    navigate(JetRouteName.login);
  }

  return null;
};
