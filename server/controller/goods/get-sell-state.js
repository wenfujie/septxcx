/*
* createTime：2018/8/7
* author：en.chen
* description: 批量获取上下架
*/

const goods = require('../../model/goods')

const getSellState = async function (ctx,next) {
    let res = await goods.getSellStateValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = getSellState
