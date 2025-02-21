import type { DsCore, Loc, Tid, MultiMode } from "./type";

/**
 * A generic dataset manager.
 * @template {object} T - The type of the data structure managed by this instance.
 */
export class Ds<T extends object> {
  //

  /* ~ private vars */

  /** The core instance managing dataset operations. */
  protected _core: DsCore<T>;

  /** Whether to use `structuredClone()` when handling data. */
  private _useClone?: boolean;

  /** Stores the previous selection reference. */
  private _oldSelRef: { tables: T[][]; rows: T[] } = { tables: [], rows: [] };

  /** Stores the current selection reference. */
  private _newSelRef: { tables: T[][]; rows: T[] } = { tables: [], rows: [] };

  //

  /**
   * Creates an instance of Ds.
   * @param {Object} params - The initialization parameters.
   * @param {DsCore<T>} params.core - The core instance managing data operations.
   * @param {boolean} [params.useClone=true] - Whether to use `structuredClone()` when handling data.
   */
  constructor(params: { core: DsCore<T>; useClone?: boolean }) {
    this._core = params.core;
    this._useClone = params.useClone ?? true; // - default use structureClone()
  }

  //

  /* ~ private sub function */

  /**
   * Logs a message.
   * @param {string} msg - The message to log.
   * @param {string} [func] - The function name to prefix the message.
   */
  protected log(msg: string, func?: string): void {
    console.log(func ? func + ": " + msg : msg);
  }

  /**
   * Updates the selected tables.
   * @param {boolean} [changeSel] - Override default. Whether to use the new selection reference.
   */
  private _updateTableSel(changeSel?: boolean): void {
    const buf: T[][] = changeSel
      ? this._newSelRef.tables
      : this._oldSelRef.tables;
    this._core.tablesSel.length = 0;
    buf.forEach((table) => {
      const { found, tid: t } = this.hasTableRef(table);
      found && this._core.tablesSel.push(t);
    });
    buf.length = 0;
  }

  /**
   * Updates the selected rows.
   * @param {boolean} [changeSel] - Override default. Whether to use the new selection reference.
   */
  private _updateRowSel(changeSel?: boolean): void {
    const buf: T[] = changeSel ? this._newSelRef.rows : this._oldSelRef.rows;
    this._core.rowsSel.length = 0;
    buf.forEach((row) => {
      const { found, loc } = this.hasRowRef(row);
      found && this._core.rowsSel.push(loc);
    });
    buf.length = 0;
  }

  //

  /* ~ tables */

  /**
   * Gets all tables in the dataset.
   * @returns {T[][]} A two-dimensional array representing the tables.
   */
  get tables(): T[][] {
    return this._core.tables;
  }

  /**
   * Gets the total number of tables in the dataset.
   * @returns {number} The number of tables.
   */
  get tablesCnt(): number {
    return this._core.tables.length;
  }

  //

  /* ~ tablesSel */

  /**
   * Gets the selected table indices.
   * @returns {number[]} An array of selected table indices.
   */
  get tablesSel(): number[] {
    return this._core.tablesSel;
  }

  /**
   * Gets references to the selected tables.
   * @returns {T[][]} A two-dimensional array of selected tables.
   */
  get tablesSelRef(): T[][] {
    return this._core.tablesSel.map((loc) => this._core.tables[loc]);
  }

  //

  /* ~ rowsSel */

  /**
   * Gets the selected row locations.
   * @returns {Loc[]} An array of selected row locations.
   */
  get rowsSel(): Loc[] {
    return this._core.rowsSel;
  }

  /**
   * Gets references to the selected rows.
   * @returns {T[]} An array of selected row values.
   */
  get rowsSelRef(): T[] {
    return this._core.rowsSel.map((loc) => this._core.tables[loc.t][loc.r]);
  }

  //

  /* ~ tables[0] (single table case) */

  /**
   * Gets the first table from the core tables.
   * **tables[0], useful for single table case**
   * @returns {T[] | undefined} The first table or undefined if no tables exist.
   */
  get table(): T[] | undefined {
    return this._core.tables[0];
  }

  /**
   * Gets the row count of the first table.
   * **tables[0], useful for single table case**
   * @returns {number | undefined} The number of rows in the first table or undefined if no tables exist.
   */
  get rowCnt(): number | undefined {
    return this._core.tables[0]?.length;
  }

