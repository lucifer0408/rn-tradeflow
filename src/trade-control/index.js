/**
 * 交易流程控制
 * @author Lucifer
 */
import {BackHandler} from 'react-native';
import TradeData from './trade-data';
import SyncTrade from './sync-trade';

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

function getCurrentTradeStep() {
  return window.currentTradeStep[window.currentTradeStep.length - 1];
}
function getCurrentTradeStepName() {
  return getCurrentTradeStep().title;
}

window.exitTrade = () => {
  // 清空交易相关数据
  window.tradeCode = null;
  window.tradeFlow = null;
  window.currentTradeStep.splice(0, window.currentTradeStep.length);

  const promise = TradeData.clearTradeData();
  if (promise) {
    promise.then(result => {
      SyncTrade.clearTradeInfo();
    });
  }

  if (window.tradepage) {
    window.tradepage.props.navigation.goBack();
    window.tradepage = null;
  }
  window.tradeEvent.remove();
  window.tradeEvent = null;
  return true;
};

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
      out = 'default';
    }

    if (out === 'title' || out === 'back') {
      alert('流程出口信息错误！');
      return;
    }

    if (out === 'default' && !getCurrentTradeStep()[out]) {
      this.exitTrade();
    } else if (out !== 'default' && !getCurrentTradeStep()[out]) {
      alert(`当前的流程节点出口“${out}”不存在！`);
    } else {
      window.currentTradeStep.push(getCurrentTradeStep()[out]);
      const routerName = `${window.tradeCode}-${getCurrentTradeStepName()}`;

      SyncTrade.syncTradeInfo();

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
        if (
          !(
            window.currentTradeStep[window.currentTradeStep.length - 1].back ==
            false
          )
        ) {
          stepCount++;
          window.currentTradeStep.pop();
        } else {
          break;
        }
      }

      if (stepCount > 0) {
        const routerName = `${window.tradeCode}-${getCurrentTradeStepName()}`;

        SyncTrade.syncTradeInfo();

        window.tradepage.props.navigation.replace(routerName);
      } else {
        alert('当前流程节点不允许退回');
      }
    } else if (window.currentTradeStep.length === 1) {
      this.exitTrade();
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
   * 设置交易数据
   * @author Lucifer
   * @param key 交易数据Key
   * @param value 交易数据Value
   */
  setTradeData(key, value) {
    TradeData.setTradeData(key, value);
  },

  /**
   * 根据key获取交易数据
   * @author Lucifer
   * @param key 交易数据Key
   */
  getTradeData(key) {
    return TradeData.getTradeData(key);
  },

  /**
   * 获取所有交易数据
   * @author Lucifer
   */
  getAllTradeData() {
    return TradeData.getAllTradeData();
  },

  /**
   * 根据Key删除交易数据
   * @author Lucifer
   * @param key 交易数据Key
   */
  removeTradeData(key) {
    TradeData.removeTradeData(key);
  },

  /**
   * 清空交易数据
   * @author Lucifer
   */
  clearTradeData() {
    TradeData.clearTradeData();
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
   * 开始交易
   * @author Lucifer
   * @param tradepage 交易画面
   */
  startTrade(tradepage) {
    SyncTrade.syncTradeInfo();

    window.tradeEvent = BackHandler.addEventListener(
      'hardwareBackPress',
      window.exitTrade,
    );

    tradepage.props.navigation.replace(
      `${window.tradeCode}-${getCurrentTradeStepName()}`,
    );
  },

  /**
   * 恢复交易页面
   * @author Lucifer
   */
  recoverTrade(tradepage) {
    const tradeInfo = SyncTrade.getTradeInfo();

    if (tradeInfo) {
      tradeInfo.then(result => {
        const tradeInfo = JSON.parse(result);

        window.tradeCode = tradeInfo.tradeCode;
        window.tradeFlow = tradeInfo.tradeFlow;
        window.currentTradeStep = tradeInfo.currentTradeStep;
        window.currentTradeData = tradeInfo.currentTradeData;

        window.tradeEvent = BackHandler.addEventListener(
          'hardwareBackPress',
          window.exitTrade,
        );

        tradepage.props.navigation.replace(
          `${window.tradeCode}-${getCurrentTradeStepName()}`,
        );
      })
      .catch(err => {
        alert('没有保存的交易信息！');
        tradepage.props.navigation.goBack();
      });
    }
  }
};
