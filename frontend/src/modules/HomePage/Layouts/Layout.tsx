import React from "react";
import Header from "@/_ui/Header";
import { ConfirmDialog } from "@/_components";
import useGlobalDatasourceUnsavedChanges from "@/_hooks/useGlobalDatasourceUnsavedChanges";

import BrandLogo from "./BrandLogo";
import SideMenus from "./SideMenus";

function Layout({ children }) {
  const {
    handleDiscardChanges,
    handleSaveChanges,
    handleContinueEditing,
    unSavedModalVisible,
    nextRoute,
  } = useGlobalDatasourceUnsavedChanges();

  return (
    <div className="row m-auto">
      <div className="col-auto p-0">
        <aside className="left-sidebar h-100 position-fixed">
          <div className="tj-leftsidebar-icon-wrap">
            <BrandLogo />
            <SideMenus />
          </div>
        </aside>
      </div>
      <div style={{ paddingLeft: 56, paddingRight: 0 }} className="col">
        <Header />
        <div style={{ paddingTop: 64 }}>{children}</div>
      </div>
      <ConfirmDialog
        title={"Unsaved Changes"}
        show={unSavedModalVisible}
        message={
          "Datasource has unsaved changes. Are you sure you want to discard them?"
        }
        onConfirm={() => handleDiscardChanges(nextRoute)}
        onCancel={handleSaveChanges}
        confirmButtonText={"Discard"}
        cancelButtonText={"Save changes"}
        confirmButtonType="dangerPrimary"
        cancelButtonType="tertiary"
        backdropClassName="datasource-selection-confirm-backdrop"
        onCloseIconClick={handleContinueEditing}
      />
    </div>
  );
}

export default Layout;
