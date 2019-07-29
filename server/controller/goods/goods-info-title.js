/*
* createTime：2018/8/31
* author：en.chen
* description:  商品模块查询商品详情目录
*/

const goods = require('../../model/goods')

const getGoodsTitle = async function (ctx,next) {
    let res = await goods.getGoodsTitleValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodsTitle
