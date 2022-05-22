const fs = require('fs');
const path = require('path');
const way = path.join(__dirname, 'text.txt');
const readline  = require('readline');
const process = require('process');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });
let writeStream = fs.createWriteStream(way);

console.log('Please, enter your text.')

process.on('beforeExit', () => console.log('Goodbye!'));

rl.on('line', (input) => {
    if (input === 'exit') {
        console.log('Goodbye!');
        process.exit();
    }
    writeStream.write(input + '\n');
});

