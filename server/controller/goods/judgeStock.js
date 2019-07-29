/*
* createTime：2018/8/7
* author：en.chen
* description: 商品模块查询商品库存
*/

const goods = require('../../model/goods')

const judgeStock = async function (ctx,next) {
    let res = await goods.judgeStock(ctx,ctx.params);
    ctx.body = res;
}

module.exports = judgeStock
