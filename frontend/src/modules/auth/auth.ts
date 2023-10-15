export class AuthState {
  hasLogged: boolean;
  isTokenValid: boolean;
  workspaceId?: string;
  isAdmin?: boolean;
}

export function verify(auth: AuthState, isPublic: boolean) {
  if (!isPublic) {
    if (auth.hasLogged) {
      return auth.isTokenValid;
    }
    return false;
  }

  return true;
}
