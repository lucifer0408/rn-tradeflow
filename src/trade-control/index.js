/**
 * 交易流程控制
 * @author 孟庆云
 */

// 设置交易流程的全局参数
// 交易码
if (!window.tradeCode) {
  window.tradeCode = null;
}

// 交易流程
if (!window.tradeFlow) {
  window.tradeFlow = null;
}

// 当前交易节点
if (!window.currentTradeStep) {
  window.currentTradeStep = [];
}

// 当前交易的数据
if (!window.currentTradeData) {
  window.currentTradeData = {};
}

/**
 * 获取下一个节点的名称
 * @author 孟庆云
 */
function getBackStep(flow, step) {
  if (flow.title === step) {
    return flow;
  } else {
    for (let key in flow) {
      if (key !== "title" && key !== "back") {
        let backStep = getBackStep(flow[key], step);
        if (backStep) {
          return backStep;
        }
      }
    }
  }
}

function getCurrentTradeStep() {
  return window.currentTradeStep[window.currentTradeStep.length - 1];
}
function getCurrentTradeStepName() {
  return getCurrentTradeStep().title;
}

export default {
  /**
   * 获取当前的交易码
   * @author 孟庆云
   */
  getTradeCode() {
    return window.tradeCode;
  },

  /**
   * 设置当前交易码
   * @author 孟庆云
   * @param tradecode 交易码
   */
  setTradeCode(tradecode) {
    window.tradeCode = tradecode;
  },

  /**
   * 设置当前交易流程
   * @author 孟庆云
   * @param tradeflow 当前交易流程
   */
  setTradeFlow(tradeflow) {
    window.tradeFlow = tradeflow;
    window.currentTradeStep.push(tradeflow);
  },

  /**
   * 进入交易的下一个节点
   * @author 孟庆云
   * @param tradepage 当前交易页面对象
   * @param out 出口名称(可不传，默认为default)
   */
  nextStep(tradepage, out) {
    if (!out) {
      out = "default";
    }

    window.currentTradeStep.push(getCurrentTradeStep()[out]);
    const routerName = `${window.tradeCode}-${getCurrentTradeStepName()}`;

    tradepage.props.navigation.replace(routerName);
  },

  /**
   * 退回到交易的上一个节点
   * @author 孟庆云
   * @param tradepage 当前交易页面对象
   */
  back(tradepage) {
    if (window.currentTradeStep.length > 0) {
      window.currentTradeStep.pop();
      const routerName = `${window.tradeCode}-${getCurrentTradeStepName()}`;

      tradepage.props.navigation.replace(routerName);
    }
  },

  /**
   * 退出当前交易
   * @author 孟庆云
   * @param tradepage 当前交易页面对象
   */
  exitTrade(tradepage) {
    // 清空交易相关数据
    window.tradeCode = null;
    window.tradeFlow = null;
    window.currentTradeStep = null;

    tradepage.props.navigation.goBack();
  },

  /**
   * 设置交易数据
   * @author 孟庆云
   * @param key 交易数据Key
   * @param value 交易数据Value
   */
  setTradeData(key, value) {
    if (!window.currentTradeData) {
      window.currentTradeData = {};
    }

    window.currentTradeData[key] = value;
  },

  /**
   * 获取交易数据
   * @author 孟庆云
   * @param key 交易数据Key
   */
  getTradeData(key) {
    if (!window.currentTradeData) {
      window.currentTradeData = {};
    }

    return window.currentTradeData[key];
  },

  /**
   * 获取交易全部数据
   * @author 孟庆云
   */
  getAllTradeData() {
    if (!window.currentTradeData) {
      window.currentTradeData = {};
    }

    return window.currentTradeData;
  },

  /**
   * 根据Key删除交易数据
   * @author 孟庆云
   * @param key 交易数据Key
   */
  removeTradeData(key) {
    if (!window.currentTradeData) {
      window.currentTradeData = {};
    }

    delete window.currentTradeData[key];
  },

  /**
   * 清空交易数据
   * @author 孟庆云
   */
  clearTradeData() {
    window.currentTradeData = {};
  },

  /**
   * 开始交易
   * @author 孟庆云
   * @param tradepage 交易画面
   */
  startTrade(tradepage) {
    tradepage.props.navigation.replace(`${window.tradeCode}-${getCurrentTradeStepName()}`);
  }
}