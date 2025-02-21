/**
 * @file Implements the Dsm class, extending Ds with additional features. Dsm - Dataset with state machine
 *
 * The state can skip "starting" and "submitting" for direct execution,
 * so there are no restrictions on state changes during `changeState()`.
 * Restrictions on state changes are enforced by events: `start()`, `submit()`, and `apply()`.
 * These restrictions ensure that events occur in the correct state flow.
 * For example, `submit()` and `apply()` shouldn't be triggered before the mode is set or started,
 * or while other states are still processing.
 *
 * Mode and state transitions should be triggered through the library’s internal functions,
 * rather than by directly modifying external variables.
 * The `state` and `mode` variables are exposed to enhance the library’s flexibility,
 * allowing it to work with different reactive syntaxes in front-end frameworks.
 */

import { Ds } from "./ds";
import { DsState, DsStateMap } from "./type";
import type { DsCore, DsMode, DsCommonHooks, DsModeConfig } from "./type";

/**
 * Extended dataset manager with state machine.
 *
 * @template T - Object type representing table structure.
 * @extends {Ds<T>}
 */
export class Dsm<T extends object> extends Ds<T> {
  //

  /** Debug mode flag. */
  private _debug: boolean | undefined;

  /** Modes registry. */
  private _modesReg: Record<DsMode, DsModeConfig> = {};

  /** Previous mode. */
  private _modeEx: string = "init";

  /** Previous state. */
  private _StateEx: DsState = DsState.Unknown;

  /** Common hooks. */
  private _hooks: DsCommonHooks | undefined;

  //

  /**
   * Creates an instance of Dsm.
   *
   * @param {object} params - Initialization parameters.
   * @param {DsCore<T>} params.core - Core dataset structure.
   * @param {boolean} [params.useClone] - Whether to use cloning.
   * @param {DsCommonHooks} [params.hooks] - Hooks configuration.
   * @param {boolean} [params.debug] - Debug mode flag.
   */
  constructor(params: {
    core: DsCore<T>;
    useClone?: boolean;
    hooks?: DsCommonHooks;
    debug?: boolean;
  }) {
    super(params);
    this._debug = params.debug;
    this._hooks = params.hooks;
    this.registerMode("idle", {});
    this._changeState(DsState.Normal);
  }

  //

  /* ~ FSM Mode register */

  /**
   * Registers a new mode with an optional configuration.
   * @template D - The data type associated with the mode.
   * @param {DsMode} mode - The name of the mode to register.
   * @param {DsModeConfig<D>} [config] - Optional configuration for the mode.
   * @throws {Error} If the mode is already registered or contains invalid characters.
   * @returns {void}
   */
  registerMode<D>(mode: DsMode, config?: DsModeConfig<D>): void {
    if (this._modesReg[mode]) {
      throw new Error(`"${mode}" cannot register, mode dupicated`);
    }
    const validNameRegex = /^[a-zA-Z0-9_]+$/;
    if (!validNameRegex.test(mode)) {
      throw new Error(
        `"${mode}" not allowed. Only letters, numbers and underscores are accepted`
      );
    }
    config ? (this._modesReg[mode] = config) : this._modesReg[mode];
  }

  //

  /* ~ access attribute */

  /**
   * Gets the registered modes.
   * @returns {Record<string, DsModeConfig>} The registered mode configurations.
   */
  get modesReg(): Record<string, DsModeConfig> {
    return this._modesReg;
  }

  /**
   * Gets the current mode.
   * @returns {string} The current mode name.
   */
  get mode(): string {
    return this._core.mode ?? "init";
  }

  /**
   * Gets the current state.
   * @returns {DsState} The current state.
   */
  get state(): DsState {
    return this._core.state ?? DsState.Unknown;
  }

  /**
   * Gets the current state as a string.
   * @returns {string} The string representation of the current state.
   */
  get stateStr(): string {
    const state = this._core.state ?? DsState.Unknown;
    return dsStateStr(state);
  }

  /**
   * Gets the current status.
   * @returns {{ mode: string; state: DsState }} The current mode and state.
   */
  get status(): { mode: string; state: DsState } {
    return {
      mode: this._core.mode ?? "init",
      state: this._core.state ?? DsState.Unknown,
    };
  }

  /**
   * Checks if the current state is normal.
   * @returns {boolean} `true` if the state is normal, otherwise `false`.
   */
  get isNormal(): boolean {
    return this._core.state === DsState.Normal;
  }

  /**
   * Checks if the current state is starting.
   * @returns {boolean} `true` if the state is starting, otherwise `false`.
   */
  get isStarting(): boolean {
    return this._core.state === DsState.Starting;
  }

  /**
   * Checks if the current state is submitting.
   * @returns {boolean} `true` if the state is submitting, otherwise `false`.
   */
  get isSubmitting(): boolean {
    return this._core.state === DsState.Submitting;
  }

  /**
   * Checks if the current state is applying.
   * @returns {boolean} `true` if the state is applying, otherwise `false`.
   */
  get isAppling(): boolean {
    return this._core.state === DsState.Appling;
  }

