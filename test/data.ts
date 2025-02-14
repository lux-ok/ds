export type MyType = {
  id: number;
  rem: string;
  meta?: {
    title?: string;
  };
};

export const row0 = { id: 0, rem: "rem00", meta: { title: "title00" } };
export const row1 = { id: 1, rem: "rem01", meta: { title: "title01" } };
export const row2 = { id: 2, rem: "rem02", meta: { title: "title02" } };
export const row3 = { id: 3, rem: "rem03", meta: { title: "title03" } };
export const row4 = { id: 4, rem: "rem04", meta: { title: "title04" } };
export const table0: MyType[] = [row0, row1, row2, row3, row4];

export const row10 = { id: 10, rem: "rem10", meta: { title: "title10" } };
export const row11 = { id: 11, rem: "rem11", meta: { title: "title11" } };
export const row12 = { id: 12, rem: "rem12", meta: { title: "title12" } };
export const row13 = { id: 13, rem: "rem13", meta: { title: "title13" } };
export const row14 = { id: 14, rem: "rem14", meta: { title: "title14" } };
export const table1: MyType[] = [row10, row11, row12, row13, row14];

export const row20 = { id: 20, rem: "rem20", meta: { title: "title20" } };
export const row21 = { id: 21, rem: "rem21", meta: { title: "title21" } };
export const row22 = { id: 22, rem: "rem22", meta: { title: "title22" } };
export const row23 = { id: 23, rem: "rem23", meta: { title: "title23" } };
export const row24 = { id: 24, rem: "rem24", meta: { title: "title24" } };
export const table2: MyType[] = [row20, row21, row22, row23, row24];

export const row30 = { id: 30, rem: "rem30", meta: { title: "title30" } };
export const row31 = { id: 31, rem: "rem31", meta: { title: "title31" } };
export const row32 = { id: 32, rem: "rem32", meta: { title: "title32" } };
export const row33 = { id: 33, rem: "rem33", meta: { title: "title33" } };
export const row34 = { id: 34, rem: "rem34", meta: { title: "title34" } };
export const table3: MyType[] = [row30, row31, row32, row33, row34];

export const row40 = { id: 40, rem: "rem40" };
export const row41 = { id: 41, rem: "rem41" };
export const row42 = { id: 42, rem: "rem42" };
export const row43 = { id: 43, rem: "rem43" };
export const row44 = { id: 44, rem: "rem44" };
export const table4: MyType[] = [row40, row41, row42, row43, row44];

export const row50 = { id: 50, rem: "rem50" };
export const row51 = { id: 51, rem: "rem51" };
export const row52 = { id: 52, rem: "rem52" };
export const row53 = { id: 53, rem: "rem53" };
export const row54 = { id: 54, rem: "rem54" };
export const table5: MyType[] = [row50, row51, row52, row53, row54];

export const tables: MyType[][] = [table1, table2, table3, table4, table5];
