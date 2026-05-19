import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskForm, TaskStatus, TaskPriority } from "../types";

interface Props {
  open: boolean;
  title: string;
  initial: TaskForm;
  onClose: () => void;
  onSave: (form: TaskForm) => void;
}

export function TaskDialog({ open, title, initial, onClose, onSave }: Props) {
  const [form, setForm] = useState<TaskForm>(initial);

  useEffect(() => {
    if (open) {
      setForm(initial);
    }
  }, [initial, open]);

  const handleOpenChange = (o: boolean) => {
    if (o) {
      setForm(initial);
      return;
    }
    onClose();
  };

  const field = (key: keyof TaskForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="border-0 p-0 gap-0 max-w-[480px] rounded-2xl overflow-hidden"
        style={{ background: "#1c1b1d" }}
      >
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle
            className="text-[1.125rem] font-semibold tracking-[-0.02em]"
            style={{ color: "#f4f4f5" }}
          >
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-1.5 block">
              Task Title
            </label>
            <Input
              value={form.title}
              onChange={(e) => field("title", e.target.value)}
              placeholder="e.g. Refactor SQLite queries"
              className="border-0 bg-[#201f22] text-[#e4e4e6] placeholder:text-[#636268] focus-visible:ring-[#c0c1ff]/30 focus-visible:ring-1"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-1.5 block">
              Description
            </label>
            <Textarea
              value={form.subtitle}
              onChange={(e) => field("subtitle", e.target.value)}
              placeholder="Brief context or acceptance criteria…"
              rows={2}
              className="border-0 bg-[#201f22] text-[#e4e4e6] placeholder:text-[#636268] focus-visible:ring-[#c0c1ff]/30 focus-visible:ring-1 resize-none"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-1.5 block">
                Status
              </label>
              <Select
                value={form.status}
                onValueChange={(v) => field("status", v as TaskStatus)}
              >
                <SelectTrigger className="w-full h-9 border-0 bg-[#201f22] text-[#e4e4e6] text-[0.8125rem] focus:ring-1 focus:ring-[#c0c1ff]/30 focus-visible:ring-[#c0c1ff]/30">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="border-0 rounded-xl" style={{ background: "#2a2a2c", boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(70,69,84,0.15)" }}>
                  <SelectItem value="TODO" className="text-[0.8125rem] text-[#e4e4e6] focus:bg-[#353437] focus:text-[#f4f4f5] rounded-lg">Todo</SelectItem>
                  <SelectItem value="IN PROGRESS" className="text-[0.8125rem] text-[#e4e4e6] focus:bg-[#353437] focus:text-[#f4f4f5] rounded-lg">In Progress</SelectItem>
                  <SelectItem value="DONE" className="text-[0.8125rem] text-[#e4e4e6] focus:bg-[#353437] focus:text-[#f4f4f5] rounded-lg">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-1.5 block">
                Priority
              </label>
              <Select
                value={form.priority}
                onValueChange={(v) => field("priority", v as TaskPriority)}
              >
                <SelectTrigger className="w-full h-9 border-0 bg-[#201f22] text-[#e4e4e6] text-[0.8125rem] focus:ring-1 focus:ring-[#c0c1ff]/30 focus-visible:ring-[#c0c1ff]/30">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="border-0 rounded-xl" style={{ background: "#2a2a2c", boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(70,69,84,0.15)" }}>
                  <SelectItem value="High" className="text-[0.8125rem] text-[#e4e4e6] focus:bg-[#353437] focus:text-[#f4f4f5] rounded-lg">High</SelectItem>
                  <SelectItem value="Medium" className="text-[0.8125rem] text-[#e4e4e6] focus:bg-[#353437] focus:text-[#f4f4f5] rounded-lg">Medium</SelectItem>
                  <SelectItem value="Low" className="text-[0.8125rem] text-[#e4e4e6] focus:bg-[#353437] focus:text-[#f4f4f5] rounded-lg">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-1.5 block">
                Category
              </label>
              <Select
                value={form.category}
                onValueChange={(v) => field("category", v)}
              >
                <SelectTrigger className="w-full h-9 border-0 bg-[#201f22] text-[#e4e4e6] text-[0.8125rem] focus:ring-1 focus:ring-[#c0c1ff]/30 focus-visible:ring-[#c0c1ff]/30">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-0 rounded-xl" style={{ background: "#2a2a2c", boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(70,69,84,0.15)" }}>
                  <SelectItem value="Work" className="text-[0.8125rem] text-[#e4e4e6] focus:bg-[#353437] focus:text-[#f4f4f5] rounded-lg">Work</SelectItem>
                  <SelectItem value="Personal" className="text-[0.8125rem] text-[#e4e4e6] focus:bg-[#353437] focus:text-[#f4f4f5] rounded-lg">Personal</SelectItem>
                  <SelectItem value="Study" className="text-[0.8125rem] text-[#e4e4e6] focus:bg-[#353437] focus:text-[#f4f4f5] rounded-lg">Study</SelectItem>
                  <SelectItem value="Fitness" className="text-[0.8125rem] text-[#e4e4e6] focus:bg-[#353437] focus:text-[#f4f4f5] rounded-lg">Fitness</SelectItem>
                  <SelectItem value="Errands" className="text-[0.8125rem] text-[#e4e4e6] focus:bg-[#353437] focus:text-[#f4f4f5] rounded-lg">Errands</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estimate */}
            <div>
              <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-1.5 block">
                Time Estimate
              </label>
              <Input
                value={form.estimate}
                onChange={(e) => field("estimate", e.target.value)}
                placeholder="e.g. 1h 30m"
                className="w-full h-9 border-0 bg-[#201f22] text-[#e4e4e6] placeholder:text-[#636268] focus-visible:ring-[#c0c1ff]/30 focus-visible:ring-1 text-[0.8125rem]"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-5 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] bg-[#201f22] hover:bg-[#2a2a2c] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (form.title.trim()) {
                onSave(form);
                onClose();
              }
            }}
            className="px-5 py-2 rounded-md text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#131315] bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] hover:opacity-90 transition-opacity drop-shadow-[0_4px_16px_rgba(192,193,255,0.2)]"
          >
            Save Task
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
