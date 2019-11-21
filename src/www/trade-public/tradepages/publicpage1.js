import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

import TradeUtil from '$/trade-control';

module.exports = class Publicpage1 extends React.Component {
  constructor(props) {
    super(props);

    TradeUtil.initTradePage(this);
  }
  render() {
    return (
      <View>
        <Text>当前在公共流程</Text>
        <Text>公共页面1</Text>
        <Text>点击设置数据</Text>
        <Button
          title={'设置数据'}
          onPress={() => {
            TradeUtil.setTradeData('publicdata1', 'page1');
          }}
        />
        <Text>点击按钮进入下一步</Text>
        <Button
          title={'下一步'}
          onPress={() => {
            TradeUtil.nextStep();
          }}
        />
        <Text>点击按钮进入上一步</Text>
        <Button
          title={'上一步'}
          onPress={() => {
            TradeUtil.back();
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({});
