import { Ds } from "../ds";
import { Dsm } from "../dsm";
import type { Tid } from "../type";
import { singleTableSelection } from "../util";

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

//

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

//

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

//

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

//

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

//

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

//

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
  // todo: not test now
  const select = target?.select; // - default: undefined
  const which = target?.which ?? "bottom"; // - default: bottom
  const place = target?.place ?? "newTableBelow"; // - newTableBelow
  const changeSel = target?.changeSel;
  const useClone = target?.useClone;

  source.forEach((table) => {
    ds.rows(table, { select, which, place, changeSel, useClone });
  });

  // check: no changeSel now !!!
  return { success: true };
}

// function paramNotAllow(param: string | undefined, allowedParams: string) {
//   throw new Error(`Param '${param}' not allow. Valid param: ${allowedParams} `);
// }
