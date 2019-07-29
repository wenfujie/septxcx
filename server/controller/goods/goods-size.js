/*
* createTime：2018/7/31
* author：en.chen
* description: 商品模块获取商品尺寸大小
*/

const goods = require('../../model/goods')

const getGoodsSize = async function (ctx,next) {
    let res = await goods.getGoodsSizeValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodsSize
