import { authenticationService } from "@/_services/authentication.service";
import { getWorkspaceId } from "@/core/utils";
import { JetRouteName, WorkspaceParam, navigate } from "../routes";

export const UnknowPage = () => {
  if (authenticationService?.currentSessionValue?.current_organization_id) {
    navigate<WorkspaceParam>({
      to: JetRouteName.workspace,
      state: { workspaceId: getWorkspaceId() },
    });
  } else {
    navigate(JetRouteName.login);
  }

  return null;
};
