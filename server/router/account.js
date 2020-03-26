//  获取常数值
const accountFun = require("../controller/account");

module.exports = {
  "POST/wxCharge": accountFun.wxCharge  // 微信充值
};
