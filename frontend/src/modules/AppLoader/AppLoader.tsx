import React, { useEffect } from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { organizationService, authenticationService } from "@/_services";
import { Editor } from "../../Editor/Editor";
import { RealtimeEditor } from "@/Editor/RealtimeEditor";
import config from "config";
import { safelyParseJSON, stripTrailingSlash } from "@externals/helpers/utils";
import { redirectToDashboard, getSubpath, getWorkspaceId } from "@/core/utils";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { navigateTo } from "@externals/helpers/routes";
import { getService } from "@/core/service";
import { ApplicationService } from "@/interfaces/application";
import useRouter from "@/_hooks/use-router";

type AppLoaderProps = {
  darkMode?: boolean;
  switchDarkMode?: (dardMode: boolean) => void;
} & WithTranslation;

const AppLoaderComponent = (props: AppLoaderProps) => {
  const params = useParams();
  const appId = params.id;

  const router = useRouter();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => loadAppDetails(), []);

  const appService = getService<ApplicationService>(ApplicationService);

  const loadAppDetails = () => {
    appService.getApp(appId, "edit").catch((error) => {
      handleError(error);
    });
  };

  const switchOrganization = (orgId) => {
    const path = `/apps/${appId}`;
    const sub_path = window?.appConfig?.SUB_PATH
      ? stripTrailingSlash(window?.appConfig?.SUB_PATH)
      : "";
    organizationService.switchOrganization(orgId).then(
      () => {
        window.location.href = `${sub_path}/${orgId}${path}`;
      },
      () => {
        return (window.location.href = `${sub_path}/login/${orgId}?redirectTo=${path}`);
      }
    );
  };

  const handleError = (error) => {
    try {
      if (error?.data) {
        const statusCode = error.data?.statusCode;
        if (statusCode === 403) {
          const errorObj = safelyParseJSON(error.data?.message);
          if (
            errorObj?.organizationId &&
            authenticationService.currentSessionValue
              .current_organization_id !== errorObj?.organizationId
          ) {
            switchOrganization(errorObj?.organizationId);
            return;
          }
          redirectToDashboard();
        } else if (statusCode === 401) {
          navigateTo(
            `${getSubpath() ?? ""}/login${
              !_.isEmpty(getWorkspaceId()) ? `/${getWorkspaceId()}` : ""
            }?redirectTo=${router.location.pathname}`
          );
          return;
        } else if (statusCode === 404 || statusCode === 422) {
          toast.error(error?.error ?? "App not found");
        }
        redirectToDashboard();
      }
    } catch (err) {
      redirectToDashboard();
    }
  };

  return config.ENABLE_MULTIPLAYER_EDITING ? (
    <RealtimeEditor {...props} />
  ) : (
    <Editor {...props} />
  );
};

export const AppLoader = withTranslation()(AppLoaderComponent);
