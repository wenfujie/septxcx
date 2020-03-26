/*
 * createTime：2018/7/27
 * author：en.chen
 * description: 会员模块-会员基础功能模块用于处理前端请求的中间层接口
 */
const common = require('./common')

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
class userBase {
    //  校验手机号是否绑定
    static async checkPhone(ctx, params) {
        let url = '/vip-info-hds/check-bind-wx'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取手机验证码的先置条件
    static async getCaptcha(ctx, params) {
        let url = '/vip-info-hds/get-verify-code-v2'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  通过mobileMsg发送短信
    static async sendCaptcha(ctx, params) {
        return ctx.$get(ctx.baseUrl + '/sms/sms/send', params).then((res) => {
            return res
        });
    }

    //  绑定手机号
    static async bindMobile(ctx, params) {
        let UrlParams = urlEncode(params).slice(1)
        let url = '/vip-info-hds/binding-usr-mobile?' + UrlParams
        return ctx.$put(ctx.nettyUrl + ctx.serverPortUrl.memberService + common.newUrlKey + url, params).then((res) => {
            return res
        });
    }

    //  验证手机验证码是否正确
    static async checkCaptcha(ctx, params) {
        let url = '/vip-info-hds/verify-usr-mobile-v2?companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  更换绑定手机号
    static async changePhone(ctx, params) {
        let url = '/vip-info-hds/mobile/' + params.vipInfoHdId + `?newMobile=${params.newMobile}&oldMobile=${params.oldMobile}&companyId=${params.companyId}&usrId=${params.usrId}&ownCompanyId=${params.ownCompanyId}`
        return ctx.$putUrl(ctx.nettyUrl + ctx.serverPortUrl.memberService + common.newUrlKey + url, params).then((res) => {
            return res
        });
    }

    //  会员整合操作 （不整合；此账号不是我的；验证码确认；账号密码确认）
    static async memberMergeOperator(ctx, params) {
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-rel-hds/relation-confirm', params).then((res) => {
            return res
        });
    }

    //  获取会员整合用户列表
    static async memberMergeList(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-rel-trgs/vip-relation', params).then((res) => {
            return res
        });
    }
}

module.exports = userBase
