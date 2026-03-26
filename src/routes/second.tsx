import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

/*
 * You can delete this page or modify it to your needs.
 * This is just a sample page to demonstrate routing.
 */

function SecondPage() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
      <p className="mb-3 font-medium text-[10px] text-zinc-400 tracking-[0.14em] uppercase dark:text-zinc-500">
        Page
      </p>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto">
        <section className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-zinc-700/70 dark:bg-zinc-800/50">
          <h1 className="font-semibold text-2xl text-zinc-800 dark:text-zinc-100">
            {t("titleSecondPage")}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-300">
            This page now shares the same app shell style as the home screen.
          </p>
        </section>

        <section className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-zinc-700/70 dark:bg-zinc-800/50">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Keep route content focused while the global window look is controlled by the layout.
          </p>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/second")({
  component: SecondPage,
});
