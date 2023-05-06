const fs = require('fs');
const path = require('path');
const way = path.join(__dirname, 'secret-folder');

function printFileData(name, type, size) {
  process.stdout.write(`${name} - ${type.slice(1)} - ${size / 1024} kb\n`);
}

function readDir(filePath) {
  fs.readdir(filePath, (err, files) => {
    if (err) console.log(err);

    files.forEach((file) => {
      const currentPath = path.join(filePath, file);
      fs.lstat(currentPath, (err, stat) => {

        if (err) return console.log(err);

        if (stat.isFile()) {
          const type = path.extname(file);
          const name = path.basename(file, type);
          const size = stat.size;
          printFileData(name, type, size);
        }
      });
    });
  });
}

readDir(way);

