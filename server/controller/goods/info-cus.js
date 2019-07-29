/*
* createTime：2018/11-8
* author：fujie.wen
* description:  商品模块查询商品详情(定制)
*/

const goods = require('../../model/goods')

const getGoodsInfoCus = async function (ctx,next) {
    let res = await goods.getGoodsInfoCusValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodsInfoCus
