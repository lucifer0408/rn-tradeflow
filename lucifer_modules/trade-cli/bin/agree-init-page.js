#!/usr/bin/env node
const program = require('commander');
const initPage = require("../src/init-notradepage");

program.on('--help', () => {
  showHelp();
});

function help() {
  program.parse(process.argv);
  if (program.args.length < 1) {
    return program.help();
  }
}

function showHelp() {
  console.log('  agree init-trade <tradecode>');
  console.log('  Examples:');
  console.log('   # agree init-trade hello');
}

help();

const params = process.argv.splice(2);
program.cwd = process.cwd();

if (!params || params.length < 1) {
  showHelp();
} else {
  initPage(params[0]);
}
