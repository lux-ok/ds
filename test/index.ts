import * as d from "./data";
import { Dss, DssState, dssStateStr } from "../src";
import type { DsCore, DssCore } from "../src";

const dsCore: DsCore<d.MyType> = {
  tables: [],
  tablesSel: [],
  rowsSel: [],
};

const dssCore: DssCore = {};

const dss = new Dss<d.MyType>({ dsCore, dssCore });

dss.registerMode("fetch", {
  applyHandler: async () => {
    console.log("Fetching data...");

    return new Promise<{ success: boolean; data: d.MyType[] | null }>(
      (resolve) => {
        setTimeout(() => {
          resolve({ success: true, data: d.table0 });
        }, 1000);
      }
    );
  },

  successHandler: (data) => {
    console.log("Data fetched successfully:", data);
  },
});

console.clear();
dss.cl("");

dss.start("fetch", false, false);
dss.cl("");

dss.submit(true, false);
dss.cl("");

dss.apply(false);

dss.cl("");
