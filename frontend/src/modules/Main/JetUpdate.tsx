import { tooljetService } from "@/_services";
import { lt } from "semver";
import React, { useState } from "react";

export default () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [autoUpdater, setAutoUpdater] = useState(0);

  React.useEffect(() => {
    tooljetService.fetchMetaData().then((data) => {
      localStorage.setItem("currentVersion", data.installed_version);
      if (
        data.latest_version &&
        lt(data.installed_version, data.latest_version) &&
        data.version_ignored === false
      ) {
        setUpdateAvailable(true);
      }
    });
  }, [autoUpdater]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setAutoUpdater(autoUpdater + 1);
    }, 1000 * 60 * 60 * 1);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    updateAvailable && (
      <div className="alert alert-info alert-dismissible" role="alert">
        <h3 className="mb-1">Update available</h3>
        <p>A new version of ToolJet has been released.</p>
        <div className="btn-list">
          <a
            href="https://docs.tooljet.io/docs/setup/updating"
            target="_blank"
            className="btn btn-info"
            rel="noreferrer"
          >
            Read release notes & update
          </a>
          <a
            onClick={() => {
              tooljetService.skipVersion();
              setUpdateAvailable(false);
            }}
            className="btn"
          >
            Skip this version
          </a>
        </div>
      </div>
    )
  );
};
