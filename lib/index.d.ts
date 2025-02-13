export interface DsCore<T extends object> {
    tables: T[][];
    tablesSel: number[];
    rowsSel: Loc[];
}
export type MultiMode = "ctrl" | "shift" | undefined;
export type Loc = {
    t: number;
    r: number;
};
export type Tid = number;
/**
 * Class Ds
 *
 * @export
 * @class Ds
 * @template T
 */
export declare class Ds<T extends object> {
    #private;
    /**
     * Creates an instance of Ds.
     * @param {{ core: DsCore<T>; useClone?: boolean }} params
     * @memberof Ds
     */
    constructor(params: {
        core: DsCore<T>;
        useClone?: boolean;
    });
    /**
     * Tables
     *
     * @readonly
     * @type {T[][]}
     * @memberof Ds
     */
    get tables(): T[][];
    /**
     * TablesCnt
     *
     * @readonly
     * @type {number}
     * @memberof Ds
     */
    get tablesCnt(): number;
    /**
     * Selected tables tids
     *
     * @readonly
     * @memberof Ds
     */
    get tablesSel(): number[];
    /**
     * Selected tables reference
     *
     * @readonly
     * @memberof Ds
     */
    get tablesSelRef(): T[][];
    /**
     * Selected rows locs
     *
     * @readonly
     * @memberof Ds
     */
    get rowsSel(): Loc[];
    /**
     * Selected rows reference
     *
     * @readonly
     * @memberof Ds
     */
    get rowsSelRef(): T[];
    /**
     * Table (single table case)
     *
     * @readonly
     * @type {(T[] | undefined)}
     * @memberof Ds
     */
    get table(): T[] | undefined;
    /**
     * Table rows count (single table case)
     *
     * @readonly
     * @type {(number | undefined)}
     * @memberof Ds
     */
    get rowCnt(): number | undefined;
    /**
     * Selected tables tid (single selection case)
     *
     * @readonly
     * @type {(number | undefined)}
     * @memberof Ds
     */
    get tableSel(): number | undefined;
    /**
     * Selected table reference (single selection case)
     *
     * @readonly
     * @type {T[]}
     * @memberof Ds
     */
    get tableSelRef(): T[];
    /**
     * Selected row loc (single selection case)
     *
     * @readonly
     * @type {(Loc | undefined)}
     * @memberof Ds
     */
    get rowSel(): Loc | undefined;
    /**
     * Selected row reference (single selection case)
     *
     * @readonly
     * @type {(T | undefined)}
     * @memberof Ds
     */
    get rowSelRef(): T | undefined;
    /**
     * Find tid and return table reference
     *
     * @param {number} t
     * @return {*}  {({ found: boolean; tableRef: T[] | undefined })}
     * @memberof Ds
     */
    hasTable(t: number): {
        found: boolean;
        tableRef: T[] | undefined;
    };
    /**
     * Find loc and return row reference
     *
     * @param {Loc} loc
     * @return {*}  {({ found: boolean; rowRef: T | undefined })}
     * @memberof Ds
     */
    hasRow(loc: Loc): {
        found: boolean;
        rowRef: T | undefined;
    };
    /**
     * Find table reference and return tid
     *
     * @param {T[]} tableRef
     * @return {*}  {{ found: boolean; tid: number }}
     * @memberof Ds
     */
    hasTableRef(tableRef: T[]): {
        found: boolean;
        tid: number;
    };
    /**
     * Find row reference and return loc
     *
     * @param {T} rowRef
     * @return {*}  {{ found: boolean; loc: Loc; row?: T }}
     * @memberof Ds
     */
    hasRowRef(rowRef: T): {
        found: boolean;
        loc: Loc;
        row?: T;
    };
    /**
     * Tables reference convert to Tids
     *
     * @param {T[][]} tables
     * @return {*}  {{ foundAll: boolean; tids: number[] }}
     * @memberof Ds
     */
    tablesToTids(tables: T[][]): {
        foundAll: boolean;
        tids: number[];
    };
    /**
     * Rows reference convert to Locs
     *
     * @param {T[]} rows
     * @return {*}  {{ foundAll: boolean; locs: Loc[] }}
     * @memberof Ds
     */
    rowsToLocs(rows: T[]): {
        foundAll: boolean;
        locs: Loc[];
    };
    /**
     * Selected tables sorting
     *
     * @param {('forward' | 'reverse')} [direction]
     * @memberof Ds
     */
    sortTablesSel(direction?: "forward" | "reverse"): void;
    /**
     * Selected Rows sorting
     *
     * @param {('forward' | 'reverse')} [direction]
     * @memberof Ds
     */
    sortRowsSel(direction?: "forward" | "reverse"): void;
    /**
     * Table selection
     *
     * @param {(T[] | number)} table
     * @param {({ mode?: MultiMode; sort?: 'forward' | 'reverse' })} [option]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     */
    selectTable(table: T[] | number, option?: {
        mode?: MultiMode;
        sort?: "forward" | "reverse";
    }): {
        success: boolean;
    };
    /**
     * Row selection
     *
     * @param {(T | Loc)} row
     * @param {({ mode?: MultiMode; sort?: 'forward' | 'reverse' })} [option]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     */
    selectRow(row: T | Loc, option?: {
        mode?: MultiMode;
        sort?: "forward" | "reverse";
    }): {
        success: boolean;
    };
    /**
     * Mouse click table selection
     *
     * @param {(T[] | number)} table
     * @param {MouseEvent} e
     * @param {('forward' | 'reverse')} [sort]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     */
    clickTable(table: T[] | number, e: MouseEvent, sort?: "forward" | "reverse"): {
        success: boolean;
    };
    /**
     * Mouse click row selection
     *
     * @param {(T | Loc)} row
     * @param {MouseEvent} e
     * @param {('forward' | 'reverse')} [sort]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     */
    clickRow(row: T | Loc, e: MouseEvent, sort?: "forward" | "reverse"): {
        success: boolean;
    };
    /**
     * Deselect all selected tables
     *
     * @memberof Ds
     */
    deselectAllTable(): void;
    /**
     * Deselect all selected rows
     *
     * @memberof Ds
     */
    deselectAllRow(): void;
    /**
     * Deselect all selected tables & rows
     *
     * @memberof Ds
     */
    deselectAll(): void;
    /**
     * @param {number} t
     * @return {*}  {boolean}
     * @memberof Ds
     */
    isSelectedTable(t: number): boolean;
    /**
     * @param {Loc} loc
     * @return {*}  {boolean}
     * @memberof Ds
     */
    isSelectedRow(loc: Loc): boolean;
    /**
     * @param {T[]} tableRef
     * @return {*}  {boolean}
     * @memberof Ds
     */
    isSelectedTableRef(tableRef: T[]): boolean;
    /**
     * @param {T} rowRef
     * @return {*}  {boolean}
     * @memberof Ds
     */
    isSelectedRowRef(rowRef: T): boolean;
    /**
     * function signature for new rows
     * add rows，replace rows, del rows, replace all rows of existing tables
     *
     * @param {T[]} [source]
     * @param {({
     * 			select?: 'tables' | 'rows' | Tid[] | Loc[];
     * 			which?: 'top' | 'all' | 'bottom';
     * 			place?: 'above' | 'replace' | 'below';
     * 			changeSel?: boolean;
     * 			useClone?: boolean;
     * 		})} [target]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     */
    rows(source?: T[], target?: {
        select?: "tables" | "rows" | Tid[] | Loc[];
        which?: "top" | "all" | "bottom";
        place?: "above" | "replace" | "below";
        changeSel?: boolean;
        useClone?: boolean;
    }): {
        success: boolean;
    };
    /**
     * function signature for new tables: new table above, new table above
     *
     * @param {T[]} source
     * @param {({
     * 			select?: 'tables' | Tid[];
     * 			which?: 'top' | 'all' | 'bottom';
     * 			place?: 'newTableAbove' | 'newTableBelow';
     * 			changeSel?: boolean;
     * 			useClone?: boolean;
     * 		})} [target]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     */
    rows(source: T[], target?: {
        select?: "tables" | Tid[];
        which?: "top" | "all" | "bottom";
        place?: "newTableAbove" | "newTableBelow";
        changeSel?: boolean;
        useClone?: boolean;
    }): {
        success: boolean;
    };
    /**
     * Insert multi tables
     * ! This function is not complete, will be update in the future
     *
     * @param {T[][]} source
     * @param {({
     * 			select?: 'tables' | Tid[];
     * 			which?: 'top' | 'all' | 'bottom';
     * 			place?: 'newTableAbove' | 'newTableBelow';
     * 			changeSel?: boolean;
     * 			useClone?: boolean;
     * 		})} [target]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     */
    newTables(source: T[][], target?: {
        select?: "tables" | Tid[];
        which?: "top" | "all" | "bottom";
        place?: "newTableAbove" | "newTableBelow";
        changeSel?: boolean;
        useClone?: boolean;
    }): {
        success: boolean;
    };
    /**
     * insert a single table
     *
     * @param {T[]} source
     * @param {({
     * 			select?: 'tables' | Tid[];
     * 			which?: 'top' | 'all' | 'bottom';
     * 			place?: 'newTableAbove' | 'newTableBelow';
     * 			changeSel?: boolean;
     * 			useClone?: boolean;
     * 		})} [target]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     *
     * params default: 'undefined', 'bottom', 'newTableBelow'
     */
    newTable(source: T[], target?: {
        select?: "tables" | Tid[];
        which?: "top" | "all" | "bottom";
        place?: "newTableAbove" | "newTableBelow";
        changeSel?: boolean;
        useClone?: boolean;
    }): {
        success: boolean;
    };
    /**
     * insert multi rows
     *
     * @param {T[]} source
     * @param {({
     * 			select?: 'tables' | 'rows' | Tid[] | Loc[];
     * 			which?: 'top' | 'all' | 'bottom';
     * 			place?: 'above' | 'replace' | 'below';
     * 			changeSel?: boolean;
     * 			useClone?: boolean;
     * 		})} [target]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     *
     * params default: 'rows', 'bottom', 'below'
     */
    newRows(source: T[], target?: {
        select?: "tables" | "rows" | Tid[] | Loc[];
        which?: "top" | "all" | "bottom";
        place?: "above" | "replace" | "below";
        changeSel?: boolean;
        useClone?: boolean;
    }): {
        success: boolean;
    };
    /**
     * Delete multi tables
     *
     * @param {({
     * 		select?: 'tables' | Tid[];
     * 		which?: 'top' | 'all' | 'bottom';
     * 		changeSel?: boolean;
     * 		useClone?: boolean;
     * 	})} [target]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     *
     * params default: 'tables', 'all'
     */
    delTables(target?: {
        select?: "tables" | Tid[];
        which?: "top" | "all" | "bottom";
        changeSel?: boolean;
        useClone?: boolean;
    }): {
        success: boolean;
    };
    /**
     * Delete multi rows
     *
     * @param {({
     * 		select?: 'tables' | 'rows' | Tid[] | Loc[];
     * 		which?: 'top' | 'all' | 'bottom';
     * 		place?: 'above' | 'below';
     * 		changeSel?: boolean;
     * 		useClone?: boolean;
     * 	})} [target]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     *
     * params default: 'rows', 'all', 'below'
     * - place will no effect when select 'rows' or Loc[]
     */
    delRows(target?: {
        select?: "tables" | "rows" | Tid[] | Loc[];
        which?: "top" | "all" | "bottom";
        place?: "above" | "below";
        changeSel?: boolean;
        useClone?: boolean;
    }): {
        success: boolean;
    };
    /**
     * Delete / Shift / Pop a single table
     *
     * @param {({
     * 		select?: 'shift' | 'pop' | Tid | T[];
     * 		changeSel?: boolean;
     * 		useClone?: boolean;
     * 	})} [target]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     *
     * params default: 'pop'
     */
    delTable(target?: {
        select?: "shift" | "pop" | Tid | T[];
        changeSel?: boolean;
        useClone?: boolean;
    }): {
        success: boolean;
    };
    /**
     * Delete single row
     *
     * @param {({
     * 		select: Loc | T;
     * 		changeSel?: boolean;
     * 		useClone?: boolean;
     * 	})} target
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     *
     * params default: 'rows'
     */
    delRow(target: {
        select: Loc | T;
        changeSel?: boolean;
        useClone?: boolean;
    }): {
        success: boolean;
    };
}
/**
 * Locs array sorting
 *
 * @export
 * @param {Loc[]} locs
 * @param {'reverse'} [mode]
 * @return {*}  {Loc[]}
 */
export declare function locsSort(locs: Loc[], mode?: "reverse"): Loc[];
/**
 * Tids array sorting
 *
 * @export
 * @param {number[]} num
 * @param {'reverse'} [mode]
 * @return {*}  {number[]}
 */
export declare function tidsSort(num: number[], mode?: "reverse"): number[];
//# sourceMappingURL=index.d.ts.map