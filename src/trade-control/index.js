/**
 * 交易流程控制
 * @author Lucifer
 */

/**
 * 用Key，公共流程中非出口的key描述
 * */
const defaultKeys = ['title', 'subflow', 'back', 'recovery', 'name', 'public'];

import {BackHandler} from 'react-native';
import TradeData from './trade-data';
import SyncTrade from './sync-trade';
import PublicTrade from './public-trade';
import getTrade from '$/trade-control/get-trade';

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

// 交易恢复标识
if (window.tradeRecovery === undefined) {
  window.tradeRecovery = true;
}

/**
 * 获取当前的流程节点
 * @author Lucifer
 */
function getCurrentTradeStep() {
  return window.currentTradeStep[window.currentTradeStep.length - 1];
}

/**
 * 获取当前流程节点的标题
 * @author Lucifer
 */
function getCurrentTradeStepName() {
  return getCurrentTradeStep().title;
}

/**
 * 退出交易方法
 * @author Lucifer
 */
window.exitTrade = () => {
  // 清空交易相关数据
  window.tradeCode = null;
  window.tradeFlow = null;
  window.currentTradeStep.splice(0, window.currentTradeStep.length);

  TradeData.clearTradeData();
  SyncTrade.clearTradeInfo();

  if (window.tradepage) {
    window.tradepage.props.navigation.goBack();
    window.tradepage = null;
  }
  window.tradeEvent.remove();
  window.tradeEvent = null;
  return true;
};

/**
 * 根据当前查找到的节点和出口跳到指定的节点
 * @author Lucifer
 * */
