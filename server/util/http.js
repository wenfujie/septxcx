/*
 * createTime：2018-06-07
 * author：yongtian.hong
 * description: 封装四种HTTP请求类型
 * */
const axios = require('axios')
const TokenManager = require('./token-manager')
const moment = require('moment')

// 添加请求拦截器
axios.interceptors.request.use(function (request) {
    // 打印请求发出的时间、请求方式、请求地址、请求参数
    console.log("[" + moment(new Date()).format('YYYY-MM-DD HH:mm:ss ms') + "][" + request.method.toUpperCase() + " request]" + request.url + ", 参数: " + JSON.stringify(request.params || request.data))
    return request;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

/**
 * 返回状态判断(添加响应拦截器)
 */
axios.interceptors.response.use((response) => {
    let resUrl = response.config.url
    let data = JSON.stringify(response.data)
    if (resUrl.indexOf('file/oss') !== -1) { // 过滤图片请求返回的参数
        data = ""
    }
    console.log("[" + moment(new Date()).format('YYYY-MM-DD HH:mm:ss ms') + "][response]" + resUrl + ", 返回数据: " + data)
    return response
}, (err) => {
    console.log('koa-http-err', err)
    try {
        if ((err.error === 'invalid_token') || err.response.error === 'invalid_token' || err.status === 401 || err.response.status === 401) { // token过期处理
            global.tokenMap = undefined
            TokenManager.getToken()
        }
    } catch (e) {}
    err.response.data.statusCode = err.response.status
    return err.response
})


class http {
  /*
   * 查询方法
   * options: 设置axios其他参数项
   * */
  static async get(serverUrl, params, options) {
    let configObj = Object.assign({
      params: params
    }, {
      headers: {
        Authorization: this.headers.authorization,
        ownCompanyId: this.headers.owncompanyid
      }
    }, options) // 合并参数对象和其他axios参数对象（例如headers、responseType）

    return axios.get(serverUrl, configObj)
  }

  /*
 * 获取图片
 * options:
 * */
  static async getImg(serverUrl, params, options) {
    let token = await TokenManager.getToken()
    let configObj = Object.assign(    // 合并参数对象和其他axios参数对象（例如headers、responseType）
      {
        params: params
      },
      options,
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    )
    return axios.get(serverUrl, configObj)
  }

  /*
   * 获取视频
   * options:
   * */
  static async getVideo(serverUrl, params, options) {
    let token = await TokenManager.getToken()
    let configObj = Object.assign({
      params: params
    }, {
      headers: {
        Authorization: 'Bearer ' + token,
        ownCompanyId: params.ownCompanyId,
        Range: params.range,
        contentType: "video/mp4;charset=UTF-8",
        "Accept-Encoding": "xxx"
      }
    }, options) // 合并参数对象和其他axios参数对象（例如headers、responseType）
    return axios.get(serverUrl, configObj)
  }

  /*
   * 新增方法(后台使用body接收参数)
   * */
  static async post(serverUrl, params, options) {
    let configObj = Object.assign({
      headers: {
        Authorization: this.headers.authorization,
        ownCompanyId: this.headers.owncompanyid
      }
    }, options)
    return axios.post(serverUrl, params, configObj).then((res) => {
      return res.data
    })

  }

  /*
   * (后台使用params接收参数)
   * */
  static async postUrl(serverUrl, params, options) {
    return axios.post(serverUrl, params, {
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
      headers: {
        Authorization: this.headers.authorization,
        ownCompanyId: this.headers.owncompanyid
      },
      options
    }).then((res) => {
      return res.data
    })
  }

  /*
   *  修改方法(body传参)
   * */
  static async put(serverUrl, params) {
    return axios.put(serverUrl, params, {
      headers: {
        Authorization: this.headers.authorization,
        ownCompanyId: this.headers.owncompanyid
      }
    }).then((res) => {
      return res.data
    })
  }

  /*
   *  修改方法(params传参)
   * */
  static async putUrl(serverUrl, params, options) {
    return axios.put(serverUrl, params, {
      transformRequest: [function (data) {
        // 对 data 进行任意转换处理
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
      headers: {
        Authorization: this.headers.authorization,
        ownCompanyId: this.headers.owncompanyid
      },
      options
    }).then((res) => {
      return res.data
    })
  }

  /*
   * 删除方法
   * */
  static async delete(serverUrl, params, options) {
    let configObj = Object.assign({
      params: params
    }, {
      headers: {
        Authorization: this.headers.authorization,
        ownCompanyId: this.headers.owncompanyid
      }
    }, options)
    return axios.delete(serverUrl, configObj).then((res) => {
      return res.data
    })
  }

  static async all(...fn) {
    return axios.all(...fn)
  }

}

module.exports = http
