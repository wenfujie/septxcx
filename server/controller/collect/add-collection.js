/*
* createTime：2018/8/17
* author：en.chen
* description: 收藏模块加入收藏功能
*/

const collection = require('../../model/collect')

const addCollection = async function (ctx,next) {
    let res = await collection.addCollectionValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = addCollection
