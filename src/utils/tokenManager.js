/*
* createTime：2019/6/6
* author：en.chen
* description: 前端token处理
*/

import Storage from './storage'

const tokenManager = {

  //  获取token
  async getclientToken(type) {

    if (!!Storage.get('TOKENINFO')) {

      //  微信缓存中获取token

      return Storage.get('TOKENINFO').access_token

    } else {

      //  微信缓存中没有token，通过请求获取

      if(!!type && type==='pwd') {
        // todo 账号密码模式
      }else{
        //  游客模式
        let res = await tokenManager.getToken()
        return res.access_token
      }
    }
  },

  //  游客模式
  async getToken() {
    let data = {
      client_id: "wissClient",
      client_secret: "wissClientSecret"
    }
    return new Promise((reslove,reject) => {
      wx.request({
        url: global.baseConstant.serverUrl + 'token/clientToken',
        data: data,
        method: 'POST',
        success: (res) => {
          Storage.set('TOKENINFO',res.data,6660)  // 设置token存储时间为1小时52分钟
          reslove(res.data)
        }
      })
    })
  }

}

export default tokenManager
