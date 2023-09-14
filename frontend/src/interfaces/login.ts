import { WithTranslation } from "react-i18next";
import { WithRouterProps } from "./router";

export type LoginProps = {} & WithRouterProps & WithTranslation;

export type LoginConfig = Partial<{
  form: any;
  git: any;
  google: any;
  name: string;
  enable_sign_up: any;
}>;

export type LoginState = Partial<{
  showPassword?: boolean;
  isLoading?: boolean;
  isGettingConfigs?: boolean;
  configs?: LoginConfig;
  emailError?: string;
  navigateToLogin?: boolean;
  current_organization_name?: string;
  email?: string;
  password?: string;
  name?: string;
}>;
