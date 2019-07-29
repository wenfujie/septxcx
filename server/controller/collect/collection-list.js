/*
* createTime：2018/8/16
* author：en.chen
* description: 收藏模块查询收藏商品列表
*/

const collection = require('../../model/collect')

const getCollectionList = async function (ctx,next) {
    let res = await collection.getCollectionListValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getCollectionList
