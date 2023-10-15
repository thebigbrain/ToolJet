import { createObservable } from "@externals/observables";
import { AuthState } from "./auth";
import { getAuthService } from "./auth.service";

export const authStateObs = createObservable(new AuthState());

export async function initAuthState() {
  const authService = getAuthService();
  return authService.validateSession().then((session) => {
    authStateObs.update({
      workspaceId: session.workspaceId,
      hasLogged: session.isValid,
      isTokenValid: session.isValid,
      isAdmin: session.admin,
    });
  });
}

export function getAuthState() {
  return authStateObs.value;
}
