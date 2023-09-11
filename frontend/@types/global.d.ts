export {};

declare global {
  interface PubConfig {
    LANGUAGE: string;
    TOOLJET_SERVER_URL: string;
    RELEASE_VERSION: string;
    SENTRY_DNS: string;
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
  }

  interface Window {
    public_config: PubConfig;
  }
}
