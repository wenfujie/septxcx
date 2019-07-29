/*
* createTime：2018/11/16
* author：en.chen
* description: 线下沙龙模块
*/

const salon = require('../../model/salon')

class salonFun {

    //  获取线下沙龙文章列表
    static async getList (ctx, next) {
        let res = await salon.getList(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取文章id获取文章列表
    static async getDetail (ctx, next) {
        let res = await salon.getDetail(ctx,ctx.params)
        ctx.body = res.data
    }

}

module.exports = salonFun