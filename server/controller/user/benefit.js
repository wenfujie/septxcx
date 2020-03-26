/*
* createTime：2018/8/29
* author：en.chen
* description: 会员模块-会员基本功能api
*/

const userBenefit = require('../../model/user-benefit')

class benefit {

    // 获取会籍会员列表
    static async getCardList(ctx, next) {
        let res = await userBenefit.getCardList(ctx, ctx.params)
        ctx.body = res.data
    }

    // 获取会籍会员详情
    static async getCardDetailValue(ctx, next) {
        let res = await userBenefit.getCardDetailValue(ctx, ctx.params)
        ctx.body = res.data
    }

    // 获取积分余额
    static async getPoint(ctx, next) {
        let res = await userBenefit.getPoint(ctx, ctx.params)
        ctx.body = res.data
    }

    //  获取我的会籍会员
    static async getMyCardInfo(ctx, next) {
        let res = await userBenefit.getMyCardInfo(ctx, ctx.params)
        ctx.body = res.data
    }

    //  获取会员卡促销
    static async getCardVouchers(ctx, next) {
        let res = await userBenefit.getCardVouchers(ctx, ctx.params)
        ctx.body = res.data
    }

    //  购买会籍会员
    static async buyCard(ctx, next) {
        let res = await userBenefit.buyCard(ctx, ctx.params)
        ctx.body = res
    }

    //  获取会员推荐尺码
    static async getMinIntegral(ctx, next) {
        let res = await userBenefit.getMinIntegral(ctx, ctx.params)
        ctx.body = res.data
    }
}

module.exports = benefit
