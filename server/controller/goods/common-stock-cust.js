/*
* createTime：2018/12/14
* author：fujie.wen
* description: 商品模块查询商品库存(单品、组合)
*/

const goods = require('../../model/goods')

const getCommonStockCust = async function (ctx,next) {
    let res = await goods.getCommonStockCustValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = getCommonStockCust
