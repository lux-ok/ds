import { Ds } from "../ds";
import { Dsm } from "../dsm";
import type { Loc, Tid } from "../type";
import { singleRowSelection, singleTableSelection } from "./util";

/**
 * Adds multiple new rows to the dataset.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T[]} source - The array of rows to be added.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | "rows" | Tid[] | Loc[]} [target.select] - Specifies the selection scope. Defaults to `"rows"`.
 * @param {"top" | "all" | "bottom"} [target.which] - Determines where the new rows are applied. Defaults to `"bottom"`.
 * @param {"above" | "replace" | "below"} [target.place] - Specifies the placement of the new rows. Defaults to `"below"`.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the source rows before adding.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function newRows<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T[],
  target?: {
    select?: "tables" | "rows" | Tid[] | Loc[];
    which?: "top" | "all" | "bottom";
    place?: "above" | "replace" | "below";
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  return ds.rows(source, {
    select: target?.select ?? "rows", // - default: rows
    which: target?.which ?? "bottom", // - default: bottom
    place: target?.place ?? "below", // - default: below
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

/**
 * Adds a single new row to the dataset.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T} source - The row to be added.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | "rows" | Tid[] | Loc[]} [target.select] - Specifies the selection scope. Defaults to `"rows"`.
 * @param {"top" | "all" | "bottom"} [target.which] - Determines where the new row is applied. Defaults to `"bottom"`.
 * @param {"above" | "replace" | "below"} [target.place] - Specifies the placement of the new row. Defaults to `"below"`.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the source row before adding.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function newRow<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T,
  target?: {
    select?: "tables" | "rows" | Tid[] | Loc[];
    which?: "top" | "all" | "bottom";
    place?: "above" | "replace" | "below";
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  return ds.rows([source], {
    select: target?.select ?? "rows", // - default: rows
    which: target?.which ?? "bottom", // - default: bottom
    place: target?.place ?? "below", // - default: below
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

//

/**
 * Adds multiple new rows above the selected rows.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T[]} source - The array of rows to be added.
 * @param {Object} [target] - Optional target configuration.
 * @param {"rows" | Loc[]} [target.select] - Specifies the selection scope. Defaults to `"rows"`.
 * @param {"top" | "all" | "bottom"} [target.which] - Determines where the new rows are applied. Defaults to `"all"`.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the source rows before adding.
 * @returns {{ success: boolean }} - The result of the operation.
 */

