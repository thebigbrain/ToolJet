export interface EnvConfig {
  apiUrl: string;
  SERVER_IP: string;
  COMMENT_FEATURE_ENABLE: boolean;
  ENABLE_TOOLJET_DB: boolean;
  ENABLE_MULTIPLAYER_EDITING: boolean;
  ENABLE_MARKETPLACE_FEATURE: boolean;
  ENABLE_MARKETPLACE_DEV_MODE: string;
  TOOLJET_MARKETPLACE_URL: string;
}

declare const config: EnvConfig;

export default config;
