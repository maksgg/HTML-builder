const readline = require('readline');
const fs = require('fs');

// Step 2: Create a writable stream to a text file
const outputFile = fs.createWriteStream('output.txt');

// Step 3: Display a welcome message in the console
console.log('Welcome! Enter text or type "exit" to stop.');

// Step 4: Wait for user input with subsequent checking for the presence of the keyword 'exit'
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (userInput) => {
  if (userInput.toLowerCase() === 'exit') {
    rl.close();
  } else {
    // Step 5: Write the entered text to the file
    outputFile.write(userInput + '\n');
  }
});

// Step 6: Implement a farewell message when the process is stopped
rl.on('close', () => {
  console.log('\nFarewell! Your input has been saved to "output.txt".');
  outputFile.close();
});
