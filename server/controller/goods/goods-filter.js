/*
* createTime：2018/11-8
* author：en.chen
* description: 商品模块查询商品列表/商品墙 (过滤orderFlag=1数据)
*/

const goods = require('../../model/goods')

const getFilterGoodsList = async function (ctx,next) {
    let res = await goods.getFilterGoodsListValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = getFilterGoodsList
