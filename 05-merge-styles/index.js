const fs_promises = require('node:fs/promises');
const fs = require('fs');
const path = require('path');

async function mergeStyles() {
  const pathToStyles = path.join(__dirname, 'styles');
  const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');
  const stylesArr = await fs_promises.readdir(pathToStyles, {
    withFileTypes: true,
  });
  const writeStream = fs.createWriteStream(pathToBundle);
  stylesArr.forEach(async (file) => {
    if (file.isFile()) {
      if (file.name.includes('.css')) {
        const readStream = fs.createReadStream(
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

mergeStyles();
