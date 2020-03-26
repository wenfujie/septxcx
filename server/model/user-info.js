/*
 * createTime：2018/8/21
 * author：en.chen
 * description: 会员模块-会员信息功能模块用于处理前端请求的中间层接口
 */
const common = require('./common')

class userInfo {
    //  根据用户获取下一等级还需要消费的金额，名称
    static async getVipLevelInfo(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + common.newUrlKey +
            '/vip-level-upgs/next-level/info', params).then((res) => {
                return res
            });
    }

    //  获取账户页面会员信息
    static async getVipInfo(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + common.newUrlKey +
            '/vip-info-hds/index-info/vip-id', params).then((res) => {
                return res
            });
    }

    //  获取个人资料
    static async getUserInfo(ctx, params) {
        let url = '/vip-info-aggregates/vip-id/' + params.vipInfoHdId
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + common.newUrlKey + url, params).then((res) => {
            return res
        });
    }

    //  修改个人资料
    static async updateUserInfo(ctx, params) {
        let url = '/vip-info-hds/usr-id/' + params.usrId + '?companyId=' + params.companyId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取会员自定义属性
    static async getMemberInfo(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + common.newUrlKey +
            '/sp-ctms/vip-customs', params).then((res) => {
                return res
            });
    }

    //  修改会员自定义属性
    static async updateMemberInfo(ctx, params) {
        let url = '/sp-ctms/vip-customs?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    static async updateChimaInfo(ctx, params) {
        let url = '/sp-ctms/vip-bill-customs?billCode=' + params.billCode + '&usrId=' + params.usrId + '&companyId=' + params.companyId;
        console.log("-------->>", params)
        params.spVipCustomsSaveDto.ownCompanyId = params.companyId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params.spVipCustomsSaveDto).then((res) => {
            return res
        });
    }

    //  修改会员自定义属性(新)
    static async updateMemberBodyInfo(ctx, params) {
        console.error("updateMemberBodyInfo")
        let url = '/sp-ctms/vip-measure-customs?usrId=' + params.usrId + '&companyId=' + params.companyId + "&saleMeasureHdId=" + params.saleMeasureHdId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }



    //  保存我的足迹
    static async saveUserFootprint(ctx, params) {
        let url = '/footmark-hd-aggregates/insert-vip-info?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取我的足迹
    static async getUserFootprint(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/footmark-hd-aggregates/get-myfootmark', params).then((res) => {
            return res
        });
    }

    //  删除我的足迹
    static async deleteUserFootprint(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.memberService + '/footmark-hds/clear-flag', params).then((res) => {
            return res
        });
    }

    //  获取消费记录
    static async getPurchaseHistory(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/card-info-dt-costs/consume-list/usr-id', params).then((res) => {
            return res
        });
    }

    //  获取会员推荐尺码
    static async getMemberRcmd(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-ctms/recommend-size', params).then((res) => {
            return res
        });
    }

    //  保存会员推荐尺码
    static async saveMemberRcmd(ctx, params) {
        let url = '/sp-ctms/recommend-size?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params.spCommendSizeDto).then((res) => {
            return res
        });
    }

    //  获取商品详情的气泡，已购买的用户列表
    static async getGoodsClient(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-hds/random', params).then((res) => {
            return res
        });
    }

    //获取用户关联账户列表(包含自身)
    static async getRelationAccountList(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-hds/relation-list', params).then((res) => {
            return res
        });
    }
}

module.exports = userInfo
