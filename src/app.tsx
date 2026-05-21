import { RouterProvider } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useTranslation } from "react-i18next";
import { updateAppLanguage } from "./actions/language";
import { syncWithLocalTheme } from "./actions/theme";
import { SyncStatusProvider } from "./state/sync-status";
import { router } from "./utils/routes";
import "./localization/i18n";
import QueryProvider from "./provider/query-provider";

import { ToastProvider } from "./provider/toast-provider";

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    syncWithLocalTheme();
    updateAppLanguage(i18n);
  }, [i18n]);

  return (
    <QueryProvider>
      <SyncStatusProvider>
        <RouterProvider router={router} />
         <ToastProvider/>
      </SyncStatusProvider>
    </QueryProvider>
  );
}

const container = document.getElementById("app");
if (!container) {
  throw new Error('Root element with id "app" not found');
}
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
