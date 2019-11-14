/**
 * 交易数据管理模块
 * @author Lucifer
 */
import SyncTrade from "./sync-trade";

// 当前交易的数据
if (!window.currentTradeData) {
  window.currentTradeData = {};
}

export default {
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

    return SyncTrade.syncTradeInfo();
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

    return SyncTrade.syncTradeInfo();
  },

  /**
   * 清空交易数据
   * @author Lucifer
   */
  clearTradeData() {
    window.currentTradeData = {};

    return SyncTrade.syncTradeInfo();
  },
}