import { Ds } from "../ds";
import { Dsm } from "../dsm";
import type { Tid } from "../type";
import { singleTableSelection } from "./util";

/**
 * Creates a new table with the provided rows.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T[]} source - The row data to populate the new table.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | Tid[]} [target.select] - Specifies the selection scope.
 * @param {"top" | "all" | "bottom"} [target.which] - Determines which tables to affect.
 * @param {"newTableAbove" | "newTableBelow"} [target.place] - Determines the position of the new table.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the rows before inserting.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function newTable<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T[],
  target?: {
    select?: "tables" | Tid[];
    which?: "top" | "all" | "bottom";
    place?: "newTableAbove" | "newTableBelow";
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  return ds.rows(source, {
    select: target?.select, // - default: undefined
    which: target?.which ?? "bottom", // - default: bottom
    place: target?.place ?? "newTableBelow", // - newTableBelow
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

//

/**
 * Adds a new table above the specified table.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T[]} source - The row data to populate the new table.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | Tid | T[]} [target.select] - Specifies the target table.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the rows before inserting.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function addTableAbove<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T[],
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

  return ds.rows(source, {
    select: [tid],
    place: "newTableAbove",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

/**
 * Adds a new table below the specified table.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T[]} source - The row data to populate the new table.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | Tid | T[]} [target.select] - Specifies the target table.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the rows before inserting.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function addTableBelow<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T[],
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

  return ds.rows(source, {
    select: [tid],
    place: "newTableBelow",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

//

/**
 * Adds a new table at the beginning of the dataset.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T[]} source - The row data to populate the new table.
 * @param {Object} [target] - Optional target configuration.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the rows before inserting.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function unshiftTable<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T[],
  target?: {
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  return ds.rows(source, {
    select: undefined,
    place: "newTableAbove",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

/**
 * Adds a new table at the end of the dataset.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T[]} source - The row data to populate the new table.
 * @param {Object} [target] - Optional target configuration.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the rows before inserting.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function pushTable<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T[],
  target?: {
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  return ds.rows(source, {
    select: undefined,
    place: "newTableBelow",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

//

/**
 * Replaces tables in the dataset with the provided row data.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T[]} source - The row data to replace existing tables.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | Tid[]} [target.select="tables"] - The tables to be replaced.
 * @param {"top" | "all" | "bottom"} [target.which="all"] - Specifies which tables to replace.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the rows before replacing.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function setTables<T extends object>(
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
    place: "replace",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

/**
 * Replaces the content of a selected table in the dataset.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T[]} source - The row data to replace the selected table's content.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | Tid | T[]} [target.select] - The table to be replaced.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone the rows before replacing.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function setTable<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T[],
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

  return ds.rows(source, {
    select: [tid],
    place: "replace",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

//

/**
 * Deletes selected tables from the dataset.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | Tid[]} [target.select] - The tables to delete (default: "tables").
 * @param {"top" | "all" | "bottom"} [target.which] - Specifies which tables to delete (default: "all").
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone before deleting.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function delTables<T extends object>(
  ds: Ds<T> | Dsm<T>,
  target?: {
    select?: "tables" | Tid[];
    which?: "top" | "all" | "bottom";
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  if (ds.tables.length === 0) {
    console.log("tables is empty, no table can be delete");
    return { success: false };
  }

  return ds.rows(undefined, {
    select: target?.select ?? "tables", // - default: tables
    which: target?.which ?? "all", // - default: all
    place: "replace",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

/**
 * Deletes a single selected table from the dataset.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | Tid | T[]} [target.select] - The table to delete.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to clone before deleting.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function delTable<T extends object>(
  ds: Ds<T> | Dsm<T>,
  target?: {
    select?: "tables" | Tid | T[];
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  const tablesCnt = ds.tablesCnt;

  if (tablesCnt === 0) {
    console.log("tables is empty, no table can be delete");
    return { success: false };
  }

  const tid = singleTableSelection(ds, target?.select);

  if (tid === undefined) {
    console.log("Please select one/single table");
    return { success: false };
  }

  return ds.rows(undefined, {
    select: [tid],
    place: "replace",
    changeSel: target?.changeSel,
    useClone: target?.useClone,
  });
}

//

/**
 * Removes the last table from the dataset.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {Object} [target] - Optional target configuration.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function popTable<T extends object>(
  ds: Ds<T> | Dsm<T>,
  target?: {
    changeSel?: boolean;
  }
): { success: boolean } {
  const tablesCnt = ds.tablesCnt;

  if (tablesCnt === 0) {
    console.log("tables is empty, no table can be delete");
    return { success: false };
  }

  return ds.rows(undefined, {
    select: [tablesCnt - 1],
    place: "replace",
    changeSel: target?.changeSel,
  });
}

/**
 * Removes the first table from the dataset.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {Object} [target] - Optional target configuration.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function shiftTable<T extends object>(
  ds: Ds<T> | Dsm<T>,
  target?: {
    changeSel?: boolean;
  }
): { success: boolean } {
  const tablesCnt = ds.tablesCnt;

  if (tablesCnt === 0) {
    console.log("tables is empty, no table can be delete");
    return { success: false };
  }

  return ds.rows(undefined, {
    select: [0],
    place: "replace",
    changeSel: target?.changeSel,
  });
}

//

/**
 * Adds multiple tables to the dataset.
 *
 * If `changeSel` is `true`, the function will select the last added table
 * and all its rows after the operation is completed.
 *
 * @template {object} T - The type of the row data.
 * @param {Ds<T> | Dsm<T>} ds - The dataset or dataset manager.
 * @param {T[][]} source - The tables to be added.
 * @param {Object} [target] - Optional target configuration.
 * @param {"tables" | Tid[]} [target.select] - The selection criteria.
 * @param {"top" | "all" | "bottom"} [target.which] - Where to place the tables.
 * @param {"newTableAbove" | "newTableBelow"} [target.place] - Positioning of new tables.
 * @param {boolean} [target.changeSel] - Whether to update the selection.
 * @param {boolean} [target.useClone] - Whether to use a cloned version.
 * @returns {{ success: boolean }} - The result of the operation.
 */
export function addBulkTables<T extends object>(
  ds: Ds<T> | Dsm<T>,
  source: T[][],
  target?: {
    select?: "tables" | Tid[];
    which?: "top" | "all" | "bottom";
    place?: "newTableAbove" | "newTableBelow";
    changeSel?: boolean;
    useClone?: boolean;
  }
): { success: boolean } {
  const select = target?.select; // - default: undefined
  const which = target?.which ?? "bottom"; // - default: bottom
  const place = target?.place ?? "newTableBelow"; // - newTableBelow
  const changeSel = target?.changeSel;
  const useClone = target?.useClone;

  source.forEach((table) => {
    ds.rows(table, { select, which, place, changeSel, useClone });
  });

  return { success: true };
}
