import { createContext } from "react";

interface IGlobalDatasourcesContext {
  showDataSourceManagerModal: false;
  toggleDataSourceManagerModal: (show?: boolean) => void;
  selectedDataSource;
  setSelectedDataSource: (datasource?) => void;

  fetchDataSources?;
  handleModalVisibility?;
  isEditing?: boolean;
  setEditing?;
  dataSources?;
  currentEnvironment?;
  environments?;
  setCurrentEnvironment?;
  activeDatasourceList?;
  setActiveDatasourceList?;
  isLoading?: boolean;
  setLoading?;
}

export const GlobalDataSourcesContext =
  createContext<IGlobalDatasourcesContext>({
    showDataSourceManagerModal: false,
    toggleDataSourceManagerModal: () => {},
    selectedDataSource: null,
    setSelectedDataSource: () => {},
  });
