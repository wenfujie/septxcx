/*
* createTime：2018/7/24
* author：en.chen
* description: 微信登陆后获取用户信息
*/

const userLogin = require('../../model/login')

const getAuthorizeInfo = async function (ctx,next) {
    let res = await userLogin.getAuthorizeInfoValue(ctx,ctx.params)
    ctx.body = res;
}

module.exports = getAuthorizeInfo
