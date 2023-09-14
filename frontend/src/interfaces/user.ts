import { OrgId } from "./org";

export type UserId = string;

export interface User {
  current_organization_id?: OrgId;
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
