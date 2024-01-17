const fs = require('fs');
const path = require('path');

/* Instead of '01-read-file' you can write  __dirname , 
which indicates the name of the folder where the file is located */

// const filePath = path.join(__dirname, 'text.txt');

const filePath = path.join('01-read-file', 'text.txt');

const readStream = fs.createReadStream(filePath, 'utf-8');

readStream.pipe(process.stdout);