  /* ~ tableSel[0] & tableSel[0] Reference, (single selection case)  */

  /**
   * Gets the selected table index if only one table is selected.
   * **table tid of tablesSel[0], useful for single selection case**
   * @returns {number | undefined} The selected table index or undefined if multiple or no tables are selected.
   */
  get tableSel(): number | undefined {
    return this._core.tablesSel.length === 1
      ? this._core.tablesSel[0]
      : undefined;
  }

  /**
   * Gets the reference to the selected table if only one table is selected.
   * **table reference of tablesSel[0], useful for single selection case**
   * @returns {T[]} The selected table or an empty array if multiple or no tables are selected.
   */
  get tableSelRef(): T[] {
    return this._core.tablesSel.length === 1
      ? this._core.tables[this._core.tablesSel[0]]
      : [];
  }

  //

  /* ~ rowSel[0] & rowSel[0] Reference, (single selection case)  */

  /**
   * Gets the selected row location if only one row is selected.
   * **Row loc of rowsSel[0], useful for single selection case**
   * @returns {Loc | undefined} The selected row location or undefined if multiple or no rows are selected.
   */
  get rowSel(): Loc | undefined {
    return this._core.rowsSel.length === 1
      ? { t: this._core.rowsSel[0].t, r: this._core.rowsSel[0].r }
      : undefined;
  }

  /**
   * Gets the reference to the selected row if only one row is selected.
   * **Row reference of rowsSel[0], useful for single selection case**
   * @returns {T | undefined} The selected row or undefined if multiple or no rows are selected.
   */
  get rowSelRef(): T | undefined {
    return this._core.rowsSel.length === 1
      ? this._core.tables[this._core.rowsSel[0].t][this._core.rowsSel[0].r]
      : undefined;
  }

  /* ~ has table / row location checker  */

  /**
   * Find table if a table exists at the given index(tid).
   * @param {number} t - The index of the table.
   * @returns {{ found: boolean; tableRef: T[] | undefined }} An object indicating whether the table exists and its reference if found.
   */
  hasTable(t: number): { found: boolean; tableRef: T[] | undefined } {
    const tableRef = this._core.tables[t];
    return { found: tableRef !== undefined, tableRef };
  }

  /**
   * Find row if a row exists at the given location(loc).
   * @param {Loc} loc - The location of the row, containing table and row indices.
   * @returns {{ found: boolean; rowRef: T | undefined }} An object indicating whether the row exists and its reference if found.
   */
  hasRow(loc: Loc): { found: boolean; rowRef: T | undefined } {
    const rowRef = this._core.tables[loc.t]?.[loc.r];
    return { found: rowRef !== undefined, rowRef };
  }

  /* ~ has table / row reference checker */

  /**
   * Find table if a given table reference exists in the core tables.
   * @param {T[]} tableRef - The reference to the table.
   * @returns {{ found: boolean; tid: Tid }} An object indicating whether the table reference exists and its index if found.
   */
  hasTableRef(tableRef: T[]): { found: boolean; tid: Tid } {
    const tid = this._core.tables.indexOf(tableRef);
    return { found: tid > -1, tid };
  }

  /**
   * Find row if a given row reference exists in any table.
   * @param {T} rowRef - The reference to the row.
   * @returns {{ found: boolean; loc: Loc; row?: T }} An object indicating whether the row reference exists, its location if found, and the row itself.
   */
  hasRowRef(rowRef: T): { found: boolean; loc: Loc; row?: T } {
    for (let t = 0; t < this._core.tables.length; t++) {
      let r = this._core.tables[t].indexOf(rowRef);
      if (r !== -1)
        return { found: true, loc: { t, r }, row: this._core.tables[t]?.[r] };
    }
    return { found: false, loc: { t: -1, r: -1 } };
  }

  /* ~ ref to indexes: Tids & Locs */

  /**
   * Converts table references to their corresponding table indices.
   * @param {T[][]} tables - An array of table references.
   * @returns {{ foundAll: boolean; tids: Tid[] }} An object indicating whether all tables were found and their corresponding indices.
   */
  tablesToTids(tables: T[][]): { foundAll: boolean; tids: Tid[] } {
    let foundAll = true;
    const tids = tables.map((table) => {
      const { found, tid: t } = this.hasTableRef(table);
      if (!found) foundAll = false;
      return t;
    });
    return { tids, foundAll };
  }

