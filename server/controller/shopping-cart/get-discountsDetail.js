/*
 * description: 获取购物车促销的详细信息
 */

const cart = require('../../model/shopping-cart')
const getshopDiscountsDetail = async function (ctx, next) {
    let res = await cart.getshopDiscountsDetailValue(ctx, ctx.params);
    ctx.body = res;
}
module.exports = getshopDiscountsDetail;