/**
 * 全局配置交易运行的公共参数
 * @author Lucifer
 */
module.exports = {
  /**
   * 交易流程配置是否保存在服务器上
   * 如果保存到服务器上，所有的流程（公共流程和交易私有流程）都必须从服务器端获取
   * @author Lucifer
   */
  saveOnServer: false,
  /**
   * 获取交易流程配置的服务端地址，当saveOnServer=true时启用
   * @author Lucifer
   */
  tradeInfoAddress: 'http://data.nineheaven.top:10086/service/tradeflow/getTradeflowConfig',
  /**
   * 获取公共流程配置的服务端地址，当saveOnServer=true时启用
   * @author Lucifer
   */
  publicTradeInfoAddress: 'http://data.nineheaven.top:10086/service/tradeflow/getTradeflowConfig',
  /**
   * 是否从服务端获取系统参数配置，例如交易异常退出后的恢复时间等
   * @author Lucifer
   */
  getConfigFromServer: false,
  /**
   * 交易异常退出后的恢复时间，超出这个时间以后不能恢复，单位：min
   * @author Lucifer
   */
  defaultRecoveryTimeout: 5,
};
