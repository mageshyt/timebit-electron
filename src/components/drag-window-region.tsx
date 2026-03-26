import { type ReactNode, useEffect, useState } from "react";
import { getPlatform } from "@/actions/app";
import { closeWindow, maximizeWindow, minimizeWindow } from "@/actions/window";

interface DragWindowRegionProps {
  title?: ReactNode;
}

export default function DragWindowRegion({ title }: DragWindowRegionProps) {
  const [platform, setPlatform] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getPlatform()
      .then((value) => {
        if (!active) {
          return;
        }

        setPlatform(value);
      })
      .catch((error) => {
        console.error("Failed to detect platform", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const isMacOS = platform === "darwin";
  const appTitle = title ?? "TimeBit";

  return (
    <header className="w-full border-zinc-200/70 border-b bg-white/65 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-950/60">
      {isMacOS ? (
        <div className="draglayer flex h-14 items-center px-3">
          <div className="w-20 shrink-0" />
          <div className="mx-auto w-full max-w-xl px-2">
            <div className="no-drag flex h-9 items-center justify-center rounded-full border border-zinc-300/70 bg-white/85 px-4 text-[11px] text-zinc-500 tracking-wide uppercase shadow-sm dark:border-zinc-700/80 dark:bg-zinc-900/85 dark:text-zinc-400">
              {appTitle}
            </div>
          </div>
          <div className="w-20 shrink-0" />
        </div>
      ) : (
        <div className="flex h-11 w-full items-stretch justify-between">
          <div className="draglayer flex flex-1 items-center px-3">
            <div className="select-none whitespace-nowrap text-zinc-500 text-xs tracking-wide uppercase dark:text-zinc-400">
              {appTitle}
            </div>
          </div>
          <WindowButtons />
        </div>
      )}
    </header>
  );
}

function WindowButtons() {
  return (
    <div className="no-drag flex items-stretch">
      <button
        className="px-3 text-zinc-500 transition-colors hover:bg-zinc-200/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        onClick={minimizeWindow}
        title="Minimize"
        type="button"
      >
        <svg
          aria-hidden="true"
          height="12"
          role="img"
          viewBox="0 0 12 12"
          width="12"
        >
          <rect fill="currentColor" height="1" width="10" x="1" y="6" />
        </svg>
      </button>
      <button
        className="px-3 text-zinc-500 transition-colors hover:bg-zinc-200/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        onClick={maximizeWindow}
        title="Maximize"
        type="button"
      >
        <svg
          aria-hidden="true"
          height="12"
          role="img"
          viewBox="0 0 12 12"
          width="12"
        >
          <rect
            fill="none"
            height="9"
            stroke="currentColor"
            width="9"
            x="1.5"
            y="1.5"
          />
        </svg>
      </button>
      <button
        className="px-3 text-zinc-500 transition-colors hover:bg-red-400/90 hover:text-white dark:text-zinc-400"
        onClick={closeWindow}
        title="Close"
        type="button"
      >
        <svg
          aria-hidden="true"
          height="12"
          role="img"
          viewBox="0 0 12 12"
          width="12"
        >
          <polygon
            fill="currentColor"
            fillRule="evenodd"
            points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"
          />
        </svg>
      </button>
    </div>
  );
}