  /**
   * Checks if the current state is busy (not normal).
   * @returns {boolean} `true` if the state is busy, otherwise `false`.
   */
  get busy(): boolean {
    return this._core.state !== DsState.Normal;
  }

  //

  /* ~ convenience function */

  /**
   * Checks if the current mode matches the specified mode.
   * @param {string} mode - The mode to check.
   * @returns {boolean} `true` if the current mode matches, otherwise `false`.
   */
  isMode(mode: string): boolean {
    return this._core.mode === mode;
  }

  /**
   * Checks if the current state matches the specified state.
   * @param {DsState} state - The state to check.
   * @returns {boolean} `true` if the current state matches, otherwise `false`.
   */
  isState(state: DsState): boolean {
    return this._core.state === state;
  }

  /**
   * Checks if both the current mode and state match the specified values.
   * @param {string} mode - The mode to check.
   * @param {DsState} state - The state to check.
   * @returns {boolean} `true` if both the mode and state match, otherwise `false`.
   */
  is(mode: string, state: DsState): boolean {
    return this._core.mode === mode && this._core.state === state;
  }

  /**
   * Checks if the specified mode is registered.
   * @param {string} mode - The mode to check.
   * @returns {boolean} `true` if the mode is registered, otherwise `false`.
   */
  isValidMode(mode: string): boolean {
    return this._modesReg[mode] ? true : false;
  }

  /**
   * Retrieves the mode configuration registry or a specific mode's configuration.
   * @param {string} [mode] - The mode to retrieve the configuration for.
   * @returns {DsModeConfig<any> | Record<string, DsModeConfig<any>> | undefined}
   * The entire mode registry if no mode is specified, otherwise the configuration for the given mode.
   */
  getModesReg(
    mode?: string
  ): DsModeConfig<any> | Record<string, DsModeConfig<any>> | undefined {
    if (mode === undefined) return this._modesReg;
    else return this._modesReg[mode];
  }

  //

  /* ~ event (state transition) */

  /**
   * Starts a new mode and updates the state accordingly.
   * **Fsm start point, start the specified mode**
   * @param {DsMode} mode - The mode to start.
   * @param {"submitted" | "applied"} [option] - Determines how the state transitions:
   * - `undefined`: Moves to `Starting` state.
   * - `"submitted"`: Skips `Starting` and moves directly to `Submitting` state.
   * - `"applied"`: Skips `Starting` and `Submitting`, moves directly to `Appling` state, and triggers processing.
   * @returns {boolean} `true` if the mode was successfully started, otherwise `false`.
   * @throws {Error} If an unknown option is provided in pure JavaScript environments.
   */
  start(mode: DsMode, option?: "submitted" | "applied"): boolean {
    // - state: [Normal]

    // - flow limiter
    if (this._core.state !== DsState.Normal) {
      // - validate current state is Normal(non busy)
      console.log("Not in Normal mode, cannot goto Starting");
      return false;
    }

    // - change mode
    const validMode = this._changeMode(mode);
    if (!validMode) return false;

    // - change state
    if (option === undefined) {
      // - goto [Starting]
      this._changeState(DsState.Starting);
      //
    } else if (option === "submitted") {
      // - bypass [starting], goto [Submitting]
      this._changeState(DsState.Submitting);
      //
    } else if (option === "applied") {
      // - bypass [starting] & [submitting], goto [Appling]
      this._changeState(DsState.Appling);
      this._process();
      //
    } else {
      // - for pure js
      throw new Error("Unknown option");
    }

    return true;
  }

  /**
   * Submits the current process and updates the state accordingly.
   * @param {"cancel" | "applied"} [option] - Determines how the state transitions:
   * - `undefined`: Moves to `Submitting` state.
   * - `"cancel"`: Cancels the process and returns to `Normal` state.
   * - `"applied"`: Skips `Submitting`, moves directly to `Appling` state, and triggers processing.
   * @returns {boolean} `true` if the submission was successful, otherwise `false`.
   * @throws {Error} If an unknown option is provided in pure JavaScript environments.
   */
  submit(option?: "cancel" | "applied"): boolean {
    // - state: [Starting]

    // - flow limiter
    if (this._core.state !== DsState.Starting) {
      console.log("invalid state, cannot goto Submitting");
      return false;
    }

    // - change state
    if (option === undefined) {
      // - goto [submitting]
      this._changeState(DsState.Submitting);
      //
    } else if (option === "cancel") {
      // - back to [Normal]
      this._changeState(DsState.Normal);
      //
    } else if (option === "applied") {
      // - bypass [Submiting], goto [Appling]
      this._changeState(DsState.Appling);
      this._process();
      //
    } else {
      // - for pure js
      throw new Error("Unknown option");
    }

    return true;
  }

  /**
   * Applies the current process and updates the state accordingly.
   * @param {"cancel"} [option] - Determines how the state transitions:
   * - `undefined`: Moves to `Appling` state and triggers processing.
   * - `"cancel"`: Reverts to the previous state.
   * @returns {boolean} `true` if the application was successful, otherwise `false`.
   * @throws {Error} If an unknown option is provided in pure JavaScript environments.
   */
  apply(option?: "cancel"): boolean {
    // - state: [Submitting]

    // - flow limiter
    if (this._core.state !== DsState.Submitting) {
      console.log("invalid state, cannot goto Appling");
      return false;
    }

    // - change state
    if (option === undefined) {
      // - goto [Appling]
      this._changeState(DsState.Appling);
      return this._process();
      //
    } else if (option === "cancel") {
      // - back previous state
      this._changeState(this._StateEx); // check
      return true;
      //
    } else {
      // - for pure js
      throw new Error("Unknown option");
    }
  }

  /**
   * Executes the `applied` hook function for the current mode and handles state transitions.
   * **FSM flow end point, final processing**
   * - If no `applied` hook is defined, it logs a message and returns `false`.
   * - On success, it triggers `applySuccess` and transitions to `Normal` state.
   * - On failure, it triggers `applyFail` and reverts to the previous state.
   * - Catches any errors and reverts to the previous state.
   * @returns {boolean} `true` if the process started, otherwise `false`.
   */
  private _process(): boolean {
    // - state: [Appling]

    // - undefined object guard
    const process = this._modesReg[this._core.mode!]?.applied;
    if (process === undefined) {
      console.log(
        "No applied() hook function config, no processing will be done"
      );
      console.log(`Mode config is: (${this._modesReg[this._core.mode!]})`);
      this._changeState(DsState.Normal);
      return false;
    }

    process()
      .then((r) => {
        // - Promise resolve
        const { success, data } = r;

        if (success) {
          // - success: update to local data, goto Normal
          this._modesReg[this._core.mode!]?.applySuccess?.(data);
          this._changeState(DsState.Normal);
          //
        } else {
          // - error: back to Start
          this._modesReg[this._core.mode!]?.applyFail?.(data);
          this._changeState(this._StateEx); // check
          //
        }
        //
      })
      .catch((error) => {
        console.log(error);
        this._changeState(this._StateEx); // check
      });

    return true;
  }

  //

  /* ~ State machine transition */

  /**
   * Changes the current mode if it is valid and allowed by the current state.
   * **Mode transition**
   * - Throws an error if the mode is not registered.
   * - Prevents mode change unless the current state is `Normal` (except for `"idle"` mode).
   * - Updates the mode, logs the change, and triggers mode change hooks.
   * @param {string} mode - The target mode to switch to.
   * @returns {boolean} `true` if the mode was successfully changed, otherwise `false`.
   */
  private _changeMode(mode: string): boolean {
    if (!this.isValidMode(mode))
      throw new Error(`Mode "${mode}" is not registered.`);

    // - flow limiter
    if (mode !== "idle" && this._core.state !== DsState.Normal) {
      console.log("current status not in Normal state, cannot change mode");
      return false;
    }

    // - change mode
    this._modeEx = this._core.mode ?? "init";
    this._core.mode = mode;

    // - mode changed & exec hook function
    this._printMode();
    this._hooks?.modeChanged?.({ ex: this._modeEx, now: mode });
    this._modesReg[mode].modeChanged?.({ ex: this._modeEx, now: mode });

    return true;
  }

  /**
   * Changes the current state and executes related hooks.
   * **State transition**
   * - Stores the previous state before updating.
   * - Triggers `stateChanged` hooks for both global and mode-specific handlers.
   * - Logs the new state.
   * - If the new state is `Normal`, automatically switches to `"idle"` mode.
   * @param {DsState} state - The new state to set.
   * @returns {void}
   * @private
   */

  private _changeState(state: DsState): void {
    // - change state
    this._StateEx = this._core.state ?? DsState.Unknown;
    this._core.state = state;

    // - execute hook
    this._hooks?.stateChanged?.(this.mode, { ex: this._StateEx, now: state });
    this._modesReg[this.mode]?.stateChanged?.(this.mode, {
      ex: this._StateEx,
      now: state,
    });

    this._printState();

    if (state === DsState.Normal) {
      this._changeMode("idle");
    }
  }

  //

  /* ~ debug use */

  /**
   * Logs the mode change if debugging is enabled.
   * **Displays the previous and current mode in the console.**
   * @returns {void}
   * @private
   */
  private _printMode(): void {
    if (this._debug !== true) return;
    console.debug(`Mode changed: ${this._modeEx} > ${this._core.mode}`);
  }

  /**
   * Logs the state change if debugging is enabled.
   * **Displays the mode, previous state, and current state in the console.**
   * @returns {void}
   * @private
   */
  private _printState(): void {
    if (this._debug !== true) return;
    const mode = this._core.mode;
    const exState = dsStateStr(this._StateEx);
    const nowState = dsStateStr(this._core.state);
    console.debug(`${mode}: [${exState}] > [${nowState}]`);
  }
}

/**
 * Converts a `DsState` value to its corresponding string representation.
 * @param {DsState} [state] - The state to convert.
 * @returns {string} The string representation of the state, or "Unknown" if not found.
 */
export function dsStateStr(state?: DsState): string {
  return DsStateMap.get(state ?? DsState.Unknown) ?? "Unknown";
}
