/*
* createTime：2018/10/9
* author：en.chen
* description: 订单支付
*/

const login = require('../model/login')
const analysis = require('../model/analysis')

class loginController {

    // 微信获取用户授权地址
    static async getAuthorizeUrl (ctx, next) {
        let res = await login.getAuthorizeUrlValue(ctx,ctx.params);
        ctx.body = res
    }

    // 微信登陆后获取用户信息
    static async getAuthorizeInfo (ctx, next) {
        let res = await login.getAuthorizeInfoValue(ctx,ctx.params);
        ctx.body = res
    }

    // 获取乔顿商城用户信息
    static async userLogin (ctx, next) {
        let res = await login.userLogin(ctx,ctx.params);
        ctx.body = res.data
    }

    // 根据openid和unionid判断用户是否已存在
    static async existUser (ctx, next) {
        let res = await login.isExistUserMm(ctx,ctx.params);
        ctx.body = res.data
    }

    // 联合登录
    static async mergeLogin (ctx, next) {
        ctx.params.properties = JSON.parse(ctx.params.properties)
        ctx.params.appId = ctx.params.properties.appId
        ctx.params.appSecret = ctx.params.properties.appSecret
        let wechatInfo = await analysis.getWxData(ctx, ctx.params)
        let userSex = ''    // 默认没有性别
        if(wechatInfo.gender == 1){ // 男
            userSex = 'D_MALE'
        }else if(wechatInfo.gender == 2){   // 女
            userSex = 'D_FEMALE'
        }
        let loginData = {
            ownCompanyId: ctx.params.companyId,
            companyId: ctx.params.companyId,
            shopId: ctx.params.properties.shopId,
            busContsCode: ctx.params.properties.busContsCode,
            openId: wechatInfo.openId,
            signUpTypeCode: 'D_WECHAT',
            usrName: wechatInfo.nickName,
            url: wechatInfo.avatarUrl,
            sex: userSex,
            appId: ctx.params.properties.appId
        }
        if (!!wechatInfo.unionId) loginData.unionId = wechatInfo.unionId
        let userInfo = await login.userLogin(ctx, loginData)

        let loginInfo = {
            openId: wechatInfo.openId,
            usrId: userInfo.data.usrId,
            mobilePhone: userInfo.data.mobilePhone,
            // publicAccount: ctx.params.properties.publicAccount,
            vipInfoId: userInfo.data.vipInfoId,  // 分销商模块需要使用的会员id字段
            sessionKey: wechatInfo.session_key
        }
        ctx.body = loginInfo;
    }

    // 获取单点登录需要的code（搭配组件）
    static async getSingleCode (ctx, next) {
        let res = await login.getSingleCode(ctx,ctx.params);
        ctx.body = res.data
    }
}

module.exports = loginController;
