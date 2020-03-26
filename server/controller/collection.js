/*
* createTime：2018/12/14
* author：fujie.wen
* description: 收藏模块加入收藏功能(组合商品)
*/

const collection = require('../model/collection');

class collectionController {

    //  加入收藏(组合)
    static async addCollectionComb(ctx, next) {
        let res = await collection.addCollectionComb(ctx, ctx.params);
        ctx.body = res;
    }

    //  加入收藏
    static async addCollection(ctx, next) {
        let res = await collection.addCollection(ctx, ctx.params);
        ctx.body = res;
    }

    //  获取收藏列表
    static async getCollectionList(ctx, next) {
        let res = await collection.getCollectionList(ctx, ctx.params);
        ctx.body = res.data;
    }

    //  取消收藏
    static async deleteCollection(ctx, next) {
        let res = await collection.deleteCollection(ctx, ctx.params);
        ctx.body = res;
    }

    //  取消收藏(组合)
    static async  deleteCollectionComb(ctx, next) {
        let res = await collection.deleteCollectionComb(ctx, ctx.params);
        ctx.body = res;
    }

}


module.exports = collectionController
