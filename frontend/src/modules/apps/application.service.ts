import config from "config";
import { authHeader, handleResponse } from "@externals/helpers";
import { AccessType, AppId } from "./application";
import { InviteInfo } from "@/interfaces/invite";
import { PasswordInfo } from "@/interfaces/password";
import { OrgId } from "@/interfaces/org";
import { UserId } from "@/modules/users";
import { Service } from "@/core/service";

export abstract class ApplicationService implements Service {
  getAll: (page: number, folder?: string, searchKey?: string) => Promise<any>;
  getApp: (id: AppId, accessType?: AccessType) => Promise<any>;
  getAppBySlug: (slug: string) => Promise<any>;
  getAppByVersion: (appId: AppId, versionId: string) => Promise<any>;

  createApp: (body: Object) => Promise<any>;
  cloneApp: (id: AppId) => Promise<any>;
  deleteApp: (id: AppId) => Promise<any>;
  saveApp: (id: AppId, attributes: Object) => Promise<any>;

  exportApp: (id: AppId, versionId: string) => Promise<any>;
  importApp: (body: Object) => Promise<any>;

  getAppUsers: (id: AppId) => Promise<any>;
  createAppUser: (
    app_id: AppId,
    org_user_id: UserId,
    role: string
  ) => Promise<any>;

  setVisibility: (appId: AppId, visibility: boolean) => Promise<any>;

  setSlug: (appId: AppId, slug: string) => Promise<any>;

  setPasswordFromToken: (info: PasswordInfo) => Promise<any>;

  changeIcon: (icon: string, appId: AppId) => Promise<any>;

  setMaintenance: (appId: AppId, value: boolean) => Promise<any>;

  getVersions: (id: AppId) => Promise<any>;

  acceptInvite: (info: InviteInfo) => Promise<any>;
}

const appService: ApplicationService = {
  getAll,
  createApp,
  cloneApp,
  exportApp,
  importApp,
  changeIcon,
  deleteApp,
  getApp,
  getAppBySlug,
  getAppByVersion,
  saveApp,
  getAppUsers,
  createAppUser,
  setVisibility,
  setMaintenance,
  setSlug,
  setPasswordFromToken,
  acceptInvite,
  getVersions,
};

export class ApplicationServiceImpl extends ApplicationService {
  constructor() {
    super();
    return appService;
  }
}

function getConfig() {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: authHeader(),
    credentials: "include",
  };
  return fetch(`${config.apiUrl}/config`, requestOptions).then(handleResponse);
}

function getAll(page: number, folder?: string, searchKey?: string) {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: authHeader(),
    credentials: "include",
  };
  if (page === 0)
    return fetch(`${config.apiUrl}/apps`, requestOptions).then(handleResponse);
  else
    return fetch(
      `${config.apiUrl}/apps?page=${page}&folder=${
        folder || ""
      }&searchKey=${searchKey}`,
      requestOptions
    ).then(handleResponse);
}

function createApp(body = {}) {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: authHeader(),
    credentials: "include",
    body: JSON.stringify(body),
  };
  return fetch(`${config.apiUrl}/apps`, requestOptions).then(handleResponse);
}

function cloneApp(id: AppId) {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: authHeader(),
    credentials: "include",
  };
  return fetch(`${config.apiUrl}/apps/${id}/clone`, requestOptions).then(
    handleResponse
  );
}

function exportApp(id: AppId, versionId: string) {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: authHeader(),
    credentials: "include",
  };
  return fetch(
    `${config.apiUrl}/apps/${id}/export${
      versionId ? `?versionId=${versionId}` : ""
    }`,
    requestOptions
  ).then(handleResponse);
}

function getVersions(id: AppId) {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: authHeader(),
    credentials: "include",
  };
  return fetch(`${config.apiUrl}/apps/${id}/versions`, requestOptions).then(
    handleResponse
  );
}

function importApp(body: Object) {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: authHeader(),
    credentials: "include",
    body: JSON.stringify(body),
  };
  return fetch(`${config.apiUrl}/apps/import`, requestOptions).then(
    handleResponse
  );
}

