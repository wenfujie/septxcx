/*
* createTime：2019/3/13
* author：junyong.hong
* description: 获取销售量、虚拟销售量、收藏量
*/

const goods = require('../../model/goods')

const getGoodsCount = async function (ctx,next) {
    let res = await goods.getGoodsCount(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodsCount
