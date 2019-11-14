/**
 * 同步交易数据
 * @author Lucifer
 */
export default {
  /**
   * 同步交易数据到本地存储(真实落地时可以考虑同步到后台)
   * @author Lucifer
   */
  syncTradeInfo() {
    if (window.$Storage) {
      return $Storage.save({
        key: 'tradeInfo',
        data: JSON.stringify({
          tradeCode: window.tradeCode,
          tradeFlow: window.tradeFlow,
          currentTradeStep: window.currentTradeStep,
          currentTradeData: window.currentTradeData
        })
      });
    } else {
      console.log("存储模块没有初始化！");
      return null;
    }
  },
  clearTradeInfo() {
    if (window.$Storage) {
      $Storage.remove({
        key: 'tradeInfo',
      });
    } else {
      console.log("存储模块没有初始化！");
      return null;
    }
  },
  getTradeInfo() {
    if (window.$Storage) {
      return $Storage.load({key: 'tradeInfo'});
    } else {
      console.log("存储模块没有初始化！");
      return null;
    }
  }
}