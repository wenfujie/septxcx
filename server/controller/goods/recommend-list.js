/*
* createTime：2018/7/14
* author：en.chen
* description:  商品模块查询平台商品的推荐商品列表
*/

const goods = require('../../model/goods')

const goodsRecommendList = async function (ctx,next) {
    let res = await goods.getGoodsRecommendListValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = goodsRecommendList
