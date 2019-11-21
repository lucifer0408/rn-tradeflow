import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import TradeUtil from "$/trade-control";

module.exports = class Page5 extends React.Component {
  constructor(props) {
    super(props);
    TradeUtil.initTradePage(this);
  }
  render() {
    return(
      <View>
        <Text>这是交易的第5个页面</Text>
        <Text>{`交易数据Tradedata: ${TradeUtil.getTradeData("tradedata")}`}</Text>
        <Text>{`交易数据Step: ${TradeUtil.getTradeData("step")}`}</Text>
        <Text>点击按钮退回上一步</Text>
        <Button title={`上一步`} onPress={() => {TradeUtil.back();}}></Button>
        <Text>点击按钮退回3步</Text>
        <Button title={`退回3步`} onPress={() => {TradeUtil.back(3);}}></Button>
        <Text>点击按钮进入下一步</Text>
        <Button title={`下一步`} onPress={() => {TradeUtil.nextStep();}}></Button>
        <Text>点击按钮退出交易</Text>
        <Button title={`退出`} onPress={() => {TradeUtil.exitTrade();}}></Button>
      </View>
    )
  }
}
