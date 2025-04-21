/**
 * Core data structure for Ds.
 * @template T - Object type representing table structure.
 */
export interface DsCore<T extends object> {
  /** 2D array representing tables. */
  tables: T[][];
  /** Selected table IDs. */
  tablesSel: Tid[];
  /** Selected row locations. */
  rowsSel: Loc[];
  /** Current mode. */
  mode?: DsMode;
  /** Current state. */
  state?: DsState;
}

//

/** Table ID. */
export type Tid = number;

/** Row location in a table. */
export type Loc = { t: number; r: number };

//

/** Multi-selection mode. */
export type MultiMode = "additive" | "range" | undefined;

//

/** Data structure mode. */
export type DsMode = string;

/** Enumeration of possible states. */
export enum DsState {
  Unknown = 0,
  Normal = 1,
  Starting = 2,
  Submitting = 3,
  Appling = 4,
}

/** Maps DsState values to their string representations. */
export const DsStateMap = new Map<DsState, string>(
  Object.values(DsState)
    .filter((value) => typeof value === "number")
    .map((value) => [value as DsState, DsState[value as number]])
);

//

/**
 * Hook triggered after an apply operation.
 * @template D - Data type returned in the response.
 * @returns {Promise<{ success: boolean; data: D | null }>} Promise resolving with success status and optional data.
 */
export type HookApplied<D = any> = () => Promise<{
  success: boolean;
  data: D | null;
}>;

/**
 * Hook triggered on a successful apply operation.
 * @template D - Data type passed to the hook.
 * @param {D} [data] - Optional data related to the successful operation.
 */
export type HookApplySuccess<D = any> = (data?: D) => void;

/**
 * Hook triggered on a failed apply operation.
 * @template D - Data type passed to the hook.
 * @param {D} [data] - Optional data related to the failed operation.
 */
export type HookApplyFail<D = any> = (data?: D) => void;

/**
 * Hook triggered when the mode changes.
 * @param {object} mode - Object containing previous and current mode.
 * @param {string} mode.ex - Previous mode.
 * @param {string} mode.now - Current mode.
 */
export type HookModeChanged = (mode: { ex: string; now: string }) => void;

/**
 * Hook triggered when the state changes.
 * @param {string} mode - Current mode.
 * @param {object} state - Object containing previous and current state.
 * @param {DsState} state.ex - Previous state.
 * @param {DsState} state.now - Current state.
 */
export type HookStateChanged = (
  mode: string,
  state: { ex: DsState; now: DsState }
) => void;

/**
 * Configuration for mode-specific hooks.
 * @template D - Data type for hooks.
 * @property {HookApplied<D>} [applied] - Hook triggered after an apply operation.
 * @property {HookApplySuccess<D>} [applySuccess] - Hook triggered on a successful apply.
 * @property {HookApplyFail<D>} [applyFail] - Hook triggered on a failed apply.
 * @property {HookModeChanged} [modeChanged] - Hook triggered when mode changes.
 * @property {HookStateChanged} [stateChanged] - Hook triggered when state changes.
 */
export type DsModeConfig<D = any> = {
  applied?: HookApplied<D>;
  applySuccess?: HookApplySuccess<D>;
  applyFail?: HookApplyFail<D>;
  modeChanged?: HookModeChanged;
  stateChanged?: HookStateChanged;
};

/**
 * Common hook configuration.
 * @template D - Data type for hooks.
 * @property {HookModeChanged} [modeChanged] - Hook triggered when mode changes.
 * @property {HookStateChanged} [stateChanged] - Hook triggered when state changes.
 */
export type DsCommonHooks<D = any> = {
  modeChanged?: HookModeChanged;
  stateChanged?: HookStateChanged;
};

export type HookRowSelectChanged = () => void;

export type HookTableSelectChanged = () => void;

export type DsSelectChangedHooks = {
  rowSelectChanged?: HookRowSelectChanged;
  tableSelectChanged?: HookTableSelectChanged;
};
