const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  const files = fs.readdirSync(src);

  files.forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    fs.copyFileSync(srcPath, destPath);
  });

  console.log('Directory copied successfully!');
}

const sourceDir = path.join(__dirname, 'files');

const destinationDir = path.join(__dirname, 'files-copy');

copyDir(sourceDir, destinationDir);
