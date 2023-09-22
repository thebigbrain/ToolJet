import { authenticationService } from "@/_services";

class User {
  static current: User = null;
  static session: typeof authenticationService.currentSessionValue;

  get isAdmin(): boolean {
    return User.session?.admin;
  }
}

export function getCurrentUser() {
  const session = authenticationService.currentSessionValue;
  return session.current_user;
}
