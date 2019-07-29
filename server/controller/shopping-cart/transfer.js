/*
* createTime：2018/7/16
* author：en.chen
* description: 批量转移本地购物车
*/

const cart = require('../../model/shopping-cart')

const cartTransfer = async function (ctx,next) {
    let res = await cart.transferValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = cartTransfer
