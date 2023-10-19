import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
  useContext,
} from "react";
import Layout from "@/modules/layouts/Layout";
import TooljetDatabasePage from "./TooljetDatabasePage";
import { usePostgrestQueryBuilder } from "./usePostgrestQueryBuilder";
import { authenticationService } from "@/_services/authentication.service";
import { useBreadCrumbContext } from "@/core/context";
import { TooljetDatabaseContext } from "./context";
import { OrgId } from "@/interfaces/org";

export const TooljetDatabase = (props) => {
  const [organizationId, setOrganizationId] = useState<OrgId>(
    authenticationService?.currentSessionValue?.current_organization_id
  );
  const [columns, setColumns] = useState([]);
  const [tables, setTables] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedTableData, setSelectedTableData] = useState([]);

  const [totalRecords, setTotalRecords] = useState(0);

  const [queryFilters, setQueryFilters] = useState({});
  const [sortFilters, setSortFilters] = useState({});

  const {
    handleBuildFilterQuery,
    handleBuildSortQuery,
    buildPaginationQuery,
    resetSortQuery,
    resetFilterQuery,
    resetAll,
  } = usePostgrestQueryBuilder({
    organizationId,
    selectedTable,
    setSelectedTableData,
    setTotalRecords,
  });

  const value = useMemo(
    () => ({
      searchParam,
      setSearchParam,
      organizationId,
      setOrganizationId,
      tables,
      setTables,
      columns,
      setColumns,
      selectedTable,
      setSelectedTable,
      selectedTableData,
      setSelectedTableData,
      totalRecords,
      setTotalRecords,
      handleBuildFilterQuery,
      handleBuildSortQuery,
      buildPaginationQuery,
      resetSortQuery,
      resetFilterQuery,
      queryFilters,
      setQueryFilters,
      sortFilters,
      setSortFilters,
      resetAll,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      searchParam,
      organizationId,
      tables,
      columns,
      selectedTable,
      selectedTableData,
      totalRecords,
      queryFilters,
      sortFilters,
    ]
  );

  const { updateSidebarNAV }: any = useBreadCrumbContext();

  useEffect(() => {
    updateSidebarNAV("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="page-wrapper tooljet-database">
        <TooljetDatabaseContext.Provider value={value as any}>
          <TooljetDatabasePage totalTables={tables.length || 0} />
        </TooljetDatabaseContext.Provider>
      </div>
    </Layout>
  );
};
