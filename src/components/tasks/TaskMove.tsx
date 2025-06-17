import React from 'react';
import { Task } from '../../pages/BuilderPage';
import { TASK_SCHEMAS, DESC_FORMAT } from '@/schemas/taskSchemas';

const MOVE_SCHEMA = TASK_SCHEMAS.move;
type Axis = keyof typeof MOVE_SCHEMA;  // 'x' | 'y' | 'z'

interface TaskCompProps {
  task: Task;
  onUpdate: (updated: Task) => void;
}

const TaskMove: React.FC<TaskCompProps> = ({ task, onUpdate }) => {
  /** Convert UI cm → m and update parent */
  const applyChange = (axis: Axis, uiCm: number) => {
    const metres = MOVE_SCHEMA[axis].toInternal?.(uiCm) ?? uiCm;
    const newParams = { ...task.parameters, [axis]: metres };
    const newDesc = DESC_FORMAT.move(newParams);
    onUpdate({ ...task, parameters: newParams, description: newDesc });
  };

  /** Field factory for X,Y,Z */
  const Field = (axis: Axis) => {
    const spec = MOVE_SCHEMA[axis];
    const step = (spec as { step?: number }).step ?? 1;
    const toUI = spec.toUI ?? ((v: number) => v);

    const [draft, setDraft] = React.useState(() =>
      String(toUI((task.parameters[axis] as number) ?? 0))
    );

    React.useEffect(() => {
      const next = String(toUI((task.parameters[axis] as number) ?? 0));
      if (next !== draft) setDraft(next);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task.parameters[axis]]);

    const commit = () => {
      const num = Number(draft);
      if (!Number.isNaN(num)) applyChange(axis, num);
    };

    return (
      <div className="flex items-center space-x-2" key={axis}>
        <label
          htmlFor={`${task.id}-${axis}`}
          className="w-20 text-sm text-gray-600"
        >
          {spec.label} ({spec.unit})
        </label>
        <input
          id={`${task.id}-${axis}`}
          type="number"
          min={spec.min}
          max={spec.max}
          step={step}
          value={draft}
          onChange={(e) => {
            const next = e.target.value;
            if (/^-?\d*\.?\d*$/.test(next)) {
              setDraft(next);
            }
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            const ok =
              ['-', '.', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) ||
              /^[0-9]$/.test(e.key);
            if (ok) e.stopPropagation();
            else e.preventDefault();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-24 rounded border px-2 py-1 text-sm"
        />
      </div>
    );
  };

  return (
    <div className="ml-8 mt-2 space-y-2">
      {Field('x')}
      {Field('y')}
      {Field('z')}
    </div>
  );
};

export default TaskMove;