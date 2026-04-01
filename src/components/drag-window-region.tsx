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
    <header className="w-full bg-[#131315]">
      {isMacOS ? (
        <div className="draglayer h-8 w-full" />
      ) : (
        <div className="flex h-8 w-full items-stretch justify-between">
          <div className="draglayer flex flex-1 items-center px-3" />
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
        className="px-3 text-[#e4e4e6] transition-colors hover:bg-[#201f22]"
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
        className="px-3 text-[#e4e4e6] transition-colors hover:bg-[#201f22]"
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
        className="px-3 text-[#e4e4e6] transition-colors hover:bg-red-500/90 hover:text-[#131315]"
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
