/*
* createTime：2018/12/14
* author：fujie.wen
* description: 收藏模块加入收藏功能(组合商品)
*/

const collection = require('../../model/collect')

const addCollectionComb = async function (ctx,next) {
    let res = await collection.addCollectionCombValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = addCollectionComb
