/*
* createTime：2018/8/7
* author：en.chen
* description: 商品模块查询商品库存
*/

const goods = require('../../model/goods')

const getGoodsStock = async function (ctx,next) {
    let res = await goods.getGoodsStockValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodsStock
