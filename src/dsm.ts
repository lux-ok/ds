/**
 * + Dsm - Dataset with state machine
 *
 * State can skip starting and submitting for direct execution,
 * so no restriction on state changes during changeState().
 * Restrictions on state changes are handled by events: start(), submit(), apply().
 * Restrictions ensure events happen in the correct state flow.
 * For example, submit() and apply() shouldn't be triggered before the mode is set or started,
 * or while other states are processing.
 *
 * Mode and state transitions should be triggered through the library’s internal functions,
 * not by external variable modifications.
 * The state and mode variables are exposed to make the library more versatile,
 * allowing it to work with different reactive syntax in front-end frameworks.
 */

import { Ds } from "./ds";
import { DsState, DsStateMap } from "./type";
import type { DsCore, DsMode, DsCommonHooks, DsModeConfig } from "./type";

/**
 * Dsm - Dataset with state machine
 *
 * @export
 * @class Dsm
 * @extends {Ds<T extends object>}
 * @template T
 */
export class Dsm<T extends object> extends Ds<T> {
  #debug: boolean | undefined;
  #modesReg: Record<DsMode, DsModeConfig> = {}; // - modes registry
  #modeEx: string = "init";
  #StateEx: DsState = DsState.Unknown;
  #hooks: DsCommonHooks | undefined;

  /**
   * Creates an instance of Dsm.
   * @param {{
   *     core: DsCore<T>;
   *     useClone?: boolean;
   *     hooks?: DsCommonHooks;
   *     debug?: boolean;
   *   }} params
   * @memberof Dsm
   */
  constructor(params: {
    core: DsCore<T>;
    useClone?: boolean;
    hooks?: DsCommonHooks;
    debug?: boolean;
  }) {
    super(params);
    this.#debug = params.debug;
    this.#hooks = params.hooks;
    this.registerMode("idle", {});
    this.#changeState(DsState.Normal);
  }

  /* ~ FSM Mode register */