function jumpToNextByOut(node, out) {
  const nodeCopy = JSON.parse(JSON.stringify(node));
  defaultKeys.forEach(key => {
    delete nodeCopy[key];
  });

  if (Object.keys(nodeCopy).length === 0) {
    // 没有配置任何出口
    this.exitTrade();
  } else if (!nodeCopy[out]) {
    alert(`当前的流程节点出口“${out}”不存在！`);
  } else {
    const nextNode = node[out];
    window.currentTradeStep.push(nextNode);

    if (nextNode.title) {
      const routerName = `${window.tradeCode}-${nextNode.title}`;
      if (window.tradeRecovery) {
        SyncTrade.syncTradeInfo();
      }
      window.tradepage.props.navigation.replace(routerName);
    } else if (nextNode.subflow) {
      getTrade.getPublicFlow(nextNode.subflow, result => {
        PublicTrade.startPublicTradeFlow(result, window.tradepage);
      });
    } else {
      alert('流程配置不正确');
      this.exitTrade();
    }
  }
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
   * 设置交易恢复标识
   * @author Lucifer
   * */
  setTradeRecovery(recovery) {
    window.tradeRecovery = recovery;
  },

  /**
   * 获取交易恢复标识
   * @author Lucifer
   * */
  getTradeRecovery() {
    return window.tradeRecovery;
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

    if (defaultKeys.indexOf(out) !== -1) {
      alert('流程出口信息错误！');
      return;
    }

    // 是否在交易主流程执行下一步的操作
    // 2 - 主流程执行+1
    // 1 - 无操作
    // 0 - 公共流程结束
    // -1 - 公共流程中出口配置错误
    let tradeExec = 2;

    const currentNode = JSON.parse(JSON.stringify(getCurrentTradeStep()));
    const isPublic = currentNode.public;
    // 当前在公共流程中，公共流程+1
    if (isPublic) {
      tradeExec = PublicTrade.nextStep(out);
    }

    // 如果需要主流程执行
    switch (tradeExec) {
      case 2:
        jumpToNextByOut(currentNode, out);
        break;
      case 1:
        break;
      case 0:
        const currentFlowLength = window.currentTradeStep.length;

        for (let i = currentFlowLength - 1; i >= 0; i--) {
          const node = window.currentTradeStep[i];
          if (node.subflow) {
            jumpToNextByOut(node, out);
            break;
          }
        }
        break;
      default:
        alert('公共流程出口配置错误，无需操作');
    }
  },

  /**
   * 退回到交易的上一个节点
   * @author Lucifer
   * @param tradepage 当前交易页面对象
   * @param count 需要回退的步骤数量，默认为1
   */
  back(count) {
    if (!count) {
      count = 1
    }
    let stepCount = 0;

    while (true) {
      let currentStep = getCurrentTradeStep();

      if (currentStep.title) {
        if (currentStep.back === false) {
          break;
        } else {
          window.currentTradeStep.pop();
          stepCount++;
        }
      }

      currentStep = getCurrentTradeStep();
      if (!currentStep.title && currentStep.subflow) {
        // 公共流程
        window.currentTradeStep.pop();
      }

      if (stepCount === count || window.currentTradeStep.length === 0) {
        break;
      }
    }

    if (window.currentTradeStep.length === 0) {
      this.exitTrade();
    } else {
      if (stepCount === 0) {
        alert('当前节点不允许回退');
      } else {
        const currentStep = getCurrentTradeStep();

        const routeName = currentStep.public ? currentStep.title : `${this.getTradeCode()}-${currentStep.title}`;

        window.tradepage.props.navigation.replace(routeName);

        if (window.tradeRecovery) {
          SyncTrade.syncTradeInfo();
        }
      }
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
    const _this = this;

    window.tradeEvent = BackHandler.addEventListener(
      'hardwareBackPress',
      window.exitTrade,
    );

    // 如果是以公共节点开始，需要跳转公共流程，并打开相应公共流程的节点
    const currentStep = getCurrentTradeStep();
    if (currentStep.title) {
      tradepage.props.navigation.replace(
        `${window.tradeCode}-${getCurrentTradeStepName()}`,
      );
      if (window.tradeRecovery) {
        SyncTrade.syncTradeInfo();
      }
    } else if (currentStep.subflow) {
      // 公共流程
      getTrade.getPublicFlow(currentStep.subflow, result => {
        if (result) {
          PublicTrade.startPublicTradeFlow(result, tradepage);
        } else {
          window.exitTrade();
        }
      });

    } else {
      alert("流程配置不正确！");
      tradepage.props.navigation.goBack();
    }
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

        // 恢复交易异常退出时所有的数据
        window.tradeCode = tradeInfo.tradeCode;
        window.tradeFlow = tradeInfo.tradeFlow;
        window.currentTradeStep = tradeInfo.currentTradeStep;
        window.currentTradeData = tradeInfo.currentTradeData;
        window.tradeRecovery = true;

        window.tradeEvent = BackHandler.addEventListener(
          'hardwareBackPress',
          window.exitTrade,
        );

        // 根据交易过程的recovery标志，找到需要恢复到的交易画面
        let recoveryNode = null, recoveryIndex = -1;
        for (let i = 0; i < window.currentTradeStep.length; i++) {
          const currentNode = window.currentTradeStep[i];

          if (currentNode.title) {
            if (currentNode.recovery === false) {
              break;
            } else {
              recoveryNode = currentNode;
              recoveryIndex = i;
            }
          } else if (!currentNode.title && currentNode.subflow) {
            // 主流程中subflow的节点，要查找公共流程，不处理
            continue;
          } else {
            break;
          }
        }

        if (recoveryIndex !== -1) {
          const routeName = recoveryNode.public ? recoveryNode.title : `${this.getTradeCode()}-${recoveryNode.title}`;
          window.currentTradeStep.splice(recoveryIndex + 1);
          tradepage.props.navigation.replace(routeName);
        } else {
          alert('交易不可恢复')
          tradepage.props.navigation.goBack();
        }
      })
      .catch(err => {
        alert('没有保存的交易信息！');
        tradepage.props.navigation.goBack();
      });
    }
  }
};
