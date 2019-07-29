/*
* createTime：2018/10/8
* author：en.chen
* description: 获取购物车数量
*/

const cart = require('../../model/shopping-cart')

const getCartCount = async function (ctx,next) {
    let res = await cart.getCartCountValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getCartCount