  /**
   * Mode registration
   *
   * @template D
   * @param {DsMode} mode
   * @param {DsModeConfig<D>} [config]
   * @memberof Dsm
   */
  registerMode<D>(mode: DsMode, config?: DsModeConfig<D>) {
    if (this.#modesReg[mode]) {
      throw new Error(`"${mode}" cannot register, mode dupicated`);
    }
    const validNameRegex = /^[a-zA-Z0-9_]+$/;
    if (!validNameRegex.test(mode)) {
      throw new Error(
        `"${mode}" not allowed. Only letters, numbers and underscores are accepted`
      );
    }
    config ? (this.#modesReg[mode] = config) : this.#modesReg[mode];
  }

  /* ~ access attribute */
  /**
   * modesReg attribute
   *
   * @readonly
   * @memberof Dsm
   */
  get modesReg() {
    return this.#modesReg;
  }

  /**
   * mode attribute
   *
   * @readonly
   * @type {string}
   * @memberof Dsm
   */
  get mode(): string {
    return this.core.mode ?? "init";
  }

  /**
   * state attribute
   *
   * @readonly
   * @type {DsState}
   * @memberof Dsm
   */
  get state(): DsState {
    return this.core.state ?? DsState.Unknown;
  }

  /**
   * state string attribute
   *
   * @readonly
   * @type {string}
   * @memberof Dsm
   */
  get stateStr(): string {
    const state = this.core.state ?? DsState.Unknown;
    return dsStateStr(state);
  }

  /**
   * {mode; state} attribute
   *
   * @readonly
   * @type {{ mode: string; state: DsState }}
   * @memberof Dsm
   */
  get status(): { mode: string; state: DsState } {
    return {
      mode: this.core.mode ?? "init",
      state: this.core.state ?? DsState.Unknown,
    };
  }

  /**
   * Is Normal state attribute
   *
   * @readonly
   * @type {boolean}
   * @memberof Dsm
   */
  get isNormal(): boolean {
    return this.core.state === DsState.Normal;
  }

  /**
   * Is [Starting] state attribute
   *
   * @readonly
   * @type {boolean}
   * @memberof Dsm
   */
  get isStarting(): boolean {
    return this.core.state === DsState.Starting;
  }

  /**
   * Is [Submitting] state attribute
   *
   * @readonly
   * @type {boolean}
   * @memberof Dsm
   */
  get isSubmitting(): boolean {
    return this.core.state === DsState.Submitting;
  }

  /**
   * Is [Appling] state attribute
   *
   * @readonly
   * @type {boolean}
   * @memberof Dsm
   */
  get isAppling(): boolean {
    return this.core.state === DsState.Appling;
  }

  /**
   * Not [Normal] state, busy attribute
   *
   * @readonly
   * @type {boolean}
   * @memberof Dsm
   */
  get busy(): boolean {
    return this.core.state !== DsState.Normal;
  }

  /* ~ convenience function */

  /**
   * Mode comparator
   *
   * @param {string} mode
   * @return {*}  {boolean}
   * @memberof Dsm
   */
  isMode(mode: string): boolean {
    return this.core.mode === mode;
  }

  /**
   * State comparator
   *
   * @param {DsState} state
   * @return {*}  {boolean}
   * @memberof Dsm
   */
  isState(state: DsState): boolean {
    return this.core.state === state;
  }

  /**
   * Mode and State comparator
   *
   * @param {string} mode
   * @param {DsState} state
   * @return {*}  {boolean}
   * @memberof Dsm
   */
  is(mode: string, state: DsState): boolean {
    return this.core.mode === mode && this.core.state === state;
  }

  /**
   * Mode validator
   *
   * @param {string} mode
   * @return {*}  {boolean}
   * @memberof Dsm
   */
  isValidMode(mode: string): boolean {
    return this.#modesReg[mode] ? true : false;
  }

  /**
   * get modes registry
   *
   * @param {string} [mode]
   * @return {*}  {(DsModeConfig<any> | Record<string, DsModeConfig<any>> | undefined)}
   * @memberof Dsm
   */
  getModesReg(
    mode?: string
  ): DsModeConfig<any> | Record<string, DsModeConfig<any>> | undefined {
    if (mode === undefined) return this.#modesReg;
    else return this.#modesReg[mode];
  }

  /* ~ event (state transition) */

  /**
   * Start specified mode, FSM flow start point
   *
   * option = undefined : state transit to [Starting]
   * option = "submitted": bypass [Starting],go direct to [Submitting]
   * option = "applied": bypass [Starting] and [submitting], go direct to [Appling]
   *
   * @param {DsMode} mode
   * @param {("submitted" | "applied")} [option]
   * @return {*}  {boolean}
   * @memberof Dsm
   */
  start(mode: DsMode, option?: "submitted" | "applied"): boolean {
    // - state: [Normal]

    // - flow limiter
    if (this.core.state !== DsState.Normal) {
      // - validate current state is Normal(non busy)
      console.log("Not in Normal mode, cannot goto Starting");
      return false;
    }

    // - change mode
    const validMode = this.#changeMode(mode);
    if (!validMode) return false;

    // - change state
    if (option === undefined) {
      // - goto [Starting]
      this.#changeState(DsState.Starting);
      //
    } else if (option === "submitted") {
      // - bypass [starting], goto [Submitting]
      this.#changeState(DsState.Submitting);
      //
    } else if (option === "applied") {
      // - bypass [starting] & [submitting], goto [Appling]
      this.#changeState(DsState.Appling);
      this.#process();
      //
    } else {
      // - for pure js
      throw new Error("Unknown option");
    }

    return true;
  }

  /**
   * Submit a request
   *
   * option = "canel": back to [Normal] state and reset mode to (idle)
   * option = "applied": bypass [Submiting], go direct to [Appling]
   *
   * @param {("cancel" | "applied")} [option]
   * @return {*}  {boolean}
   * @memberof Dsm
   */
  submit(option?: "cancel" | "applied"): boolean {
    // - state: [Starting]

    // - flow limiter
    if (this.core.state !== DsState.Starting) {
      console.log("invalid state, cannot goto Submitting");
      return false;
    }

    // - change state
    if (option === undefined) {
      // - goto [submitting]
      this.#changeState(DsState.Submitting);
      //
    } else if (option === "cancel") {
      // - back to [Normal]
      this.#changeState(DsState.Normal);
      //
    } else if (option === "applied") {
      // - bypass [Submiting], goto [Appling]
      this.#changeState(DsState.Appling);
      this.#process();
      //
    } else {
      // - for pure js
      throw new Error("Unknown option");
    }

    return true;
  }

  /**
   * Apply processing means [Submitting] confirmation and entering processing
   *
   * option = "cancel": abort submitting and back to previous state
   *
   * @param {"cancel"} [option]
   * @return {*}  {boolean}
   * @memberof Dsm
   */
  apply(option?: "cancel"): boolean {
    // - state: [Submitting]

    // - flow limiter
    if (this.core.state !== DsState.Submitting) {
      console.log("invalid state, cannot goto Appling");
      return false;
    }

    // - change state
    if (option === undefined) {
      // - goto [Appling]
      this.#changeState(DsState.Appling);
      return this.#process();
      //
    } else if (option === "cancel") {
      // - back previous state
      this.#changeState(this.#StateEx); // check
      return true;
      //
    } else {
      // - for pure js
      throw new Error("Unknown option");
    }
  }

  /**
   * FSM flow end point, final processing
   */
  #process(): boolean {
    // - state: [Appling]

    // - undefined object guard
    const process = this.#modesReg[this.core.mode!]?.applied;
    if (process === undefined) {
      console.log(
        "No applied() hook function config, no processing will be done"
      );
      console.log(`Mode config is: (${this.#modesReg[this.core.mode!]})`);
      this.#changeState(DsState.Normal);
      return false;
    }

    process()
      .then((r) => {
        // - Promise resolve
        const { success, data } = r;

        if (success) {
          // - success: update to local data, goto Normal
          this.#modesReg[this.core.mode!]?.applySuccess?.(data);
          this.#changeState(DsState.Normal);
          //
        } else {
          // - error: back to Start
          this.#modesReg[this.core.mode!]?.applyFail?.(data);
          this.#changeState(this.#StateEx); // check
          //
        }
        //
      })
      .catch((error) => {
        console.log(error);
        this.#changeState(this.#StateEx); // check
      });

    return true;
  }

