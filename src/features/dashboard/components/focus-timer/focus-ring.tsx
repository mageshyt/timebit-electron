import { useTimerStore } from "../../store/timer.store";

const RADIUS = 140;
const STROKE_WIDTH = 4;
const TRACK_WIDTH = 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SIZE = (RADIUS + STROKE_WIDTH) * 2;

/**
 * SVG progress ring — only re-renders when `elapsed` or `sessionDuration` changes.
 * The CSS border trick used before showed a fixed 3/4 arc; this computes real progress.
 */
export function FocusRing() {
  const elapsed = useTimerStore((s) => s.elapsed);
  const sessionDuration = useTimerStore((s) => s.sessionDuration);

  const progress = Math.min(elapsed / sessionDuration, 1);
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <svg
      width={SIZE}
      height={SIZE}
      className="absolute"
      style={{ transform: "rotate(-90deg)" }}
      aria-hidden
    >
      {/* Track */}
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="#353437"
        strokeWidth={TRACK_WIDTH}
      />
      {/* Progress arc */}
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="url(#ring-gradient)"
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 0.25s linear",
          filter: "drop-shadow(0 0 12px rgba(192,193,255,0.35))",
        }}
      />
      <defs>
        <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c0c1ff" />
          <stop offset="100%" stopColor="#8083ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}
