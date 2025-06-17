export interface ParamSpec {
    label: string;          // what to show in UI
    unit?: string;          // optional unit text
    min?: number;
    max?: number;
    step?: number;
    toInternal?: (v: number) => number; // UI → model
    toUI?: (v: number) => number;       // model → UI
  }
  
  export const TASK_SCHEMAS = {
    move: {
      x: { label: 'X', unit: 'cm', min: -200, max: 200, toInternal: cm => cm / 100, toUI: m => m * 100 },
      y: { label: 'Y', unit: 'cm', min: -100, max: 100, toInternal: cm => cm / 100, toUI: m => m * 100 },
      z: { label: 'Z', unit: 'cm', min:  0,   max: 200, toInternal: cm => cm / 100, toUI: m => m * 100 },
    },
    grip: {
      force: { label: 'Force', unit: '%', min: 0, max: 100, step: 1 },
    },
    wait: {
      duration: { label: 'Duration', unit: 's', min: 0.1, max: 600, step: 0.1 },
    },
    release: {},
  } satisfies Record<string, Record<string, ParamSpec>>;

export const DESC_FORMAT: Record<string, (p: Record<string, number>) => string> = {
  move: (p) =>
    `Move to Position (${(p.x ?? 0).toFixed(2)} m, ` +
    `${(p.y ?? 0).toFixed(2)} m, ` +
    `${(p.z ?? 0).toFixed(2)} m)`,

  grip: (p) => `Grip with ${(p.force ?? 0).toFixed(0)}% force`,

  release: () => 'Release gripper',

  wait: (p) => `Wait for ${(p.duration ?? 0).toFixed(1)} sec`,
};

export const DEFAULT_PARAMETERS: Record<keyof typeof TASK_SCHEMAS, Record<string, number>> = {
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