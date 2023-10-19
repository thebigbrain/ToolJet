import { createObservable } from "@externals/observables";
import { AuthState } from "./auth";
import { getAuthService } from "./auth.service";
import { User } from "../users";

export const authStateObs = createObservable(new AuthState());

export async function initAuthState() {
  const authService = getAuthService();
  return authService.validateSession().then((session) => {
    User.session = session;

    authStateObs.update({
      workspaceId: session.workspaceId,
      hasLogged: session.isValid,
      isTokenValid: session.isValid,
      isAdmin: session.admin,
      session,
    });
  });
}

export function getAuthState() {
  return authStateObs.value;
}
