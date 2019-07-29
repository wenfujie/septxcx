/*
* createTime：2018/9/6
* author：en.chen
* description:  获取token
*/

const config = require("../config");

const axios = require('axios')

// todo 线上取环境变量
let url = config.tokenUrl || 'http://qishon-zuul-gateway.test.qs.com/uaa/oauth-client/token'

class getToken {

  //  通过客户端获取token
  static async getclientToken(ctx, params) {
    return axios.post(url, params).then((res) => {
      return res.data
    });
  }

  //  通过密码模式获取token
  static async getPwdToken(ctx, params) {
    return axios.post(url, params).then((res) => {
      return res
    });
  }

}

module.exports = getToken
