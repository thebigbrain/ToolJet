import React from "react";
import { toast } from "react-hot-toast";
import { computeComponentName, isQueryRunnable } from "./utils";
import _ from "lodash";
import moment from "moment";
import Tooltip from "react-bootstrap/Tooltip";

import RunjsIcon from "@assets/Icons/runjs.svg";
import RunTooljetDbIcon from "@assets/Icons/tooljetdb.svg";
import RunPyIcon from "@assets/Icons/runpy.svg";
import { v4 as uuidv4 } from "uuid";
// eslint-disable-next-line import/no-unresolved
import { allSvgs } from "@tooljet/plugins/client";
import { setCookie } from "@externals/helpers/cookie";

export const ERROR_TYPES = Object.freeze({
  ReferenceError: "ReferenceError",
  SyntaxError: "SyntaxError",
  TypeError: "TypeError",
  URIError: "URIError",
  RangeError: "RangeError",
  EvalError: "EvalError",
});

export function setStateAsync(_ref, state) {
  return new Promise((resolve) => {
    _ref.setState(state, resolve);
  });
}

export function setCurrentStateAsync(_ref, changes) {
  return new Promise((resolve) => {
    _ref.setState((prevState) => {
      return {
        currentState: prevState.currentState,
        ...changes,
      };
    }, resolve);
  });
}

export function addToLocalStorage(object) {
  localStorage.setItem(object["key"], object["value"]);
}

export function getDataFromLocalStorage(key) {
  return localStorage.getItem(key);
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch (err) {
    console.log("Failed to copy!", err);
  }
}

export function debounce(func) {
  let timer;
  return (...args) => {
    const event = args[1] || {};
    if (event.debounce === undefined) {
      return func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, Number(event.debounce));
  };
}

export function renderTooltip({ props, text }) {
  if (text === "") return <></>;
  return (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );
}

export const getSvgIcon = (
  key,
  height = 50,
  width = 50,
  iconFile = undefined,
  styles = {}
) => {
  if (iconFile)
    return (
      <img
        src={`data:image/svg+xml;base64,${iconFile}`}
        style={{ height, width }}
      />
    );
  if (key === "runjs") return <RunjsIcon style={{ height, width }} />;
  if (key === "tooljetdb") return <RunTooljetDbIcon />;
  if (key === "runpy") return <RunPyIcon />;
  const Icon = allSvgs[key];

  if (!Icon) return <></>;

  return <Icon style={{ height, width, ...styles }} />;
};

export const debuggerActions = {
  error: (_self, errors) => {
    useCurrentStateStore.getState().actions.setErrors({
      ...errors,
    });
  },

  flush: (_self) => {
    useCurrentStateStore.getState().actions.setCurrentState({
      errors: {},
    });
  },

  //* @params: errors - Object
  generateErrorLogs: (errors) => {
    const errorsArr = [];
    Object.entries(errors).forEach(([key, value]) => {
      const errorType =
        value.type === "query" &&
        (value.kind === "restapi" ||
          value.kind === "tooljetdb" ||
          value.kind === "runjs")
          ? value.kind
          : value.type;

      const error = {};
      const generalProps = {
        key,
        type: value.type,
        kind: errorType !== "transformations" ? value.kind : "transformations",
        page: value.page,
        timestamp: moment(),
        strace: value.strace ?? "app_level",
      };

      switch (errorType) {
        case "restapi":
          generalProps.message = value.data.message;
          generalProps.description = value.data.description;
          error.substitutedVariables = value.options;
          error.request = value.data.data.requestObject;
          error.response = value.data.data.responseObject;
          break;

        case "tooljetdb":
          generalProps.message = value.data.message;
          generalProps.description = value.data.description;
          error.substitutedVariables = value.options;
          error.request = value.data.data.requestObject;
          error.response = value.data.data.responseObject;
          break;

        case "runjs":
          error.message = value.data.data.message;
          error.description = value.data.data.description;
          break;

        case "query":
          error.message = value.data.message;
          error.description = value.data.description;
          error.substitutedVariables = value.options;
          break;

        case "transformations":
          generalProps.message = value.data.message;
          error.data = value.data.data ?? value.data;
          break;

        case "component":
          generalProps.message = value.data.message;
          generalProps.property = key.split("- ")[1];
          error.resolvedProperties = value.resolvedProperties;
          break;

        default:
          break;
      }
      errorsArr.push({
        error,
        ...generalProps,
      });
    });
    return errorsArr;
  },

  generateQuerySuccessLogs: (logs) => {
    const querySuccesslogs = [];
    Object.entries(logs).forEach(([key, value]) => {
      const generalProps = {
        key,
        type: value.type,
        page: value.page,
        timestamp: moment(),
        message: "Completed",
        description: value?.data?.description ?? "",
        isQuerySuccessLog: true,
      };

      querySuccesslogs.push(generalProps);
    });
    return querySuccesslogs;
  },
  flushAllLog: () => {
    useCurrentStateStore.getState().actions.setCurrentState({
      succededQuery: {},
    });
  },
};

export const getComponentName = (currentState, id) => {
  try {
    const name = Object.entries(currentState?.components).filter(
      ([_, component]) => component.id === id
    )[0][0];
    return name;
  } catch {
    return "";
  }
};

const updateNewComponents = (
  pageId,
  appDefinition,
  newComponents,
  updateAppDefinition
) => {
  const newAppDefinition = JSON.parse(JSON.stringify(appDefinition));
  newComponents.forEach((newComponent) => {
    newComponent.component.name = computeComponentName(
      newComponent.component.component,
      newAppDefinition.pages[pageId].components
    );
    newAppDefinition.pages[pageId].components[newComponent.id] = newComponent;
  });
  updateAppDefinition(newAppDefinition);
};

export const cloneComponents = (
  _ref,
  updateAppDefinition,
  isCloning = true,
  isCut = false
) => {
  const { selectedComponents, appDefinition, currentPageId } = _ref.state;
  if (selectedComponents.length < 1) return getSelectedText();
  const { components: allComponents } = appDefinition.pages[currentPageId];
  let newDefinition = _.cloneDeep(appDefinition);
  let newComponents = [],
    newComponentObj = {},
    addedComponentId = new Set();
  for (let selectedComponent of selectedComponents) {
    if (addedComponentId.has(selectedComponent.id)) continue;
    const component = {
      id: selectedComponent.id,
      component: allComponents[selectedComponent.id]?.component,
      layouts: allComponents[selectedComponent.id]?.layouts,
      parent: allComponents[selectedComponent.id]?.parent,
    };
    addedComponentId.add(selectedComponent.id);
    let clonedComponent = JSON.parse(JSON.stringify(component));
    clonedComponent.parent = undefined;
    clonedComponent.children = [];
    clonedComponent.children = [
      ...getChildComponents(
        allComponents,
        component,
        clonedComponent,
        addedComponentId
      ),
    ];
    newComponents = [...newComponents, clonedComponent];
    newComponentObj = {
      newComponents,
      isCloning,
      isCut,
    };
  }
  if (isCloning) {
    addComponents(
      currentPageId,
      appDefinition,
      updateAppDefinition,
      undefined,
      newComponentObj
    );
    toast.success("Component cloned succesfully");
  } else if (isCut) {
    navigator.clipboard.writeText(JSON.stringify(newComponentObj));
    removeSelectedComponent(currentPageId, newDefinition, selectedComponents);
    updateAppDefinition(newDefinition);
  } else {
    navigator.clipboard.writeText(JSON.stringify(newComponentObj));
    toast.success("Component copied succesfully");
  }
  _ref.setState({ currentSidebarTab: 2 });
};

const getChildComponents = (
  allComponents,
  component,
  parentComponent,
  addedComponentId
) => {
  let childComponents = [],
    selectedChildComponents = [];

  if (
    component.component.component === "Tabs" ||
    component.component.component === "Calendar"
  ) {
    childComponents = Object.keys(allComponents).filter((key) =>
      allComponents[key].parent?.startsWith(component.id)
    );
  } else {
    childComponents = Object.keys(allComponents).filter(
      (key) => allComponents[key].parent === component.id
    );
  }

  childComponents.forEach((componentId) => {
    let childComponent = JSON.parse(JSON.stringify(allComponents[componentId]));
    childComponent.id = componentId;
    const newComponent = JSON.parse(
      JSON.stringify({
        id: componentId,
        component: allComponents[componentId]?.component,
        layouts: allComponents[componentId]?.layouts,
        parent: allComponents[componentId]?.parent,
      })
    );
    addedComponentId.add(componentId);

    if (
      (component.component.component === "Tabs") |
      (component.component.component === "Calendar")
    ) {
      const childTabId = childComponent.parent.split("-").at(-1);
      childComponent.parent = `${parentComponent.id}-${childTabId}`;
    } else {
      childComponent.parent = parentComponent.id;
    }
    parentComponent.children = [
      ...(parentComponent.children || []),
      childComponent,
    ];
    childComponent.children = [
      ...getChildComponents(
        allComponents,
        newComponent,
        childComponent,
        addedComponentId
      ),
    ];
    selectedChildComponents.push(childComponent);
  });

  return selectedChildComponents;
};

const updateComponentLayout = (components, parentId, isCut = false) => {
  let prevComponent;
  components.forEach((component, index) => {
    Object.keys(component.layouts).map((layout) => {
      if (parentId !== undefined) {
        if (index > 0) {
          component.layouts[layout].top =
            prevComponent.layouts[layout].top +
            prevComponent.layouts[layout].height;
          component.layouts[layout].left = 0;
        } else {
          component.layouts[layout].top = 0;
          component.layouts[layout].left = 0;
        }
        prevComponent = component;
      } else if (!isCut) {
        component.layouts[layout].top =
          component.layouts[layout].top + component.layouts[layout].height;
      }
    });
  });
};

export const addComponents = (
  pageId,
  appDefinition,
  appDefinitionChanged,
  parentId = undefined,
  newComponentObj
) => {
  console.log({ pageId, newComponentObj });
  const finalComponents = [];
  let parentComponent = undefined;
  const {
    isCloning,
    isCut,
    newComponents: pastedComponent = [],
  } = newComponentObj;

  if (parentId) {
    const id = Object.keys(appDefinition.pages[pageId].components).filter(
      (key) => parentId.startsWith(key)
    );
    parentComponent = JSON.parse(
      JSON.stringify(appDefinition.pages[pageId].components[id[0]])
    );
    parentComponent.id = parentId;
  }

  !isCloning && updateComponentLayout(pastedComponent, parentId, isCut);

  const buildComponents = (
    components,
    parentComponent = undefined,
    skipTabCalendarCheck = false
  ) => {
    if (Array.isArray(components) && components.length > 0) {
      components.forEach((component) => {
        const newComponent = {
          id: uuidv4(),
          component: component?.component,
          layouts: component?.layouts,
        };
        if (parentComponent) {
          if (
            !skipTabCalendarCheck &&
            (parentComponent.component.component === "Tabs" ||
              parentComponent.component.component === "Calendar")
          ) {
            const childTabId = component.parent.split("-").at(-1);
            newComponent.parent = `${parentComponent.id}-${childTabId}`;
          } else {
            newComponent.parent = parentComponent.id;
          }
        }
        finalComponents.push(newComponent);
        if (component.children.length > 0) {
          buildComponents(component.children, newComponent);
        }
      });
    }
  };

  buildComponents(pastedComponent, parentComponent, true);

  updateNewComponents(
    pageId,
    appDefinition,
    finalComponents,
    appDefinitionChanged
  );
  !isCloning && toast.success("Component pasted succesfully");
};

export const addNewWidgetToTheEditor = (
  componentMeta,
  eventMonitorObject,
  currentComponents,
  canvasBoundingRect,
  currentLayout,
  shouldSnapToGrid,
  zoomLevel,
  isInSubContainer = false,
  addingDefault = false
) => {
  const componentMetaData = _.cloneDeep(componentMeta);
  const componentData = _.cloneDeep(componentMetaData);

  const defaultWidth = isInSubContainer
    ? (componentMetaData.defaultSize.width * 100) / 43
    : componentMetaData.defaultSize.width;
  const defaultHeight = componentMetaData.defaultSize.height;

  componentData.name = computeComponentName(
    componentData.component,
    currentComponents
  );

  let left = 0;
  let top = 0;

  if (isInSubContainer && addingDefault) {
    const newComponent = {
      id: uuidv4(),
      component: componentData,
      layout: {
        [currentLayout]: {
          top: top,
          left: left,
        },
      },
    };

    return newComponent;
  }

  const offsetFromTopOfWindow = canvasBoundingRect.top;
  const offsetFromLeftOfWindow = canvasBoundingRect.left;
  const currentOffset = eventMonitorObject.getSourceClientOffset();
  const initialClientOffset = eventMonitorObject.getInitialClientOffset();
  const delta = eventMonitorObject.getDifferenceFromInitialOffset();
  const subContainerWidth = canvasBoundingRect.width;

  left = Math.round(
    currentOffset?.x +
      currentOffset?.x * (1 - zoomLevel) -
      offsetFromLeftOfWindow
  );
  top = Math.round(
    initialClientOffset?.y -
      10 +
      delta.y +
      initialClientOffset?.y * (1 - zoomLevel) -
      offsetFromTopOfWindow
  );

  if (shouldSnapToGrid) {
    [left, top] = snapToGrid(subContainerWidth, left, top);
  }

  left = (left * 100) / subContainerWidth;

  if (currentLayout === "mobile") {
    componentData.definition.others.showOnDesktop.value = false;
    componentData.definition.others.showOnMobile.value = true;
  }

  const widgetsWithDefaultComponents = ["Listview", "Tabs", "Form", "Kanban"];

  const newComponent = {
    id: uuidv4(),
    component: componentData,
    layout: {
      [currentLayout]: {
        top: top,
        left: left,
        width: defaultWidth,
        height: defaultHeight,
      },
    },

    withDefaultChildren: widgetsWithDefaultComponents.includes(
      componentData.component
    ),
  };

  return newComponent;
};

export function snapToGrid(canvasWidth, x, y) {
  const gridX = canvasWidth / 43;

  const snappedX = Math.round(x / gridX) * gridX;
  const snappedY = Math.round(y / 10) * 10;
  return [snappedX, snappedY];
}
export const removeSelectedComponent = (
  pageId,
  newDefinition,
  selectedComponents
) => {
  selectedComponents.forEach((component) => {
    let childComponents = [];

    if (
      newDefinition.pages[pageId].components[component.id]?.component
        ?.component === "Tabs"
    ) {
      childComponents = Object.keys(
        newDefinition.pages[pageId].components
      ).filter((key) =>
        newDefinition.pages[pageId].components[key].parent?.startsWith(
          component.id
        )
      );
    } else {
      childComponents = Object.keys(
        newDefinition.pages[pageId].components
      ).filter(
        (key) =>
          newDefinition.pages[pageId].components[key].parent === component.id
      );
    }

    childComponents.forEach((componentId) => {
      delete newDefinition.pages[pageId].components[componentId];
    });

    delete newDefinition.pages[pageId].components[component.id];
  });
};

const getSelectedText = () => {
  if (window.getSelection) {
    navigator.clipboard.writeText(window.getSelection());
  }
  if (window.document.getSelection) {
    navigator.clipboard.writeText(window.document.getSelection());
  }
  if (window.document.selection) {
    navigator.clipboard.writeText(window.document.selection.createRange().text);
  }
};

function convertMapSet(obj) {
  if (obj instanceof Map) {
    return Object.fromEntries(
      Array.from(obj, ([key, value]) => [key, convertMapSet(value)])
    );
  } else if (obj instanceof Set) {
    return Array.from(obj).map(convertMapSet);
  } else if (Array.isArray(obj)) {
    return obj.map(convertMapSet);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertMapSet(value)])
    );
  } else {
    return obj;
  }
}

export const checkExistingQueryName = (newName) =>
  useDataQueriesStore
    .getState()
    .dataQueries.some((query) => query.name === newName);

export const runQueries = (queries, _ref) => {
  queries.forEach((query) => {
    if (query.options.runOnPageLoad && isQueryRunnable(query)) {
      runQuery(_ref, query.id, query.name);
    }
  });
};

export const computeQueryState = (queries, _ref) => {
  let queryState = {};
  queries.forEach((query) => {
    if (query.plugin?.plugin_id) {
      queryState[query.name] = {
        ...query.plugin.manifest_file.data?.source?.exposedVariables,
        kind: query.plugin.manifest_file.data.source.kind,
        ...getCurrentState().queries[query.name],
      };
    } else {
      queryState[query.name] = {
        ...DataSourceTypes.find((source) => source.kind === query.kind)
          ?.exposedVariables,
        kind: DataSourceTypes.find((source) => source.kind === query.kind)
          ?.kind,
        ...getCurrentState()?.queries[query.name],
      };
    }
  });
  const hasDiffQueryState = !_.isEqual(getCurrentState()?.queries, queryState);
  if (hasDiffQueryState) {
    useCurrentStateStore.getState().actions.setCurrentState({
      queries: {
        ...queryState,
      },
    });
  }
};
