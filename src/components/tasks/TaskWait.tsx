import React from 'react';
import { Task } from '../../pages/BuilderPage';
import { DESC_FORMAT } from '@/schemas/taskSchemas';

interface TaskCompProps {
  task: Task;
  onUpdate: (idx: number, newTask: Task) => void;
}

const TaskWait: React.FC<TaskCompProps> = ({ task, onUpdate }) => {
  const commit = (val: number) => {
    const clamped = Math.max(0.1, Math.min(600, val));
    const newParams = { ...task.parameters, duration: clamped };
    const newDesc = DESC_FORMAT.wait(newParams);
    onUpdate({ ...task, parameters: newParams, description: newDesc });
  };

  const [draft, setDraft] = React.useState<string>(
    String(task.parameters.duration ?? 0)
  );
  React.useEffect(() => {
    setDraft(String(task.parameters.duration ?? 0));
  }, [task.parameters.duration]);

  return (
    <div className="ml-8 mt-2 space-y-2">
      <div className="flex items-center space-x-2">
        <label className="w-28 text-sm text-gray-600">Duration (s)</label>
        <input
          type="number"
          min={0.1}
          max={600}
          step={0.1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => commit(parseFloat(draft))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit(parseFloat(draft));
            const allowed = [
              '-',
              '.',
              'Backspace',
              'Delete',
              'ArrowLeft',
              'ArrowRight',
              'Tab',
            ];
            if (allowed.includes(e.key) || /^[0-9]$/.test(e.key)) {
              e.stopPropagation();
            } else {
              e.preventDefault();
            }
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-32 rounded border px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
};

export default TaskWait;