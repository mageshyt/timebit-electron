import { useState } from "react";
import { Plus, Trash2, ListChecks } from "lucide-react";
import { useHabitActions } from "@/features/habits/habit.hooks";

export function HabitsSettingsCard() {
  const { habits, isLoading, createHabit, deleteHabit } = useHabitActions();
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      createHabit({ title: newTitle.trim(), category: "Protocol" });
      setNewTitle("");
    }
  };

  if (isLoading) {
    return <div className="bg-[#1c1b1d] rounded-xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.2)] animate-pulse h-64" />;
  }

  return (
    <div className="bg-[#1c1b1d] rounded-xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.2)] flex flex-col h-full">
      <div className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-4">
        <ListChecks className="w-4 h-4 text-[#c0c1ff]" />
        Configured Habits
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between rounded-lg bg-[#201f22] p-3 text-[0.8125rem] text-[#e4e4e6] border border-white/5"
          >
            <span>{habit.title}</span>
            <button
              type="button"
              onClick={() => deleteHabit(habit.id)}
              className="text-[#8e8d92] hover:text-[#ffb4ab] transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {habits.length === 0 && (
          <div className="text-center text-[0.8125rem] text-[#8e8d92] py-4">
            No habits configured.
          </div>
        )}
      </div>

      <form onSubmit={handleAdd} className="mt-auto flex items-center gap-2 pt-4 border-t border-white/5">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New habit protocol..."
          className="flex-1 rounded-md border-0 bg-[#201f22] px-3 py-2 text-[0.8125rem] text-[#e4e4e6] outline-none focus:ring-1 focus:ring-[#c0c1ff]/40 placeholder:text-[#8e8d92]"
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="flex h-8 w-8 items-center justify-center rounded-md bg-[#c0c1ff] text-[#1000a9] disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
