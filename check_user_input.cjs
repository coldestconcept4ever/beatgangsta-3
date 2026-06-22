const fs = require('fs');

const raw = fs.readFileSync('user_input.txt', 'utf8');
const blocks = raw.split(/^desc:/m);

console.log('Total blocks separated by desc:', blocks.length - 1);

let count = 0;
for(let i = 1; i < blocks.length; i++) {
   const b = blocks[i];
   // Check if it has a slider
   if(b.includes('slider')) {
      count++;
   }
}

console.log('Blocks with sliders:', count);
