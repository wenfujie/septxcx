/*
* createTime：2018/7/16
* author：en.chen
* description: 删除购物车
*/

const cart = require('../../model/shopping-cart')

const deleteCart = async function (ctx,next) {
    let res = await cart.deleteCartValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = deleteCart
