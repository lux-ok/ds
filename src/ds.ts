import type { DsCore, Loc, Tid, MultiMode } from "./type";

/**
 * Class Ds
 *
 * @export
 * @class Ds
 * @template T
 * @template {object} T
 */
export class Ds<T extends object> {
  /**
   * Creates an instance of Ds.
   * @param {{ dsCore: DsCore<T>; useClone?: boolean }} params
   * @memberof Ds
   */
  constructor(params: { core: DsCore<T>; useClone?: boolean }) {
    this.core = params.core;
    this.#useClone = params.useClone ?? true; // - default use structureClone()
    console.log("Ds Version:", this.#version);
  }

  /* ~ private vars */

  protected core: DsCore<T>;
  #version = "0.2.2";
  #useClone?: boolean;
  #oldSelRef: { tables: T[][]; rows: T[] } = { tables: [], rows: [] };
  #newSelRef: { tables: T[][]; rows: T[] } = { tables: [], rows: [] };

  /* ~ private utils */

  protected log(msg: string, func?: string) {
    console.log(func ? func + ": " + msg : msg);
  }

  #updateTableSel(changeSel?: boolean) {
    const buf: T[][] = changeSel
      ? this.#newSelRef.tables
      : this.#oldSelRef.tables;
    this.core.tablesSel.length = 0;
    buf.forEach((table) => {
      const { found, tid: t } = this.hasTableRef(table);
      found && this.core.tablesSel.push(t);
    });
    buf.length = 0;
  }