  /* ~ State machine transition */

  /**
   * Mode transition
   */
  #changeMode(mode: string): boolean {
    if (!this.isValidMode(mode))
      throw new Error(`Mode "${mode}" is not registered.`);

    // - flow limiter
    if (mode !== "idle" && this.core.state !== DsState.Normal) {
      console.log("current status not in Normal state, cannot change mode");
      return false;
    }

    // - change mode
    this.#modeEx = this.core.mode ?? "init";
    this.core.mode = mode;

    // - mode changed & exec hook function
    this.#printMode();
    this.#hooks?.modeChanged?.({ ex: this.#modeEx, now: mode });
    this.#modesReg[mode].modeChanged?.({ ex: this.#modeEx, now: mode });

    return true;
  }

  /**
   * State transition
   */
  #changeState(state: DsState) {
    // - change state
    this.#StateEx = this.core.state ?? DsState.Unknown;
    this.core.state = state;

    // - execute hook
    this.#hooks?.stateChanged?.(this.mode, { ex: this.#StateEx, now: state });
    this.#modesReg[this.mode]?.stateChanged?.(this.mode, {
      ex: this.#StateEx,
      now: state,
    });

    this.#printState();

    if (state === DsState.Normal) {
      this.#changeMode("idle");
    }
  }

  /* ~ debug use */

  #printMode() {
    if (this.#debug !== true) return;
    console.debug(`Mode changed: ${this.#modeEx} > ${this.core.mode}`);
  }

  #printState() {
    if (this.#debug !== true) return;
    const mode = this.core.mode;
    const exState = dsStateStr(this.#StateEx);
    const nowState = dsStateStr(this.core.state);
    console.debug(`${mode}: [${exState}] > [${nowState}]`);
  }
}

/**
 * convert state enum to string
 *
 * @export
 * @param {DsState} [state]
 * @return {*}  {*}
 */
export function dsStateStr(state?: DsState): string {
  return DsStateMap.get(state ?? DsState.Unknown) ?? "Unknown";
}
