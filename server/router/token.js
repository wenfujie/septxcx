/*
 * createTime：2018/9/6
 * author：en.chen
 * description: 中间层提供给前端的token模块api
 */

//  token功能模块
const tokenFun = require('../controller/token')

module.exports = {
    "POST/getClientToken": tokenFun.getClientToken, // 通过客户端获取token
    "POST/getPwdToken": tokenFun.getPwdToken, // 通过密码模式获取token
}
