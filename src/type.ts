export interface DsCore<T extends object> {
  tables: T[][];
  tablesSel: Tid[];
  rowsSel: Loc[];
  mode?: DsMode;
  state?: DsState;
}

export type Loc = { t: number; r: number };

export type Tid = number;

export type MultiMode = "additive" | "range" | undefined;

export type DsMode = string;

export enum DsState {
  Unknown = 0,
  Normal = 1,
  Starting = 2,
  Submitting = 3,
  Appling = 4,
}

export const DsStateMap = new Map<number, string>(
  Object.entries(DsState).map(
    ([key, value]) => [value, key] as [DsState, string]
  )
);

export type HookApplied<D = any> = () => Promise<{
  success: boolean;
  data: D | null;
}>;

export type HookApplySuccess<D = any> = (data?: D) => void;

export type HookApplyFail<D = any> = (data?: D) => void;

export type HookModeChanged = (mode: { ex: string; now: string }) => void;

export type HookStateChanged = (
  mode: string,
  state: { ex: DsState; now: DsState }
) => void;

export type DsModeConfig<D = any> = {
  // - Mode-specific hook function configuration
  applied?: HookApplied<D>;
  applySuccess?: HookApplySuccess<D>;
  applyFail?: HookApplyFail<D>;
  modeChanged?: HookModeChanged;
  stateChanged?: HookStateChanged;
};

export type DsCommonHooks<D = any> = {
  // - Common hook function configuration
  modeChanged?: HookModeChanged;
  stateChanged?: HookStateChanged;
};
