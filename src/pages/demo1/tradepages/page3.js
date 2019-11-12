import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import TradeUtil from "$/trade-control";

module.exports = class Page3 extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <View>
        <Text>这是交易的第3个页面</Text>
        <Text>点击按钮进入下一步，去往Page5</Text>
        <Button title={`下一步`} onPress={() => {TradeUtil.nextStep(this);}}></Button>
        <Text>点击按钮返回上一步</Text>
        <Button title={`上一步`} onPress={() => {TradeUtil.back(this);}}></Button>
        <Text>点击按钮退出交易</Text>
        <Button title={`退出`} onPress={() => {TradeUtil.exitTrade(this);}}></Button>
      </View>
    )
  }
}
