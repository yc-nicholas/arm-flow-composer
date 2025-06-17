// src/schemas/taskRegistry.ts
import TaskMove from '@/components/tasks/TaskMove';
import TaskGrip from '@/components/tasks/TaskGrip';
import TaskRelease from '@/components/tasks/TaskRelease';
import TaskWait from '@/components/tasks/TaskWait';

import { TASK_SCHEMAS } from '@/schemas/taskSchemas';

export const TaskComponentMap = {
  move: TaskMove,
  grip: TaskGrip,
  release: TaskRelease,
  wait: TaskWait,
} as const;

export const DESC_FORMAT: Record<string, (p: Record<string, number>) => string> = {
  move: (p) =>
    `Move to Position (${(p.x ?? 0).toFixed(2)} m, ` +
    `${(p.y ?? 0).toFixed(2)} m, ` +
    `${(p.z ?? 0).toFixed(2)} m)`,

  grip: (p) => `Grip with ${(p.force ?? 0).toFixed(0)}% force`,

  release: () => 'Release gripper',

  wait: (p) => `Wait for ${(p.duration ?? 0).toFixed(1)} sec`,
};

const DEFAULT_PARAMETERS: Record<keyof typeof TASK_SCHEMAS, Record<string, number>> = {
  move: { x: 0, y: 0, z: 0 },
  grip: { force: 50 },
  release: {},
  wait: { duration: 1 },
};

export function getDefaultParams<T extends keyof typeof TASK_SCHEMAS>(
  type: T
): Record<string, number> {
  return JSON.parse(JSON.stringify(DEFAULT_PARAMETERS[type]));
}