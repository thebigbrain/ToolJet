import React from "react";

import Toast from "@/_ui/Toast";
import { getThemeMode } from "../theme/mode";
import { ToastOptions } from "react-hot-toast";

export default () => {
  const isDark = getThemeMode().isDark;

  const toastOptions: ToastOptions = isDark
    ? {
        className: "toast-dark-mode",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
          wordBreak: "break-all",
        },
      }
    : {
        style: {
          wordBreak: "break-all",
        },
      };

  return <Toast toastOptions={toastOptions} />;
};
