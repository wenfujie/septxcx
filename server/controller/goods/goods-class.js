/*
* createTime：2018/7/24
* author：en.chen
* description: 商品模块查询商品分类
*/

const goods = require('../../model/goods')

const getGoodsClass = async function (ctx,next) {
    let res = await goods.getGoodsClassValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodsClass
