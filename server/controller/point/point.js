/*
* createTime：2018/11/6
* author：en.chen
* description:  积分模块
*/

const point = require('../../model/point')

class pointFun {

    //  获取积分详情
    static async getDetail (ctx, next) {
        let res = await point.getDetail(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取 用户是否可使用积分flag
    static async getUsePointFlag (ctx, next) {
        let res = await point.getUsePointFlagValue(ctx,ctx.params)
        ctx.body = res.data
    }

    //  根据价格计算赠送积分
    static async getComputePointer (ctx, next) {
        let res = await point.getComputePointerValue(ctx,ctx.params)
        ctx.body = res.data
    }

    
    //  查询积分券
    static async getCardData (ctx, next) {
        let res = await point.getCardData(ctx,ctx.params)
        ctx.body = res.data
    }



    //兑换积分
    static async sellCardData (ctx, next) {
        let res = await point.sellCardData(ctx,ctx.params)
        ctx.body = res
    }

}

module.exports = pointFun