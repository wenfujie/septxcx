/*
* createTime：2019/3/20
* author：junyong.hong
* description: 满减、满折、赠品
*/

const goods = require('../../model/goods')

const getGoodPreferential = async function (ctx,next) {
    let res = await goods.getGoodPreferential(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodPreferential
