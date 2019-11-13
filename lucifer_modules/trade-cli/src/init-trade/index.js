const fs = require('fs');
const process = require('process');
const chalk = require('chalk');

const tradeBasePath = `${process.cwd()}/src/pages`;

module.exports = function(tradecode) {
  console.log('交易码: ', tradecode);

  const tradePath = tradeBasePath + `/${tradecode}`;

  if (fs.existsSync(tradePath)) {
    console.log(chalk.red('当前交易已存在，不允许重复创建！'));
  } else {
    fs.mkdirSync(tradePath);
    fs.mkdirSync(`${tradePath}/tradepages`);
    const tradeConfigPath = `${tradePath}/tradeflow.json`;
    const tradeConfig = {tradecode: tradecode, pages: [], tradeflow: {}};

    fs.writeFileSync(tradeConfigPath, JSON.stringify(tradeConfig, null, "\t"), { encoding: "UTF-8" });
  }
};
