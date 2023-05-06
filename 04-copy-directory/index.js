const path = require('path');
const fsProm = require('fs/promises');

const mainFolderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

async function copyDir(mainDir, copyDir) {
  await fsProm.mkdir(copyDir, {recursive: true});
  const oldFiles = await fsProm.readdir(copyFolderPath);
  for (let file of oldFiles) {
    const pathFiles = path.join(copyFolderPath, file);
    await fsProm.unlink(pathFiles);
  }
  const files = await fsProm.readdir(mainFolderPath);
  for (let file of files) {
    await fsProm.copyFile(`${mainFolderPath}/${file}`, `${copyFolderPath}/${file}`);
  }
}

copyDir(mainFolderPath, copyFolderPath);