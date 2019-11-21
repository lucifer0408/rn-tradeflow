/**
 * 公共流程管理模块
 * @author Lucifer
 */

/**
 * 通用Key，公共流程中非出口的key描述
 * */
const defaultKeys = ['title', 'back', 'recovery', 'name', 'public'];

import SyncTrade from './sync-trade';

function getCurrentPublicStep() {
  return window.currentTradeStep[window.currentTradeStep.length - 1];
}

/**
 * 向当前公共流程节点中添加新的流程执行历史
 * @author Lucifer
 * */
function addNewPublicStep(step) {
  step.public = true;
  window.currentTradeStep.push(step);
}

export default {
  /**
   * 设置公共交易流程配置
   * @author Lucifer
   * @param flow 公共交易流程
   */
  startPublicTradeFlow(flow, tradepage) {
    if (!tradepage) {
      tradepage = window.tradepage;
    }
    addNewPublicStep(flow)
    tradepage.props.navigation.replace(flow.title);
    if (window.tradeRecovery) {
      SyncTrade.syncTradeInfo();
    }
  },
  /**
   * 当前是否在最后一个节点
   * @author Lucifer
   * */
  isLastNode() {
    const currentNode = getCurrentPublicStep();
    let keys = Object.keys(currentNode);
    let result = true;

    keys.forEach(key => {
      if (defaultKeys.indexOf(key) === -1) {
        result = false;
      }
    });

    return result;
  },
  /**
   * 当前是否在第一个节点
   * @author Lucifer
   * */
  isFirstNode() {
    const currentNode = getCurrentPublicStep();
    return currentNode.length === 1;
  },
  /**
   * 公共流程的下个节点
   * @param out 出口
   * @param tradepage 交易画面对象
   *
   * @return -1 - 流程出口配置错误
   * @return 0 - 没有配置流程出口，主流程前进一步
   * @return 1 - 流程出口配置正确，子流程执行
   * */
  nextStep(out, tradepage) {
    if (!out) {
      out = 'default';
    }
    if (!tradepage) {
      tradepage = window.tradepage;
    }

    const currentNode = JSON.parse(JSON.stringify(getCurrentPublicStep()));

    defaultKeys.forEach(key => {
      delete currentNode[key];
    });

    if (Object.keys(currentNode).length === 0) {
      // 没有任何出口，回到主流程前进一步
      return 0;
    } else {
      if (Object.keys(currentNode).indexOf(out) === -1) {
        // 流程出口配置不正确
        return -1;
      } else {
        const nextNode = currentNode[out];

        // 处理公共流程信息
        addNewPublicStep(nextNode);

        tradepage.props.navigation.replace(nextNode.title);
        if (window.tradeRecovery) {
          SyncTrade.syncTradeInfo();
        }
        return 1;
      }
    }
  }
};
