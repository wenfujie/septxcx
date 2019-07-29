/*
* createTime：2018/12/15
* author：fujie.wen
* description:  查询单品推荐套餐
*/

const goods = require('../../model/goods')

const getRecommendPackages = async function (ctx,next) {
    let res = await goods.getRecommendPackagesValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getRecommendPackages
