/*
* createTime：2018/11/26
* author：fujie.wen
* description:  获取商品部件信息，主面料id
*/

const goods = require('../../model/goods')

const getMainFabricInfo = async function (ctx,next) {
    let res = await goods.getMainFabricInfoValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getMainFabricInfo
