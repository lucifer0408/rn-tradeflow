#!/usr/bin/env node
const packageVersion = require('../package.json').version;
const process = require('process');

const program = require('commander');

function run() {
  program
    .version(packageVersion)
    .usage('<command> [options]')
    .command('init-tradepage', 'init from page template')
    .parse(process.argv);
}

run();