  #updateRowSel(changeSel?: boolean) {
    const buf: T[] = changeSel ? this.#newSelRef.rows : this.#oldSelRef.rows;
    this.core.rowsSel.length = 0;
    buf.forEach((row) => {
      const { found, loc } = this.hasRowRef(row);
      found && this.core.rowsSel.push(loc);
    });
    buf.length = 0;
  }

  /**
   * Print this library version
   *
   * @readonly
   * @memberof Ds
   */
  get version() {
    return this.#version;
  }

  /* ~ tables */

  /**
   * Tables
   *
   * @readonly
   * @type {T[][]}
   * @memberof Ds
   */
  get tables(): T[][] {
    return this.core.tables;
  }

  /**
   * TablesCnt
   *
   * @readonly
   * @type {number}
   * @memberof Ds
   */
  get tablesCnt(): number {
    return this.core.tables.length;
  }

  /* ~ tablesSel */

  /**
   * Selected tables tids
   *
   * @readonly
   * @memberof Ds
   */
  get tablesSel() {
    return this.core.tablesSel;
  }

  /**
   * Selected tables reference
   *
   * @readonly
   * @memberof Ds
   */
  get tablesSelRef() {
    return this.core.tablesSel.map((loc) => this.core.tables[loc]);
  }

  /* ~ rowsSel */

  /**
   * Selected rows locs
   *
   * @readonly
   * @memberof Ds
   */
  get rowsSel() {
    return this.core.rowsSel;
  }

  /**
   * Selected rows reference
   *
   * @readonly
   * @memberof Ds
   */
  get rowsSelRef() {
    return this.core.rowsSel.map((loc) => this.core.tables[loc.t][loc.r]);
  }

  /* ~ table0 (single table case) */
  /**
   * Table (single table case)
   *
   * @readonly
   * @type {(T[] | undefined)}
   * @memberof Ds
   */
  get table(): T[] | undefined {
    return this.core.tables[0];
  }

  /**
   * Table rows count (single table case)
   *
   * @readonly
   * @type {(number | undefined)}
   * @memberof Ds
   */
  get rowCnt(): number | undefined {
    return this.core.tables[0]?.length;
  }

  /* ~ get tableSel[0] & tableSel[0] Reference, (single selection case)  */

  /**
   * Selected tables tid (single selection case)
   *
   * @readonly
   * @type {(number | undefined)}
   * @memberof Ds
   */
  get tableSel(): number | undefined {
    return this.core.tablesSel.length === 1
      ? this.core.tablesSel[0]
      : undefined;
  }

  /**
   * Selected table reference (single selection case)
   *
   * @readonly
   * @type {T[]}
   * @memberof Ds
   */
  get tableSelRef(): T[] {
    return this.core.tablesSel.length === 1
      ? this.core.tables[this.core.tablesSel[0]]
      : [];
  }

  /* ~ get rowSel[0] & rowSel[0] Reference, (single selection case)  */

  /**
   * Selected row loc (single selection case)
   *
   * @readonly
   * @type {(Loc | undefined)}
   * @memberof Ds
   */
  get rowSel(): Loc | undefined {
    return this.core.rowsSel.length === 1
      ? { t: this.core.rowsSel[0].t, r: this.core.rowsSel[0].r }
      : undefined;
  }

  /**
   * Selected row reference (single selection case)
   *
   * @readonly
   * @type {(T | undefined)}
   * @memberof Ds
   */
  get rowSelRef(): T | undefined {
    return this.core.rowsSel.length === 1
      ? this.core.tables[this.core.rowsSel[0].t][this.core.rowsSel[0].r]
      : undefined;
  }

  /* ~ has table / row location checker  */

  /**
   * Find tid and return table reference
   *
   * @param {number} t
   * @return {*}  {({ found: boolean; tableRef: T[] | undefined })}
   * @memberof Ds
   */
  hasTable(t: number): { found: boolean; tableRef: T[] | undefined } {
    const tableRef = this.core.tables[t];
    return { found: tableRef !== undefined, tableRef };
  }

  /**
   * Find loc and return row reference
   *
   * @param {Loc} loc
   * @return {*}  {({ found: boolean; rowRef: T | undefined })}
   * @memberof Ds
   */
  hasRow(loc: Loc): { found: boolean; rowRef: T | undefined } {
    const rowRef = this.core.tables[loc.t]?.[loc.r];
    return { found: rowRef !== undefined, rowRef };
  }

  /* ~ has table / row reference checker */

  /**
   * Find table reference and return tid
   *
   * @param {T[]} tableRef
   * @return {*}  {{ found: boolean; tid: number }}
   * @memberof Ds
   */
  hasTableRef(tableRef: T[]): { found: boolean; tid: number } {
    const tid = this.core.tables.indexOf(tableRef);
    return { found: tid > -1, tid };
  }

  /**
   * Find row reference and return loc
   *
   * @param {T} rowRef
   * @return {*}  {{ found: boolean; loc: Loc; row?: T }}
   * @memberof Ds
   */
  hasRowRef(rowRef: T): { found: boolean; loc: Loc; row?: T } {
    for (let t = 0; t < this.core.tables.length; t++) {
      let r = this.core.tables[t].indexOf(rowRef);
      if (r !== -1)
        return { found: true, loc: { t, r }, row: this.core.tables[t]?.[r] };
    }
    return { found: false, loc: { t: -1, r: -1 } };
  }

  /* ~ ref to indexes: Tids & Locs */

  /**
   * Tables reference convert to Tids
   *
   * @param {T[][]} tables
   * @return {*}  {{ foundAll: boolean; tids: number[] }}
   * @memberof Ds
   */
  tablesToTids(tables: T[][]): { foundAll: boolean; tids: number[] } {
    let foundAll = true;
    const tids = tables.map((table) => {
      const { found, tid: t } = this.hasTableRef(table);
      if (!found) foundAll = false;
      return t;
    });
    return { tids, foundAll };
  }

  /**
   * Rows reference convert to Locs
   *
   * @param {T[]} rows
   * @return {*}  {{ foundAll: boolean; locs: Loc[] }}
   * @memberof Ds
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
   * Selected tables sorting
   *
   * @param {('forward' | 'reverse')} [direction]
   * @memberof Ds
   */
  sortTablesSel(direction?: "forward" | "reverse") {
    this.core.tablesSel.sort((a, b) =>
      direction === "reverse" ? b - a : a - b
    );
  }

  /**
   * Selected Rows sorting
   *
   * @param {('forward' | 'reverse')} [direction]
   * @memberof Ds
   */
  sortRowsSel(direction?: "forward" | "reverse") {
    this.core.rowsSel.sort((a, b) => {
      if (a.t === b.t) return direction === "reverse" ? b.r - a.r : a.r - b.r;
      return direction === "reverse" ? b.t - a.t : a.t - b.t;
    });
  }

  /* ~ table & row selection */

  /**
   * Table selection
   *
   * @param {(T[] | number)} table
   * @param {({ multiMode?: MultiMode; sort?: 'forward' | 'reverse' })} [option]
   * @return {*}  {{ success: boolean }}
   * @memberof Ds
   */
  selectTable(
    table: T[] | number,
    option?: { multiMode?: MultiMode; sort?: "forward" | "reverse" }
  ): { success: boolean } {
    // - support table index number and table reference both
    let success = true;
    let loc: number = -1;

    if (typeof table === "number") {
      this.hasTable(table).found ? (loc = table) : (success = false);
    } else {
      const { found, tid: t } = this.hasTableRef(table);
      found ? (loc = t) : (success = false);
    }

    if (success) {
      multiSelectionLogic(loc, this.core.tablesSel, option?.multiMode);
      option?.sort && this.sortTablesSel(option.sort);
    }

    return { success };
  }

  /**
   * Row selection
   *
   * @param {(T | Loc)} row
   * @param {({ multiMode?: MultiMode; sort?: 'forward' | 'reverse' })} [option]
   * @return {*}  {{ success: boolean }}
   * @memberof Ds
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
      multiSelectionLogic(loc, this.core.rowsSel, option?.multiMode);
      option?.sort && this.sortRowsSel(option.sort);
    }

    return { success };
  }

  /* ~ mouse click select with MouseEvent key ('ctrl & 'shift') */

  /**
   * Mouse click table selection
   *
   * @param {(T[] | number)} table
   * @param {MouseEvent} e
   * @param {('forward' | 'reverse')} [sort]
   * @return {*}  {{ success: boolean }}
   * @memberof Ds
   */
  clickTable(
    table: T[] | number,
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
   * Mouse click row selection
   *
   * @param {(T | Loc)} row
   * @param {MouseEvent} e
   * @param {('forward' | 'reverse')} [sort]
   * @return {*}  {{ success: boolean }}
   * @memberof Ds
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
   * Deselect all selected tables
   *
   * @memberof Ds
   */
  deselectAllTable() {
    this.core.tablesSel.length = 0;
  }

  /**
   * Deselect all selected rows
   *
   * @memberof Ds
   */
  deselectAllRow() {
    this.core.rowsSel.length = 0;
  }

  /**
   * Deselect all selected tables & rows
   *
   * @memberof Ds
   */
  deselectAll() {
    this.core.rowsSel.length = 0;
    this.core.tablesSel.length = 0;
  }

  /* ~ isSelected */

  /**
   * @param {number} t
   * @return {*}  {boolean}
   * @memberof Ds
   */
  isSelectedTable(t: number): boolean {
    return this.core.tablesSel.includes(t);
  }

  /**
   * @param {Loc} loc
   * @return {*}  {boolean}
   * @memberof Ds
   */
  isSelectedRow(loc: Loc): boolean {
    return this.core.rowsSel.some((sel) => sel.t === loc.t && sel.r === loc.r);
  }

  /**
   * @param {T[]} tableRef
   * @return {*}  {boolean}
   * @memberof Ds
   */
  isSelectedTableRef(tableRef: T[]): boolean {
    const { tid: t } = this.hasTableRef(tableRef);
    return this.core.tablesSel.includes(t);
  }

  /**
   * @param {T} rowRef
   * @return {*}  {boolean}
   * @memberof Ds
   */
  isSelectedRowRef(rowRef: T): boolean {
    const { loc } = this.hasRowRef(rowRef);
    return this.core.rowsSel.some((sel) => sel.t === loc.t && sel.r === loc.r);
  }

  /**
   * function signature for new rows
   * add rows，replace rows, del rows, replace all rows of existing tables
   *
   * @param {T[]} [source]
   * @param {({
   * 			select?: 'tables' | 'rows' | Tid[] | Loc[];
   * 			which?: 'top' | 'all' | 'bottom';
   * 			place?: 'above' | 'replace' | 'below';
   * 			changeSel?: boolean;
   * 			useClone?: boolean;
   * 		})} [target]
   * @return {*}  {{ success: boolean }}
   * @memberof Ds
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
   * function signature for new tables: new table above, new table above
   *
   * @param {T[]} source
   * @param {({
   * 			select?: 'tables' | Tid[];
   * 			which?: 'top' | 'all' | 'bottom';
   * 			place?: 'newTableAbove' | 'newTableBelow';
   * 			changeSel?: boolean;
   * 			useClone?: boolean;
   * 		})} [target]
   * @return {*}  {{ success: boolean }}
   * @memberof Ds
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
   * Main function of rows control
   *
   * @param {T[]} [source]
   * @param {({
   * 			select?: 'tables' | 'rows' | Tid[] | Loc[];
   * 			which?: 'top' | 'all' | 'bottom';
   * 			place?: 'newTableAbove' | 'above' | 'replace' | 'below' | 'newTableBelow';
   * 			changeSel?: boolean;
   * 			useClone?: boolean;
   * 		})} [target]
   * @return {*}  {{ success: boolean }}
   * @memberof Ds
   *
   * params default: 'newTable', 'bottom', 'below'
   *
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
    const { tables, tablesSel, rowsSel } = this.core;

    // - default value when params undefined
    const select = target?.select;
    const which = target?.which ?? "bottom";
    const place = target?.place ?? "below";
    const useClone = target?.useClone ?? this.#useClone;
    const changeSel = target?.changeSel ?? false;

    // - targets
    let tids: number[] = [];
    let locs: Loc[] = [];

    // - [ select ] tables or rows
    if (select === "tables") {
      //
      tids = [...tablesSel];
      //
    } else if (select === "rows") {
      //
      locs = [...rowsSel];
      //
    } else if (Array.isArray(select) && select.length > 0) {
      //
      typeof select[0] === "number"
        ? (select as Tid[]).some((t) => t < -1 || t > tables.length) ||
          (tids = select as Tid[])
        : (select as Loc[]).some((l) => !this.hasRow(l).found) ||
          (locs = select as Loc[]);
      //
    } else if (select === undefined) {
      // - new table issuse, can be no tids or locs, predefine push new table to above or below
      if (place === "newTableAbove") {
        tids = [0];
      } else if (place === "newTableBelow") {
        tids = [tables.length - 1];
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
    this.#oldSelRef.tables = this.tablesSelRef;
    this.#oldSelRef.rows = this.rowsSelRef;

    // - clear buffer
    this.#newSelRef.rows.length = 0;
    this.#newSelRef.tables.length = 0;

    if (tids.length > 0) {
      // - by tables tid

      tids = tidsSort(tids, "reverse");

      // - editting
      tids.forEach((tid) => {
        //
        // const rows = source ? (useClone ? structuredClone(source) : source) : [];
        const rows = useClone ? structuredClone(source) : source;

        // if (rows.length > 0) {
        if (rows !== undefined) {
          // - add rows -> add rows to table

          if (place === "above" || place === "replace" || place === "below") {
            // - to exist table

            // - new rows location setup
            // - if place === below, rid set to the bottom index of the table
            const tableLength = tables[tid]?.length ?? 0;
            const rid = place === "below" ? tableLength : 0;

            // - replace table so del all rows
            place === "replace" && (tables[tid].length = 0);

            // - add rows to the table
            rows.forEach((row, i) => {
              tables[tid].splice(rid + i, 0, row);
              this.#newSelRef.rows.push(tables[tid][rid + i]); // - new rowsSel
            });
            //
          } else if (place === "newTableAbove" || place === "newTableBelow") {
            // - to new table

            // - insert new table to below
            place === "newTableBelow" && (tid = tid + 1);

            // - add a empty table
            tables.splice(tid, 0, rows);
            for (let i = 0; i < rows.length; i++)
              this.#newSelRef.rows.push(tables[tid][i]);

            //
          } else {
            paramNotAllow(
              place,
              `undefined | "newTableAbove" | "above" | "replace" | "below" | "newTableBelow"`
            );
          }

          //
        } else {
          // - no rows -> del table

          // check
          if (place === "replace") {
            tables.splice(tid, 1);
          } else {
            let rid: number;

            if (place === "above") {
              // - above
              rid = 0;
            } else {
              // - below
              rid = tables[tid].length - 1;
            }

            tables[tid].splice(rid, 1);
          }

          //
        }

        this.#newSelRef.tables.push(tables[tid]); // check: - new tablesSel

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
            this.#newSelRef.rows.push(tables[loc.t][loc.r + i]); // - new rowsSel
          });
        } else {
          // - del rows
          tables[loc.t].splice(loc.r, 1);
        }
      });

      this.#newSelRef.tables.push(...this.tablesSelRef); // - tablesSel not change
      //
    }

    // - update tablesSel & rowsSel
    this.#updateTableSel(changeSel);
    this.#updateRowSel(changeSel);

    //
    return { success: true };
  }

  //
}

/**
 * Locs array sorting
 *
 * @export
 * @param {Loc[]} locs
 * @param {'reverse'} [mode]
 * @return {*}  {Loc[]}
 */
export function locsSort(locs: Loc[], mode?: "reverse"): Loc[] {
  const sortedLocs = [...locs].sort((a, b) =>
    a.t === b.t ? a.r - b.r : a.t - b.t
  );
  return mode === "reverse" ? sortedLocs.reverse() : sortedLocs;
}

/**
 * Tids array sorting
 *
 * @export
 * @param {number[]} num
 * @param {'reverse'} [mode]
 * @return {*}  {number[]}
 */
export function tidsSort(num: number[], mode?: "reverse"): number[] {
  const sortedNums = [...num].sort((a, b) => a - b);
  return mode === "reverse" ? sortedNums.reverse() : sortedNums;
}

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

function paramNotAllow(param: string | undefined, allowedParams: string) {
  throw new Error(`Param '${param}' not allow. Valid param: ${allowedParams} `);
}

function multiSelectionLogic<L extends number | Loc>(
  loc: L,
  sel: L[],
  multiMode?: MultiMode
) {
  // ~ search loc in sel[] and return array index, if not found return -1
  const i = sel.findIndex((s) =>
    typeof loc === "number"
      ? loc === s
      : (loc as Loc).t === (s as Loc).t && (loc as Loc).r === (s as Loc).r
  );

  // ~ ( i > -1 ) meaning is the select item already selected before

  if (multiMode === undefined) {
    //
    if (i > -1) {
      if (sel.length > 1) {
        // - multi selected before, clear all and select the new one
        sel.length = 0;
        sel.push(loc);
      } else {
        // - single selected before, clear
        sel.length = 0;
      }
    } else {
      sel.length = 0;
      sel.push(loc);
    }
    //
  } else if (multiMode === "additive") {
    //
    i > -1 ? sel.splice(i, 1) : sel.push(loc);
    //
  } else if (multiMode === "range") {
    //
    if (i > -1) {
      // - ( loc is selected before )
      if (sel.length > 1) {
        // - multi selected before, clear all and select the new one
        sel.length = 0;
        sel.push(loc);
      } else {
        // - single selected before, clear
        sel.length = 0;
      }
    } else {
      // - ( loc is not selected )
      if (sel.length === 0) {
        // - sel array is empty
        sel.push(loc);
        //
      } else if (sel.length > 1) {
        // - sel array has more then one selected
        sel.length = 0;
        sel.push(loc);
        //
      } else if (sel.length === 1) {
        // - sel array has only one selected
        //
        if (typeof loc === "number") {
          // - is table
          const firstSelected = sel[0] as number;
          const currentSelected = loc as number;

          sel.length = 0;

          const startTable = Math.min(firstSelected, currentSelected);
          const endTable = Math.max(firstSelected, currentSelected);

          for (let t = startTable; t <= endTable; t++) {
            (sel as number[]).push(t);
          }
          //
        } else {
          // - is row
          const firstLoc = sel[0] as Loc;
          const currentLoc = loc as Loc;

          sel.length = 0;

          if (firstLoc.t === currentLoc.t) {
            const startRow = Math.min(firstLoc.r, currentLoc.r);
            const endRow = Math.max(firstLoc.r, currentLoc.r);

            for (let r = startRow; r <= endRow; r++) {
              (sel as Loc[]).push({ t: firstLoc.t, r });
            }
          } else {
            sel.push(loc);
          }
          //
        }
        //
      }
    }
    //
  }
}
