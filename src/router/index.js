import {createStackNavigator} from 'react-navigation';

const tradeRouters = require('./tradeRouters');
const publicRouters = require('./publicRoutes');

let routerList = Object.assign(
  {
    homepage: {
      screen: require('$/www/home/homepage'),
      componentName: 'homepage',
      navigationOptions: {header: null},
    },
    tradetemplate: {
      screen: require('$/www/templates/tradetemplate'),
      componentName: 'tradetemplate',
      navigationOptions: {header: null},
    },
  },
  tradeRouters,
  publicRouters
);

module.exports = createStackNavigator(routerList, {
  initialRouteName: 'homepage',
});
