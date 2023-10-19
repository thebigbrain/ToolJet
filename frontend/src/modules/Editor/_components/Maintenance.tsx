import React from "react";
import { useTranslation } from "react-i18next";

export const MaintenanceWarning = () => {
  const { t } = useTranslation();

  return (
    <div className="maintenance_container">
      <div className="card">
        <div
          className="card-body"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h3>{t("viewer", "Sorry!. This app is under maintenance")}</h3>
        </div>
      </div>
    </div>
  );
};
