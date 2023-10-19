import React from "react";

import ReactCodeMirror, {
  IEditorInstance,
  IReactCodemirror,
} from "@uiw/react-codemirror";
import "codemirror/mode/handlebars/handlebars";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/sql/sql";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/display/placeholder";
import "codemirror/addon/search/match-highlighter";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/theme/base16-light.css";
import "codemirror/theme/duotone-light.css";
import "codemirror/theme/monokai.css";

function CodeMirror(
  props: IReactCodemirror & React.RefAttributes<IEditorInstance | undefined>
) {
  return <ReactCodeMirror {...props} />;
}

export default CodeMirror;
