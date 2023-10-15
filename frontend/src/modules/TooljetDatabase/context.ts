import { createContext } from "react";

interface ITooljetDatabaseContext {
  organizationId?;
  setOrganizationId?;
  selectedTable?;
  setSelectedTable?;
  searchParam?;
  setSearchParam?;
  selectedTableData?;
  setSelectedTableData?;
  tables?;
  setTables?;
  columns?;
  setColumns?;
  totalRecords?: number;
  setTotalRecords?;
  handleBuildFilterQuery?;
  handleBuildSortQuery?;
  buildPaginationQuery?;
  resetSortQuery?;
  resetFilterQuery?;
  queryFilters?;
  setQueryFilters?;
  sortFilters?;
  setSortFilters?;
  resetAll?;
  updateRowsOptions?;
  handleUpdateRowsOptionsChange?;
  listRowsOptions?;
  limitOptionChanged?;
  handleOptionsChange?;
  deleteOperationLimitOptionChanged?;
  deleteRowsOptions?;
  handleDeleteRowsOptionsChange?;
}

export const TooljetDatabaseContext = createContext<ITooljetDatabaseContext>({
  totalRecords: 0,
});