  /**
   * Converts row references to their corresponding locations.
   * @param {T[]} rows - An array of row references.
   * @returns {{ foundAll: boolean; locs: Loc[] }} An object indicating whether all rows were found and their corresponding locations.
   */
  rowsToLocs(rows: T[]): { foundAll: boolean; locs: Loc[] } {
    let foundAll = true;
    const locs = rows.map((row) => {
      const { found, loc } = this.hasRowRef(row);
      if (!found) foundAll = false;
      return loc;
    });
    return { locs, foundAll };
  }

  /* ~ sel Tids & Locs sorting */

  /**
   * Sorts the selected table indices in the specified direction.
   * @param {"forward" | "reverse"} [direction] - The sorting direction, defaults to "forward".
   * @returns {void}
   */
  sortTablesSel(direction?: "forward" | "reverse"): void {
    this._core.tablesSel.sort((a, b) =>
      direction === "reverse" ? b - a : a - b
    );
  }

  /**
   * Sorts the selected rows based on table and row indices in the specified direction.
   * @param {"forward" | "reverse"} [direction] - The sorting direction, defaults to "forward".
   * @returns {void}
   */
  sortRowsSel(direction?: "forward" | "reverse"): void {
    this._core.rowsSel.sort((a, b) => {
      if (a.t === b.t) return direction === "reverse" ? b.r - a.r : a.r - b.r;
      return direction === "reverse" ? b.t - a.t : a.t - b.t;
    });
  }

  /* ~ table & row selection */

  /**
   * Selects a table by its reference or index(tid).
   * @param {T[] | Tid} table - The table reference or index.
   * @param {{ multiMode?: MultiMode; sort?: "forward" | "reverse" }} [option] - Selection options, including multi-selection mode and sorting direction.
   * @returns {{ success: boolean }} An object indicating whether the selection was successful.
   */
  selectTable(
    table: T[] | Tid,
    option?: { multiMode?: MultiMode; sort?: "forward" | "reverse" }
  ): { success: boolean } {
    // - support table index number and table reference both
    let success = true;
    let tid: number = -1;

    if (typeof table === "number") {
      this.hasTable(table).found ? (tid = table) : (success = false);
    } else {
      const { found, tid: t } = this.hasTableRef(table);
      found ? (tid = t) : (success = false);
    }

    if (success) {
      multiSelectionLogic(tid, this._core.tablesSel, option?.multiMode);
      option?.sort && this.sortTablesSel(option.sort);
    }

    return { success };
  }

  /**
   * Selects a row by its reference or location.
   * @param {T | Loc} row - The row reference or location.
   * @param {{ multiMode?: MultiMode; sort?: "forward" | "reverse" }} [option] - Selection options, including multi-selection mode and sorting direction.
   * @returns {{ success: boolean }} An object indicating whether the selection was successful.
   */
  selectRow(
    row: T | Loc,
    option?: { multiMode?: MultiMode; sort?: "forward" | "reverse" }
  ): { success: boolean } {
    // - support row location indexes and row reference both
    let success = true;
    let loc: Loc = { t: -1, r: -1 };

    if (typeof row === "object" && row !== null && "t" in row && "r" in row) {
      this.hasRow(row).found ? (loc = row) : (success = false);
    } else {
      const { found, loc: tr } = this.hasRowRef(row);
      found ? (loc = tr) : (success = false);
    }

    if (success) {
      multiSelectionLogic(loc, this._core.rowsSel, option?.multiMode);
      option?.sort && this.sortRowsSel(option.sort);
    }

    return { success };
  }

  /* ~ mouse click select with MouseEvent key ('ctrl & 'shift') */

  /**
   * Handles table selection on mouse click with support for multi-selection modes.
   * **Only intended for frontend usage.**
   * @param {T[] | Tid} table - The table reference or index.
   * @param {MouseEvent} e - The mouse event triggering the selection.
   * @param {"forward" | "reverse"} [sort] - The sorting direction.
   * @returns {{ success: boolean }} An object indicating whether the selection was successful.
   */
  clickTable(
    table: T[] | Tid,
    e: MouseEvent,
    sort?: "forward" | "reverse"
  ): { success: boolean } {
    const multiMode: MultiMode = e.ctrlKey
      ? "additive"
      : e.shiftKey
      ? "range"
      : undefined;

    return this.selectTable(table, { multiMode, sort });
  }

