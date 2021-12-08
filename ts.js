const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: fs.createReadStream('./ts.txt')
});

let ValueType = {}
let index = 0
ValueType[index] = []
rl.on('line', (line) => {
  if (line.length == 0) {
    index++
    ValueType[index] = []
  } else {
    ValueType[index].push(line)
  }
});

setTimeout(() => {
  delete ValueType[index]
  console.log(JSON.stringify(ValueType, undefined, 2 ))
}, 100)