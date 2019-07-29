/*
* createTime：2019/1/17
* author：fujie.wen
* description: 判断商品是否上架
*/

const goods = require('../../model/goods')

const getGoodSellState = async function (ctx,next) {
    let res = await goods.getGoodSellStateValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodSellState
