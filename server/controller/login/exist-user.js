/*
* createTime：2018/12/28
* author：zhibin.zhao
* description: 根据openid和unionid判断用户是否已存在
*/

const userLogin = require('../../model/login')

const existUser = async function (ctx,next) {
    let res = await userLogin.isExistUserMm(ctx,ctx.params)
    ctx.body = res.data;
}

module.exports = existUser
