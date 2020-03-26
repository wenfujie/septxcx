/*
 * createTime: 2019/9/21 9:27
 * author: wei.wang
 * description: 中间层提供给前端的基础模块api
 */

const analysis = require('../model/analysis');
const userBase = require('../model/user-base')

class analysisController {

  // 获取常数值
  static async getWxData (ctx) {
    let res = await analysis.getWxData(ctx, ctx.params);
    ctx.body = res;
  }

  // 解析手机号信息
  static async getPhoneNumber (ctx) {
    let res = await analysis.getPhoneNumber(ctx, ctx.params);
    ctx.body = res;
  }

  // sessionKey未过期
  static async bindNotExpire(ctx){
    let mobile = await analysis.getPhoneNumber(ctx, ctx.params);
    ctx.params.mobile = mobile.phoneNumber
    let exist = await userBase.checkPhone(ctx, ctx.params)
    console.log("exist=========",exist)
    if(!!exist.data.statusCode){
      ctx.body = exist.data
    }else{
      let res = await userBase.bindMobile(ctx, ctx.params)
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
    let exist = await userBase.checkPhone(ctx, ctx.params)
    if(!!exist.data.statusCode){
      ctx.body = exist.data
    }else{
      let res = await userBase.bindMobile(ctx, ctx.params)
      ctx.body =  res;
    }
  }

}

module.exports = analysisController;
