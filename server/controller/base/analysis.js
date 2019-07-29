/*
 * @Author: zhibin.zhao
 * @Date: 2018-11-13 20:54:27
 * @LastEditors: zhibin.zhhao
 * @LastEditTime: 2018-11-13 20:54:27
 * @Description: 解析小程序授权信息encryptedData
 */

const analysis = require('../../model/analysis')

const getWxData = async function(ctx, next){
    let res = await analysis.getWxData(ctx, ctx.params);
    ctx.body =  res;
}

module.exports = getWxData