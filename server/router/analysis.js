/*
* createTime：2018/11/13
* author：zhibin.zhao
* description: 解析小程序授权信息encryptedData
*/

const analysisFun = require('../controller/analysis')

module.exports = {
    'GET/getWxData': analysisFun.getWxData,  // 获取常数值
    'GET/getPhoneNumber': analysisFun.getPhoneNumber,  // 获取解析后的手机号码
    'PUT/bindPhone': analysisFun.bindNotExpire,  // sessionKey未过期
    'PUT/bindExpire': analysisFun.bindExpire  // sessionKey过期
}
