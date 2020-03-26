/**
 *
 * @description: 裂变
 * @author: junyong.hong
 * @createTime: 2019/9/24
 * @version: 1.0.0.0
 * @history:
 *    1、
 *    2、
 *
 */
const common = require('./common')

class fission {
    // 拼团列表
    static async findGrpartList(ctx, params) {
        let url = `/online-dtt-grparts/find-grpart-list`
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.promotion + common.newUrlKey + url, params).then(res => {
        // return ctx.$get('http://1.1.6.27:28809' + url, params).then(res => {
            return res;
        });
    }

    // 拼团记录
    static async findAllVipinforid(ctx, params) {
        let url = `/vip-info-dtt-fsss/find-all-vipinforid`
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + common.newUrlKey + url, params).then(res => {
        // return ctx.$get('http://1.1.6.27:28805' + url, params).then(res => {
            return res;
        });
    }

    // 拼团记录—删除
    static async delVipDtFss(ctx, params) {
        let url = `/vip-info-dt-fsss`
        return ctx.$delete(ctx.nettyUrl + ctx.serverPortUrl.memberService + common.newUrlKey + url, params).then(res => {
            return res;
        });
    }

    // 拼团详情
    static async onlinedttbgpartInfo(ctx, params) {
        let url = `/online-dt-groups/onlinedttgrpart-info?ownCompanyId=${params.ownCompanyId}`
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.promotion + common.newUrlKey + url, params).then(res => {
        // return ctx.$get('http://1.1.6.224:28809' + url, params).then(res => {
        // return ctx.$get('http://1.1.6.27:28809' + url, params).then(res => {
            return res;
        });
    }
    // 秒杀列表
    static async getFlashSaleList(ctx, params) {
        let url = "/online-dtt-skparts/find-skpart-list";
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.promotion + common.newUrlKey + url, params).then(res => {
        // return ctx.$get('http://1.1.6.27:28809' + url, params).then(res => {
            return res;
        });
    }
    //  秒杀商品详情
    static async getFlashDetail(ctx, params) {
        let url ="/online-dtt-skparts/onlinedttskpart-info?ownCompanyId="+params.ownCompanyId
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.promotion + common.newUrlKey + url, params).then(res => {
            // return ctx.$get('http://1.1.6.27:28809' + url, params).then(res => {
                return res;
            });
    }
    // 获取砍价列表
    static async getBargainList(ctx, params) {
        let url = "/online-dtt-bgparts/find-bgpart-list";
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.promotion + common.newUrlKey + url, params).then(res => {
        // return ctx.$get('http://1.1.6.27:28809' + url, params).then(res => {
            return res;
        });
    }
    // 发起砍价
    static async startBargain(ctx, params) {
        let url = "/online-dtt-bgparts/start-bargain";
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.promotion + common.newUrlKey + url, params).then(res => {
        // return ctx.$post('http://1.1.6.27:28809' + url, params).then(res => {
            return res;
        });
    }
    // 帮助砍价
    static async helpBargain(ctx, params) {
        let url = "/online-dtt-bgparts/help-bargain";
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.promotion + common.newUrlKey + url, params).then(res => {
        // return ctx.$post('http://1.1.6.27:28809' + url, params).then(res => {
            return res;
        });
    }
    // 砍价详情
    static async getBargainDetail(ctx, params) {
        let url = "/online-dtt-bgparts/onlinedttbgpart-info";
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.promotion + common.newUrlKey + url, params).then(res => {
        // return ctx.$get('http://1.1.6.224:28809' + url, params).then(res => {
        // return ctx.$get('http://1.1.6.27:28809' + url, params).then(res => {
            return res;
        });
    }
    // 砍价排行榜
    static async getBargainRank(ctx, params) {
        let url = "/vip-info-dtt-fssbgs/find-fssbg-fist";
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + common.newUrlKey + url, params).then(res => {
        // return ctx.$get('http://1.1.6.27:28805' + url, params).then(res => {
            return res;
        });
    }
    // 获取推荐列表
    static async bargainRecommendList(ctx, params) {
        let url = "/online-dtt-bgparts/find-ptiparts";
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.promotion + common.newUrlKey + url, params).then(res => {
            // return ctx.$get('http://1.1.6.27:28809' + url, params).then(res => {
            return res;
        });
    }
    // 请求服务器时间
    static async getServerDate(ctx, params) {
        let url = "/online-dtt-bgparts/now-date";
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.promotion + common.newUrlKey + url, params).then(res => {
            return res;
        });
    }
     //  秒杀、拼团、砍价 保存更新结算
    static async saveFissionCartTemp(ctx, params) {
        let url = `/fps-sales/cart-temp?companyId=${params.companyId}&usrId=${params.usrId}`;
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + common.newUrlKey + url, params).then(res => {
        // return ctx.$post('http://1.1.6.28:28806' + url, params).then(res => {
            return res;
        });
    }
    //  秒杀、拼团、砍价 获取订单结算页信息
    static async getFissionOrderSettleInfo(ctx, params) {
        let url = `/fps-sales/cart-temp`;
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + common.newUrlKey +url, params).then(res => {
        // return ctx.$get('http://1.1.6.27:28806' + url, params).then(res => {
            return res;
         });
    }
     //  秒杀、拼团、砍价 订单提交
    static async saveFissionOrder(ctx, params) {
        let url = `/fps-sales/order-save?companyId=${params.companyId}&usrId=${params.usrId}`;
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + common.newUrlKey + url, params).then(res => {
        // return ctx.$post('http://1.1.6.27:28806' + url, params).then(res => {
            return res;
         });
    }
    //  裂变 校验库存和上下架接口
    static async checkoutSellStock(ctx, params) {
        let url ="/online-dtt-bgparts/check-fpsstock"
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.promotion + common.newUrlKey + url, params).then(res => {
        // return ctx.$post('http://1.1.6.27:28809' + url, params).then(res => {

            return res;
        });
    }

}

module.exports = fission;
