import type React from "react";
import DragWindowRegion from "@/components/drag-window-region";
import LangToggle from "@/components/lang-toggle";
import NavigationMenu from "@/components/navigation-menu";
import ToggleTheme from "@/components/toggle-theme";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DragWindowRegion title="TimeBit" />
      <main className="relative h-[calc(100vh-3.5rem)] overflow-hidden bg-[radial-gradient(95%_90%_at_50%_0%,#f6f7fb_0%,#eceef5_42%,#e6e8f0_100%)] dark:bg-[radial-gradient(95%_90%_at_50%_0%,#1b1d24_0%,#14161c_48%,#0f1116_100%)]">
        <div className="pointer-events-none absolute top-8 left-4 h-36 w-36 rounded-full bg-cyan-200/45 blur-3xl dark:bg-cyan-500/10" />
        <div className="pointer-events-none absolute right-8 bottom-8 h-48 w-48 rounded-full bg-rose-200/45 blur-3xl dark:bg-rose-500/10" />

        <section className="relative mx-auto flex h-full w-full max-w-6xl flex-col px-4 pt-3 pb-4 md:px-6">
          <header className="mb-3 flex items-center gap-2 rounded-2xl border border-zinc-200/80 bg-zinc-100/70 p-2 backdrop-blur-md dark:border-zinc-700/70 dark:bg-zinc-800/45">
            <div className="hidden items-center gap-1.5 px-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <span className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <span className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>
            <div className="hidden min-w-0 flex-1 items-center rounded-lg border border-zinc-300/80 bg-white/85 px-3 py-1.5 text-xs text-zinc-500 md:flex dark:border-zinc-600/80 dark:bg-zinc-900/75 dark:text-zinc-400">
              Search commands
            </div>
            <NavigationMenu />
            <div className="ml-auto flex items-center gap-2 px-1">
              <LangToggle />
              <ToggleTheme />
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/65 p-3 backdrop-blur-sm dark:border-zinc-700/70 dark:bg-zinc-900/60">
            {children}
          </div>
        </section>
      </main>
    </>
  );
}
