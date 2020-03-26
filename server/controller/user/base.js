/*
 * createTime：2018/7/27
 * author：en.chen
 * description: 会员模块-会员基本功能api
 */

const userBase = require('../../model/user-base')

class userBaseController {

    // 校验手机号是否绑定
    static async checkPhone(ctx, next) {
        let res = await userBase.checkPhone(ctx, ctx.params)
        ctx.body = res.data
    }

    // 手机验证码先置code
    static async getCaptcha(ctx, next) {
        let res = await userBase.getCaptcha(ctx, ctx.params)
        // let params = {
        //     telphone: ctx.params.mobile,
        //     context: res.data.mobileMsg,
        //     ownCompanyId: ctx.params.ownCompanyId,
        //     companyId: ctx.params.companyId || ctx.params.ownCompanyId,
        //     cmsMesstempHdId: res.data.cmsMesstempHdId, // 短信模板id
        //     companySign: res.data.companySign || null, // 公司签名
        //     templateCode: res.data.templateCode || null, // 验证码模板编号
        //     smsType: res.data.smsType || null // 短信平台类型
        // }
        // let resp = await userBase.sendCaptchaValue(ctx, params)
        ctx.body = res.data
    }

    // 手机验证码
    static async sendCaptcha(ctx, next) {
        let res = await userBase.sendCaptcha(ctx, ctx.params)
        ctx.body = res.data
    }

    //  绑定手机号
    static async bindMobile(ctx, next) {
        let res = await userBase.bindMobile(ctx, ctx.params)
        ctx.body = res
    }

    //  验证手机验证码
    static async checkCaptcha(ctx, next) {
        let res = await userBase.checkCaptcha(ctx, ctx.params)
        ctx.body = res
    }

    //  验证手机验证码
    static async changePhone(ctx, next) {
        let res = await userBase.changePhone(ctx, ctx.params)
        ctx.body = res
    }

    // 会员整合操作 （不整合；此账号不是我的；验证码确认；账号密码确认）
    static async memberMergeOperator(ctx) {
        let res = await userBase.memberMergeOperator(ctx, ctx.params);
        ctx.body = res
    }

    // 获取会员整合用户列表
    static async memberMergeList(ctx) {
        let res = await userBase.memberMergeList(ctx, ctx.params);
        ctx.body = res.data
    }
}

module.exports = userBaseController
