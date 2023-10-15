import React from "react";
import DynamicForm from "@/Editor/QueryManager/QueryEditors/DynamicForm";

import { allOperations } from "@tooljet/plugins/client";
import { Restapi } from "./Restapi";
// eslint-disable-next-line import/no-unresolved
import { Runjs } from "./Runjs";
import { Runpy } from "./Runpy";
import { Stripe } from "./Stripe";
import { Openapi } from "./Openapi";
import Grpc from "./GRPC";
import tooljetDbOperations from "./TooljetDatabase/operations.json.js";

import { queryManagerSelectComponentStyle } from "@/_ui/Select/styles";

const computeSelectStyles = (width: number) => {
  const darkMode = localStorage.getItem("darkMode") === "true";
  return queryManagerSelectComponentStyle(darkMode, width);
};

const ops: any = Object.keys(allOperations).reduce(
  (accumulator, currentValue) => {
    accumulator[currentValue] = (props: any) => (
      <div className="query-editor-dynamic-form-container">
        <DynamicForm
          schema={allOperations[currentValue]}
          {...props}
          computeSelectStyles={computeSelectStyles}
          layout="horizontal"
        />
      </div>
    );
    return accumulator;
  },
  {}
);

export const allSources = {
  ...ops,
  Tooljetdb: (props: any) => (
    <DynamicForm schema={tooljetDbOperations} {...props} layout="horizontal" />
  ),
  Restapi,
  Runjs,
  Runpy,
  Stripe,
  Openapi,
  Grpc,
};

export const source = (props: any) => (
  <div className="query-editor-dynamic-form-container">
    <DynamicForm
      schema={props.pluginSchema}
      {...props}
      computeSelectStyles={computeSelectStyles}
      layout="horizontal"
    />
  </div>
);
