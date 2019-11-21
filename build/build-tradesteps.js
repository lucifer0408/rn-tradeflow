const fs = require("fs");
const path = require("path");
const process = require("process");
const chalk = require("chalk");
const glob = require("glob");

const basePath = path.resolve(__dirname, "../src");

// 处理公共目录的页面资源，生成路由
const publicPagePath = `${basePath}/www/trade-public/tradepages`;

const publicRouteFile = `${basePath}/router/publicRoutes.js`;

let publicRouteContent = `module.exports = {`;

glob.sync(`${publicPagePath}/**.js`).forEach(page => {
  const filename = page.substring(page.lastIndexOf("/") + 1, page.lastIndexOf("\.js"));
  const fileRelativePath = "$/" + page.substring(`${basePath}/`.length, page.lastIndexOf("\.js"));

  publicRouteContent += `
  "${filename}": {
    "screen": require("${fileRelativePath}"), 
    "componentName": "${filename}", 
    "navigationOptions": {"header": null}
  },`;
});

publicRouteContent += `
};`;

fs.writeFileSync(publicRouteFile, publicRouteContent, { encoding: "UTF-8" });

// 处理公共目录的流程资源
const publicTradeConfigPath = `${basePath}/www/trade-public/tradeflows`;
const publicTradeDestPath = `${basePath}/router/publicFlow.js`;
let publicTradeConfigContent = `module.exports = {`;

glob.sync(`${publicTradeConfigPath}/**.json`).forEach(conf => {
  const confContent = fs.readFileSync(conf, { encoding: "UTF-8" });

  const confJson = JSON.parse(confContent);
  const key = confJson.tradecode;

  publicTradeConfigContent += `
  "${key}": ${JSON.stringify(confJson.tradeflow)},`;
})

publicTradeConfigContent += `
};
`;

fs.writeFileSync(publicTradeDestPath, publicTradeConfigContent, { encoding: "UTF-8" });

const destPath = `${basePath}/router/tradeFlow.js`;
const tradeRouterPath = `${basePath}/router/tradeRouters.js`;

let tradeCodes = [];

// 扫描全部的交易私有流程描述文件，合并
let destContent = `module.exports = {`;
let tradeRouters = `module.exports = {`;

glob.sync(`${basePath}/www/trade/**/tradeflow.json`).forEach(filepath => {
  const fileContentStr = fs.readFileSync(filepath, { encoding: "UTF-8" });

  const configJson = JSON.parse(fileContentStr);

  const tradecode = configJson.tradecode;

  if (tradeCodes.indexOf(tradecode) !== -1) {
    console.log(chalk.red("交易码有重复，请调整后再试"));
    process.exit(-1);
  } else {
    tradeCodes.push(tradecode);
    destContent += `
  "${tradecode}": {"recovery": ${configJson.recovery === false ? false : true}, "tradeflow": `;

    const pages = configJson.pages;

    pages.map(node => {
      tradeRouters += `
      "${tradecode}-${node.title}": {
        "screen": require("${node.path}"),
        "componentName": "${tradecode}-${node.componentName}",
        "navigationOptions": ${JSON.stringify(node.navigationOptions)}
      },`;
    });

    destContent += `${JSON.stringify(configJson.tradeflow, null, "\t")}},`
  }
});
destContent += `
}`;
tradeRouters += `
}`;

fs.writeFileSync(destPath, destContent, {encoding: "UTF-8"});
fs.writeFileSync(tradeRouterPath, tradeRouters, {encoding: "UTF-8"});
