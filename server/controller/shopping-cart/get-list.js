/*
 * createTime：2018/8/9
 * author：en.chen
 * description: 获取购物车列表
 */

const cart = require('../../model/shopping-cart')

const getCartList = async function (ctx, next) {
    let res = await cart.getCartListValue(ctx, ctx.params);
    ctx.body = res.data;
}
module.exports = getCartList