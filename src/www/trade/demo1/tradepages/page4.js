import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import TradeUtil from "$/trade-control";

module.exports = class Page4 extends React.Component {
  constructor(props) {
    super(props);
    TradeUtil.initTradePage(this);
  }
  render() {
    return(
      <View>
        <Text>这是交易的第4个页面</Text>
        <Text>点击按钮进入下一步，去往Page5</Text>
        <Button title={`下一步`} onPress={() => {TradeUtil.nextStep();}}></Button>
        <Text>点击按钮返回上一步</Text>
        <Button title={`上一步`} onPress={() => {TradeUtil.back();}}></Button>
        <Text>点击按钮退出交易</Text>
        <Button title={`退出`} onPress={() => {TradeUtil.exitTrade();}}></Button>
      </View>
    )
  }
}
