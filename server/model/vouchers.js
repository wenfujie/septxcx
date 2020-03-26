/*
 * createTime：2018/8/22
 * author：en.chen
 * description: 优惠券模块用于处理前端请求的中间层接口
 */
const common = require('./common')

class vouchersFunc {
  //  获取领取优惠券列表
  static async getVouchersList(ctx, params) {
    return ctx
      .$get(
        ctx.nettyUrl +
        ctx.serverPortUrl.memberService +
        common.newUrlKey +
        "/coupons-aggregates/available-coupons",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  获取我的优惠券列表
  static async getUserVouchersList(ctx, params) {
    return ctx
      .$get(
        ctx.nettyUrl +
        ctx.serverPortUrl.memberService +
        common.newUrlKey +
        "/value-card-hds/get-usr-coupons-info",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  领取优惠券
  static async saveCoupons(ctx, params) {
    let url = '/coupons-aggregates?usrId=' + params.usrId + '&companyId=' + params.companyId + '&vipInfoHdId=' + params.vipInfoHdId
    return ctx
      .$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params)
      .then(res => {
        return res;
      });
  }

  //  购买优惠券
  static async buyCouponsValue(ctx, params) {
    let url = "/sp-ord-level-hds/buying-coupon?companyId=" + params.companyId;
    return ctx
      .$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params)
      .then(res => {
        return res;
      });
  }

  //  清空优惠券
  static async deleteCouponsValue(ctx, params) {
    let url =
      "/vip-cher-infos/waste-card/" +
      params.usrId +
      "?couponCategory=" +
      params.couponCategory +
      "&companyId=" +
      params.companyId;
    return ctx
      .$putUrl(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params)
      .then(res => {
        return res;
      });
  }

  //  获取结算可用优惠券信息 （超鸿）
  static async getSettlementDiscountValue(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl + ctx.serverPortUrl.memberService + "/valuecard-cards/cher",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  获取订单结算页面促销赠品信息
  static async getOrderPromotionValue(ctx, params) {
    return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.promotion + "/online-hds/cart-temp-id/order-promotions/new", params).then(res => {
      return res;
    });
  }

  //  获取订单结算页面促销赠品信息(重构)
  static async getNewOrderPromotion(ctx, params) {
    return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.promotion + "/online-hds/cart-temp-id/order-promotions/new", params).then(res => {
      return res;
    });
  }

  //  获取商品促销活动
  static async getGoodsPromotion(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
        ctx.serverPortUrl.shoppingCart +
        "/sp-part-goodss/goods/promotion",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  获取促销标识
  static async goodsPmFlag(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
        ctx.serverPortUrl.promotion +
        "/online-hds/get-promotion-pic",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  获取促销赠品sku
  static async getPromotionGoodsSku(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl + ctx.serverPortUrl.promotion + "/promotion-goods-skus",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  获取促销赠品库存
  static async getPromotionGoodsInventory(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
        ctx.serverPortUrl.promotion +
        "/online-dtt-gifts/inventory",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  获取结算可用优惠券列表 (季老师，新版)   旧版为/valuecard-hds/ord-usable-coupons
  static async getOrderCouponsList(ctx, params) {
    return ctx
      .$get(
        ctx.nettyUrl +
        ctx.serverPortUrl.memberService +
        common.newUrlKey +
        "/valuecard-hds/ord-usable-coupons-hans",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  根据卡编号 获取卡id
  static async getCouponsId(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
        ctx.serverPortUrl.memberService +
        "/valuecard-hds/card-id",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  选券后获取可用券id列表
  static async getCanUseCouponsList(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
        ctx.serverPortUrl.memberService +
        "/valuecard-hds/ord-usable-coupons-simple",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  结算页面优惠金额
  static async getOrderDiscountValue(ctx, params) {
    return ctx
      .$postUrl(
        ctx.baseUrl +
        ctx.serverPortUrl.shoppingCart +
        "/rtl-online-result-hds/preferential-amount",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  结算页面优惠金额(包含积分) 建福
  static async getOrderDiscountPoint(ctx, params) {
    return ctx
      .$postUrl(
        ctx.nettyUrl +
        ctx.serverPortUrl.shoppingCart +
        common.newUrlKey +
        "/rtl-online-result-hds/preferential-amount-point" +
        `?companyId=${params.companyId}&usrId=${params.usrId}&vipInfoHdId=${params.vipInfoHdId}&rtlOrdInterHdId=${params.rtlOrdInterHdId}&pointFlag=${params.pointFlag}&ownCompanyId=${params.ownCompanyId}&cardIds=${params.cardIds}` +
        `&shopId=${params.shopId}&busContsCode=${params.busContsCode}`,
        params
      )
      .then(res => {
        return res;
      });
  }

  //  获取优惠券加入微信卡包参数
  static async getWxConfig(ctx, params) {
    return ctx
      .$post(
        ctx.baseUrl + ctx.serverPortUrl.wxService + "/wxcards/getCardExt",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  会员登录触发发卡发券
  static async sendCardCoupons(ctx, params) {
    return ctx
      .$putUrl(
        ctx.baseUrl +
        ctx.serverPortUrl.shoppingCart +
        "/rtl-ord-hds/send-card-coupons",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  获取商品可使用一次性储值卡
  static async getUsableVlaueCard(ctx, params) {
    return ctx
      .$get(
        ctx.nettyUrl +
        ctx.serverPortUrl.memberService +
        common.newUrlKey +
        "/valuecard-hds/get-available-stored-cards",
        params
      )
      .then(res => {
        return res;
      });
  }
}

module.exports = vouchersFunc;
