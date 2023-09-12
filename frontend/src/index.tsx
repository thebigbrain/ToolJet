import React from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router-dom";
import { BrowserTracing } from "@sentry/browser";
import { App, appService } from "./modules/App";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend, { HttpBackendOptions } from "i18next-http-backend";
import { ServiceType, registerService } from "./core/service";

bootstrap().then(loadPlugins).then(render);

async function bootstrap() {
  window.appConfig = await appService.getConfig();
}

function loadPlugins() {
  const config = window.appConfig;

  installI18n(config);
  installTracing(config);

  installApp(config);
}

function installI18n(config: AppConfig) {
  const language = config.LANGUAGE || "en";
  const path = config?.SUB_PATH || "/";
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init<HttpBackendOptions>({
      load: "languageOnly",
      fallbackLng: "en",
      lng: language,
      backend: {
        loadPath: `${path}assets/translations/{{lng}}.json`,
      },
    });
}

function installTracing(config: AppConfig) {
  if (config.APM_VENDOR === "sentry") {
    const tooljetServerUrl = config.TOOLJET_SERVER_URL;
    const tracingOrigins = ["localhost", /^\//];
    const releaseVersion = config.RELEASE_VERSION
      ? `tooljet-${config.RELEASE_VERSION}`
      : "tooljet";

    if (tooljetServerUrl) tracingOrigins.push(tooljetServerUrl);

    Sentry.init({
      dsn: config.SENTRY_DNS,
      debug: !!config.SENTRY_DEBUG,
      release: releaseVersion,
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.reactRouterV6Instrumentation(
            React.useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes
          ),
          tracingOrigins: tracingOrigins,
        }),
      ],
      tracesSampleRate: 0.5,
    });
  }
}

function installApp(config: AppConfig) {
  registerService(ServiceType.Application, appService);
}

function render() {
  const AppWithProfiler = Sentry.withProfiler(App);
  createRoot(document.getElementById("app")).render(<AppWithProfiler />);
}