  /**
   * Handles row selection on mouse click with support for multi-selection modes.
   * **Only intended for frontend usage.**
   * @param {T | Loc} row - The row reference or location.
   * @param {MouseEvent} e - The mouse event triggering the selection.
   * @param {"forward" | "reverse"} [sort] - The sorting direction.
   * @returns {{ success: boolean }} An object indicating whether the selection was successful.
   */
  clickRow(
    row: T | Loc,
    e: MouseEvent,
    sort?: "forward" | "reverse"
  ): { success: boolean } {
    const multiMode: MultiMode = e.ctrlKey
      ? "additive"
      : e.shiftKey
      ? "range"
      : undefined;

    return this.selectRow(row, { multiMode, sort });
  }

  /* ~ deselection */

  /**
   * Deselects all selected tables.
   * @returns {void}
   */
  deselectAllTable(): void {
    this._core.tablesSel.length = 0;
  }

  /**
   * Deselects all selected rows.
   * @returns {void}
   */
  deselectAllRow(): void {
    this._core.rowsSel.length = 0;
  }

  /**
   * Deselects all selected tables and rows.
   * @returns {void}
   */
  deselectAll(): void {
    this._core.rowsSel.length = 0;
    this._core.tablesSel.length = 0;
  }

  /* ~ isSelected */

  /**
   * Checks if a table with the given index is selected.
   * @param {Tid} tid - The table index.
   * @returns {boolean} True if the table is selected, otherwise false.
   */
  isSelectedTable(tid: Tid): boolean {
    return this._core.tablesSel.includes(tid);
  }

  /**
   * Checks if a row at the given location is selected.
   * @param {Loc} loc - The row location.
   * @returns {boolean} True if the row is selected, otherwise false.
   */
  isSelectedRow(loc: Loc): boolean {
    return this._core.rowsSel.some((sel) => sel.t === loc.t && sel.r === loc.r);
  }

  /**
   * Checks if a table reference is selected.
   * @param {T[]} tableRef - The table reference.
   * @returns {boolean} True if the table is selected, otherwise false.
   */
  isSelectedTableRef(tableRef: T[]): boolean {
    const { tid: t } = this.hasTableRef(tableRef);
    return this._core.tablesSel.includes(t);
  }

  /**
   * Checks if a row reference is selected.
   * @param {T} rowRef - The row reference.
   * @returns {boolean} True if the row is selected, otherwise false.
   */
  isSelectedRowRef(rowRef: T): boolean {
    const { loc } = this.hasRowRef(rowRef);
    return this._core.rowsSel.some((sel) => sel.t === loc.t && sel.r === loc.r);
  }

  /**
   * Checks if a table or row (by index or location) is selected.
   * @param {Tid | Loc} index - The table index or row location.
   * @returns {boolean} True if the table or row is selected, otherwise false.
   */
  isSelected(index: Tid | Loc): boolean {
    if (typeof index === "number") return this.isSelectedTable(index);
    else return this.isSelectedRow(index);
  }

  /* ~ isValid tids & Locs */

  /**
   * Checks if all given table IDs are valid.
   * @param {Tid[]} tids - The array of table IDs.
   * @returns {boolean} True if all table IDs are valid, otherwise false.
   */
  isValidTids(tids: Tid[]): boolean {
    // Early exit with !some() on invalid tid
    return !tids.some((tid) => !this.hasTable(tid).found);
  }

  /**
   * Checks if all given row locations are valid.
   * @param {Loc[]} locs - The array of row locations.
   * @returns {boolean} True if all row locations are valid, otherwise false.
   */
  isValidLocs(locs: Loc[]): boolean {
    // Early exit with !some() on invalid loc
    return !locs.some((loc) => !this.hasRow(loc).found);
  }

  /**
   * Manipulates rows based on selection and placement rules.
   * @see rows (full documentation in main implementation)
   */
  rows(
    source?: T[],
    target?: {
      select?: "tables" | "rows" | Tid[] | Loc[];
      which?: "top" | "all" | "bottom";
      place?: "above" | "replace" | "below";
      changeSel?: boolean;
      useClone?: boolean;
    }
  ): { success: boolean };

