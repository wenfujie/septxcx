/*
* createTime：2018/12-25
* author：fujie.wen
* description:  获取商品可绣花、绣字部位
*/

const goods = require('../../model/goods')

const getUseablePart = async function (ctx,next) {
    let res = await goods.getUseablePartValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getUseablePart
