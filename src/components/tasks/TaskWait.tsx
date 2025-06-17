import React from 'react';
import { Task } from '@/interfaces/Task';
import { DESC_FORMAT } from './UIConfig';

interface TaskCompProps {
  task: Task;
  onUpdate: (newTask: Task) => void;
}

const TaskWait: React.FC<TaskCompProps> = ({ task, onUpdate }) => {
  const [draft, setDraft] = React.useState<string>(
    String(task.parameters.duration ?? 1)
  );

  React.useEffect(() => {
    setDraft(String(task.parameters.duration ?? 1));
  }, [task.parameters.duration]);

  const handleCommit = (val: number) => {
    const clamped = Math.max(0.1, Math.min(600, val));
    const newParams = { ...task.parameters, duration: clamped };
    const newDesc = DESC_FORMAT.wait(newParams);
    onUpdate({ ...task, parameters: newParams, description: newDesc });
  };

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
          onChange={(e) => {
            const next = e.target.value;
            if (/^-?\d*\.?\d*$/.test(next)) {
              setDraft(next);
            }
          }}
          onBlur={() => handleCommit(parseFloat(draft))}
          onKeyDown={(e) => {
            const allowed = [
              '-', '.', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
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