  /**
   * Modifies rows or creates new tables based on placement rules.
   * @see rows (full documentation in main implementation)
   */
  rows(
    source: T[],
    target?: {
      select?: "tables" | Tid[];
      which?: "top" | "all" | "bottom";
      place?: "newTableAbove" | "newTableBelow";
      changeSel?: boolean;
      useClone?: boolean;
    }
  ): { success: boolean };

  /**
   * Manipulates rows within tables based on selection criteria and placement rules.
   * @param {T[]} [source] - The source rows to be added or modified.
   * @param {Object} [target] - The target configuration for row manipulation.
   * @param {"tables" | "rows" | Tid[] | Loc[]} [target.select] - Selection mode or specific IDs/locations.
   * @param {"top" | "all" | "bottom"} [target.which] - Determines which rows are affected.
   * @param {"newTableAbove" | "above" | "replace" | "below" | "newTableBelow"} [target.place] - Placement of rows.
   * @param {boolean} [target.changeSel] - Whether to update selection.
   * @param {boolean} [target.useClone] - Whether to use `structuredClone()` for deep copying when adding or modifying rows.
   * @returns {{ success: boolean }} True if operation was successful.
   */
  rows(
    source?: T[],
    target?: {
      select?: "tables" | "rows" | Tid[] | Loc[]; // - default: newTable
      which?: "top" | "all" | "bottom"; // - default: bottom
      place?: "newTableAbove" | "above" | "replace" | "below" | "newTableBelow"; // - default: below
      changeSel?: boolean;
      useClone?: boolean;
    }
  ): { success: boolean } {
    const { tables, tablesSel, rowsSel } = this._core;

    // - default value when params undefined
    const select = target?.select;
    const which = target?.which ?? "bottom";
    const place = target?.place ?? "below";
    const useClone = target?.useClone ?? this._useClone;
    const changeSel = target?.changeSel ?? false;

    // - params validate for pure js
    const validWhichs = ["top", "all", "bottom"];
    const validPlaces = [
      "newTableAbove",
      "above",
      "replace",
      "below",
      "newTableBelow",
    ];

    if (!validWhichs.includes(which)) {
      paramNotAllow(which, `undefined ${validWhichs.join(" | ")}`);
    }

    if (!validPlaces.includes(place)) {
      paramNotAllow(place, `undefined ${validPlaces.join(" | ")}`);
    }

    // - targets
    let tids: number[] = [];
    let locs: Loc[] = [];

    // - [ select ] tables or rows
    if (select === undefined) {
      // - select is undefined means use  shift or push table mode,
      // - no tids or locs param input,
      // - and base on place to define add new table to above or below
      if (place === "newTableAbove") {
        // - shift table
        tids = [0];
      } else if (place === "newTableBelow") {
        // - push table
        tids = [tables.length - 1];
      }
      //
    } else if (select === "tables") {
      //
      tids = [...tablesSel];
      //
    } else if (select === "rows") {
      //
      locs = [...rowsSel];
      //
    } else if (Array.isArray(select) && select.length > 0) {
      // check
      if (typeof select[0] === "number") {
        this.isValidTids(select as Tid[]) && (tids = select as Tid[]);
      } else {
        this.isValidLocs(select as Loc[]) && (locs = select as Loc[]);
      }
      //
    } else if (typeof select === "string") {
      //
      paramNotAllow(select, `undefined | "tables" | "rows" | Tid[] | Loc[]`);
      //
    }

    // - [ which ] tables or rows are targeted when multi selected
    if (tids.length > 0) {
      //
      tids = whichSel(tids, tidsSort, which);
      //
    } else if (locs.length > 0) {
      //
      locs = whichSel(locs, locsSort, which);
      //
    } else {
      // -  tids & locs both empty
      console.log("no target selected or some of tid/loc invalid");
      return { success: false };
      //
    }

    // - backup the reference of selected items (before deleting)
    // - for renew tablesSel & rowsSel indexes
    this._oldSelRef.tables = this.tablesSelRef;
    this._oldSelRef.rows = this.rowsSelRef;

    // - clear buffer
    this._newSelRef.rows.length = 0;
    this._newSelRef.tables.length = 0;

    if (tids.length > 0) {
      // - by tables tid

      tids = tidsSort(tids, "reverse");

      // - editting
      tids.forEach((tid) => {
        //
        const rows = useClone ? structuredClone(source) : source;

        if (rows !== undefined) {
          // - add rows -> add rows to table

          if (place === "above" || place === "replace" || place === "below") {
            // - to exist table

            // - new rows location setup
            // - if place is below, rid set to the bottom index of the table
            const tableLength = tables[tid]?.length ?? 0;
            const rid = place === "below" ? tableLength : 0;

            // - replace table so del all rows
            place === "replace" && (tables[tid].length = 0);

            // - add rows to the table
            rows.forEach((row, i) => {
              tables[tid].splice(rid + i, 0, row);
              this._newSelRef.rows.push(tables[tid][rid + i]); // - new rowsSel
            });
            //
          } else if (place === "newTableAbove" || place === "newTableBelow") {
            // - to new table

            // - insert new table to below
            place === "newTableBelow" && (tid = tid + 1);

            // - add a empty table
            tables.splice(tid, 0, rows);
            for (let i = 0; i < rows.length; i++)
              this._newSelRef.rows.push(tables[tid][i]);

            //
          }

          this._newSelRef.tables.push(tables[tid]);

          //
        } else {
          // - no rows -> deletion

          if (place === "replace") {
            // - replace = delete table
            tables.splice(tid, 1);
            // * remarks: delete table no changeSel function
          } else if (place === "above") {
            // - above = shift row
            tables[tid].splice(0, 1);
            this._newSelRef.tables.push(tables[tid]);
          } else if (place === "below") {
            // - below = pop row
            tables[tid].splice(tables[tid].length - 1, 1);
            this._newSelRef.tables.push(tables[tid]);
          }

          //
        }

        //
      });

      //
    } else if (locs.length > 0) {
      // - by rows loc

      locs = locsSort(locs, "reverse");

      // - edit row in specified rows location
      locs.forEach((loc) => {
        const rows = source
          ? useClone
            ? structuredClone(source)
            : source
          : [];

        if (rows.length > 0) {
          // - each row edit and save the reference for new rowsSel
          if (place === "below") loc.r++;

          rows.forEach((row, i) => {
            tables[loc.t].splice(loc.r + i, place === "replace" ? 1 : 0, row);
            this._newSelRef.rows.push(tables[loc.t][loc.r + i]); // - new rowsSel
          });
        } else {
          // - del row
          tables[loc.t].splice(loc.r, 1);
          // * remarks: delete row no changeSel function
        }
      });

      this._newSelRef.tables.push(...this.tablesSelRef); // - tablesSel not change
      //
    }

    // - update tablesSel & rowsSel
    this._updateTableSel(changeSel);
    this._updateRowSel(changeSel);

    //
    return { success: true };
  }

