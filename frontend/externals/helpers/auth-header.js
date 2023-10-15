let workspaceId;

export function setWorkspaceId(id) {
  workspaceId = id;
}

export function authHeader(isMultipartData = false, current_organization_id) {
  const wid = current_organization_id || workspaceId;

  return {
    ...(!isMultipartData && {
      "Content-Type": "application/json",
    }),
    ...(wid && {
      "tj-workspace-id": wid,
    }),
  };
}
