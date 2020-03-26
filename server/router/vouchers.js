/*
* createTime：2018/8/22
* author：en.chen
* description: 中间层提供给前端的优惠券模块api
*/

//  优惠券功能模块
const vouchersFun = require('../controller/vouchers')

module.exports = {
    "GET/getVouchersList": vouchersFun.getVouchersList,  // 获取领取优惠券列表
    "GET/getUserVouchersList": vouchersFun.getUserVouchersList,  // 获取我的优惠券列表
    "POST/saveCoupons": vouchersFun.saveCoupons,  // 领取优惠券
    "POST/buyCoupons": vouchersFun.buyCoupons,  // 购买优惠券
    "PUT/deleteCoupons": vouchersFun.deleteCoupons,  // 清空优惠券
    "GET/settlementDiscount": vouchersFun.getSettlementDiscount,  // 获取结算可用优惠券信息 (超鸿)
    "GET/getOrderCouponsList": vouchersFun.getOrderCouponsList,  // 获取结算可用优惠券信息 (季老师)
    "GET/getCouponsId": vouchersFun.getCouponsId,  // 根据卡编号 获取卡id
    "GET/getCanUseCouponsList": vouchersFun.getCanUseCouponsList,  // 选券后获取可用券id列表 (季老师)
    "GET/orderPromotion": vouchersFun.getOrderPromotion,  // 获取订单结算页面促销赠品信息 (扬辉)
    "GET/getNewOrderPromotion": vouchersFun.getNewOrderPromotion,  // 获取订单结算页面促销赠品信息 (扬辉) 重构
    "GET/getGoodsPromotion": vouchersFun.getGoodsPromotion,  // 获取商品促销活动
    "GET/goodsPmFlag": vouchersFun.goodsPmFlag,  // 获取促销标识
    "GET/getPromotionGoodsSku": vouchersFun.getPromotionGoodsSku,  // 获取促销赠品sku
    "GET/getPromotionGoodsInventory": vouchersFun.getPromotionGoodsInventory,  // 获取促销赠品库存
    "POST/orderDiscount": vouchersFun.getOrderDiscount,  //结算页面优惠金额
    "POST/getOrderDiscountPoint": vouchersFun.getOrderDiscountPoint,  //结算页面优惠金额(包含积分)
    "POST/getWxConfig": vouchersFun.getWxConfig,  // 优惠券加入微信卡包
    "PUT/sendCardCoupons": vouchersFun.sendCardCoupons,  // 会员登录触发发卡发券
    // "GET/usableVlaueCard": vouchersFun.getUsableVlaueCard  // 会员登录触发发卡发券
}
