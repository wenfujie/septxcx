/*
* createTime：2018/7/31
* author：en.chen
* description: 商品模块获取风格选择列表
*/

const goods = require('../../model/goods')

const getGoodsPropList = async function (ctx,next) {
    let res = await goods.getPropListValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodsPropList
