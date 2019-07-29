/*
* createTime：2018/11/21
* author：en.chen
* description: 提交企业团购
*/

//  提交企业团购
const teamPurchaseFun = require('../controller/team-purchase/team-purchase')

module.exports = {
    "POST/purchase": teamPurchaseFun.postPurchase,  // 提交企业团购
}