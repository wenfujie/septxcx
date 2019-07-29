/*
* createTime：2018/7/30
* author：en.chen
* description: 商品模块查询商品评价
*/
const goods = require('../../model/goods')

const getGoodsComments = async function (ctx,next) {
    let res = await goods.getGoodsCommentsValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodsComments
