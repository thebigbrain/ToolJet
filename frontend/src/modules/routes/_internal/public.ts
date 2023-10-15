import { JetRouteName, findRouteName } from "./name";

const publicRoutes = [
  JetRouteName.login,
  JetRouteName.setup,
  JetRouteName.sso,
  JetRouteName.signup,
  JetRouteName.forgot_password,
  JetRouteName.reset_password,
  JetRouteName.invitations,
  JetRouteName.confirm_invite,
];

const adminRoutes = [JetRouteName.integrations];

export function isPublic(name: JetRouteName) {
  return publicRoutes.includes(name) || false;
}

export function isPathPublic(path: string) {
  const name = findRouteName(path);
  return path && name && isPublic(name);
}

export function isAdminOnly(name: JetRouteName) {
  return adminRoutes.includes(name) || false;
}
