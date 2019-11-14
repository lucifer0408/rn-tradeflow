/**
 * 交易流程控制
 * @author Lucifer
 */
import { BackHandler } from "react-native";

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

function getCurrentTradeStep() {
  return window.currentTradeStep[window.currentTradeStep.length - 1];
}
function getCurrentTradeStepName() {
  return getCurrentTradeStep().title;
}

/**
 * 保存当前交易的全部信息
 * @author Lucifer
 */
function saveCurrentTradeToStorage() {
  if (window.$Storage) {
    $Storage.save({
      key: 'tradeInfo',
      data: JSON.stringify({
        tradeCode: window.tradeCode,
        tradeFlow: window.tradeFlow,
        currentTradeStep: window.currentTradeStep,
        currentTradeData: window.currentTradeData
      })
    });
  } else {
    console.log("没有本地存储模块！");
  }
}

function clearCurrentTradeFromStorage() {
  if (window.$Storage) {
    $Storage.remove({
      key: 'tradeInfo',
    });
  } else {
    console.log("没有本地存储模块！");
  }
}

function clearTradeData() {
  window.currentTradeData = {};
}

window.exitTrade = () => {
  // 清空交易相关数据
  window.tradeCode = null;
  window.tradeFlow = null;
  window.currentTradeStep.splice(0, window.currentTradeStep.length);
  clearTradeData();
  clearCurrentTradeFromStorage();
  if (window.tradepage) {
    window.tradepage.props.navigation.goBack();
    window.tradepage = null;
  }
  window.tradeEvent.remove();
  window.tradeEvent = null;
  return true;
}

export default {
  /**
   * 获取当前的交易码
   * @author Lucifer
   */
  getTradeCode() {
    return window.tradeCode;
  },

  /**
   * 设置当前交易码
   * @author Lucifer
   * @param tradecode 交易码
   */
  setTradeCode(tradecode) {
    window.tradeCode = tradecode;
  },

  /**
   * 设置当前交易流程
   * @author Lucifer
   * @param tradeflow 当前交易流程
   */
  setTradeFlow(tradeflow) {
    window.tradeFlow = tradeflow;
    window.currentTradeStep.push(tradeflow);
  },

  /**
   * 进入交易的下一个节点
   * @author Lucifer
   * @param out 出口名称(可不传，默认为default)
   */
  nextStep(out) {
    if (!out) {
      out = "default";
    }

    if (out === "title" || out === "back") {
      alert("流程出口信息错误！");
      return;
    }

    if (!getCurrentTradeStep()[out]) {
      alert(`当前的流程节点出口“${out}”不存在！`);
    } else {
      window.currentTradeStep.push(getCurrentTradeStep()[out]);
      const routerName = `${window.tradeCode}-${getCurrentTradeStepName()}`;

      saveCurrentTradeToStorage();

      window.tradepage.props.navigation.replace(routerName);
    }
  },

  /**
   * 退回到交易的上一个节点
   * @author Lucifer
   * @param tradepage 当前交易页面对象
   * @param count 需要回退的步骤数量，默认为1
   */
  back(count) {
    if (window.currentTradeStep.length > 1) {
      if (!count) {
        count = 1;
      }
      // 逐步弹出流程记录栈顶元素；如果碰到流程不允许退回的情况，直接break，然后开始计算需要跳转到的目标地址
      let stepCount = 0;
      for (let i = 0; i < count; i++) {
        if (window.currentTradeStep.length === 1) {
          break;
        }
        if (!(window.currentTradeStep[window.currentTradeStep.length - 1].back == false)) {
          stepCount++;
          window.currentTradeStep.pop();
        } else {
          break;
        }
      }

      if (stepCount > 0) {
        const routerName = `${window.tradeCode}-${getCurrentTradeStepName()}`;

        saveCurrentTradeToStorage();

        window.tradepage.props.navigation.replace(routerName);
      } else {
        alert("当前流程节点不允许退回");
      }
    } else if (window.currentTradeStep.length === 1) {
      window.exitTrade();
    }
  },

  /**
   * 退出当前交易
   * @author Lucifer
   */
  exitTrade() {
    window.exitTrade();
  },

  /**
   * 初始化交易画面
   * @author Lucifer
   * @param tradepage 交易画面对象
   */
  initTradePage(tradepage) {
    window.tradepage = tradepage;
  },

  /**
   * 设置交易数据
   * @author Lucifer
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
   * @author Lucifer
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
   * @author Lucifer
   */
  getAllTradeData() {
    if (!window.currentTradeData) {
      window.currentTradeData = {};
    }

    return window.currentTradeData;
  },

  /**
   * 根据Key删除交易数据
   * @author Lucifer
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
   * @author Lucifer
   */
  clearTradeData() {
    clearTradeData();
  },

  /**
   * 开始交易
   * @author Lucifer
   * @param tradepage 交易画面
   */
  startTrade(tradepage) {
    saveCurrentTradeToStorage();

    window.tradeEvent = BackHandler.addEventListener("hardwareBackPress", window.exitTrade);

    tradepage.props.navigation.replace(`${window.tradeCode}-${getCurrentTradeStepName()}`);
  },

  /**
   * 恢复交易页面
   * @author Lucifer
   */
  recoverTrade(tradepage) {
    console.log("恢复交易");
    $Storage.load({key: 'tradeInfo'}).then(result => {
      const tradeInfo = JSON.parse(result);

      window.tradeCode = tradeInfo.tradeCode;
      window.tradeFlow = tradeInfo.tradeFlow;
      window.currentTradeStep = tradeInfo.currentTradeStep;
      window.currentTradeData = tradeInfo.currentTradeData;

      window.tradeEvent = BackHandler.addEventListener("hardwareBackPress", window.exitTrade);

      tradepage.props.navigation.replace(`${window.tradeCode}-${getCurrentTradeStepName()}`);
    }).catch(err => {
      alert("没有保存的交易信息！");
      tradepage.props.navigation.goBack();
    })
  }
}
