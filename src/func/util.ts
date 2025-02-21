import { Ds } from "../ds";
import { Dsm } from "../dsm";
import type { Loc, Tid } from "../type";

export function singleTableSelection<T extends object>(
  ds: Ds<T> | Dsm<T>,
  select?: "tables" | Tid | T[]
): Tid | undefined {
  const sel = select ?? "tables";

  let tid: Tid | undefined = undefined;

  if (typeof sel === "string") {
    if (sel === "tables") {
      tid = ds.tableSel;
    } else {
      throw new Error(`Unknown select: "${sel}"`);
    }
  } else if (typeof sel === "number") {
    tid = sel;
  } else {
    const { found, tid: t } = ds.hasTableRef(sel);
    tid = found ? t : undefined;
  }

  return tid;
}

export function singleRowSelection<T extends object>(
  ds: Ds<T> | Dsm<T>,
  select?: "rows" | Loc | T
): Loc | undefined {
  const sel = select ?? "rows";

  let loc: Loc | undefined = undefined;

  if (typeof sel === "string") {
    if (sel === "rows") {
      loc = ds.rowSel;
    } else {
      throw new Error(`Unknown select: "${sel}"`);
    }
  } else if ("t" in sel && "r" in sel) {
    loc = sel;
  } else {
    const { found, loc: l } = ds.hasRowRef(sel);
    loc = found ? l : undefined;
  }

  return loc;
}
