/*
* createTime：2018/11/14
* author：fujie.wen
* description: 商品分类等级查询
*/

const goods = require('../../model/goods')

const getGoodsLayerClass = async function (ctx,next) {
    let res = await goods.getGoodsLayerClassValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodsLayerClass
