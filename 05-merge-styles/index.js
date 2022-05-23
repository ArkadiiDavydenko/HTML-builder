const path = require('path');
const fsProm = require('fs/promises');
const fs = require("fs");
const styleFilesPath = path.join(__dirname, 'styles');
const toBundlePath = path.join(__dirname, 'project-dist');
const stream = fs.createWriteStream(path.join(toBundlePath, 'bundle.css'));

async function createBundle() {
    const styleFiles = await fsProm.readdir(styleFilesPath, {withFileTypes: true});
    for (let file of styleFiles) {
        if (file.isFile()) {
            let type = path.extname(file.name);
            if (type === '.css') {
                const readableStream = fs.createReadStream(path.join(styleFilesPath, file.name))
                readableStream.pipe(stream);
            }
        }
    }
}

createBundle();