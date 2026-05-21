import {
  SESSION_CATEGORIES,
  type SessionCategory,
  useTimerStore,
} from "../store/timer.store";

export function SessionCategoryPicker() {
  const category = useTimerStore((s) => s.category);
  const setCategory = useTimerStore((s) => s.setCategory);
  const isActive = useTimerStore((s) => s.isActive);
  const activeSessionId = useTimerStore((s) => s.activeSessionId);

  // Lock the picker while a session is in progress
  const locked = isActive || activeSessionId !== null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-4 px-2">
      {SESSION_CATEGORIES.map((cat) => {
        const selected = category === cat;
        return (
          <button
            key={cat}
            type="button"
            disabled={locked}
            onClick={() => setCategory(cat as SessionCategory)}
            className="px-3 py-1 rounded-full text-[0.6875rem] font-semibold uppercase tracking-[0.05em] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: selected ? "linear-gradient(135deg, #c0c1ff, #8083ff)" : "#201f22",
              color: selected ? "#131315" : "#8e8d92",
              boxShadow: selected ? "0 0 12px rgba(192,193,255,0.25)" : "none",
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
