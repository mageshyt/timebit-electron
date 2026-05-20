import { useState } from "react";
import { Plus, CalendarIcon } from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";
import { cn } from "@/utils/tailwind";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function LogProtocolDialog({
  habits,
  toggleHabit,
}: {
  habits: any[];
  toggleHabit: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const today = startOfDay(new Date());
  const selectedDay = date ? startOfDay(date) : undefined;
  
  const isPastDate = selectedDay ? isBefore(selectedDay, today) : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPastDate || !selectedHabit || !date) return;
    
    toggleHabit(Number(selectedHabit));
    setOpen(false);
    setSelectedHabit("");
    setDate(new Date());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex h-8 items-center gap-2 rounded-md px-3 text-[0.75rem] font-semibold text-[#1000a9] transition-opacity hover:opacity-90"
          style={{ background: "#c0c1ff" }}
        >
          <Plus className="h-4 w-4" />
          Log Protocol
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Protocol Completion</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#e4e4e6]">Select Protocol</label>
            <Select value={selectedHabit} onValueChange={setSelectedHabit} required>
              <SelectTrigger className="w-full bg-[#201f22] border-white/10 text-[#e4e4e6] focus:ring-[#c0c1ff]/40">
                <SelectValue placeholder="Choose a protocol..." />
              </SelectTrigger>
              <SelectContent>
                {habits.map((h) => (
                  <SelectItem key={h.id} value={String(h.id)}>
                    {h.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#e4e4e6]">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-[#201f22] border-white/10 text-[#e4e4e6] hover:bg-[#2a2a2c] hover:text-white",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-white/10" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                />
              </PopoverContent>
            </Popover>
            
            {isPastDate && (
              <span className="text-[0.6875rem] text-[#ffb4ab]">
                Cannot log protocols for past dates. Missing past data is strictly locked.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!selectedHabit || isPastDate || !date}
            className="mt-4 flex h-9 w-full items-center justify-center rounded-md font-semibold text-[#1000a9] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
            style={{ background: "#c0c1ff" }}
          >
            Submit Log
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
