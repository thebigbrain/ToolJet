import { authenticationService } from "@/_services";
import { OrgId } from "@/interfaces/org";

export type UserId = string;

export class User {
  static current: User = null;
  static session: typeof authenticationService.currentSessionValue;

  get isAdmin(): boolean {
    return User.session?.admin;
  }

  id?: UserId;
  avatar_id?: string;
  current_organization_id?: OrgId;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  organizationUserId?: UserId;
}

export function getCurrentUser() {
  return User.current;
}

export function getCurrentSession() {
  return User.session;
}
