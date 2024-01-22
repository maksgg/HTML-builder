const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const projectDistFolderPath = path.join(__dirname, 'project-dist');
const outputFile = path.join(projectDistFolderPath, 'bundle.css');

fs.readdir(stylesFolderPath, (err, files) => {
  if (err) {
    console.error('Error reading styles folder:', err);
    return;
  }

  const styleFiles = files.filter((file) => {
    const filePath = path.join(stylesFolderPath, file);
    const isFile = fs.statSync(filePath).isFile();
    const hasCorrectExtension = path.extname(file).toLowerCase() === '.css';

    return isFile && hasCorrectExtension;
  });

  const compiledStyles = styleFiles.map((file) => {
    const filePath = path.join(stylesFolderPath, file);
    return fs.readFileSync(filePath, 'utf8');
  });

  const bundleContent = compiledStyles.join('\n');
  fs.writeFileSync(outputFile, bundleContent, 'utf8');

  console.log('Styles compiled successfully!');
});
