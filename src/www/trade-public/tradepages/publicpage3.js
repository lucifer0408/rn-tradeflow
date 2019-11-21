import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

import TradeUtil from '$/trade-control';

module.exports = class Publicpage2 extends React.Component {
  constructor(props) {
    super(props);

    TradeUtil.initTradePage(this);
  }
  render() {
    return (
      <View>
        <Text>当前在公共流程</Text>
        <Text>公共页面3</Text>
        <Text>点击按钮进入下一步</Text>
        <Button
          title={'下一步'}
          onPress={() => {
            this.goNext();
          }}
        />
        <Text>点击按钮进入上一步</Text>
        <Button
          title={'上一步'}
          onPress={() => {
            this.goBack();
          }}
        />
      </View>
    );
  }
  goNext() {
    TradeUtil.nextStep();
  }

  goBack() {
    TradeUtil.back();
  }
};

const styles = StyleSheet.create({});
