/*
 * createTime：2018/12/22
 * author：en.chen
 * description: 资金模块
 */

//  支付功能模块
const fundFun = require("../controller/fund/fund");

module.exports = {
  "GET/getFundDetail": fundFun.getFund, // 获取账户资金
  "GET/getFundsList": fundFun.getFundsList, // 获取资金详情列表
  "POST/wxCharge": fundFun.wxCharge, //微信充值
  "GET/getChargeCardList": fundFun.getChargeCardList, // 获取充值卡信息列表
  "GET/chargeByCardNum": fundFun.chargeByCardNum, // 通过卡号密码充值
  "GET/chargeByCardId": fundFun.chargeByCardId, // 通过充值卡id充值
  "GET/getChargeTypeList": fundFun.getChargeTypeList, // 获取充值类型列表
  "GET/getCardInfoForCheck": fundFun.getCardInfoForCheck // 获取充值类型列表
};
