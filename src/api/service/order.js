/*
 * createTime：2018/9/5
 * author：en.chen
 * description: 订单模块api
 */

import http from "../../utils/http";

/**
 * 获取运费
 * @param config
 * var param = {
    usrId: 用户id,
    companyId: 公司id,
    destId: 地址id,
    id: 订单结算中间表id
    }
 * @returns {*}
 */

export const getFreight = config => {
    return http.get("order/getFreight", config);
};

/**
 * 获取订单优惠信息
 * @param config
 * var param = {
    usrId: 用户id,
    companyId: 公司id,
    billCode: 订单编码
    }
 * @returns {*}
 */

export const getDiscount = config => {
    return http.get("order/getOrderDiscount", config);
};

/**
 * 保存更新结算
 * @param config
 * var param = {
   "interfaceCode":"SP_SALE_SAVECARTTEMP",
   amountOrd: '总价格',
   "ctmUsrKey":"用户ID",
   "companyKey":"公司ID",
   "cookieKey":"cookieID",
   "shopCode":"店铺编码",
   "usrKey":"游客或者用户ID",
   "masCartTempHdKey":"结算中间表ID",
   "skuList":[
      {
         "goodsCode":"商品货号",
         "colorCode":"颜色编码",
         "sizeCode":"尺码编号",
         "amount":"数量",
         "dealPrice":"成交价",
         "masCartTempDtKey":"结算明细ID",
         "cartKey":"购物车ID",
         "groupKey":"搭配KEY",
         "masPartDtSkuKey":"SKUID",
      }
   ]
    }
 * @returns {*}
 */

export const saveCartTemp = config => {
    return http.post("order/saveCartTemp", config);
};

/**
 * 获取结算页商品信息
 * @param config
 * var param = {
    usrId: 用户id,
    ctmUsrId: 用户id,
    cookieId: cookieID,
    rtlCartTempHdId: 中间表id,
    busContsCode: 业务触点,
    shopCode: 门店编码,
    companyId: 公司id,
    }
 * @returns {*}
 */

export const getSettlementInfo = config => {
    return http.get("order/getOrderSettlementInfo", config);
};

/**
 * 获取配送方式
 * @param config
 * var param = {
    effFlag: 1 (是否启用),
    policyTypeCode: 'D_SALERETAIL' （业单据业务类型）,
    }
 * @returns {*}
 */

export const getShipType = config => {
    return http.get("order/getShipType", config);
};

/**
 * 提交订单
 * @param config
 * var param = {
{
  "billId": 35,
  "busContsCode": "D_BUSCONTS_WSC",
  "buyUsrMobile": "18812345678",
  "cargoAddr": "吃人了！",
  "cargoCityId": 101305,
  "cargoCityCode": "350500",
  "cargoCityName": "泉州市",
  "cargoDestrictId": 10130512,
  "cargoDestrictCode": "350582",
  "cargoDestrictName": "晋江市",
  "cargoMobile": "18812345678",
  "cargoProvinceId": 1013,
  "cargoProvinceCode": "350000",
  "cargoProvinceName": "福建省",
  "cargoSexCode": "string",
  "cargoUsrName": "string",
  "cargoZipCode": "string",
  "cartList": [
    {
  "amount": 1,
  "classCode": "nz01",
  "className": "男休闲衬衫",
  "colorCode": "2",
  "colorName": "红色",
  "dealPrice": 103.2,
  "goodsCode": "2",
  "goodsName": "T恤",
  "mainFabricCode": null,
  "mainFabricName": null,
  "masCartTempDtId": null,
  "orderFlag": 0,
  "partList": [],
  "pictFileId": null,
  "ptiPartDtSkuId": 2759,
  "shopCode": "001",
  "shopName": "启尚微商城",
  "sizeCode": "23",
  "sizeName": "38"
    }
  ],
  "ctmMessage": "string",
  "ctmUsrId": 498,
  "ordMemo": "string",
  "receiptWayCode": "kdps",
  "receiptWayId": "7",
  "saleGuiderCode": "string",
  "shopCode": "001",
  "shopId": 305,
  "sourceCode": "D_ORDWEIN",
  "totalQty": 0
}
    }
 * @returns {*}
 */

export const saveOrder = config => {
    return http.post("order/saveOrder", config);
};

//获取物流信息
export const thirdParty = config => {
    return http.post("thirdParty/getLogis", config);
};
// 获取包裹
export const getDetailInfo = config => {
    return http.get("order/getDetailInfo", config);
};
// 获取列表
export const getList = config => {
    return http.get("order/getOrderList", config);
};
// 取消订单
export const cancel = config => {
    return http.put("order/cancelOrder", config);
};

//再次购买
export const buyAgain = config => {
    return http.post("order/buyAgain", config);
};

// 确认收货前判断该订单是否存在售后申请单子
export const beforeSignUp = config => {
    return http.put("order/beforeSignUp", config);
};
// 签收订单(确认收货)
export const signUp = config => {
    return http.put("order/confirmReceived", config);
};

// 获取微信分享签名
export const getWxSignature = config => {
    return http.post("order/getWxSignature", config);
};
// 提交订单评价
export const ordComment = config => {
    return http.post("order/saveOrderComment", config);
};

/**
 * 订单=》处理会员积分
 * @param config
 * var param = {
  ownCompanyId:
  companyId:
  ctmUsrId: 用户id
  usrId: 用户id
  busContsCode: 业务触点
  businessNode: 'SETTLEMENT',//业务节点:订单结算（SETTLEMENT）、收货确认（RECEIPT_CONFIRM）、取消订单（ORDER_CANCEL）
  billCode: 订单编码
    }
 * @returns {*}
 */
export const handlePoints = config => {
    return http.put("order/handlePoints", config);
};

/**
 * 订单=》订单优惠计算
 * @param config
 *  param = {
  ownCompanyId:
  companyId:
  usrId: 用户id
}
 * @returns {*}
 */
//

export const orderPreferCal = config => {
    return http.get("order/getOrderPreferCal", config);
};

// 执行会员升级
export const packLevelUp = config => {
    return http.post("order/packLevelUp", config);
};

/**
 * 订单=》锁库存
 * @param config
 *  param = {
  ownCompanyId:
  companyId:
  usrId: 用户id
  operType: 操作类型(BACK_PAY:后台支付,BACK_CONFIRM:后台确认,BACK_COPY_ORDER:后台复制小票,FRONT_ORDER:客户端下单,FRONT_PAY:客户端支付)
}
 * @returns {*}
 */
export const lockStock = config => {
    return http.put("order/lockStock", config);
};
