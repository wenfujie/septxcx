/*
* createTime：2018/11/13
* author：zhibin.zhao
* description: 解析小程序授权信息encryptedData
*/

//  获取常数值
const getWxData = require('../controller/base/analysis')
//  获取解析后的手机号码
const getPhoneNumber = require('../controller/base/analysis-phone')
//  绑定手机号码
const bindPhone = require('../controller/base/bind-phone')
module.exports = {
    'GET/getWxData': getWxData,
    'GET/getPhoneNumber': getPhoneNumber,
    'PUT/bindPhone': bindPhone.bindNotExpire,
    'PUT/bindExpire': bindPhone.bindExpire
}