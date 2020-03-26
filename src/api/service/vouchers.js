/*
* createTime：2018/8/22
* author：en.chen
* description: 优惠券模块
*/

import http from '../../utils/http'

/**
 * 获取可领取优惠券列表
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyId":"公司ID",
   "busContsCode":"业务触点",
   "isWeixin":"是否是微信卡券(0,1,2)" 默认使用2,
   "wxUnionid":"公众号id"
    }
 * @returns {*}
 */
export const getVouchersList = (config) => { return http.get('vouchers/getVouchersList',config); }

/**
 * 获取我的优惠券列表
 * @param config
 * var param = {
   usrId: "用户ID",
   companyId: "公司ID",
   couponCategory: 'D_VALCARDOVERD(非必填)',
   pageNum: 1,
   pageSize: 10,
   cardCode: 优惠券编码，非必填
    }
 * @returns {*}
 */
export const userVouchersList = (config) => { return http.get('vouchers/getUserVouchersList',config); }

/**
 * 领取优惠券
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyId":"公司ID",
   "busContsCode":"业务触点",
   "couponsId":"优惠劵ID",
   "totalFlag":"全部领取标记",
   "cardId:"领取指定的卡ID"
    }
 * @returns {*}
 */
export const saveCoupons = (config) => { return http.post('vouchers/saveCoupons',config); }

/**
 * 获取结算可用优惠信息 (季老师)
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyId":"公司ID",
   scopeId: 0,
   shopId: 店铺id,
   rtlOrdInterHdId: 订单中间表id
    }
 * @returns {*}
 */
export const getOrderCouponsList = (config) => { return http.get('vouchers/getOrderCouponsList',config); }

/**
 * 根据卡编号 获取卡id
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyId":"公司ID",
   scopeId: 0,
   shopId: 店铺id,
   rtlOrdInterHdId: 订单中间表id
    }
 * @returns {*}
 */
export const getCouponsId = (config) => { return http.get('vouchers/getCouponsId',config); }

/**
 * 选券后获取可用券id列表 (季老师)
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyId":"公司ID",
   ownCompanyId "公司ID",
   rtlOrdHd 非必传
   cardIds ['123','456'] //全选中券id
   rtlOrdInterHdId: 订单中间表id
    }
 * @returns {*}
 */
export const getCanUseCouponsList = (config) => { return http.get('vouchers/getCanUseCouponsList',config); }

/**
 * 获取赠品
 * @param config
 * @returns {*|Promise}
 */
export const getNewOrderPromotion = (config) => { return http.get('vouchers/getNewOrderPromotion',config); }

/**
 * 获取商品促销活动
 * @param config
 * var param = {
   "usrId": "用户ID",
   "companyId": "公司ID",
   "shopCode": "店铺编码",
   "goodsCode": "商品编码",
   "sizeCode": "尺码编码",
   "colorCode": "颜色编码"
    }
 * @returns {*}
 */
export const getGoodsPromotion = (config) => { return http.get('vouchers/getGoodsPromotion',config); }

/**
 * 获取商品促销活动(包含积分)
 * @param config
 * var param = {
    usrId: "用户ID",
    companyId: "公司ID",
    rtlOrdInterHdId: 中间表id,
    cardIds: '卡券id',
    pointFlag： '是否使用积分' 1使用
    }
 * @returns {*}
 */
export const getOrderDiscountPoint = (config) => { return http.post('vouchers/getOrderDiscountPoint',config); }

/**
 * 加入微信卡券获取参数
 * @param config
 * var param = {
      "card_id": "string",  卡券weixinId
      "code": "string",
      "isNeedOpenid": 0,
      "openId": "string",
      "wxuuid": "string"
    }
 * @returns {*}
 */
export const getWxconfig = (config) => { return http.post('vouchers/getWxConfig',config); }

/**
 * 发卡发券
 * @param config
 * var param = {
      "ownCompanyId":
      "companyId":
      "usrId": 用户id
    }
 * @returns {*}
 */
export const sendCardCoupons = (config) => { return http.put('vouchers/sendCardCoupons',config); }