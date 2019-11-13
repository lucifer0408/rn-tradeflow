#!/usr/bin/env node
const program = require('commander');
const initTradePage = require("../src/init-page");

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
  console.log('  agree init-page <tradecode> <pagename>');
  console.log('  Examples:');
  console.log('   # agree init-page hello step1');
}

help();

const params = process.argv.splice(2);
program.cwd = process.cwd();

if (!params || params.length < 2) {
  showHelp();
} else {
  initTradePage(params[0], params[1]);
}