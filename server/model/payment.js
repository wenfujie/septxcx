/*
* createTime：2018/10/9
* author：en.chen
* description:  订单支付
*/
const common = require('./common')

class paymentFun {

    //  订单支付
    static async payOrder(ctx, params) {
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.payment + common.newUrlKey +
                '/order-pay', params).then((res) => {
            return res
        });
    }

}

module.exports = paymentFun