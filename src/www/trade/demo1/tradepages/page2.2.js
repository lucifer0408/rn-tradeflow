import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import TradeUtil from "$/trade-control";

module.exports = class Page22 extends React.Component {
  constructor(props) {
    super(props);
    TradeUtil.initTradePage(this);
  }
  render() {
    return(
      <View>
        <Text>这是交易的第2-2个页面</Text>
        <Text>{`交易数据: ${TradeUtil.getTradeData("tradedata")}`}</Text><Text>点击按钮设置数据，在下一步可以看到</Text>
        <Button title={`设置数据`} onPress={() => {
          TradeUtil.setTradeData("step", "2.2");
        }}></Button>
        <Text>点击按钮进入下一步</Text>
        <Button title={`下一步`} onPress={() => {TradeUtil.nextStep();}}></Button>
        <Text>点击按钮返回上一步</Text>
        <Button title={`上一步`} onPress={() => {TradeUtil.back();}}></Button>
        <Text>点击按钮退出交易</Text>
        <Button title={`退出`} onPress={() => {TradeUtil.exitTrade();}}></Button>
      </View>
    )
  }
}
