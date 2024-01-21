const { createWriteStream, createReadStream } = require('node:fs');
const fs = require('node:fs/promises');
const path = require('path');

function createDirectory() {
  const pathToFinalDirectory = path.join(__dirname, 'project-dist');
  const pathFromCopy = path.join(__dirname, 'assets');
  const pathToCopy = path.join(__dirname, 'project-dist', 'assets');
  fs.mkdir(pathToFinalDirectory, { recursive: true }, (err) => {
    if (err) return console.error(err);
  });
  readTemplate();
  mergeStyles();
  copyDir(pathToCopy, pathFromCopy);
}

async function readTemplate() {
  let template = await fs.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  addComponents(template);
}

async function addComponents(template) {
  const components = await fs.readdir(path.join(__dirname, 'components'), {
    withFileTypes: true,
  });
  const promisesArr = components.map(async (component) => {
    if (path.parse(component.name).ext === '.html') {
      const compName = path.parse(component.name).name;
      const compData = await fs.readFile(
        path.join(component.path, component.name),
        'utf-8',
      );
      template = template.replace(`{{${compName}}}`, `${compData}`);
    }
  });
  Promise.all(promisesArr).then(() => {
    putFileToDir(template);
  });
}

async function mergeStyles() {
  const pathToStyles = path.join(__dirname, 'styles');
  const pathToBundle = path.join(__dirname, 'project-dist', 'style.css');
  const stylesArr = await fs.readdir(pathToStyles, {
    withFileTypes: true,
  });
  const writeStream = createWriteStream(pathToBundle);
  stylesArr.forEach(async (file) => {
    if (file.isFile()) {
      if (file.name.includes('.css')) {
        const readStream = createReadStream(
          path.join(file.path, file.name),
          'utf-8',
        );

        readStream.on('data', (chunk) => {
          writeStream.write(chunk);
        });
      }
    }
  });
}
async function copyDir(pathToCopy, pathFromCopy) {
  const originalFiles = await fs.readdir(pathFromCopy, { withFileTypes: true });
  fs.mkdir(pathToCopy, { recursive: true }, (err) => {
    if (err) return console.error(err);
  });
  originalFiles.forEach((file) => {
    if (file.isFile()) {
      fs.copyFile(
        path.join(file.path, file.name),
        path.join(pathToCopy, file.name),
      );
    } else {
      copyDir(
        path.join(pathToCopy, file.name),
        path.join(pathFromCopy, file.name),
      );
    }
  });
  const copiedFiles = await fs.readdir(pathToCopy);
  const originalFilesToCheck = await fs.readdir(pathFromCopy);
  const filesToDelete = copiedFiles.filter(
    (file) => !originalFilesToCheck.includes(file),
  );
  filesToDelete.forEach((file) => {
    fs.unlink(path.join(pathToCopy, file));
  });
}

function putFileToDir(file) {
  const writeFile = createWriteStream(
    path.join(__dirname, 'project-dist', 'index.html'),
  );
  writeFile.write(file);
}

createDirectory();
