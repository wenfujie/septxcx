/*
* createTime：2018/8/1
* author：en.chen
* description: 保存购物车
*/

const cart = require('../../model/shopping-cart')

const saveCart = async function (ctx,next) {
    let res = await cart.saveCartValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = saveCart
