import { useState } from "react";
import { ListChecks, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHabitActions } from "@/features/habits/habit.hooks";

const RESET_OPTIONS = [
  "Daily",
  "Weekdays",
  "Weekends",
  "Weekly",
  "Monthly",
] as const;

const DEFAULT_FORM = {
  title: "",
  category: "Protocol",
  resetFrequency: "Daily",
};

export function HabitsSettingsCard() {
  const { habits, isLoading, createHabit, deleteHabit, updateHabit } = useHabitActions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formState, setFormState] = useState(DEFAULT_FORM);

  const openCreate = () => {
    setEditingId(null);
    setFormState(DEFAULT_FORM);
    setIsDialogOpen(true);
  };

  const openEdit = (habit: { id: number; title: string; category: string; resetFrequency: string }) => {
    setEditingId(habit.id);
    setFormState({
      title: habit.title,
      category: habit.category || "",
      resetFrequency: habit.resetFrequency || "Daily",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const title = formState.title.trim();
    if (!title) return;

    const payload = {
      title,
      category: formState.category.trim(),
      resetFrequency: formState.resetFrequency,
    };

    if (editingId !== null) {
      updateHabit({ id: editingId, ...payload });
    } else {
      createHabit(payload);
    }

    setIsDialogOpen(false);
  };

  if (isLoading) {
    return <div className="bg-[#1c1b1d] rounded-xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.2)] animate-pulse h-64" />;
  }

  return (
    <div className="bg-[#1c1b1d] rounded-xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.2)] flex flex-col h-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
          <ListChecks className="w-4 h-4 text-[#c0c1ff]" />
          Configured Habits
        </div>
        <Button
          type="button"
          size="sm"
          onClick={openCreate}
          className="bg-[#c0c1ff] text-[#1000a9] hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Habit
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between rounded-lg bg-[#201f22] p-3 text-[0.8125rem] text-[#e4e4e6] border border-white/5"
          >
            <div className="min-w-0">
              <div className="truncate text-[0.875rem] font-medium text-[#f4f4f5]">
                {habit.title}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[0.6875rem] text-[#8e8d92]">
                {habit.category ? (
                  <span className="rounded-full border border-white/10 px-2 py-0.5">
                    {habit.category}
                  </span>
                ) : null}
                {habit.resetFrequency ? (
                  <span className="rounded-full border border-white/10 px-2 py-0.5">
                    {habit.resetFrequency}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openEdit(habit)}
                className="text-[#8e8d92] hover:text-[#c0c1ff] transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => deleteHabit(habit.id)}
                className="text-[#8e8d92] hover:text-[#ffb4ab] transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {habits.length === 0 && (
          <div className="text-center text-[0.8125rem] text-[#8e8d92] py-4">
            No habits configured.
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#131315] text-[#e4e4e6]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Habit" : "Add Habit"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
              Habit Name
              <Input
                value={formState.title}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Morning Deep Work"
                className="mt-2 h-9 border-white/10 bg-[#201f22] text-[#e4e4e6] focus-visible:ring-[#c0c1ff]/40"
              />
            </label>

            <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
              Category
              <Input
                value={formState.category}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, category: event.target.value }))
                }
                placeholder="Protocol"
                className="mt-2 h-9 border-white/10 bg-[#201f22] text-[#e4e4e6] focus-visible:ring-[#c0c1ff]/40"
              />
            </label>

            <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
              Reset Frequency
              <Select
                value={formState.resetFrequency}
                onValueChange={(value) =>
                  setFormState((prev) => ({ ...prev, resetFrequency: value }))
                }
              >
                <SelectTrigger className="mt-2 w-full bg-[#201f22] text-[#e4e4e6] focus:ring-[#c0c1ff]/40">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {RESET_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </label>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#c0c1ff] text-[#1000a9] hover:opacity-90">
                {editingId ? "Save Changes" : "Create Habit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
