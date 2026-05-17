import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "../types";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskActionsMenu({ task, onEdit, onDelete }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-[#5c5b61] hover:text-[#e4e4e6] hover:bg-[#201f22]"
          aria-label="More actions"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-0 rounded-xl p-1 min-w-[140px]"
        style={{
          background: "#2a2a2c",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(70,69,84,0.15)",
        }}
      >
        <DropdownMenuItem
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[0.8125rem] text-[#e4e4e6] cursor-pointer hover:bg-[#353437] focus:bg-[#353437]"
          onClick={() => onEdit(task)}
        >
          <Pencil className="w-3.5 h-3.5 text-[#8083ff]" />
          Edit task
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[0.8125rem] text-[#ff6b6b] cursor-pointer hover:bg-[#353437] focus:bg-[#353437]"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
