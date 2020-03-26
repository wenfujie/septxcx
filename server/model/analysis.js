/*
 * @Author: zhibin.zhao
 * @Date: 2018-11-13 20:54:27
 * @LastEditors: zhibin.zhhao
 * @LastEditTime: 2018-11-13 20:54:27
 * @Description: 解析小程序授权信息encryptedData
 */
const WXBizDataCrypt = require('../util/WXBizDataCrypt')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
class analysis {
    static async getWxData(ctx, params){
        let object = await this.getWxOpenId(ctx, params.code, params.appId, params.appSecret)
        console.log("object==================", object)
        let pc = new WXBizDataCrypt(params.appId, object.data.session_key)
        params.userInfo = JSON.parse(params.userInfo)
        console.log("params.userInfo", params.userInfo.encryptedData, params.userInfo.iv)
        var data = pc.decryptData(params.userInfo.encryptedData , params.userInfo.iv)
        console.log("解密后的数据", data)
        data.session_key = object.data.session_key
        data.appId = params.appId
        return data
    }
    // 解析手机号信息
    static async getPhoneNumber(ctx, params){
        let pc = new WXBizDataCrypt(params.appId, params.sessionKey)
        console.log("===========PC",pc)
        let data = pc.decryptData(params.encryptedData , params.iv)
        console.log("解密后的手机号", data)
        return data
    }
    // 获取用户openid、session_key会话密钥
    static async getWxOpenId(ctx, code, appid, secret){
        let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code'
        return axios.get(url).then((res) => {
            return res
        })
    }

    // 获取微信公众号（不是小程序）蓝牙设备的id和唯一二维码
    static async getWechatAssesstoken(){
        let at = await this.getWechatAccessToken();
        let url = 'https://api.weixin.qq.com/device/getqrcode?access_token='+ at.access_token +'&product_id=51125';
        return axios.get(url).then(res=>{
            console.log(res)
        })
    }
}
module.exports = analysis