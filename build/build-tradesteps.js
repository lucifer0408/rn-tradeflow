const fs = require("fs");
const path = require("path");
const process = require("process");
const chalk = require("chalk");
const glob = require("glob");

const basePath = path.resolve(__dirname, "../src");
const destPath = `${basePath}/router/tradeRouters.js`;

let tradeCodes = [];

// 生成目标文件的内容
let destContent = `module.exports = {`;

glob.sync(`${basePath}/pages/**/tradeflow.json`).forEach(filepath => {
  const fileContentStr = fs.readFileSync(filepath, { encoding: "UTF-8" });

  const configJson = JSON.parse(fileContentStr);

  const tradecode = configJson.tradecode;

  if (tradeCodes.indexOf(tradecode) !== -1) {
    console.log(chalk.red("交易码有重复，请调整后再试"));
    process.exit(-1);
  } else {
    tradeCodes.push(tradecode);
    destContent += `"${tradecode}": {"pages": [`;

    const pages = configJson.pages;

    pages.map(node => {
      destContent += `{"title": "${node.title}", "screen": require("${node.path}"), "componentName": "${node.componentName}", "navigationOptions": ${JSON.stringify(node.navigationOptions)}},`;
    });

    destContent += `],
  "tradeflow": ${JSON.stringify(configJson.tradeflow)}`

    destContent += `},`;
  }
});

destContent += `}`;

fs.writeFileSync(destPath, destContent, {encoding: "UTF-8"});
