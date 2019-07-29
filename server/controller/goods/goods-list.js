/*
 * createTime：2018/7/25
 * author：en.chen
 * description: 商品模块查询商品列表/商品墙
 */

const goods = require('../../model/goods')

const getGoodsList = async function (ctx, next) {
    let res = await goods.getGoodsListValue(ctx, ctx.params);
    ctx.body = res;
}

module.exports = getGoodsList