/*
* createTime：2018/10/9
* author：en.chen
* description: 订单支付
*/

const paymentFun = require('../../model/payment')

class payment {

    //  订单支付
    static async orderPayment (ctx, next) {
        let res = await paymentFun.payOrder(ctx,ctx.params)
        ctx.body = res
    }

}

module.exports = payment