/*
 * @Author: yongtian.hong
 * @Date: 2018-09-25 15:10:30
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-06-20 11:31:15
 * @Description: 售后服务路由适配
 */
const postSaleFun = require("../controller/postSale");

module.exports = {
  "GET/getPostSaleList": postSaleFun.getPostSaleList,
  "PUT/cancelApply": postSaleFun.cancelApply,
  "POST/submitApply": postSaleFun.submitApply,
  "GET/getReason": postSaleFun.getReason,
  "GET/getReasonCodes": postSaleFun.getReasonCodes,
  "GET/getPostSaleWays": postSaleFun.getPostSaleWay,
  "GET/getPostSaleDetail": postSaleFun.getPostSaleDetail,
  "GET/getExpressCompanies": postSaleFun.getExpressCompanies,
  "POST/savePostSaleLogis": postSaleFun.savePostSaleLogis,
  "GET/getApplyNum": postSaleFun.getApplyNum

};
