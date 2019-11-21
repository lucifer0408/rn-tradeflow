import React from "react";
import { View, Button, Text } from "react-native";
import { NavigationEvents } from "react-navigation";

import { getConfigFromServer, defaultRecoveryTimeout } from "$/../conf/trade-config"

const request = require('$/util/request')

module.exports = class Homepage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

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

  componentDidMount() {
    const _this = this;

    // 获取系统参数
    if (getConfigFromServer) {
      request('http://data.nineheaven.top:10086/service/getsysparam/getparam', {paramkey: 'recoverytime'}, result => {
        window.recoverytime = parseInt(result.paramvalue);

        $Storage.load({key: "tradeInfo"}).then(result => {
          _this.props.navigation.navigate("tradetemplate");
        }).catch(err => {
          console.log("没有找到保存的交易");
        });
      });
    } else {
      $Storage.load({key: "tradeInfo"}).then(result => {
        console.log(JSON.parse(result));
        _this.props.navigation.navigate("tradetemplate");
      }).catch(err => {
        console.log("没有找到保存的交易");
      });
    }



  }

  jumpToTrade(tradecode) {
    this.props.navigation.navigate("tradetemplate", {tradecode: tradecode});
  }
}
