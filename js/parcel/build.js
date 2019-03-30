const path = require('path');
const { fork } = require('child_process');

const args = process.argv.slice(2);

fork(path.join(__dirname, './bundle.js'), ['js', ...args]);
fork(path.join(__dirname, './bundle.js'), ['less', ...args]);

