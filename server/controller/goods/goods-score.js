/*
* createTime：2018/11-9
* author：fujie.wen
* description: 商品评价综合得分
*/
const goods = require('../../model/goods')

const getGoodsScore = async function (ctx,next) {
    let res = await goods.getGoodsScoreValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodsScore
