/**
 * 初始化非交易页面方法
 * @author Lucifer
 * @param filepath 需要创建页面的路径
 * */
const process = require("process");
const fs = require("fs");
const chalk = require("chalk");

const pageTemplatePath = `${process.cwd()}/lucifer_templates/page-template/index.js`;

module.exports = function(filepath) {
  if (filepath.endsWith("\.js")) {
    const pagePath = `${process.cwd()}/${filepath}`;
    console.log("需要创建文件的路径: ", pagePath);

    const pageDirectory = pagePath.substr(0, pagePath.lastIndexOf("/"));

    // 创建页面所在的目录
    fs.mkdirSync(pageDirectory, { recursive: true });

    const filename = pagePath.substring(pagePath.lastIndexOf("/") + 1, pagePath.lastIndexOf("\.js"));
    const className = filename.charAt(0).toUpperCase() + filename.substr(1);

    const pageContent = fs.readFileSync(pageTemplatePath, { encoding: "UTF-8" }).replace(/\${className}/g, className);

    fs.writeFileSync(pagePath, pageContent, { encoding: "UTF-8" });
  } else {
    console.log(chalk.red("页面路径不是以.js结尾，不能创建！"));
  }
}
