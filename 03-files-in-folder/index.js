const fs = require('fs/promises');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

async function getInfo() {
  try {
    const entries = await fs.readdir(secretFolder, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile()) {
        const entryPath = path.join(secretFolder, entry.name);
        const fileStats = await fs.stat(entryPath);
        const fileSizeInKB = fileStats.size / 1024;
        console.log(`${path.parse(entry.name).name} - ${path.parse(entry.name).ext.substring(1)} - ${fileSizeInKB.toFixed(3)}kb`);
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: The specified folder '${secretFolder}' was not found.`);
    } else {
      console.error(`An error occurred: ${error.message}`);
    }
  }
}
getInfo();