  //
}

/**
 * Sorts an array of locations (`Loc`) by table ID (`t`) and row index (`r`).
 * @param {Loc[]} locs - The array of locations to sort.
 * @param {"reverse"} [mode] - If `"reverse"`, the sorted array will be reversed.
 * @returns {Loc[]} A new sorted array of locations.
 */
export function locsSort(locs: Loc[], mode?: "reverse"): Loc[] {
  const sortedLocs = [...locs].sort((a, b) =>
    a.t === b.t ? a.r - b.r : a.t - b.t
  );
  return mode === "reverse" ? sortedLocs.reverse() : sortedLocs;
}

/**
 * Sorts an array of table IDs (`Tid`).
 * @param {Tid[]} tid - The array of table IDs to sort.
 * @param {"reverse"} [mode] - If `"reverse"`, the sorted array will be reversed.
 * @returns {Tid[]} A new sorted array.
 */
export function tidsSort(tid: Tid[], mode?: "reverse"): Tid[] {
  const sortedNums = [...tid].sort((a, b) => a - b);
  return mode === "reverse" ? sortedNums.reverse() : sortedNums;
}

/**
 * Filters selected items based on position criteria.
 * @template S - Selection type (`Tid` or `Loc`).
 * @param {S[]} sel - The selected items.
 * @param {(arr: S[]) => S[]} sortFn - Function to sort the selection array.
 * @param {"top" | "all" | "bottom"} [which] - Selection criteria.
 * @returns {S[]} The filtered selection.
 */
function whichSel<S extends Tid | Loc>(
  sel: S[],
  sortFn: (arr: S[]) => S[],
  which?: "top" | "all" | "bottom"
): S[] {
  if (which === undefined || which === "all") {
    //
    return sel;
    //
  } else if (which === "top") {
    //
    const item = sortFn(sel).at(0);
    return item !== undefined ? [item] : [];
    //
  } else if (which === "bottom") {
    //
    const item = sortFn(sel).at(sel.length - 1);
    return item !== undefined ? [item] : [];
    //
  } else {
    paramNotAllow(which, `undefined | "top" | "all" | "bottom"`);
    return [];
  }
}

/**
 * Throws an error if the provided parameter is not allowed.
 * @param {string | undefined} param - The invalid parameter.
 * @param {string} allowedParams - A string describing the valid parameters.
 * @throws {Error}  Always throws an error indicating the valid parameters.
 * @returns {void}
 */
function paramNotAllow(param: string | undefined, allowedParams: string): void {
  throw new Error(`Param '${param}' not allow. Valid param: ${allowedParams} `);
}

/**
 * Handles multi-selection logic based on the given mode.
 * @template L - The selection type, either a table ID (`number`) or a row location (`Loc`).
 * @param {L} index - The current selection target.
 * @param {L[]} sel - The array of selected items.
 * @param {MultiMode} [multiMode] - The multi-selection mode (`additive`, `range`, or `undefined` for single selection).
 * @returns {void}
 */
function multiSelectionLogic<L extends Tid | Loc>(
  index: L,
  sel: L[],
  multiMode?: MultiMode
): void {
  // ~ Search loc in sel[] and return the array index; if not found, return -1
  // ~ (i > -1) means the selected item was already selected before

  const i = sel.findIndex((s) =>
    typeof index === "number"
      ? index === s
      : (index as Loc).t === (s as Loc).t && (index as Loc).r === (s as Loc).r
  );

  if (multiMode === undefined) {
    //
    if (i > -1) {
      if (sel.length > 1) {
        // - Multiple items were selected before; clear all and select the new one
        sel.length = 0;
        sel.push(index);
      } else {
        // - single selected before, clear
        sel.length = 0;
      }
    } else {
      sel.length = 0;
      sel.push(index);
    }
    //
  } else if (multiMode === "additive") {
    //
    i > -1 ? sel.splice(i, 1) : sel.push(index);
    //
  } else if (multiMode === "range") {
    //
    if (i > -1) {
      // - ( The item was selected before )
      if (sel.length > 1) {
        // - Multiple items were selected before; clear all and select the new one
        sel.length = 0;
        sel.push(index);
      } else {
        // - A single item was selected before; clear selection
        sel.length = 0;
      }
    } else {
      // - ( The item was not selected )
      if (sel.length === 0) {
        // - The selection array is empty; add the item
        sel.push(index);
        //
      } else if (sel.length > 1) {
        // - Multiple items were selected before; reset selection and select the new one
        sel.length = 0;
        sel.push(index);
        //
      } else if (sel.length === 1) {
        // - Only one item was selected before

        if (typeof index === "number") {
          // - Selection is a table
          const firstSelected = sel[0] as number;
          const currentSelected = index as number;

          sel.length = 0;

          const startTable = Math.min(firstSelected, currentSelected);
          const endTable = Math.max(firstSelected, currentSelected);

          for (let t = startTable; t <= endTable; t++) {
            (sel as number[]).push(t);
          }
          //
        } else {
          // - Selection is a row
          const firstLoc = sel[0] as Loc;
          const currentLoc = index as Loc;

          sel.length = 0;

          if (firstLoc.t === currentLoc.t) {
            // - Selection is within the same table; select the range of rows
            const startRow = Math.min(firstLoc.r, currentLoc.r);
            const endRow = Math.max(firstLoc.r, currentLoc.r);

            for (let r = startRow; r <= endRow; r++) {
              (sel as Loc[]).push({ t: firstLoc.t, r });
            }
          } else {
            // - Selection spans multiple tables; select only the new item
            sel.push(index);
          }
          //
        }
        //
      }
    }
    //
  }
}
