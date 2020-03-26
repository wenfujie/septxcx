/*
 * createTime：2018/8/21
 * author：en.chen
 * description: 会员模块-会员基本功能api
 */

const userInfo = require('../../model/user-info')

class info {

    //  根据用户获取下一等级还需要消费的金额，名称
    static async getVipLevelInfo(ctx, next) {
        let res = await userInfo.getVipLevelInfo(ctx, ctx.params)
        ctx.body = res.data
    }


    // 获取首页会员信息
    static async getVipInfo(ctx, next) {
        let res = await userInfo.getVipInfo(ctx, ctx.params)
        ctx.body = res.data
    }

    //  获取用户信息
    static async getUserInfo(ctx, next) {
        let res = await userInfo.getUserInfo(ctx, ctx.params)
        ctx.body = res.data
    }

    //  修改用户信息
    static async updateUserInfo(ctx, next) {
        let res = await userInfo.updateUserInfo(ctx, ctx.params)
        ctx.body = res
    }

    //  获取会员自定义信息
    static async getMemberInfo(ctx, next) {
        let res = await userInfo.getMemberInfo(ctx, ctx.params)
        ctx.body = res.data
    }

    //  修改会员自定义信息
    static async updateMemberInfo(ctx, next) {
        let res = await userInfo.updateMemberInfo(ctx, ctx.params)
        ctx.body = res
    }

    static async updateChimaInfo(ctx, next) {
        let res = await userInfo.updateChimaInfo(ctx, ctx.params)
        ctx.body = res
    }

    //  修改会员自定义信息
    static async updateMemberBodyInfo(ctx, next) {
        let res = await userInfo.updateMemberBodyInfo(ctx, ctx.params)
        ctx.body = res
    }



    //  保存我的足迹
    static async saveUserFootprint(ctx, next) {
        let res = await userInfo.saveUserFootprint(ctx, ctx.params)
        ctx.body = res
    }

    //  获取我的足迹
    static async getUserFootprint(ctx, next) {
        let res = await userInfo.getUserFootprint(ctx, ctx.params)
        ctx.body = res.data
    }

    //  删除我的足迹
    static async deleteUserFootprint(ctx, next) {
        let res = await userInfo.deleteUserFootprint(ctx, ctx.params)
        ctx.body = res
    }

    //  获取消费记录
    static async getPurchaseHistory(ctx, next) {
        let res = await userInfo.getPurchaseHistory(ctx, ctx.params)
        ctx.body = res.data
    }

    //  获取会员推荐尺码
    static async getMemberRcmd(ctx, next) {
        let res = await userInfo.getMemberRcmd(ctx, ctx.params)
        ctx.body = res.data
    }

    //  保存会员推荐尺码
    static async saveMemberRcmd(ctx, next) {
        let res = await userInfo.saveMemberRcmd(ctx, ctx.params)
        ctx.body = res
    }

    //  获取商品详情的气泡，已购买的用户列表
    static async getGoodsClient(ctx, next) {
        let res = await userInfo.getGoodsClient(ctx, ctx.params)
        ctx.body = res.data
    }

    // 获取用户关联账户列表()
    static async getRelationAccountList(ctx, next) {
        let params = {
            ownCompanyId: ctx.params.companyId,
            companyId: ctx.params.companyId,
            vipId: ctx.params.vipInfoHdId
        }
        let res = await userInfo.getRelationAccountList(ctx, params)
        ctx.body = res.data
    }
}

module.exports = info