export function addRowsAbove<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T[],
  target?: {
    select?: "rows" | Loc[];
    which?: "top" | "all" | "bottom";
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  return ds.rows(source, {
    select: target?.select ?? "rows", // - default: rows
    which: target?.which ?? "all", // - default: all
    place: "above",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

/**
 * Adds a single new row above the selected row.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T} source - The row to be added.
 * @param {Object} [target] - Optional target configuration.
 * @param {"rows" | Loc | T} [target.select] - Specifies the selection scope.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the source row before adding.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function addRowAbove<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T,
  target?: {
    select?: "rows" | Loc | T;
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  const loc = singleRowSelection(ds, target?.select);

  if (loc === undefined) {
    console.log("Please select one/single row");
    return { success: false };
  }

  return ds.rows([source], {
    select: [loc],
    place: "above",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

//

/**
 * Adds multiple new rows below the selected rows.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T[]} source - The array of rows to be added.
 * @param {Object} [target] - Optional target configuration.
 * @param {"rows" | Loc[]} [target.select] - Specifies the selection scope. Defaults to `"rows"`.
 * @param {"top" | "all" | "bottom"} [target.which] - Determines where the new rows are applied. Defaults to `"all"`.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the source rows before adding.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function addRowsBelow<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T[],
  target?: {
    select?: "rows" | Loc[];
    which?: "top" | "all" | "bottom";
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  return ds.rows(source, {
    select: target?.select ?? "rows", // - default: rows
    which: target?.which ?? "all", // - default: all
    place: "below",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

/**
 * Adds a single new row below the selected row.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T} source - The row to be added.
 * @param {Object} [target] - Optional target configuration.
 * @param {"rows" | Loc | T} [target.select] - Specifies the selection scope.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the source row before adding.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function addRowBelow<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T,
  target?: {
    select?: "rows" | Loc | T;
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  const loc = singleRowSelection(ds, target?.select);

  if (loc === undefined) {
    console.log("Please select one/single row");
    return { success: false };
  }

  return ds.rows([source], {
    select: [loc],
    place: "below",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

//

/**
 * Replaces multiple rows with new data.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T[]} source - The array of rows to replace the existing rows.
 * @param {Object} [target] - Optional target configuration.
 * @param {"rows" | Loc[]} [target.select] - Specifies the selection scope. Defaults to `"rows"`.
 * @param {"top" | "all" | "bottom"} [target.which] - Determines which rows to replace. Defaults to `"all"`.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the source rows before replacing.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function setRows<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T[],
  target?: {
    select?: "rows" | Loc[];
    which?: "top" | "all" | "bottom";
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  return ds.rows(source, {
    select: target?.select ?? "rows", // - default: rows
    which: target?.which ?? "all", // - default: all
    place: "replace",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

/**
 * Replaces a single row with new data.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T} source - The row to replace the existing row.
 * @param {Object} [target] - Optional target configuration.
 * @param {"rows" | Loc | T} [target.select] - Specifies the selection scope.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the source row before replacing.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function setRow<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T,
  target?: {
    select?: "rows" | Loc | T;
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  const loc = singleRowSelection(ds, target?.select);

  if (loc === undefined) {
    console.log("Please select one/single row");
    return { success: false };
  }

  return ds.rows([source], {
    select: [loc],
    place: "replace",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

//

/**
 * Deletes multiple rows from the dataset.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {Object} [target] - Optional target configuration.
 * @param {"rows" | Loc[]} [target.select] - Specifies the selection scope. Defaults to `"rows"`.
 * @param {"top" | "all" | "bottom"} [target.which] - Determines which rows to delete. Defaults to `"all"`.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the selected rows before deletion.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function delRows<T extends object>(
  ds: Ds<T> | Dsm<T>,
  target?: {
    select?: "rows" | Loc[];
    which?: "top" | "all" | "bottom";
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  return ds.rows(undefined, {
    select: target?.select ?? "rows", // - default: rows
    which: target?.which ?? "all", // - default: all
    place: "replace",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

/**
 * Deletes a single row from the dataset.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {Object} [target] - Optional target configuration.
 * @param {"rows" | Loc | T} [target.select] - Specifies the selection scope.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the selected row before deletion.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function delRow<T extends object>(
  ds: Ds<T> | Dsm<T>,
  target?: {
    select?: "rows" | Loc | T;
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  const loc = singleRowSelection(ds, target?.select);

  if (loc === undefined) {
    console.log("Please select one/single row");
    return { success: false };
  }

  return ds.rows(undefined, {
    select: [loc],
    place: "replace",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

//

/**
 * Inserts multiple rows at the beginning of the selected tables.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T[]} source - The rows to insert.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | Tid[]} [target.select] - Specifies the selection scope. Defaults to `"tables"`.
 * @param {"top" | "all" | "bottom"} [target.which] - Determines which tables to insert into. Defaults to `"all"`.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the inserted rows.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function unshiftRows<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T[],
  target?: {
    select?: "tables" | Tid[];
    which?: "top" | "all" | "bottom";
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  return ds.rows(source, {
    select: target?.select ?? "tables", // - default: tables
    which: target?.which ?? "all", // - default: all
    place: "above",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

/**
 * Inserts a single row at the beginning of the selected table.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T} source - The row to insert.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | Tid | T[]} [target.select] - Specifies the selection scope.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the inserted row.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function unshiftRow<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T,
  target?: {
    select?: "tables" | Tid | T[];
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  const tid = singleTableSelection(ds, target?.select);

  if (tid === undefined) {
    console.log("Please select one/single table");
    return { success: false };
  }

  return ds.rows([source], {
    select: [tid],
    place: "above",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

//

/**
 * Appends multiple rows at the end of the selected tables.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T[]} source - The rows to append.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | Tid[]} [target.select] - Specifies the selection scope. Defaults to `"tables"`.
 * @param {"top" | "all" | "bottom"} [target.which] - Determines which tables to insert into. Defaults to `"all"`.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the inserted rows.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function pushRows<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T[],
  target?: {
    select?: "tables" | Tid[];
    which?: "top" | "all" | "bottom";
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  return ds.rows(source, {
    select: target?.select ?? "tables", // - default: tables
    which: target?.which ?? "all", // - default: all
    place: "below",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

/**
 * Appends a single row at the end of the selected table.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T} source - The row to append.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | Tid | T[]} [target.select] - Specifies the selection scope.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the inserted row.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function pushRow<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T,
  target?: {
    select?: "tables" | Tid | T[];
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  const tid = singleTableSelection(ds, target?.select);

  if (tid === undefined) {
    console.log("Please select one/single table");
    return { success: false };
  }

  return ds.rows([source], {
    select: [tid],
    place: "below",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

//

/**
 * Removes the first row from the selected table.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | Tid | T[]} [target.select] - Specifies the selection scope.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the removed row.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function shiftRow<T extends object>(
  ds: Ds<T> | Dsm<T>,
  target?: {
    select?: "tables" | Tid | T[];
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  const tid = singleTableSelection(ds, target?.select);

  if (tid === undefined) {
    console.log("Please select one/single table");
    return { success: false };
  }

  if (ds.tables[tid]?.length === 0) {
    console.log("table is empty, no row can be shift");
    return { success: false };
  }

  return ds.rows(undefined, {
    select: [tid],
    place: "above",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

/**
 * Removes the last row from the selected table.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | Tid | T[]} [target.select] - Specifies the selection scope.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the removed row.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function popRow<T extends object>(
  ds: Ds<T> | Dsm<T>,
  target?: {
    select?: "tables" | Tid | T[];
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  const tid = singleTableSelection(ds, target?.select);

  if (tid === undefined) {
    console.log("Please select one/single table");
    return { success: false };
  }

  if (ds.tables[tid]?.length === 0) {
    console.log("table is empty, no row can be pop");
    return { success: false };
  }

  return ds.rows(undefined, {
    select: [tid],
    place: "below",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}
