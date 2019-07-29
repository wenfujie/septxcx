/*
* createTime：2018/7/23
* author：en.chen
* description:  商品模块查询商品详情
*/

const goods = require('../../model/goods')

const getGoodsInfo = async function (ctx,next) {
    let res = await goods.getGoodsInfoValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodsInfo
