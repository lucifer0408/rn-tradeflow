import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

import TradeUtil from '$/trade-control';

module.exports = class Page1 extends React.Component {
  constructor(props) {
    super(props);
    TradeUtil.initTradePage(this);

    this.state = {};
  }
  render() {
    return (
      <View>
        <Text style={{marginTop: 30}}>这是交易的第1个页面</Text>
        <Text>点击按钮设置数据，在下一步可以看到</Text>
        <Button
          title={'设置数据'}
          onPress={() => {
            TradeUtil.setTradeData('tradedata', 'current');
          }}
        />
        <Text>点击按钮进入下一步，去往Page2.1</Text>
        <Button
          title={'下一步'}
          onPress={() => {
            TradeUtil.nextStep();
          }}
        />
        <Text>点击按钮进入下一步，去往Page2.2</Text>
        <Button
          title={'下一步'}
          onPress={() => {
            TradeUtil.nextStep('other');
          }}
        />
      </View>
    );
  }
};
