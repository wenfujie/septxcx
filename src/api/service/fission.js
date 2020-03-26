/**
 *
 * @description: 裂变
 * @author: junyong.hong
 * @createTime: 2019/9/24
 * @version: 1.0.0.0
 * @history:
 *    1、
 *    2、
 *
 */
import http from "../../utils/http";

// 拼团列表
export const findGrpartList = config => {
    return http.get("fission/findGrpartList", config);
};
// 拼团记录
export const findAllVipinforid = config => {
    return http.get("fission/findAllVipinforid", config);
};
// 拼团记录
export const delVipDtFss = config => {
    return http.delete("fission/delVipDtFss", config);
};
// 拼团详情
export const onlinedttbgpartInfo = config => {
    return http.get("fission/onlinedttbgpartInfo", config);
};
// 获取秒杀列表
export const getFlashSaleList = config => {
    return http.get("fission/getFlashSaleList", config);
};
// 秒杀详情
export const getFlashDetail = config => {
    return http.get("fission/getFlashDetail", config);
};
// 获取砍价列表
export const getBargainList = config => {
    return http.get("fission/getBargainList", config);
};
/**
 * 发起砍价
 * @param config
 *
 onlineHdId: ;// 促销id
 ptiPartHdId: ;// 商品id
 vipInfoHdId: ;
 busContsCode: ;
 shopId: 1,
 companyId
 usrId
 */
export const startBargain = config => {
    return http.post("fission/startBargain", config);
};
/**
 * 秒杀保存更新结算
 * @param config
 * var param = {
   "vipInfoHdId":"会员id",
   "shopId": '店铺id',
   "sourceCode":"订单来源编码",
   "onlineHdId":"促销id(online_hd的id)",
   "companyId":"公司id",

   "skuList":[
      {
         "ordQty":"数量",
         "ptiPartDtSkuId":"商品skuId",
         "ptiPartHdId":"商品id",
         "colorId":"颜色id",
         "sizeId":"尺码id",
         "giftFlag":"赠品标志",

      }
   ]
    }
 * @returns {*}
 */

export const saveFissionCartTemp = config => {
    return http.post("fission/saveFissionCartTemp", config);
};
/**
 * 获取裂变促销结算页商品信息
 * @param config
 * @returns {*}
 */

export const getFissionOrderSettleInfo = config => {
    return http.get("fission/getFissionOrderSettleInfo", config);
};
/**
 * 裂变促销提交订单
 * @param config
 * var param = {
{
  "billId": 35,
  "vipInfoHdId":1206
  "fpsCode"//裂变促销类型，秒杀:SECKILL,拼团:GROUP,砍价:BARGAIN
  "shopId": "18812345678",
  "cargoAddr"//店铺id,
  "sourceCode"//订单来源,
  "cargoUsrName": "收货人姓名",
  "cargoMobile": "收货人手机",
  "cargoPhone": 收货人电话,
  "cargoProvinceId": "省份id",
  "addressId": "用户地址id",
  "cargoProvinceCode": "省份编码",
  "cargoProvinceName": 省份名称,
  "cargoCityId": "市区id",
  "cargoCityCode": "市区编码",
  "cargoCityName": "市区名称",
  "cargoDestrictId": "地区id",
  "cargoDestrictCode": "地区编码",
  "cargoDestrictName":"地区名称"

  "cargoAddr": "收货人详细地址",
  "cargoZipCode": "邮箱",
  "ordMemo": "订单备注",
  "ctmMessage": "顾客留言",
  "receiptWayCode": "收货方式",
  "receiptWayId":"收货方式id"
  "recptDptId": "收货店鋪",
  "receiptWayId":"收货方式id"
  "vipCardHdId":"前端使用的会员卡id"
    }
 * @returns {*}
 */
export const saveFissionOrder = config => {
    return http.post("fission/saveFissionOrder", config);
};


/**
 * 帮助砍价
 * @param config
 *
 onlineHdId: ;// 促销id
 ptiPartHdId: ;// 商品id
 vipInfoHdId: ;
 helpedVipInfoHdId: ; // 发起砍价人会员id
 busContsCode: ;
 shopId: 1,
 companyId
 usrId
 */
export const helpBargain = config => {
    return http.post("fission/helpBargain", config);
};

/**
 * 砍价详情
 * @param config
 *
 busContsCode: global.baseConstant.busContsCode,
 goodsCode: 'QX051309' || this.goodsCode,
 dttBgpartId: 10 || this.dttBgpartId,// 砍价id
 onlineHdId: 737,// 线上促销信息id
 shopId: global.Storage.get("properties").shopId,
 companyId
 usrId
 vipInfoHdId
 */
export const getBargainDetail = config => {
    return http.get("fission/getBargainDetail", config);
};

/**
 * 砍价排行榜
 * @param config
 *
 onlineHdId: 737,// 线上促销信息id
 ptiPartHdId:
 companyId
 vipInfoHdId
 */
export const getBargainRank = config => {
    return http.get("fission/getBargainRank", config);
};


/**
 * 获取推荐列表
 * @param config
 *
 shopId: global.Storage.get("properties").shopId,
 busContsCode: global.baseConstant.busContsCode,
 companyId
 vipInfoHdId
 */
export const bargainRecommendList = config => {
    return http.get("fission/bargainRecommendList", config);
};

/**
 * 请求服务器时间
 * @param config
 *
 companyId
 vipInfoHdId
 */
export const getServerDate = config => {
    return http.get("fission/getServerDate", config);
};
/**
 * 裂变 校验库存和上下架接口
 * @param config
 *
 onlineHdId: ;// 促销id
 ptiPartHdId: ;// 商品id
 vipInfoHdId: ;
 busContsCode: ;
 shopId: 1,
 companyId
 usrId
 */
export const checkoutSellStock = config => {
    return http.post("fission/checkoutSellStock", config);
};
