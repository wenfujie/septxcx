/*
* createTime：2018/11/16
* author：en.chen
* description:  线下沙龙模块
*/

class salon {

    //  获取文章列表
    static async getList(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas +  '/cms-articles', params).then((res) => {
            return res
        });
    }

    //  通过id获取文章详情
    static async getDetail(ctx, params) {
        let url = '/cms-articles/' + params.id
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas +  url, params).then((res) => {
            return res
        });
    }

}

module.exports = salon