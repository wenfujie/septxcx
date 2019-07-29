/*
 * @Author: zhibin.zhao
 * @Date: 2018-11-13 20:54:27
 * @LastEditors: zhibin.zhhao
 * @LastEditTime: 2018-11-13 20:54:27
 * @Description: 绑定手机号
 */

const analysis = require('../../model/analysis')
const userBase = require('../../model/user-base')

class bindPhone{
    // sessionKey未过期
    static async bindNotExpire(ctx){
        let mobile = await analysis.getPhoneNumber(ctx, ctx.params);
        ctx.params.mobile = mobile.phoneNumber
        let exist = await userBase.checkPhoneValue(ctx, ctx.params)
        console.log("exist=========",exist)
        if(!!exist.data.statusCode){
            ctx.body = exist.data
        }else{
            let res = await userBase.bindMobileValue(ctx, ctx.params)
            ctx.body =  res;
        }
    }
    // sessionKey过期
    static async bindExpire(ctx){
        let wechatInfo = await analysis.getWxOpenId(ctx, ctx.params.code, ctx.params.appId, ctx.params.secret)
        console.log("wechatInfo", wechatInfo)
        ctx.params.sessionKey = wechatInfo.data.session_key
        let mobile = await analysis.getPhoneNumber(ctx, ctx.params);
        ctx.params.mobile = mobile.phoneNumber
        let exist = await userBase.checkPhoneValue(ctx, ctx.params)
        if(!!exist.data.statusCode){
            ctx.body = exist.data
        }else{
            let res = await userBase.bindMobileValue(ctx, ctx.params)
            ctx.body =  res;
        }
    }
}

module.exports = bindPhone