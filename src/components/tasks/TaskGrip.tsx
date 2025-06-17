import React from 'react';
import { Task } from '@/interfaces/Task';
import { DESC_FORMAT } from './UIConfig';

interface TaskCompProps {
    task: Task;
    onUpdate: (newTask: Task) => void;
  }

const TaskGrip: React.FC<TaskCompProps> = ({ task, onUpdate }) => {
  const handleCommit = (val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    const newParams = { ...task.parameters, force: clamped };
    const newDesc = DESC_FORMAT.grip(newParams);
    onUpdate({ ...task, parameters: newParams, description: newDesc });
  };

  const [draft, setDraft] = React.useState<string>(
    String(task.parameters.force ?? 0)
  );
  React.useEffect(() => {
    setDraft(String(task.parameters.force ?? 0));
  }, [task.parameters.force]);

  return (
    <div className="ml-8 mt-2 space-y-2">
      <div className="flex items-center space-x-2">
        <label className="w-24 text-sm text-gray-600">Force (%)</label>
        <input
          type="number"
          min={0}
          max={100}
          step={1}
          value={draft}
          onChange={(e) => {
            const next = e.target.value;
            if (/^-?\d*\.?\d*$/.test(next)) {
              setDraft(next);
            }
          }}
          onBlur={() => handleCommit(parseFloat(draft))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCommit(parseFloat(draft));
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

export default TaskGrip;