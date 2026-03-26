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
  const items = [
    {
      day: "February 12",
      notes: [
        "great",
        "redo landing page + record it as a quick video?",
        "not 3d thing",
        "redo landing page with a bunch of previews of the animation.",
      ],
    },
    {
      day: "February 11",
      notes: [
        "at actually moves the needle",
        "need cleaner spacing and calmer hierarchy",
      ],
    },
  ];

  useEffect(
    () => startGetAppVersion(() => getAppVersion().then(setAppVersion)),
    [],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-full bg-zinc-900 px-3 py-1 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
          Workspace
        </span>
        <span className="rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          Type
        </span>
        <span className="rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          Status
        </span>
        <span className="rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          Today
        </span>
        <span className="rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          Week
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-auto pr-1">
        {items.map((group) => (
          <div key={group.day} className="space-y-2">
            <p className="font-medium text-[10px] text-zinc-400 tracking-[0.14em] uppercase dark:text-zinc-500">
              {group.day}
            </p>
            {group.notes.map((note) => (
              <article
                key={note}
                className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3 text-zinc-700 text-sm leading-relaxed dark:border-zinc-700/70 dark:bg-zinc-800/50 dark:text-zinc-200"
              >
                {note}
              </article>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-zinc-300/80 bg-white/90 px-3 py-2 text-zinc-400 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500">
        New thought...
      </div>
      <footer className="mt-3 flex items-center justify-between text-zinc-400 text-xs dark:text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
        <ExternalLink
          className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          href="https://github.com/LuanRoger"
        >
          {t("madeBy")} · {t("appName")} v{appVersion}
        </ExternalLink>
      </footer>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
