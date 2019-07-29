/*
* createTime：2019/5/27
* author：en.chen
* description: 获取面包屑查询条件ids的前置接口
*/

const goods = require('../../model/goods')

const getCrumbsGoodsIds = async function (ctx, next) {
    let res = await goods.getCrumbsGoodsIds(ctx, ctx.params);
    ctx.body = res;
}

module.exports = getCrumbsGoodsIds