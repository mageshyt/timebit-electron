import { EMPTY_FORM } from "../data";
import { useTaskStore } from "../task.store";
import type { TaskForm } from "../types";
import { TaskDialog } from "./task-dialog";

interface Props {
  onAdd: (form: TaskForm) => void;
  onEdit: (id: number, form: TaskForm) => void;
}

export function TaskDialogManager({ onAdd, onEdit }: Props) {
  const { addOpen, closeAdd, editTarget, closeEdit } = useTaskStore();

  const handleAdd = (form: TaskForm) => {
    console.log(form);
    onAdd(form);
    closeAdd();
  };

  const handleEdit = (form: TaskForm) => {
    if (!editTarget) return;
    console.log(form);
    onEdit(editTarget.id, form);
    closeEdit();
  };

  return (
    <>
      <TaskDialog
        open={addOpen}
        title="New Task"
        initial={EMPTY_FORM}
        onClose={closeAdd}
        onSave={handleAdd}
      />
      <TaskDialog
        open={!!editTarget}
        title="Edit Task"
        initial={
          editTarget
            ? {
                title: editTarget.title,
                subtitle: editTarget.subtitle,
                category: editTarget.category ?? undefined,
                status: editTarget.status,
                priority: editTarget.priority,
                estimate: editTarget.estimate,
              }
            : EMPTY_FORM
        }
        onClose={closeEdit}
        onSave={handleEdit}
      />
    </>
  );
}
