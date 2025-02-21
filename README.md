# ds

### To install dependencies:

```bash
npm install @lux-ok/ds
```

### Docs:

https://lux-ok.github.io/ds

### Usage:

```ts
import { Ds, Dsm, type DsCore } from "@lux-ok/ds";
import {
  newTable,
  newRow,
  pushRow,
  delRow,
  // Or other functions if you need, details please visit docs link
} from "@lux-ok/ds/func";

// Your data row type
type YourObjType = {
  name: string;
  age: number;
  married: Boolean;
  meta: {
    url: string;
    age: number;
  };
};

// Dataset core
const core: DsCore<YourObjType> = { tables: [], tablesSel: [], rowsSel: [] };

// Or using reactive state through front-end framework (example: svelte5 rune)
const core: DsCore<YourObjType> = $state({
  tables: [],
  tablesSel: [],
  rowsSel: [],
});

// Dataset manager instantiate
const ds = new Ds({ core });

// Or Dataset manager with FSM
const ds = new Dsm({ core });
```

### Todo: demo site
