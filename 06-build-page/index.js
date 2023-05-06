const fs = require('fs');
const path = require('path');
const fsProm = require('fs/promises');

const styleFilesPath = path.join(__dirname, 'styles');
const mainHtmlPath = path.join(__dirname, 'template.html');
const mainFolderPath = path.join(__dirname, 'assets');
const componentsPath = path.join(__dirname, 'components');
const projectFolderPath = path.join(__dirname, 'project-dist');

const copyFolderPath = path.join(projectFolderPath, 'assets');
const htmlPath = path.join(projectFolderPath, 'index.html');

async function cleanBundleFolder(pathBundle) {
  await fsProm.rm(pathBundle, {recursive: true, force: true});
  await fsProm.mkdir(pathBundle, {recursive: true});
  createHtml();
  createBundle();
}

async function copyDir(copyFolderPath, mainFolderPath) {
  await fsProm.mkdir(copyFolderPath, {recursive: true});
  const oldFiles = await fsProm.readdir(copyFolderPath);

  for (let file of oldFiles) {
    const pathFiles = path.join(copyFolderPath, file);
    await fsProm.unlink(pathFiles);
  }
  const files = await fsProm.readdir(mainFolderPath);
  for (let file of files) {
    const currentFile = path.join(mainFolderPath, file);
    const newFile = path.join(copyFolderPath, file);
    const stat = await fsProm.stat(currentFile);
    if (stat.isDirectory()) {
      copyDir(newFile, currentFile);
    } else {
      await fsProm.copyFile(`${mainFolderPath}/${file}`, `${copyFolderPath}/${file}`);
    }
  }
}

async function createHtml() {
  const FolderFiles = await fsProm.readdir(componentsPath);
  const read = fs.createReadStream(mainHtmlPath, 'utf8');

  const files = FolderFiles.filter(file => path.extname(file) === '.html');

  read.on('data', async function (htmlTemplate) {
    let htmlBundle = htmlTemplate.toString();

    for (let compName of files) {
      const compPath = path.join(componentsPath, compName);
      const comp = await fsProm.readFile(compPath);
      const name = path.basename(compName, '.html');
      htmlBundle = htmlBundle.replace(`{{${name}}}`, comp);
    }
    await fsProm.writeFile(htmlPath, htmlBundle, 'utf8');
  });
}

async function createBundle() {
  const streamCssBundle = fs.createWriteStream(path.join(projectFolderPath, 'style.css'));
  const styleFiles = await fsProm.readdir(styleFilesPath, {withFileTypes: true});
  for (let file of styleFiles) {
    if (file.isFile()) {
      let type = path.extname(file.name);
      if (type === '.css') {
        const readableStream = fs.createReadStream(path.join(styleFilesPath, file.name));
        readableStream.pipe(streamCssBundle);
      }
    }
  }
}

async function assembleProject() {
  await cleanBundleFolder(projectFolderPath);
  copyDir(copyFolderPath, mainFolderPath);
}

assembleProject();

