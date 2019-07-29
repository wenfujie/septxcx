/*
 * createTime：2018/8/16
 * author：en.chen
 * description: 收藏模块用于处理前端请求的中间层接口
 */

class collection {

    //  获取收藏列表
    static async getCollectionListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-collects/clt-info/goods-list', params).then((res) => {
            return res
        });
    }

    // 加入收藏
    static async addCollectionValue(ctx, params) {
        let url = '/sp-goods/favorite?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    // 加入收藏(组合商品)
    static async addCollectionCombValue(ctx, params) {
        let url = '/sp-combgood-goodss/favorite?usrId=' + params.usrId + '&companyId=' + params.companyId + '&ownCompanyId=' + params.ownCompanyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  取消收藏
    static async deleteCollectionValue(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-collects/clt-info', params).then((res) => {
            return res
        });
    }

    //  取消收藏功能(组合商品)
    static async deleteCollectionCombValue(ctx, params) {
    let url = "/rtl-collection-dts/update-cancel-time/" + params.id;
        return ctx.$putUrl(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }
}

module.exports = collection