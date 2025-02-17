import { Dsm } from "../dist";
import { addRowAbove, addRowsAbove } from "../dist/func";

console.clear();

const core = {
  tables: [],
  tablesSel: [],
  rowsSel: [],
};

const ds = new Dsm({ core });

console.log(ds.getModesReg("idle"));

// ds.rows([], { select: 'test' });
// ds.rows([], { select: [0], which: 'all', place: 'place' });
