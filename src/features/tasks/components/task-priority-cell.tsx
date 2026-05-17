import { PRIORITY_DOT } from "../data";
import type { TaskPriority } from "../types";

interface Props {
  priority: TaskPriority;
}

export function TaskPriorityCell({ priority }: Props) {
  return (
    <span className="flex items-center gap-2 text-[0.8125rem] text-[#8e8d92]">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: PRIORITY_DOT[priority] }}
      />
      {priority}
    </span>
  );
}
