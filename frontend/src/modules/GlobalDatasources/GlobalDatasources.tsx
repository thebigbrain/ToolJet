import React, { useMemo, useState, useEffect } from "react";
import {
  globalDatasourceService,
  appEnvironmentService,
  authenticationService,
} from "@/_services";
import { GlobalDataSourcesPage } from "./GlobalDataSourcesPage";
import { toast } from "react-hot-toast";
import { useBreadCrumbContext } from "@/core/context";
import { GlobalDataSourcesContext } from "./context";
import useRouter from "@/_hooks/use-router";
import Layout from "@/modules/layouts/Layout";

export const GlobalDatasources = (props) => {
  const { admin } = authenticationService.currentSessionValue;
  const [selectedDataSource, setSelectedDataSource] = useState(null);
  const [dataSources, setDataSources] = useState([]);
  const [showDataSourceManagerModal, toggleDataSourceManagerModal] =
    useState(false);
  const [isEditing, setEditing] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [environments, setEnvironments] = useState([]);
  const [currentEnvironment, setCurrentEnvironment] = useState(null);
  const [activeDatasourceList, setActiveDatasourceList] =
    useState("#databases");
  const { navigate } = useRouter();
  const { updateSidebarNAV }: any = useBreadCrumbContext();

  useEffect(() => {
    if (dataSources?.length == 0) updateSidebarNAV("Databases");
  }, []);

  useEffect(() => {
    selectedDataSource
      ? updateSidebarNAV(selectedDataSource.name)
      : !activeDatasourceList && updateSidebarNAV("Databases");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(dataSources), JSON.stringify(selectedDataSource)]);

  useEffect(() => {
    if (!admin) {
      toast.error(
        "You don't have access to GDS, contact your workspace admin to add datasources"
      );
      navigate("/");
    }
    fetchEnvironments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  function updateSelectedDatasource(source) {
    updateSidebarNAV(source);
  }

  const fetchDataSources = async (
    resetSelection = false,
    dataSource = null
  ) => {
    toggleDataSourceManagerModal(false);
    setLoading(true);
    globalDatasourceService
      .getAll()
      .then((data) => {
        const orderedDataSources = data.data_sources.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setDataSources([...(orderedDataSources ?? [])]);
        const ds =
          dataSource &&
          orderedDataSources.find((ds) => ds.id === dataSource.id);

        if (!resetSelection && ds) {
          setEditing(true);
          setSelectedDataSource(ds);
          toggleDataSourceManagerModal(true);
        }
        if (orderedDataSources.length && resetSelection) {
          setActiveDatasourceList("#databases");
        }
        if (!orderedDataSources.length) {
          setActiveDatasourceList("#databases");
        }
        setLoading(false);
      })
      .catch(() => {
        setDataSources([]);
        setLoading(false);
      });
  };

  const handleToggleSourceManagerModal = () => {
    toggleDataSourceManagerModal(!showDataSourceManagerModal);
    setEditing(!isEditing);
  };

  const handleModalVisibility = () => {
    handleToggleSourceManagerModal();
    if (selectedDataSource) {
      setSelectedDataSource(null);
      return;
    }
  };

  const fetchEnvironments = () => {
    appEnvironmentService.getAllEnvironments().then((data) => {
      const envArray = data?.environments;
      setEnvironments(envArray);
      if (envArray.length > 0) {
        const env = envArray.find((env) => env.is_default === true);
        setCurrentEnvironment(env);
      }
    });
  };

  const value = useMemo(
    () => ({
      selectedDataSource,
      setSelectedDataSource,
      fetchDataSources,
      dataSources,
      showDataSourceManagerModal,
      toggleDataSourceManagerModal,
      handleModalVisibility,
      isEditing,
      setEditing,
      fetchEnvironments,
      environments,
      currentEnvironment,
      setCurrentEnvironment,
      setDataSources,
      isLoading,
      activeDatasourceList,
      setActiveDatasourceList,
      setLoading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedDataSource,
      dataSources,
      showDataSourceManagerModal,
      isEditing,
      environments,
      currentEnvironment,
      isLoading,
      activeDatasourceList,
    ]
  );

  return (
    <Layout>
      <GlobalDataSourcesContext.Provider value={value as any}>
        <div className="page-wrapper">
          <GlobalDataSourcesPage
            darkMode={props.darkMode}
            updateSelectedDatasource={updateSelectedDatasource}
          />
        </div>
      </GlobalDataSourcesContext.Provider>
    </Layout>
  );
};
