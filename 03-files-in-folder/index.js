// const { Dirent } = require('node:fs');
const { readdir } = require('node:fs/promises');
const fs = require('node:fs/promises');
const path = require('path');
const pathToFolder = path.join(__dirname, 'secret-folder');

async function getListOfFiles(folderPath) {
  try {
    const files = await readdir(folderPath, { withFileTypes: true });
    for (let file in files) {
      if (files[file].isFile()) {
        const fileName = path.parse(files[file].name);
        const fileExt = fileName.ext.slice(1);
        if (fileExt.length > 0) {
          const fileStats = await fs.stat(
            path.join(folderPath, files[file].name),
          );
          console.log(
            `${fileName.name} - ${fileExt} - ${(fileStats.size / 1024).toFixed(
              3,
            )} KB`,
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

getListOfFiles(pathToFolder);
