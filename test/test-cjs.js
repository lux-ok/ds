const ds = require("../dist")



const core = {
  tables:[],
  tablesSel:[],
  rowsSel:[]
}

myDsm = new ds.Dsm({core})

console.log(myDsm.version)
console.log(myDsm.getModesReg());