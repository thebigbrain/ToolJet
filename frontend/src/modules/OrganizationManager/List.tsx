import React, { useEffect, useState } from "react";
import { CustomSelect } from "./CustomSelect";
import {
  getWorkspaceIdFromURL,
  appendWorkspaceId,
  getAvatar,
} from "@externals/helpers/utils";
import { ToolTip } from "@/_components";
import { getCurrentSession } from "@/modules/users";
import { auto } from "@externals/observables/react";
import { authStateObs } from "../auth/auth-obs";
import { getIsDark, isDarkObs } from "../theme/mode";
import { Organization } from "@/interfaces/org";
import { organizationService } from "@/_services";

export const OrganizationList = auto(
  authStateObs,
  isDarkObs
)(OrganizationsComponent);

function OrganizationsComponent() {
  const session = getCurrentSession();
  const darkMode = getIsDark();

  const [organizations, setOrganizations] = useState<Organization[]>(
    session?.organizations ?? []
  );

  useEffect(() => {
    organizationService.getOrganizations().then((data) => {
      setOrganizations(data.organizations);
    });
  }, [session?.current_organization_id]);

  const switchOrganization = (orgId) => {
    if (getWorkspaceIdFromURL() !== orgId) {
      const newPath = appendWorkspaceId(orgId, location.pathname, true);
      window.history.replaceState(null, null, newPath);
      window.location.reload();
    }
  };

  const options = organizations?.map((org) => ({
    value: org.id,
    name: org.name,
    label: (
      <div
        className={`align-items-center d-flex tj-org-dropdown  ${
          darkMode && "dark-theme"
        }`}
      >
        <div
          className="dashboard-org-avatar "
          data-cy={`${String(org.name)
            .toLowerCase()
            .replace(/\s+/g, "-")}-avatar`}
        >
          {getAvatar(org.name)}
        </div>
        <ToolTip message={org.name} placement="right">
          <div
            className="org-name"
            data-cy={`${String(org.name)
              .toLowerCase()
              .replace(/\s+/g, "-")}-name-selector`}
          >
            {org.name}
          </div>
        </ToolTip>
      </div>
    ),
  }));

  return (
    <div className="org-select-container">
      <CustomSelect
        options={options}
        value={session.workspaceId}
        onChange={(id) => switchOrganization(id)}
        className={`tj-org-select  ${darkMode && "dark-theme"}`}
      />
    </div>
  );
}
