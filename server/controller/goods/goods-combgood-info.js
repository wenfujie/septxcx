/*
* createTime：2018/11/27
* author：zhibin.zhao
* description:  获取组合商品信息
*/

const goods = require('../../model/goods')

const getCombGoodsInfoValue = async function (ctx,next) {
    let res = await goods.getCombGoodsInfoValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getCombGoodsInfoValue
