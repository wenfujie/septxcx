/*
* createTime：2019/3/8
* author：junyong.hong
* description: 大货商品详情优惠促销信息
*/

const goods = require('../../model/goods')

const getGoodsPromotion = async function (ctx,next) {
    let res = await goods.getGoodsPromotion(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodsPromotion
