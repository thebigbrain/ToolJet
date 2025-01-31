import React from "react";
import Accordion from "@/_ui/Accordion";
import { renderElement } from "../Utils";
import { baseComponentProperties } from "./DefaultComponent";
import { resolveReferences } from "@externals/helpers/utils";

export const Modal = ({
  componentMeta = {},
  darkMode = false,
  ...restProps
}: any) => {
  const {
    layoutPropertyChanged,
    component,
    paramUpdated,
    dataQueries,
    currentState,
    eventsChanged,
    apps,
    allComponents,
  } = restProps;

  const renderCustomElement = (param, paramType = "properties") => {
    return renderElement(
      component,
      componentMeta,
      paramUpdated,
      dataQueries,
      param,
      paramType,
      currentState
    );
  };
  const conditionalAccordionItems = (component) => {
    const useDefaultButton = resolveReferences(
      component.component.definition.properties.useDefaultButton?.value ??
        false,
      currentState
    );
    const accordionItems = [];
    const options = ["useDefaultButton"];

    let renderOptions = [];

    options.map((option) => renderOptions.push(renderCustomElement(option)));

    const conditionalOptions = [
      { name: "triggerButtonLabel", condition: useDefaultButton },
    ];

    conditionalOptions.map(({ name, condition }) => {
      if (condition) renderOptions.push(renderCustomElement(name));
    });

    accordionItems.push({
      title: "Options",
      children: renderOptions,
    });
    return accordionItems;
  };

  const properties = Object.keys(componentMeta.properties);
  const events = Object.keys(componentMeta.events);
  const validations = Object.keys(componentMeta.validation || {});

  const filteredProperties = properties.filter(
    (property) =>
      property !== "useDefaultButton" && property !== "triggerButtonLabel"
  );

  const accordionItems = baseComponentProperties(
    filteredProperties,
    events,
    component,
    componentMeta,
    layoutPropertyChanged,
    paramUpdated,
    dataQueries,
    currentState,
    eventsChanged,
    apps,
    allComponents,
    validations,
    darkMode
  );

  accordionItems.splice(1, 0, ...conditionalAccordionItems(component));

  return <Accordion items={accordionItems} />;
};
