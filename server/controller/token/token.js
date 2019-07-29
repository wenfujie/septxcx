/*
* createTime：2018/9/6
* author：en.chen
* description: 获取token
*/

const getToken = require('../../model/token')

class token {

    //  通过客户端获取token
    static async clientToken (ctx, next) {
        let res = await getToken.getclientToken(ctx,ctx.params)
        ctx.body = res
    }

    //  通过密码模式获取token
    static async pwdToken (ctx, next) {
        let res = await getToken.getPwdToken(ctx,ctx.params)
        ctx.body = res
    }

}

module.exports = token