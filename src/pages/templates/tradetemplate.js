import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import tradeRouters from '$/router/tradeRouters';

import TradeUtil from '$/trade-control';

module.exports = class TradeTemplate extends Component {
  constructor(props) {
    super(props);

    // 交易码
    const tradecode = props.navigation.getParam('tradecode');

    // 如果有交易码，直接根据交易码进入交易，否则开始恢复交易
    if (tradecode) {
      TradeUtil.setTradeCode(tradecode);
      // 根据交易码找到交易对应的流程配置信息
      const currentTradeFlow = tradeRouters[tradecode];
      TradeUtil.setTradeFlow(currentTradeFlow.tradeflow);

      TradeUtil.startTrade(this);
    } else {
      $Storage
        .load({
          key: 'tradeInfo',
        })
        .then(result => {
          TradeUtil.recoverTrade(this);
        })
        .catch(err => {
          console.log("没有找到保存的交易信息！", err);
          props.navigation.goBack();
        });
    }
  }
  render() {
    return <View />;
  }
};
