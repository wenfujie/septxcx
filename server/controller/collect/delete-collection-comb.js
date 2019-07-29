/*
* createTime：2018/12/14
* author：fujie.wen
* description: 收藏模块加入收藏功能(组合商品)
*/

const collection = require('../../model/collect')

const deleteCollectionComb = async function (ctx,next) {
    let res = await collection.deleteCollectionCombValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = deleteCollectionComb
