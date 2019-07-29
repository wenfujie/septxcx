/*
 * createTime：2018/7/16
 * author：en.chen
 * description: 购物车模块api聚合
 */

import http from '../../utils/http'

/**
 * 批量转移本地购物车
 * @param config
 * var param = {
   interfaceCode:"SP_MAS_TSFRCART",
   ctmUsrKey:"用户ID",
   companyKey:"公司ID",
   pageSize:"条数",
   pageNo:"查询页",
   cookieKey:"cookieID",
   cartKeys:"key1,key2,key3",
   cartIds: [
        购物车ids
   ],
   cookieId: cookieId,
   ctmUsrId: 用户id
   }
 * @returns {*}
 */
export const transfer = (config) => {
  return http.put('shopping-cart/transfer', config);
}

/**
 * 删除购物车
 * @param config
 * var param = {
    usrId: "用户ID",
    companyId: "公司ID",
    cookieId: "cookieID",
    cartIds: "购物车id数组"
   }
 * @returns {*}
 */
export const deleteCart = (config) => {
  return http.delete('shopping-cart/deleteCart', config);
}

/**
 * 保存购物车
 * @param config
 * var param = {
  "amount": 数量,
  "busContsCode": "业务触点",
  "companyId": 公司ID,
  "cookieId": cookieID,
  "ctmMeasureHdId": 量体数据ID,
  "ctmUsrId": 用户ID,
  "delaySetDtId": 延期优惠ID,
  "dptId": 店铺ID,
  "fitFlag": "试衣标志",
  "goodsCode": "商品编码",
  "memo": "备注",
  "partDtSkuId": 商品SKU ID,
  "pictFileId": 商品截图ID,
  "saleMeasureHdId": 量体工单ID,
  "usrId": 游客或用户ID,
  "rtlCartHdPartDto": [
    {
      "fabricId": 面料ID,
      "fileDtSaveDtos": [
        {
          "fileLength": 文件大写,
          "fileNameFolder": "文件存储路径",
          "fileNameSource": "文件源名称",
          "fileNameUpload": "文件存储名称",
          "md5": "md5",
          "serverId": 服务器ID
        }
      ],
      "memo": "备注说明",
      "partDtAssemplyId": 部件ID,
      "pictFileId": 商品截图,
      "printCode": "印花编码",
      "printName": "印花名称",
      "regionHdId": 部位ID,
      "salePrice": 销售价,
      "tagPrice": 吊牌价
    }
  ]
   }
 * @returns {*}
 */
export const saveCart = (config) => {
  return http.post('shopping-cart/saveCart', config);
}

/**
 * 获取购物车列表
 * @param config
 * var param = {
   "companyId":"公司ID",
    “cartKey”:购物车key（可选）
   "usrKey":"游客或者用户ID",跟cookie 2选一
    "pageSize":"条数",
    "pageNo":"查询页"
   "cookieKey":"cookieID",
   }
 * @returns {*}
 */
export const getCartList = (config) => {
  return http.get('shopping-cart/cartList', config);
}

/**
 * 获取购物车列表
 * @param config
 * var param = {
 * usrId: '用户id'
   }
 * @returns {*}
 */
export const getCartCount = (config) => {
  return http.get('shopping-cart/cartCount', config);
}

/**
 * 判断商品及SKU是否上下架
 * @param config
 * var param = {
 * usrId: '用户id'
   }
 * @returns {*}
 */
export const isGoodsAndSkuShevel = (config) => {
  return http.post('shopping-cart/isGoodsAndSkuShevel', config);
}

/**
 * 获取购物车优惠券列表
 * @param config
 * var param = {
 * usrId: '用户id'
   }
 * @returns {*}
 */
export const getshopVouchers = (config) => {
  return http.post('shopping-cart/getshopVouchers', config);
}

/**
 * 获取购物车促销的详细信息
 * @returns {*}
 */
export const getshopDiscountsDetail = (config) => {
  return http.post('shopping-cart/getshopDiscountsDetail', config);
}