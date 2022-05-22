const path = require('path');
const fs = require('fs');
const way = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(way,'utf-8');

readStream.on('data', chunk => process.stdout.write(chunk.toString()));
readStream.on('error', error => console.log('Error', error.message));