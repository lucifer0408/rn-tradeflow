import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import TradeUtil from '$/trade-control';
import getTrade from '$/trade-control/get-trade';

module.exports = class TradeTemplate extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <Text>正在加载交易中，请稍后...</Text>
      </View>
    );
  }
  componentDidMount(): void {
    const _this = this;
    // 交易码
    const tradecode = _this.props.navigation.getParam('tradecode');

    // 如果有交易码，直接根据交易码进入交易，否则开始恢复交易
    if (tradecode) {
      TradeUtil.setTradeCode(tradecode);
      // 根据交易码找到交易对应的流程配置信息
      getTrade.getTradeFlow(tradecode, result => {
        TradeUtil.setTradeFlow(result.tradeflow);
        TradeUtil.startTrade(_this);
      });
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
};
