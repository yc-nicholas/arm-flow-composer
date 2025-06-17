export interface Task {
    id: string;
    type: string;
    parameters: Record<string, any>;
    description: string;
}

export interface ParamSpec {
    label: string;          // what to show in UI
    unit?: string;          // optional unit text
    min?: number;
    max?: number;
    step?: number;
    toInternal?: (v: number) => number; // UI → model
    toUI?: (v: number) => number;       // model → UI
}