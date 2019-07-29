/*
* createTime：2018/8/22
* author：en.chen
* description: 中间层提供给前端的优惠券模块api
*/

//  优惠券功能模块
const vouchers = require('../controller/vouchers/vouchers')

module.exports = {
    "GET/vouchersList": vouchers.vouchersList,  // 获取领取优惠券列表
    "GET/userVouchersList": vouchers.userVouchersList,  // 获取我的优惠券列表
    "POST/saveCoupons": vouchers.saveCoupons,  // 领取优惠券
    "POST/buyCoupons": vouchers.buyCoupons,  // 购买优惠券
    "PUT/deleteCoupons": vouchers.deleteCoupons,  // 清空优惠券
    "GET/settlementDiscount": vouchers.getSettlementDiscount,  // 获取结算可用优惠券信息 (超鸿)
    "GET/couponsList": vouchers.getCouponsList,  // 获取结算可用优惠券信息 (季老师)
    "GET/couponsId": vouchers.getCouponsId,  // 根据卡编号 获取卡id
    "GET/canUseCouponsList": vouchers.getCanUseCouponsList,  // 选券后获取可用券id列表 (季老师)
    "GET/orderPromotion": vouchers.getOrderPromotion,  // 获取订单结算页面促销赠品信息 (扬辉)
    "GET/getNewOrderPromotion": vouchers.getNewOrderPromotion,  // 获取订单结算页面促销赠品信息 (扬辉) 重构
    "GET/goodsPromotion": vouchers.getGoodsPromotion,  // 获取商品促销活动
    "GET/goodspmFlag": vouchers.getGoodspmFlag,  // 获取促销标识
    "GET/promotionGoodsSku": vouchers.getPromotionGoodsku,  // 获取促销赠品sku
    "GET/promotionGoodsInventory": vouchers.promotionGoodsInventory,  // 获取促销赠品库存
    "POST/orderDiscount": vouchers.getOrderDiscount,  //结算页面优惠金额
    "POST/orderDiscountPoint": vouchers.getOrderDiscountPoint,  //结算页面优惠金额(包含积分)
    "POST/wxConfig": vouchers.getWxConfig,  // 优惠券加入微信卡包
    "PUT/sendCardCoupons": vouchers.sendCardCoupons,  // 会员登录触发发卡发券
    "GET/usableVlaueCard": vouchers.getUsableVlaueCard  // 会员登录触发发卡发券
}
