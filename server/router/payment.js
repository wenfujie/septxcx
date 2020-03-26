/*
* createTime：2018/10/9
* author：en.chen
* description: 中间层提供给前端的支付模块api
*/

//  支付功能模块
const paymentFun = require('../controller/payment')

module.exports = {
    "POST/orderPayment": paymentFun.orderPayment,  // 订单支付
}
