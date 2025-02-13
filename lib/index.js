/**
 * Class Ds
 *
 * @export
 * @class Ds
 * @template T
 */
export class Ds {
    /**
     * Creates an instance of Ds.
     * @param {{ core: DsCore<T>; useClone?: boolean }} params
     * @memberof Ds
     */
    constructor(params) {
        this.#core = params.core;
        this.#useClone = params.useClone ?? true; // - default use structureClone()
    }
    /* ~ private vars */
    #core;
    #useClone;
    #oldSelRef = { tables: [], rows: [] };
    #newSelRef = { tables: [], rows: [] };
    /* ~ private utils */
    #log(msg, func) {
        console.log(func ? func + ": " + msg : msg);
    }
    #updateTableSel(changeSel) {
        const buf = changeSel
            ? this.#newSelRef.tables
            : this.#oldSelRef.tables;
        this.#core.tablesSel.length = 0;
        buf.forEach((table) => {
            const { found, tid: t } = this.hasTableRef(table);
            found && this.#core.tablesSel.push(t);
        });
        buf.length = 0;
    }
    #updateRowSel(changeSel) {
        const buf = changeSel ? this.#newSelRef.rows : this.#oldSelRef.rows;
        this.#core.rowsSel.length = 0;
        buf.forEach((row) => {
            const { found, loc } = this.hasRowRef(row);
            found && this.#core.rowsSel.push(loc);
        });
        buf.length = 0;
    }
    /* ~ tables */
    /**
     * Tables
     *
     * @readonly
     * @type {T[][]}
     * @memberof Ds
     */
    get tables() {
        return this.#core.tables;
    }
    /**
     * TablesCnt
     *
     * @readonly
     * @type {number}
     * @memberof Ds
     */
    get tablesCnt() {
        return this.#core.tables.length;
    }
    /* ~ tablesSel */
    /**
     * Selected tables tids
     *
     * @readonly
     * @memberof Ds
     */
    get tablesSel() {
        return this.#core.tablesSel;
    }
    /**
     * Selected tables reference
     *
     * @readonly
     * @memberof Ds
     */
    get tablesSelRef() {
        return this.#core.tablesSel.map((loc) => this.#core.tables[loc]);
    }
    /* ~ rowsSel */
    /**
     * Selected rows locs
     *
     * @readonly
     * @memberof Ds
     */
    get rowsSel() {
        return this.#core.rowsSel;
    }
    /**
     * Selected rows reference
     *
     * @readonly
     * @memberof Ds
     */
    get rowsSelRef() {
        return this.#core.rowsSel.map((loc) => this.#core.tables[loc.t][loc.r]);
    }
    /* ~ table0 (single table case) */
    /**
     * Table (single table case)
     *
     * @readonly
     * @type {(T[] | undefined)}
     * @memberof Ds
     */
    get table() {
        return this.#core.tables[0];
    }
    /**
     * Table rows count (single table case)
     *
     * @readonly
     * @type {(number | undefined)}
     * @memberof Ds
     */
    get rowCnt() {
        return this.#core.tables[0]?.length;
    }
    /* ~ get tableSel[0] & tableSel[0] Reference, (single selection case)  */
    /**
     * Selected tables tid (single selection case)
     *
     * @readonly
     * @type {(number | undefined)}
     * @memberof Ds
     */
    get tableSel() {
        return this.#core.tablesSel.length === 1
            ? this.#core.tablesSel[0]
            : undefined;
    }
    /**
     * Selected table reference (single selection case)
     *
     * @readonly
     * @type {T[]}
     * @memberof Ds
     */
    get tableSelRef() {
        return this.#core.tablesSel.length === 1
            ? this.#core.tables[this.#core.tablesSel[0]]
            : [];
    }
    /* ~ get rowSel[0] & rowSel[0] Reference, (single selection case)  */
    /**
     * Selected row loc (single selection case)
     *
     * @readonly
     * @type {(Loc | undefined)}
     * @memberof Ds
     */
    get rowSel() {
        return this.#core.rowsSel.length === 1
            ? { t: this.#core.rowsSel[0].t, r: this.#core.rowsSel[0].r }
            : undefined;
    }
    /**
     * Selected row reference (single selection case)
     *
     * @readonly
     * @type {(T | undefined)}
     * @memberof Ds
     */
    get rowSelRef() {
        return this.#core.rowsSel.length === 1
            ? this.#core.tables[this.#core.rowsSel[0].t][this.#core.rowsSel[0].r]
            : undefined;
    }
    /* ~ has table / row location checker  */
    /**
     * Find tid and return table reference
     *
     * @param {number} t
     * @return {*}  {({ found: boolean; tableRef: T[] | undefined })}
     * @memberof Ds
     */
    hasTable(t) {
        const tableRef = this.#core.tables[t];
        return { found: tableRef !== undefined, tableRef };
    }
    /**
     * Find loc and return row reference
     *
     * @param {Loc} loc
     * @return {*}  {({ found: boolean; rowRef: T | undefined })}
     * @memberof Ds
     */
    hasRow(loc) {
        const rowRef = this.#core.tables[loc.t]?.[loc.r];
        return { found: rowRef !== undefined, rowRef };
    }
    /* ~ has table / row reference checker */
    /**
     * Find table reference and return tid
     *
     * @param {T[]} tableRef
     * @return {*}  {{ found: boolean; tid: number }}
     * @memberof Ds
     */
    hasTableRef(tableRef) {
        const tid = this.#core.tables.indexOf(tableRef);
        return { found: tid > -1, tid };
    }
    /**
     * Find row reference and return loc
     *
     * @param {T} rowRef
     * @return {*}  {{ found: boolean; loc: Loc; row?: T }}
     * @memberof Ds
     */
    hasRowRef(rowRef) {
        for (let t = 0; t < this.#core.tables.length; t++) {
            let r = this.#core.tables[t].indexOf(rowRef);
            if (r !== -1)
                return { found: true, loc: { t, r }, row: this.#core.tables[t]?.[r] };
        }
        return { found: false, loc: { t: -1, r: -1 } };
    }
    /* ~ ref to indexes: Tids & Locs */
    /**
     * Tables reference convert to Tids
     *
     * @param {T[][]} tables
     * @return {*}  {{ foundAll: boolean; tids: number[] }}
     * @memberof Ds
     */
    tablesToTids(tables) {
        let foundAll = true;
        const tids = tables.map((table) => {
            const { found, tid: t } = this.hasTableRef(table);
            if (!found)
                foundAll = false;
            return t;
        });
        return { tids, foundAll };
    }
    /**
     * Rows reference convert to Locs
     *
     * @param {T[]} rows
     * @return {*}  {{ foundAll: boolean; locs: Loc[] }}
     * @memberof Ds
     */
    rowsToLocs(rows) {
        let foundAll = true;
        const locs = rows.map((row) => {
            const { found, loc } = this.hasRowRef(row);
            if (!found)
                foundAll = false;
            return loc;
        });
        return { locs, foundAll };
    }
    /* ~ sel Tids & Locs sorting */
    /**
     * Selected tables sorting
     *
     * @param {('forward' | 'reverse')} [direction]
     * @memberof Ds
     */
    sortTablesSel(direction) {
        this.#core.tablesSel.sort((a, b) => direction === "reverse" ? b - a : a - b);
    }
    /**
     * Selected Rows sorting
     *
     * @param {('forward' | 'reverse')} [direction]
     * @memberof Ds
     */
    sortRowsSel(direction) {
        this.#core.rowsSel.sort((a, b) => {
            if (a.t === b.t)
                return direction === "reverse" ? b.r - a.r : a.r - b.r;
            return direction === "reverse" ? b.t - a.t : a.t - b.t;
        });
    }
    /* ~ table & row selection */
    /**
     * Table selection
     *
     * @param {(T[] | number)} table
     * @param {({ mode?: MultiMode; sort?: 'forward' | 'reverse' })} [option]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     */
    selectTable(table, option) {
        // - support table index number and table reference both
        let success = true;
        let loc = -1;
        if (typeof table === "number") {
            this.hasTable(table).found ? (loc = table) : (success = false);
        }
        else {
            const { found, tid: t } = this.hasTableRef(table);
            found ? (loc = t) : (success = false);
        }
        if (success) {
            multiSelectionLogic(loc, this.#core.tablesSel, option?.mode);
            option?.sort && this.sortTablesSel(option.sort);
        }
        return { success };
    }
    /**
     * Row selection
     *
     * @param {(T | Loc)} row
     * @param {({ mode?: MultiMode; sort?: 'forward' | 'reverse' })} [option]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     */
    selectRow(row, option) {
        // - support row location indexes and row reference both
        let success = true;
        let loc = { t: -1, r: -1 };
        if (typeof row === "object" && row !== null && "t" in row && "r" in row) {
            this.hasRow(row).found ? (loc = row) : (success = false);
        }
        else {
            const { found, loc: tr } = this.hasRowRef(row);
            found ? (loc = tr) : (success = false);
        }
        if (success) {
            multiSelectionLogic(loc, this.#core.rowsSel, option?.mode);
            option?.sort && this.sortRowsSel(option.sort);
        }
        return { success };
    }
    /* ~ mouse click select with MouseEvent key ('ctrl & 'shift') */
    /**
     * Mouse click table selection
     *
     * @param {(T[] | number)} table
     * @param {MouseEvent} e
     * @param {('forward' | 'reverse')} [sort]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     */
    clickTable(table, e, sort) {
        const mode = e.ctrlKey
            ? "ctrl"
            : e.shiftKey
                ? "shift"
                : undefined;
        return this.selectTable(table, { mode, sort });
    }
    /**
     * Mouse click row selection
     *
     * @param {(T | Loc)} row
     * @param {MouseEvent} e
     * @param {('forward' | 'reverse')} [sort]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     */
    clickRow(row, e, sort) {
        const mode = e.ctrlKey
            ? "ctrl"
            : e.shiftKey
                ? "shift"
                : undefined;
        return this.selectRow(row, { mode, sort });
    }
    /* ~ deselection */
    /**
     * Deselect all selected tables
     *
     * @memberof Ds
     */
    deselectAllTable() {
        this.#core.tablesSel.length = 0;
    }
    /**
     * Deselect all selected rows
     *
     * @memberof Ds
     */
    deselectAllRow() {
        this.#core.rowsSel.length = 0;
    }
    /**
     * Deselect all selected tables & rows
     *
     * @memberof Ds
     */
    deselectAll() {
        this.#core.rowsSel.length = 0;
        this.#core.tablesSel.length = 0;
    }
    /* ~ isSelected */
    /**
     * @param {number} t
     * @return {*}  {boolean}
     * @memberof Ds
     */
    isSelectedTable(t) {
        return this.#core.tablesSel.includes(t);
    }
    /**
     * @param {Loc} loc
     * @return {*}  {boolean}
     * @memberof Ds
     */
    isSelectedRow(loc) {
        return this.#core.rowsSel.some((sel) => sel.t === loc.t && sel.r === loc.r);
    }
    /**
     * @param {T[]} tableRef
     * @return {*}  {boolean}
     * @memberof Ds
     */
    isSelectedTableRef(tableRef) {
        const { tid: t } = this.hasTableRef(tableRef);
        return this.#core.tablesSel.includes(t);
    }
    /**
     * @param {T} rowRef
     * @return {*}  {boolean}
     * @memberof Ds
     */
    isSelectedRowRef(rowRef) {
        const { loc } = this.hasRowRef(rowRef);
        return this.#core.rowsSel.some((sel) => sel.t === loc.t && sel.r === loc.r);
    }
    /**
     * Main function of rows control
     *
     * @param {T[]} [source]
     * @param {({
     * 			select?: 'tables' | 'rows' | Tid[] | Loc[];
     * 			which?: 'top' | 'all' | 'bottom';
     * 			place?: 'newTableAbove' | 'above' | 'replace' | 'below' | 'newTableBelow';
     * 			changeSel?: boolean;
     * 			useClone?: boolean;
     * 		})} [target]
     * @return {*}  {{ success: boolean }}
     * @memberof Ds
     *
     * params default: 'newTable', 'bottom', 'below'
     *
     */
    rows(source, target) {
        const { tables, tablesSel, rowsSel } = this.#core;
        // - default value when params undefined
        const select = target?.select;
        const which = target?.which ?? "bottom";
        const place = target?.place ?? "below";
        const useClone = target?.useClone ?? this.#useClone;
        const changeSel = target?.changeSel ?? false;
        // - targets
        let tids = [];
        let locs = [];
        // - [ select ] tables or rows
        if (select === "tables")
            tids = [...tablesSel];
        else if (select === "rows")
            locs = [...rowsSel];
        else if (Array.isArray(select) && select.length > 0) {
            typeof select[0] === "number"
                ? select.some((t) => t < -1 || t > tables.length) ||
                    (tids = select)
                : select.some((l) => !this.hasRow(l).found) ||
                    (locs = select);
        }
        else {
            // - new table issuse, can be no tids or locs, predefine push new table to above or below
            if (place === "newTableAbove")
                tids = [0];
            else if (place === "newTableBelow")
                tids = [tables.length - 1];
        }
        // - [ which ] tables or rows are targeted when multi selected
        if (tids.length > 0)
            tids = whichSel(tids, tidsSort, which);
        else if (locs.length > 0)
            locs = whichSel(locs, locsSort, which);
        else {
            // -  tids & locs both empty
            console.log("no target selected or some of tid/loc invalid");
            return { success: false };
        }
        // - backup the reference of selected items (before deleting)
        // - for renew tablesSel & rowsSel indexes
        this.#oldSelRef.tables = this.tablesSelRef;
        this.#oldSelRef.rows = this.rowsSelRef;
        // - clear buffer
        this.#newSelRef.rows.length = 0;
        this.#newSelRef.tables.length = 0;
        if (tids.length > 0) {
            // - by tables tid
            tids = tidsSort(tids, "reverse");
            // - editting
            tids.forEach((tid) => {
                //
                // const rows = source ? (useClone ? structuredClone(source) : source) : [];
                const rows = useClone ? structuredClone(source) : source;
                // if (rows.length > 0) {
                if (rows !== undefined) {
                    // - add rows -> add rows to table
                    if (place === "above" || place === "replace" || place === "below") {
                        // - to exist table
                        // - new rows location setup
                        // - if place === below, rid set to the bottom index of the table
                        const tableLength = tables[tid]?.length ?? 0;
                        const rid = place === "below" ? tableLength : 0;
                        // - replace table so del all rows
                        place === "replace" && (tables[tid].length = 0);
                        // - add rows to the table
                        rows.forEach((row, i) => {
                            tables[tid].splice(rid + i, 0, row);
                            this.#newSelRef.rows.push(tables[tid][rid + i]); // - new rowsSel
                        });
                        //
                    }
                    else {
                        // - to new table (place === 'newTableAbove' || place === 'newTableBelow')
                        // - insert new table to below
                        place === "newTableBelow" && (tid = tid + 1);
                        // - add a empty table
                        tables.splice(tid, 0, rows);
                        for (let i = 0; i < rows.length; i++)
                            this.#newSelRef.rows.push(tables[tid][i]);
                        //
                    }
                    //
                }
                else {
                    // - no rows -> del table
                    // check
                    if (place === "replace") {
                        tables.splice(tid, 1);
                    }
                    else {
                        let rid;
                        if (place === "above") {
                            // - above
                            rid = 0;
                        }
                        else {
                            // - below
                            rid = tables[tid].length - 1;
                        }
                        tables[tid].splice(rid, 1);
                    }
                    //
                }
                this.#newSelRef.tables.push(tables[tid]); // check: - new tablesSel
                //
            });
            //
        }
        else if (locs.length > 0) {
            // - by rows loc
            locs = locsSort(locs, "reverse");
            // - edit row in specified rows location
            locs.forEach((loc) => {
                const rows = source
                    ? useClone
                        ? structuredClone(source)
                        : source
                    : [];
                if (rows.length > 0) {
                    // - each row edit and save the reference for new rowsSel
                    if (place === "below")
                        loc.r++;
                    rows.forEach((row, i) => {
                        tables[loc.t].splice(loc.r + i, place === "replace" ? 1 : 0, row);
                        this.#newSelRef.rows.push(tables[loc.t][loc.r + i]); // - new rowsSel
                    });
                }
                else {
                    // - del rows
                    tables[loc.t].splice(loc.r, 1);
                }
            });
            this.#newSelRef.tables.push(...this.tablesSelRef); // - tablesSel not change
            //
        }
        // - update tablesSel & rowsSel
        this.#updateTableSel(changeSel);
        this.#updateRowSel(changeSel);
        //
        return { success: true };
    }
    //
    /* ~ Convenience Function */
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
    newTables(source, target) {
        // todo: not test now
        const select = target?.select; // - default: undefined
        const which = target?.which ?? "bottom"; // - default: bottom
        const place = target?.place ?? "newTableBelow"; // - newTableBelow
        const changeSel = target?.changeSel;
        const useClone = target?.useClone;
        source.forEach((table) => {
            this.rows(table, { select, which, place, changeSel, useClone });
        });
        // check: no changeSel now !!!
        return { success: true };
    }
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
    newTable(source, target) {
        return this.rows(source, {
            select: target?.select, // - default: undefined
            which: target?.which ?? "bottom", // - default: bottom
            place: target?.place ?? "newTableBelow", // - newTableBelow
            changeSel: target?.changeSel,
            useClone: target?.useClone,
        });
    }
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
    newRows(source, target) {
        return this.rows(source, {
            select: target?.select ?? "rows", // - default: rows
            which: target?.which ?? "bottom", // - default: bottom
            place: target?.place ?? "below", // - default: below
            changeSel: target?.changeSel,
            useClone: target?.useClone,
        });
    }
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
    delTables(target) {
        if (this.tables.length === 0) {
            console.log("tables is empty, no table can be delete");
            return { success: false };
        }
        return this.rows(undefined, {
            select: target?.select ?? "tables", // - default: tables
            which: target?.which ?? "all", // - default: all
            place: "replace",
            changeSel: target?.changeSel,
            useClone: target?.useClone,
        });
    }
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
    delRows(target) {
        return this.rows(undefined, {
            select: target?.select ?? "rows", // - default: rows
            which: target?.which ?? "all", // - default: all
            place: target?.place ?? "below", // - default: below
            changeSel: target?.changeSel,
            useClone: target?.useClone,
        });
    }
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
    delTable(target) {
        const select = target?.select ?? "pop"; // - default: pop
        const tablesCnt = this.tablesCnt;
        if (tablesCnt === 0) {
            console.log("tables is empty, no table can be delete");
            return { success: false };
        }
        let tid;
        if (select === "shift")
            tid = 0;
        else if (select === "pop")
            tid = tablesCnt - 1;
        else {
            if (typeof select === "number")
                tid = select;
            else
                tid = this.hasTableRef(select).tid;
        }
        return this.rows(undefined, {
            select: [tid],
            place: "replace",
            changeSel: target?.changeSel,
            useClone: target?.useClone,
        });
    }
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
    delRow(target) {
        const select = target.select;
        let loc;
        if ("t" in select && "r" in select)
            loc = select;
        else
            loc = this.hasRowRef(select).loc;
        return this.rows(undefined, {
            select: [loc],
            changeSel: target.changeSel,
            useClone: target.useClone,
        });
    }
}
/**
 * Locs array sorting
 *
 * @export
 * @param {Loc[]} locs
 * @param {'reverse'} [mode]
 * @return {*}  {Loc[]}
 */
export function locsSort(locs, mode) {
    const sortedLocs = [...locs].sort((a, b) => a.t === b.t ? a.r - b.r : a.t - b.t);
    return mode === "reverse" ? sortedLocs.reverse() : sortedLocs;
}
/**
 * Tids array sorting
 *
 * @export
 * @param {number[]} num
 * @param {'reverse'} [mode]
 * @return {*}  {number[]}
 */
export function tidsSort(num, mode) {
    const sortedNums = [...num].sort((a, b) => a - b);
    return mode === "reverse" ? sortedNums.reverse() : sortedNums;
}
function whichSel(sel, sortFn, which) {
    if (which === "top") {
        const item = sortFn(sel).at(0);
        return item !== undefined ? [item] : [];
    }
    else if (which === "bottom") {
        const item = sortFn(sel).at(sel.length - 1);
        return item !== undefined ? [item] : [];
    }
    else if (which === "all") {
        return sel;
    }
    else
        return sel;
}
function multiSelectionLogic(loc, sel, mode) {
    // ~ search loc in sel[] and return array index, if not found return -1
    const i = sel.findIndex((s) => typeof loc === "number"
        ? loc === s
        : loc.t === s.t && loc.r === s.r);
    // ~ ( i > -1 ) meaning is the select item already selected before
    if (mode === undefined) {
        //
        if (i > -1) {
            if (sel.length > 1) {
                // - multi selected before, clear all and select the new one
                sel.length = 0;
                sel.push(loc);
            }
            else {
                // - single selected before, clear
                sel.length = 0;
            }
        }
        else {
            sel.length = 0;
            sel.push(loc);
        }
        //
    }
    else if (mode === "ctrl") {
        //
        i > -1 ? sel.splice(i, 1) : sel.push(loc);
        //
    }
    else if (mode === "shift") {
        //
        if (i > -1) {
            // - ( loc is selected before )
            if (sel.length > 1) {
                // - multi selected before, clear all and select the new one
                sel.length = 0;
                sel.push(loc);
            }
            else {
                // - single selected before, clear
                sel.length = 0;
            }
        }
        else {
            // - ( loc is not selected )
            if (sel.length === 0) {
                // - sel array is empty
                sel.push(loc);
                //
            }
            else if (sel.length > 1) {
                // - sel array has more then one selected
                sel.length = 0;
                sel.push(loc);
                //
            }
            else if (sel.length === 1) {
                // - sel array has only one selected
                //
                if (typeof loc === "number") {
                    // - is table
                    const firstSelected = sel[0];
                    const currentSelected = loc;
                    sel.length = 0;
                    const startTable = Math.min(firstSelected, currentSelected);
                    const endTable = Math.max(firstSelected, currentSelected);
                    for (let t = startTable; t <= endTable; t++) {
                        sel.push(t);
                    }
                    //
                }
                else {
                    // - is row
                    const firstLoc = sel[0];
                    const currentLoc = loc;
                    sel.length = 0;
                    if (firstLoc.t === currentLoc.t) {
                        const startRow = Math.min(firstLoc.r, currentLoc.r);
                        const endRow = Math.max(firstLoc.r, currentLoc.r);
                        for (let r = startRow; r <= endRow; r++) {
                            sel.push({ t: firstLoc.t, r });
                        }
                    }
                    else {
                        sel.push(loc);
                    }
                    //
                }
                //
            }
        }
        //
    }
}
