import React from "react";
import { View } from "react-native";

// 引用交易流程管理工具
import TradeUtil from "$/trade-control";

module.exports = class ${className} extends React.Component {
  constructor(props) {
    super(props);
    TradeUtil.initTradePage(this);
  }
  render() {
    return (<View />)
  }
};
