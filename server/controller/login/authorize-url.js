/*
* createTime：2018/7/11
* author：en.chen
* description: 微信获取用户授权地址
*/

const userLogin = require('../../model/login')

const getAuthorizeUrl = async function (ctx,next) {
    let res = await userLogin.getAuthorizeUrlValue(ctx,ctx.params)
    ctx.body = res;
}

module.exports = getAuthorizeUrl

