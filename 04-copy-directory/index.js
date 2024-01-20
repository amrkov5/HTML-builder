const fs = require('node:fs/promises');
const path = require('path');

async function copyDir() {
  const pathFromCopy = path.join(__dirname, 'files');
  const pathToCopy = path.join(__dirname, 'files-copy');
  const originalFiles = await fs.readdir(pathFromCopy);
  fs.mkdir(pathToCopy, { recursive: true }, (err) => {
    if (err) return console.error(err);
  });
  originalFiles.forEach((file) => {
    const pathToFile = path.join(pathFromCopy, file);
    const pathToCopiedFile = path.join(pathToCopy, file);
    fs.copyFile(pathToFile, pathToCopiedFile);
  });
  const copiedFiles = await fs.readdir(pathToCopy);
  const filesToDelete = copiedFiles.filter(
    (file) => !originalFiles.includes(file),
  );
  filesToDelete.forEach((file) => {
    fs.unlink(path.join(pathToCopy, file));
  });
}

copyDir();
