/*
 * createTime：2018/7/27
 * author：en.chen
 * description: 会员模块-会员基本功能api
 */

const userBase = require('../../model/user-base')

class base {

    // 校验手机号是否绑定
    static async checkPhone(ctx, next) {
        let res = await userBase.checkPhoneValue(ctx, ctx.params)
        ctx.body = res.data
    }

    // 手机验证码先置code
    static async getCaptcha(ctx, next) {
        let res = await userBase.getCaptchaValue(ctx, ctx.params)
        let params = {
            telphone: ctx.params.mobile,
            context: res.data.mobileMsg,
            ownCompanyId: ctx.params.ownCompanyId,
            companyId: ctx.params.companyId || ctx.params.ownCompanyId,
            cmsMesstempHdId: res.data.cmsMesstempHdId, // 短信模板id
            companySign: res.data.companySign || null, // 公司签名
            templateCode: res.data.templateCode || null, // 验证码模板编号
            smsType: res.data.smsType || null // 短信平台类型
        }
        let resp = await userBase.sendCaptchaValue(ctx, params)
        ctx.body = resp.data
    }

    // 手机验证码
    static async sendCaptcha(ctx, next) {
        let res = await userBase.sendCaptchaValue(ctx, ctx.params)
        ctx.body = res.data
    }

    //  绑定手机号
    static async bindMobile(ctx, next) {
        let res = await userBase.bindMobileValue(ctx, ctx.params)
        ctx.body = res
    }

    //  验证手机验证码
    static async checkCaptcha(ctx, next) {
        let res = await userBase.checkCaptchaValue(ctx, ctx.params)
        ctx.body = res
    }

    //  验证手机验证码
    static async changePhone(ctx, next) {
        let res = await userBase.changePhoneValue(ctx, ctx.params)
        ctx.body = res
    }
}

module.exports = base