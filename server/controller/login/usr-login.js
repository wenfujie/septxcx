/*
* createTime：2018/7/25
* author：en.chen
* description: 获取乔顿商城用户信息
*/

const userLogin = require('../../model/login')

const userLoginService = async function (ctx,next) {
    let res = await userLogin.getUesrLoginValue(ctx,ctx.params)
    ctx.body = res.data;
}

module.exports = userLoginService
