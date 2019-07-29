/*
 * createTime：2018/7/27
 * author：en.chen
 * description: 会员模块-会员基础功能模块用于处理前端请求的中间层接口
 */
const common = require('./common')

class userBase {
    //  校验手机号是否绑定
    static async checkPhoneValue(ctx, params) {
        let url = '/vip-info-hds/check-bind/' + params.usrId
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取手机验证码的先置条件
    static async getCaptchaValue(ctx, params) {
        let url = '/vip-info-hds/get-verify-code-v2/' + params.usrId
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  通过mobileMsg发送短信
    static async sendCaptchaValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + '/sms/sms/send', params).then((res) => {
            return res
        });
    }

    //  绑定手机号
    static async bindMobileValue(ctx, params) {
        let url = '/vip-info-hds/binding-usr-mobile/' + params.usrId +
                `?buscontsId=${params.buscontsId}&companyId=${params.companyId}&mobile=${params.mobile}&ownCompanyId=${params.ownCompanyId}&usrId=${params.usrId}`
        return ctx.$putUrl(ctx.nettyUrl + ctx.serverPortUrl.memberService + common.newUrlKey +
                url, params).then((res) => {
            return res
        });
    }

    //  验证手机验证码是否正确
    static async checkCaptchaValue(ctx, params) {
        let url = '/vip-info-hds/verify-usr-mobile-v2?companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  更换绑定手机号
    static async changePhoneValue(ctx, params) {
        let url = '/vip-info-hds/mobile/' + params.usrId
        return ctx.$putUrl(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

}

module.exports = userBase