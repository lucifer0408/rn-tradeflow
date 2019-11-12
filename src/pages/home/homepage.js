import React from "react";
import { View, Button, Text } from "react-native";
import { NavigationEvents } from "react-navigation";

module.exports = class Homepage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {}

    this.jumpToTrade = this.jumpToTrade.bind(this);
  }

  render() {
    return (
      <View>
        {/* NavigationEvents
          * onWillFocus：即将聚焦
          * onDidFocus：已经聚焦
          * onWillBlur：即将失去焦点
          * onDidBlur：已经失去焦点
         */}
        <NavigationEvents onDidFocus={payload => {
          alert("DidFocus")
        }} />
        <Text>
          点击按钮进入Demo1交易1
        </Text>
        <Button title="点击进入Demo1交易" onPress={() => {this.jumpToTrade("demo1")}}></Button>
      </View>
    )
  }

  jumpToTrade(tradecode) {
    this.props.navigation.navigate("tradetemplate", {tradecode: tradecode});
  }
}