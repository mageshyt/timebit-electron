import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { getAppVersion } from "@/actions/app";
import ExternalLink from "@/components/external-link";

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
      <h1 className="text-2xl font-bold">{t("home.welcome")}</h1>
      <p className="mt-4 text-sm text-gray-500">
        {t("home.version")}: {appVersion}
      </p>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
