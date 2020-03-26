import Storage from './storage.js'
import tokenManager from './tokenManager'
import Store from '../store/index'
import "./common";

const host = global.baseConstant.serverUrl; //本地调试域名

// 对象转化成url上带的参数
let urlEncode = function (param, key, encode) {
    if (param == null) return '';
    let paramStr = '';
    let t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
        for (let i in param) {
            let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
            paramStr += urlEncode(param[i], k, encode)
        }
    }
    return paramStr;
}

//请求封装
async function request(url, method, data) {

    url = http.filterUrl(url)

    //  参数重组
    data = !!data ? data : {}
    data = http.rebuildParams(data,url)

    let token = await tokenManager.getclientToken()

    let defaultHeaders = {
        Authorization: 'Bearer ' + token,
        ownCompanyId: data.ownCompanyId,
        'content-type': 'application/json', // 默认值
        'accept': 'application/json'
        // 'content-type': 'application/json' // 默认值
    }
    return new Promise((resolve, reject) => {

        //  get请求头处理缓存
        if (method === 'get' || method === 'GET') defaultHeaders = Object.assign(defaultHeaders, {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        })

        //DELETE方法改为传参模式
        if (method == 'DELETE') {
            url = url + (url.indexOf('?') === -1 ? '?' : '&') + urlEncode(data).slice(1)
        }

        // console.debug('前端请求路径:' + url)
        // console.debug('前端请求参数:' + JSON.stringify(data))

        wx.request({
            url: url, //仅为示例，并非真实的接口地址
            method: method,
            data: data,
            header: defaultHeaders,
            success: function (res) {
                // wx.hideLoading();

                let response = res.data

                let resStr = JSON.stringify(response)

                // token过期
                if (resStr.indexOf('invalid_token') !== -1) {
                    Storage.remove('TOKENINFO')
                    tokenManager.getclientToken()
                    reject(response)
                    console.error('token过期，接口回参：' + resStr)
                }

                // 异常处理
                if ((!!response && !!response.statusCode && response.statusCode !== 200) || resStr.indexOf('errorCode') !== -1) {
                    // console.debug('前端请求路径:' + url)
                    // console.error('请求失败，接口回参：' + resStr)
                    return reject(response)
                } else {
                    // console.debug('前端请求路径:' + url)
                    // console.info('请求成功，接口回参：' + resStr)
                    return resolve(response)
                }

            },
            fail: function (error) {
                // wx.hideLoading();
                reject(false)
            },
            complete: function () {
                // wx.hideLoading();
            }
        })
    })
}

const http = {
    get: async function (url, data) {
        return request(url, 'GET', data)
    },
    post: async function (url, data) {
        return request(url, 'POST', data)
    },
    put: async function (url, data) {
        return request(url, 'PUT', data)
    },
    delete: async function (url, data) {
        return request(url, 'DELETE', data)
    },

    //  请求参数重组
    rebuildParams: function (data,url) {
        let company = Storage.get('COMPANYID')
        let userInfo = Storage.get('USER_INFO')
        try {
            if (!!company) {
                data.ownCompanyId = company.company_id
                data.companyId = company.company_id
            }
            if (!!userInfo) {
                if(!data.usrId) data.usrId = userInfo.usrId||1
                if(!data.vipInfoHdId) data.vipInfoHdId = userInfo.vipInfoId ? userInfo.vipInfoId : null
            }else{
                data.usrId = -1
                data.vipInfoHdId = -1
            }

            if(url.indexOf('distribution/') !== -1 && !!Store.state.distribution.accountInfo.vipInfoHdId) {
                console.log('分销商模块的请求且前端存在选中的分销商账号~',Store.state.distribution.accountInfo.mobilePhone)
                data.vipInfoHdId = Store.state.distribution.accountInfo.vipInfoHdId
                return http.filter(data)
            }else{
                return http.filter(data)
            }
        } catch (e) {
            return data
        }
    },

    // 请求地址过滤
    filterUrl: function (url) {
        if (url.indexOf('http:') !== -1 || url.indexOf('https:') !== -1) {
            return url
        } else {
            return host + url
        }
    },

    // 外层空对象过滤
    filter: function (data) {
        let _data = {}
        for (let i in data) {
            let val = data[i]
            //  过滤不传的字符串
            if (val === null || typeof val === 'undefined') {
                continue
            }
            _data[i] = val
        }
        return _data
    }


}
export default http;
