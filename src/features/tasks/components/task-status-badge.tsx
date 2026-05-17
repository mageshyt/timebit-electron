import { STATUS_STYLES } from "../data";
import type { TaskStatus } from "../types";

interface Props {
  status: TaskStatus;
}

export function TaskStatusBadge({ status }: Props) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[0.625rem] font-semibold uppercase tracking-[0.06em] whitespace-nowrap w-fit text-center"
      style={{ background: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}
