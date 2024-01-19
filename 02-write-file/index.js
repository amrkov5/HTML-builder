require('node:stream');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const pathToFile = path.join(__dirname, 'text.txt');
const rl = readline.createInterface(process.stdin, process.stdout);
const writeStream = fs.createWriteStream(pathToFile, { flags: 'a' });

rl.setPrompt('Greetings!\nEnter text: ');
rl.prompt();
rl.on('line', (input) => {
  if (input.length === 0) {
    console.log('Nothing has been entered...');
    process.stdout.write('Enter text: ');
  } else {
    process.stdout.write('Enter text: ');
    writeStream.write(`${input}\n`);
    rl.on('error', (error) => console.log('Error', error.message));
  }
});

rl.on('SIGINT', () => {
  console.log('\nGood bye!');
  writeStream.close();
  rl.close();
  setTimeout(() => {
    process.exit();
  }, 500);
});
