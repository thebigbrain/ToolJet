let _config: Config;

export class Config {
  API_URL: string;
  SERVER_IP: string;
  COMMENT_FEATURE_ENABLE: boolean;
  ENABLE_MULTIPLAYER_EDITING: boolean;
  ENABLE_MARKETPLACE_DEV_MODE: string;
  TOOLJET_MARKETPLACE_URL: string;
  LANGUAGE: string;
  TOOLJET_SERVER_URL: string;
  RELEASE_VERSION: string;
  SENTRY_DSN: string;
  SENTRY_DEBUG: boolean;
  APM_VENDOR:
    | "sentry"
    | "Dynatrace"
    | "New Relic"
    | "AppDynamics"
    | "Datadog"
    | "Azure Monitor";
  SUB_PATH?: string;
  ENABLE_TOOLJET_DB?: boolean;
  ENABLE_MARKETPLACE_FEATURE?: boolean;
  DISABLE_MULTI_WORKSPACE?: boolean;
  WHITE_LABEL_LOGO?: string;
  TOOLJET_HOST?: string;

  static getInstance() {
    return _config ?? new Config();
  }

  static setInstance(config: Config) {
    _config = config;
  }
}

export function getConfig() {
  return Config.getInstance();
}
