/*
* createTime：2018/8/17
* author：en.chen
* description: 收藏模块取消收藏功能
*/

const collection = require('../../model/collect')

const deleteCollection = async function (ctx,next) {
    let res = await collection.deleteCollectionValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = deleteCollection
