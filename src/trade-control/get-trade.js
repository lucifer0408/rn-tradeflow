/**
 * 获取交易信息的接口
 * @author Lucifer
 */
const globalConfig = require('$/../conf/trade-config');
const allTradeFlow = require('$/router/tradeFlow');
const publicTradeFlow = require('$/router/publicFlow');

const request = require('$/util/request');

export default {
  /**
   * 根据交易码获取交易的流程配置信息
   * @author Lucifer
   */
  getTradeFlow: (tradecode, success, failure) => {
    if (globalConfig.saveOnServer) {
      request(globalConfig.tradeInfoAddress, {tradecode: tradecode}, result => {
        success(JSON.parse(result.tradeconfig));
      });
    } else {
      new Promise((resolve, reject) => {
        if (allTradeFlow[tradecode]) {
          resolve(allTradeFlow[tradecode]);
        } else {
          if (failure) {
            reject(new Error('Not Found'));
          }
        }
      })
        .then(tradeflow => {
          if (success) {
            success(tradeflow);
          }
        })
        .catch(err => {
          if (failure) {
            failure(err);
          }
        });
    }
  },
  /**
   * 根据交易码获取公共流程配置信息
   * @author Lucifer
   */
  getPublicFlow: (tradecode, success, failure) => {
    if (globalConfig.saveOnServer) {
      request(
        globalConfig.publicTradeInfoAddress,
        {tradecode: tradecode},
        result => {
          success(JSON.parse(result.tradeconfig).tradeflow);
        },
      );
    } else {
      return new Promise((resolve, reject) => {
        if (publicTradeFlow[tradecode]) {
          resolve(publicTradeFlow[tradecode]);
        } else {
          reject('未找到公共流程配置！');
        }
      })
        .then(tradeflow => {
          if (success) {
            success(tradeflow);
          }
        })
        .catch(err => {
          if (failure) {
            failure(err);
          }
        });
    }
  },
};
