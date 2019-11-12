import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

import tradeRouters from "$/router/tradeRouters";

import TradeUtil from "$/trade-control";

module.exports = class TradeTemplate extends Component {
  constructor(props) {
    super(props);

    // 交易码
    const tradecode = this.props.navigation.getParam("tradecode");
    TradeUtil.setTradeCode(tradecode);
    // 根据交易码找到交易对应的流程配置信息
    const currentTradeFlow = tradeRouters[tradecode];
    TradeUtil.setTradeFlow(currentTradeFlow.tradeflow);

    TradeUtil.startTrade(this);
  }
  render() {
    return <View />;
  }
}