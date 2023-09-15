import { OrgId } from "./org";

export type UserId = string;

export interface User {
  id?: UserId;
  current_organization_id?: OrgId;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  organizationUserId?: UserId;
}

export interface UserOnboardingDetail {
  questions?;
  password?: string;
}

export interface UserDetail {
  onboarding_details?: UserOnboardingDetail;
  name?: string;
  email?: string;
}
