/*
 * createTime：2018/8/9
 * author：en.chen
 * description: 获取购物车列表
 */

const cart = require('../../model/shopping-cart')
const getshopVouchers = async function (ctx, next) {
    let res = await cart.getshopVoucherValue(ctx, ctx.params);
    ctx.body = res;
}
module.exports = getshopVouchers;