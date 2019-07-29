/*
* createTime：2019/1/29
* author：zhibin.zhao
* description: 判断商品及SKU是否上下架
*/

const cart = require('../../model/shopping-cart')

const isGoodsAndSkuShevel = async function (ctx,next) {
    let res = await cart.isGoodsAndSkuShevel(ctx,ctx.params);
    ctx.body = res;
}

module.exports = isGoodsAndSkuShevel