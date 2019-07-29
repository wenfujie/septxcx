/*
* createTime：2018/12-13
* author：fujie.wen
* description:  查询商品详情（组合2D展示）
*/

const goods = require('../../model/goods')

const getGroupGoodsInfoCus = async function (ctx,next) {
    let res = await goods.getGroupGoodsInfoCusValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGroupGoodsInfoCus
