/*
* createTime：2018/8/22
* author：en.chen
* description: 优惠券模块功能api
*/

const vouchers = require('../model/vouchers')

class vouchersController {

    // 获取领取优惠券列表
    static async getVouchersList (ctx, next) {
        let res = await vouchers.getVouchersList(ctx,ctx.params)
        ctx.body = res.data
    }

    // 获取我的优惠券列表
    static async getUserVouchersList (ctx, next) {
        let res = await vouchers.getUserVouchersList(ctx,ctx.params)
        ctx.body = res.data
    }

    // 领取优惠券
    static async saveCoupons (ctx, next) {
        let res = await vouchers.saveCoupons(ctx,ctx.params)
        ctx.body = res
    }

    // 购买优惠券
    static async buyCoupons (ctx, next) {
        let res = await vouchers.buyCouponsValue(ctx,ctx.params)
        ctx.body = res
    }

    // 清空优惠券
    static async deleteCoupons (ctx, next) {
        let res = await vouchers.deleteCouponsValue(ctx,ctx.params)
        ctx.body = res
    }

    // 获取结算可用优惠券信息 (超鸿)
    static async getSettlementDiscount (ctx, next) {
        let res = await vouchers.getSettlementDiscountValue(ctx,ctx.params)
        ctx.body = res.data
    }

    // 获取订单结算页面促销赠品信息
    static async getOrderPromotion (ctx, next) {
        let res = await vouchers.getOrderPromotionValue(ctx,ctx.params)
        ctx.body = res.data
    }

    // 获取订单结算页面促销赠品信息(重构)
    static async getNewOrderPromotion (ctx, next) {
        let res = await vouchers.getNewOrderPromotion(ctx,ctx.params)
        ctx.body = res.data
    }

    // 获取商品促销活动
    static async getGoodsPromotion (ctx, next) {
        let res = await vouchers.getGoodsPromotion(ctx,ctx.params)
        ctx.body = res.data
    }


    // 获取促销标识
    static async goodsPmFlag (ctx, next) {
        let res = await vouchers.goodsPmFlag(ctx,ctx.params)
        ctx.body = res.data
    }

    // 获取促销赠品sku
    static async getPromotionGoodsSku (ctx, next) {
        let res = await vouchers.getPromotionGoodsSku(ctx,ctx.params)
        ctx.body = res.data
    }

    // 获取促销赠品库存
    static async getPromotionGoodsInventory (ctx, next) {
        let res = await vouchers.getPromotionGoodsInventory(ctx,ctx.params)
        ctx.body = res.data
    }

    // 获取结算可用优惠券信息 (季老师)
    static async getOrderCouponsList (ctx, next) {
        let res = await vouchers.getOrderCouponsList(ctx,ctx.params)
        ctx.body = res.data
    }

    // 根据卡编号 获取卡id
    static async getCouponsId (ctx, next) {
        let res = await vouchers.getCouponsId(ctx,ctx.params)
        ctx.body = res.data
    }

    // 选券后获取可用券id列表 (季老师)
    static async getCanUseCouponsList (ctx, next) {
        let res = await vouchers.getCanUseCouponsList(ctx,ctx.params)
        ctx.body = res.data
    }

    // 结算页面优惠金额
    static async getOrderDiscount (ctx, next) {
        let res = await vouchers.getOrderDiscountValue(ctx,ctx.params)
        ctx.body = res
    }

    // 结算页面优惠金额(包含积分)
    static async getOrderDiscountPoint (ctx, next) {
        let res = await vouchers.getOrderDiscountPoint(ctx,ctx.params)
        ctx.body = res
    }

    // 结算页面优惠金额
    static async getWxConfig (ctx, next) {
        let res = await vouchers.getWxConfig(ctx,ctx.params)
        ctx.body = res
    }

    //  会员登录触发发卡发券
    static async sendCardCoupons (ctx, next) {
        let res = await vouchers.sendCardCoupons(ctx,ctx.params)
        ctx.body = res
    }

    //  获取商品可使用一次性储值卡
    static async getUsableVlaueCard (ctx, next) {
        let res = await vouchers.getUsableVlaueCard(ctx,ctx.params)
        ctx.body = res.data
    }
}

module.exports = vouchersController
