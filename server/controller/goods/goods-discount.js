/*
 * createTime：2018/7/25
 * author：en.chen
 * description: 商品模块查询商品列表/商品墙
 */

const goods = require('../../model/goods')

const getDiscountList = async function (ctx, next) {
    let res = await goods.getDiscountValue(ctx, ctx.params);
    ctx.body = res.data;
}

module.exports = getDiscountList