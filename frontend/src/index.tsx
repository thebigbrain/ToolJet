import React from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";

import { BrowserTracing } from "@sentry/browser";
import { BluejetMain } from "./modules/main/Bluejet";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend, { HttpBackendOptions } from "i18next-http-backend";
import { registerService } from "./core/service";
import { installPlugin } from "./core/plugin";
import configPlugin, { getAppConfig } from "./plugins/config/config";
import { Config } from "./core/config";
import { ApplicationService, ApplicationServiceImpl } from "./modules/apps";
import { Bluejet } from "./core/bluejet";
import { BluejetWebImpl } from "./modules/main/bluejetImpl";
import { Theme } from "./core/theme";
import { registerAuthService } from "./modules/auth";
import { installRouter } from "./modules/routes";
import { RrJetRouter } from "./modules/main/JetRoutes";

bootstrap().then(render);

async function bootstrap() {
  Bluejet.setInstance(new BluejetWebImpl());
  Theme.setInstance(new Theme());

  installRouter(new RrJetRouter());

  const config = await getAppConfig();
  installPlugin(configPlugin);

  loadPlugins(config);

  await Bluejet.getInstance().prepare();
}

function loadPlugins(config: Config) {
  installI18n(config);
  installTracing(config);

  installServices(config);
}

function installI18n(config: Config) {
  const language = config.LANGUAGE || "zh";
  const path = config?.SUB_PATH || "/";

  i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init<HttpBackendOptions>({
      load: "languageOnly",
      fallbackLng: "zh",
      lng: language,
      backend: {
        loadPath: `${path}assets/translations/{{lng}}.json`,
      },
    });
}

function installTracing(config: Config) {
  if (config.APM_VENDOR === "sentry") {
    const tooljetServerUrl = config.TOOLJET_SERVER_URL;
    const tracingOrigins = ["localhost", /^\//];
    const releaseVersion = config.RELEASE_VERSION
      ? `tooljet-${config.RELEASE_VERSION}`
      : "tooljet";

    if (tooljetServerUrl) tracingOrigins.push(tooljetServerUrl);

    Sentry.init({
      dsn: config.SENTRY_DSN,
      debug: !!config.SENTRY_DEBUG,
      release: releaseVersion,
      integrations: [
        new BrowserTracing({
          // routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          //   React.useEffect,
          //   useLocation,
          //   useNavigationType,
          //   createRoutesFromChildren,
          //   matchRoutes
          // ),
          tracingOrigins: tracingOrigins,
        }),
      ],
      tracesSampleRate: 0.5,
    });
  }
}

function installServices(config: Config) {
  registerService(ApplicationService, ApplicationServiceImpl);
  registerAuthService();
}

function render() {
  const AppWithProfiler = Sentry.withProfiler(BluejetMain);
  createRoot(document.getElementById("app")).render(<AppWithProfiler />);
}
