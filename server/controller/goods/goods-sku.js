/*
* createTime：2018/7/27
* author：en.chen
* description: 商品模块查询商品sku
*/

const goods = require('../../model/goods')

const getGoodsSku = async function (ctx,next) {
    let res = await goods.getGoodsSkuValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodsSku
