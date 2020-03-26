/*
 * @Author: yongtian.hong
 * @Date: 2018-09-26 13:15:13
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-09-26 13:22:01
 * @Description: 第三方服务
 */

const thirdPartyFun = require("../controller/third-party");

module.exports = {
  "POST/getLogis": thirdPartyFun.getLogis
};
