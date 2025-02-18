import { Ds } from "../ds";
import { Dsm } from "../dsm";
import type { Loc, Tid } from "../type";
import { singleRowSelection, singleTableSelection } from "../util";

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

//

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

//

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

//

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

//

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

//

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

//

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

//

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
