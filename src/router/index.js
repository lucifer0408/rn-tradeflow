import {createStackNavigator} from 'react-navigation';

const tradeRouters = require('./tradeRouters');

// 根据交易路由生成对应的路由配置
function buildTradeRouters() {
  let retList = {};
  for (let trade in tradeRouters) {
    const config = tradeRouters[trade];
    const tradeSteps = config.pages;

    console.log(trade);
    tradeSteps.map((node, index) => {
      let currentTradeRoute = {};
      currentTradeRoute.screen = node.screen;
      currentTradeRoute.componentName = `${trade}-${node.componentName}`;
      currentTradeRoute.navigationOptions = node.navigationOptions
        ? node.navigationOptions
        : {header: null};

      retList[`${trade}-${node.componentName}`] = currentTradeRoute;
    });
  }

  return retList;
}

let routerList = Object.assign(
  {
    homepage: {
      screen: require('$/pages/home/homepage'),
      componentName: 'homepage',
      navigationOptions: {header: null},
    },
    tradetemplate: {
      screen: require('$/pages/templates/tradetemplate'),
      componentName: 'tradetemplate',
      navigationOptions: {header: null},
    },
  },
  buildTradeRouters(),
);

module.exports = createStackNavigator(routerList, {
  initialRouteName: 'homepage',
});
