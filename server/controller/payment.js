/*
* createTime：2018/10/9
* author：en.chen
* description: 订单支付
*/

const payment = require('../model/payment')

class paymentController {

    //  订单支付
    static async orderPayment (ctx, next) {
        let res = await payment.payOrder(ctx,ctx.params);
        ctx.body = res
    }
}

module.exports = paymentController;