function changeIcon(icon: string, appId: AppId) {
  const requestOptions: RequestInit = {
    method: "PUT",
    headers: authHeader(),
    credentials: "include",
    body: JSON.stringify({ icon }),
  };
  return fetch(`${config.apiUrl}/apps/${appId}/icons`, requestOptions).then(
    handleResponse
  );
}

function getApp(id: AppId, accessType: AccessType = "") {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: authHeader(),
    credentials: "include",
  };
  return fetch(
    `${config.apiUrl}/apps/${id}${
      accessType ? `?access_type=${accessType}` : ""
    }`,
    requestOptions
  ).then(handleResponse);
}

function deleteApp(id: AppId) {
  const requestOptions: RequestInit = {
    method: "DELETE",
    headers: authHeader(),
    credentials: "include",
  };
  return fetch(`${config.apiUrl}/apps/${id}`, requestOptions).then(
    handleResponse
  );
}

function getAppBySlug(slug: string) {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: authHeader(),
    credentials: "include",
  };
  return fetch(`${config.apiUrl}/apps/slugs/${slug}`, requestOptions).then(
    handleResponse
  );
}

function getAppByVersion(appId: AppId, versionId: string) {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: authHeader(),
    credentials: "include",
  };
  return fetch(
    `${config.apiUrl}/apps/${appId}/versions/${versionId}`,
    requestOptions
  ).then(handleResponse);
}

function saveApp(id: AppId, attributes: Object) {
  const requestOptions: RequestInit = {
    method: "PUT",
    headers: authHeader(),
    credentials: "include",
    body: JSON.stringify({ app: attributes }),
  };
  return fetch(`${config.apiUrl}/apps/${id}`, requestOptions).then(
    handleResponse
  );
}

function getAppUsers(id: AppId) {
  const requestOptions: RequestInit = {
    method: "GET",
    headers: authHeader(),
    credentials: "include",
  };
  return fetch(`${config.apiUrl}/apps/${id}/users`, requestOptions).then(
    handleResponse
  );
}

function createAppUser(app_id: AppId, org_user_id: OrgId, role: string) {
  const body = {
    app_id,
    org_user_id,
    role,
  };

  const requestOptions: RequestInit = {
    method: "POST",
    headers: authHeader(),
    credentials: "include",
    body: JSON.stringify(body),
  };
  return fetch(`${config.apiUrl}/app_users`, requestOptions).then(
    handleResponse
  );
}

function setVisibility(appId: AppId, visibility: boolean) {
  const requestOptions: RequestInit = {
    method: "PUT",
    headers: authHeader(),
    credentials: "include",
    body: JSON.stringify({ app: { is_public: visibility } }),
  };
  return fetch(`${config.apiUrl}/apps/${appId}`, requestOptions).then(
    handleResponse
  );
}

function setMaintenance(appId: AppId, value: boolean) {
  const requestOptions: RequestInit = {
    method: "PUT",
    headers: authHeader(),
    credentials: "include",
    body: JSON.stringify({ app: { is_maintenance_on: value } }),
  };
  return fetch(`${config.apiUrl}/apps/${appId}`, requestOptions).then(
    handleResponse
  );
}

function setSlug(appId: AppId, slug: string) {
  const requestOptions: RequestInit = {
    method: "PUT",
    headers: authHeader(),
    credentials: "include",
    body: JSON.stringify({ app: { slug: slug } }),
  };
  return fetch(`${config.apiUrl}/apps/${appId}`, requestOptions).then(
    handleResponse
  );
}

function setPasswordFromToken({
  token,
  password,
  organization,
  role,
  firstName,
  lastName,
  organizationToken,
}: PasswordInfo) {
  const body = {
    token,
    organizationToken,
    password,
    organization,
    role,
    first_name: firstName,
    last_name: lastName,
  };

  const requestOptions: RequestInit = {
    method: "POST",
    headers: authHeader(),
    credentials: "include",
    body: JSON.stringify(body),
  };
  return fetch(`${config.apiUrl}/set-password-from-token`, requestOptions).then(
    handleResponse
  );
}

function acceptInvite({ token, password }: InviteInfo) {
  const body = {
    token,
    password,
  };

  const requestOptions: RequestInit = {
    method: "POST",
    headers: authHeader(),
    credentials: "include",
    body: JSON.stringify(body),
  };
  return fetch(`${config.apiUrl}/accept-invite`, requestOptions);
}
