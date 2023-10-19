import { authenticationService } from "@/_services";
import { OrgId } from "@/interfaces/org";

export type UserId = string;

export class Session {
  id?;
  current_user?;
  current_organization_id?;
  current_organization_name?;
  super_admin?;
  // admin?;
  group_permissions?;
  app_group_permissions?;
  organizations?;
  authentication_status?;
  authentication_failed?: boolean;
  isUserUpdated?: boolean;
  load_app?: boolean; //key is used only in the viewer mode

  isValid: boolean;
  workspaceId?: string;
  admin?: boolean;
}

export class User {
  static current: User = null;
  static session: Session;

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
