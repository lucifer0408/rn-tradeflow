/**
 * 公共发送请求的方法
 * @author Lucifer
 * */
import axios from 'axios'

module.exports = (url, data, success, failure) => {
  if (!data) {
    data = {}
  }
  const requestConfig = {
    url: url, // 请求URL
    method: 'post',
    withCredentials: false, // 跨域请求时是否需要凭证
    timeout: 20000, // 超时时间，单位毫秒
    responseType: 'json', // 服务器响应的数据类型
    responseEncoding: 'utf8', // 响应报文的编码方式
    data: data
  }

  axios(requestConfig).then(result => {
    success(result.data)
  }).catch(err => {
    if (failure) {
      failure(err)
    }
  });
}
