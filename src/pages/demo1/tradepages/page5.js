import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import TradeUtil from "$/trade-control";

module.exports = class Page5 extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <View>
        <Text>这是交易的第5个页面</Text>
        <Text>{`交易数据Tradedata: ${TradeUtil.getTradeData("tradedata")}`}</Text>
        <Text>{`交易数据Step: ${TradeUtil.getTradeData("step")}`}</Text>
        <Text>点击按钮进入下一步</Text>
        <Button title={`上一步`} onPress={() => {TradeUtil.back(this);}}></Button>
        <Text>点击按钮退出交易</Text>
        <Button title={`退出`} onPress={() => {TradeUtil.exitTrade(this);}}></Button>
      </View>
    )
  }
}
