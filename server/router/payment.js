/*
* createTime：2018/10/9
* author：en.chen
* description: 中间层提供给前端的支付模块api
*/

//  支付功能模块
const payment = require('../controller/payment/order-payment')

module.exports = {
    "POST/orderPayment": payment.orderPayment,  // 订单支付
}