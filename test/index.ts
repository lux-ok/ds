import * as d from "./data";
import { Dsm, DsState, dsStateStr } from "../src";
import type { DsCore } from "../src";

console.clear();

const core: DsCore<d.MyType> = {
  tables: [],
  tablesSel: [],
  rowsSel: [],
};

const ds = new Dsm({
  core,
  // debug: true,
  hooks: {
    modeChanged: (mode) => {
      console.log(`common hook -> Mode changed: (${mode.ex}) > (${mode.now})`);
    },
    stateChanged: (mode, state) => {
      const stateEx = dsStateStr(state.ex);
      const stateNow = dsStateStr(state.now);
      console.log(
        `common hook -> Mode changed: (${mode}) [${stateEx}] > [${stateNow}]`
      );
    },
  },
});

ds.registerMode("fetch", {
  applied: async () => {
    console.log("fetch hook -> applied(): Fetching data...");
    return new Promise<{ success: boolean; data: d.MyType[] | null }>(
      (resolve) => {
        setTimeout(() => {
          resolve({ success: true, data: d.table0 });
        }, 1000);
      }
    );
  },
  applySuccess: (data) => {
    console.log("fetch hook -> applySuccess(): Data fetched successfully");
    console.log(data);
  },
  // modeChanged: () => console.log("Mode Changed Hook"),
  // stateChanged: () => console.log("Stage Changed Hook"),
});

// console.log(ds.mode);

// ds.start("fetch", false, false);

// ds.submit(true, false);

// ds.apply(true);

// console.log(ds.status);
