const fs = require("fs");
const process = require("process");
const chalk = require("chalk");

const tradeBasePath = `${process.cwd()}/src/pages`;
const templatePath = `${process.cwd()}/lucifer_templates/tradepage-template/index.js`;
const babelPlugin = require(`${process.cwd()}/babel.config`).plugins;

/**
 * 初始化页面
 * @author 孟庆云
 * */
module.exports = function(tradecode, filename) {
  console.log("交易码: ", tradecode);
  console.log("交易画面名称: ", filename);

  const tradePath = tradeBasePath + `/${tradecode}`;

  // 如果交易目录不存在，首先创建
  if (!fs.existsSync(tradePath)) {
    fs.mkdirSync(tradePath, { recursive: true });
  }

  const tradeConfigPath = tradePath + "/tradeflow.json";
  let tradeConfig = null;

  // 获取交易流程配置
  if (fs.existsSync(tradeConfigPath)) {
    tradeConfig = JSON.parse(fs.readFileSync(tradeConfigPath, { encoding: "UTF-8" }));
  } else {
    tradeConfig = { tradecode: tradecode, pages: [], tradeflow: {} };
  }

  // 判断交易画面是否存在
  const tradePagePath = tradePath + `/tradepages/${filename}.js`;
  if (fs.existsSync(tradePagePath)) {
    console.log(chalk.red("当前画面已经存在，请不要重新创建！"));
  } else {
    const className = filename.charAt(0).toUpperCase() + filename.substr(1);
    const tradePageContent = fs.readFileSync(templatePath, { encoding: "UTF-8" }).replace(/\${className}/g, className);

    // 首先判断默认保存交易画面的目录是否存在
    if (!fs.existsSync(`${tradePath}/tradepages`)) {
      fs.mkdirSync(`${tradePath}/tradepages`);
    }

    // 写入交易画面文件
    fs.writeFileSync(tradePagePath, tradePageContent, {encoding: "UTF-8"});

    // 更新交易流程配置
    // 首先计算交易画面的相对路径
    const tradeRelativePath = getBabelRootImportConfig() + tradePagePath.substring(`${process.cwd()}/src/`.length);

    let tradePageConfig = {};
    tradePageConfig.title = filename;
    tradePageConfig.componentName = filename;
    tradePageConfig.path = tradeRelativePath;
    tradePageConfig.navigationOptions = {
      "header": null
    };

    tradeConfig.pages.push(tradePageConfig);

    // console.log(JSON.stringify(tradeConfig, null, "\t"));

    // 写入交易流程配置
    fs.writeFileSync(tradeConfigPath, JSON.stringify(tradeConfig, null, "\t"), { encoding: "UTF-8" });
  }
};

/**
 * 获取babel-plugin-root-import中src目录的配置
 * @author 孟庆云
 * */
function getBabelRootImportConfig() {
  let ret = null;
  babelPlugin.map(node => {
    if (node[0] === "babel-plugin-root-import") {
      const configs = node[1].paths;
      configs.map(pathConfig => {
        if (pathConfig.rootPathSuffix === "./src/") {
          ret = pathConfig.rootPathPrefix;
        }
      });
    }
  });

  return ret;
}
