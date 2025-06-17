import { ParamSpec } from "@/interfaces/Task";

export const TASK_SCHEMAS = {
  move: {
    x: { label: 'X', unit: 'cm', min: -200, max: 200, toInternal: cm => cm / 100, toUI: m => m * 100 },
    y: { label: 'Y', unit: 'cm', min: -100, max: 100, toInternal: cm => cm / 100, toUI: m => m * 100 },
    z: { label: 'Z', unit: 'cm', min: 0, max: 200, toInternal: cm => cm / 100, toUI: m => m * 100 },
  },
  grip: {
    force: { label: 'Force', unit: '%', min: 0, max: 100, step: 1 },
  },
  wait: {
    duration: { label: 'Duration', unit: 's', min: 0.1, max: 600, step: 0.1 },
  },
  release: {},
} satisfies Record<string, Record<string, ParamSpec>>;