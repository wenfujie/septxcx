/*
* createTime：2018/11/14
* author：fujie.wen
* description: 商品模块查询商品库存(定制单品)
*/

const goods = require('../../model/goods')

const getGoodsStockCust = async function (ctx,next) {
    let res = await goods.getGoodsStockCustValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = getGoodsStockCust
