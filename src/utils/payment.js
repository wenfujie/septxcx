/*
* createTime：2018/11/28
* author：en.chen
* description: 支付
*/


const payment = {
    /**
     * 小程序支付
     *  var config = {
            timeStamp: String,  // 时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间(示例值:wxd678efh567hg6787)
            nonceStr: String,  // 随机字符串，不长于32位。(示例值:5K8264ILTKCH16CQ2502SI8ZNMTM67VS)
            package: String, // 统一下单接口返回的 prepay_id 参数值(示例值:prepay_id=wx2017033010242291fcfe0db70013231072)
            paySign: String,  //支付签名
     *  }
     *  successUrl : String  // 成功回调地址，例如('/order-detail?billCode=123')
     *  failUrl: String // 失败回调地址，例如('/show')
     */
    miniProgramPay: function (config, successUrl, failUrl) {
        //  支付loading
        wx.showLoading({
            title: '支付中~'
        });

        let payData = {
            timeStamp: config.timeStamp,
            nonceStr: config.nonceStr,
            package: config.prepayId,
            paySign: config.paySign,
            successUrl: successUrl || '',
            failUrl: failUrl || '/index'
        }

        // 小程序内支付
        return new Promise((reslove,reject) => {
            wx.requestPayment({
                'timeStamp': payData.timeStamp,
                'nonceStr': payData.nonceStr,
                'package': payData.package,
                'signType': 'MD5',
                'paySign': payData.paySign,
                'success': function (res) {},
                'fail': function (err) {},
                'complete': function (res) {
                    // 隐藏loading
                    wx.hideLoading();
                    if (res.errMsg == 'requestPayment:ok') {
                        // 成功处理
                        let result = {
                            statusCode: 200,
                            data: 'success'
                        }
                        reslove(result)
                        gio('track', 'payOrderSuccess', {})
                    } else {
                        // 失败处理
                        let result = {
                            statusCode: 500,
                            data: res.errMsg || res
                        }
                        reject(result)
                    }
                }
            })
        })

    },

    /**
     * 公众号支付
     *  var wxConfig = {
            appId: '', // 必填，公众号的唯一标识
            timestamp: '', // 必填，生成签名的时间戳
            nonceStr: '', // 必填，生成签名的随机串
            signature: '',// 必填，签名
     *  }
     *  var payConfig = {
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: '', // 必填，公众号的唯一标识
            timestamp: '', // 必填，生成签名的时间戳
            nonceStr: '', // 必填，生成签名的随机串
            signature: '',// 必填，签名
            jsApiList: [] // 必填，需要使用的JS接口列表
        }
     *  successUrl : String  // 成功回调地址，例如('/order-detail?billCode=123')
     *  failUrl: String // 失败回调地址，例如('/show')
     */
    WebPay: function (wxConfig, payConfig, successUrl, failUrl) {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: wxConfig.appId, // 必填，公众号的唯一标识
            timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
            nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
            signature: wxConfig.signature,// 必填，签名
            jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表
        });
        wx.chooseWXPay({
            timestamp: payConfig.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: payConfig.nonceStr, // 支付签名随机串，不长于 32 位
            package: payConfig.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: payConfig.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: payConfig.paySign, // 支付签名
            success: function (res) {
                // 支付成功后的回调函数
                if (successUrl.indexOf('http://') === -1 && successUrl.indexOf('https://') === -1) {
                    let url = window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + successUrl
                } else {
                    window.location.href = successUrl
                }
            },
            error: function (res) {
                // 支付失败后的回调函数
                if (failUrl.indexOf('http://') === -1 && failUrl.indexOf('https://') === -1) {
                    let url = window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + failUrl
                } else {
                    window.location.href = failUrl
                }
            }
        });
    }
}
export default payment
