import React from "react";
import { List } from "../List";
import { OrganizationList } from "@/modules/OrganizationManager/List";

export const CreateDataSource = ({ updateSelectedDatasource }) => {
  return (
    <>
      <List updateSelectedDatasource={updateSelectedDatasource} />
      <OrganizationList />
    </>
  );
};
