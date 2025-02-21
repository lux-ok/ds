//@ts-check

import { Dsm, DsStateMap, dsStateStr, Ds } from "../dist";
import { addRowAbove, addRowsAbove, pushTable } from "../dist/func";

console.clear();

const core = {
  tables: [],
  tablesSel: [],
  rowsSel: [],
};

const ds = new Dsm({ core });

console.log(ds.getModesReg("idle"));
console.log(ds.getModesReg());
console.log(ds.modesReg);

// ds.rows([], { select: 'test' });
// ds.rows([], { select: [0], which: 'all', place: 'place' });

console.log(dsStateStr(0));
console.log(dsStateStr(1));
console.log(dsStateStr(2));
console.log(dsStateStr(3));
console.log(dsStateStr(4));

console.log(DsStateMap);

console.log(ds.hasRow({ t: 1, r: 2 }));

console.log(ds.tables);
