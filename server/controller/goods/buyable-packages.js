/*
* createTime：2018/12/15
* author：fujie.wen
* description:  获取购买可选套餐
*/

const goods = require('../../model/goods')

const getBuyablePackages = async function (ctx,next) {
    let res = await goods.getBuyablePackagesValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getBuyablePackages
