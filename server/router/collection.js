/*
* createTime：2018/8/16
* author：en.chen
* description: 中间层提供给前端的收藏模块api
*/


const collectionFun = require('../controller/collection')
module.exports = {
    "GET/getCollectionList": collectionFun.getCollectionList, //  获取收藏列表
    "POST/addCollection": collectionFun.addCollection, //  加入收藏
    "POST/addCollectionComb": collectionFun.addCollectionComb, //  加入收藏(组合)
    "DELETE/deleteCollection": collectionFun.deleteCollection,  //  取消收藏
    "PUT/deleteCollectionComb": collectionFun.deleteCollectionComb //  取消收藏(组合)
}

