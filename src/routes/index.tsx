import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { getAppVersion } from "@/actions/app";

/*
 * Update this page to modify your home page.
 * You can delete this file component to start from a blank page.
 */

function HomePage() {
  const [appVersion, setAppVersion] = useState("0.0.0");
  const [, startGetAppVersion] = useTransition();
  const { t } = useTranslation();

  useEffect(
    () => startGetAppVersion(() => getAppVersion().then(setAppVersion)),
    []
  );

  return (
    <div className="flex h-full flex-col">
      <h1 className="font-bold text-2xl">{t("home.welcome")}</h1>
      <p className="mt-4 text-gray-500 text-sm">
        {t("home.version")}: {appVersion}
      </p>
      test
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
