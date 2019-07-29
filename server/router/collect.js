/*
* createTime：2018/8/16
* author：en.chen
* description: 中间层提供给前端的收藏模块api
*/

//  获取收藏列表
const getCollectionList = require('../controller/collect/collection-list')

//  加入收藏
const addCollection = require('../controller/collect/add-collection')

//  加入收藏(组合)
const addCollectionComb = require('../controller/collect/add-collection-comb')

//  取消收藏
const deleteCollection = require('../controller/collect/delete-collection')

//  取消收藏(组合)
const deleteCollectionComb = require('../controller/collect/delete-collection-comb')

module.exports = {
    "GET/collectionList": getCollectionList,
    "POST/addCollection": addCollection,
    "POST/addCollectionComb": addCollectionComb,
    "DELETE/deleteCollection": deleteCollection,
    "PUT/deleteCollectionComb": deleteCollectionComb
}

