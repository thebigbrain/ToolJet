import { authenticationService } from "@/_services";
import { Service, getService, registerService } from "@/core/service";
import { setWorkspaceId } from "@externals/helpers";
import { User, Session } from "../users";

export abstract class AuthService implements Service {
  abstract validateSession(): Promise<Session>;
}

class AuthServiceImpl implements AuthService {
  async validateSession(): Promise<Session> {
    try {
      const data = await authenticationService.validateSession();

      setWorkspaceId(data.current_organization_id);

      const authData = await authenticationService.authorize();

      User.current = authData.current_user;
      const session: Session = authData;

      authenticationService.updateCurrentSession({
        current_organization_id: data.current_organization_id,
      });

      session.isValid = true;
      session.workspaceId = data.current_organization_id;

      return session;
    } catch (err) {
      return {
        isValid: false,
      };
    }
  }
}

export function registerAuthService() {
  registerService<AuthService>(AuthService, AuthServiceImpl);
}

export function getAuthService() {
  return getService<AuthService>(AuthService);
}
