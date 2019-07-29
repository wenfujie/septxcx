/*
 * createTime：2018/8/21
 * author：en.chen
 * description: 会员模块-会员基本功能api
 */

const userInfo = require('../../model/user-info')

class info {

    //  根据用户获取下一等级还需要消费的金额，名称
    static async getVipLevel(ctx, next) {
        let res = await userInfo.getVipLevelInfo(ctx, ctx.params)
        ctx.body = res.data
    }


    // 获取首页会员信息
    static async vipInfo(ctx, next) {
        let res = await userInfo.getVipInfoValue(ctx, ctx.params)
        ctx.body = res.data
    }

    //  获取用户信息
    static async userInfo(ctx, next) {
        let res = await userInfo.getUserInfoValue(ctx, ctx.params)
        ctx.body = res.data
    }

    //  修改用户信息
    static async updateInfo(ctx, next) {
        let res = await userInfo.updateUserInfoValue(ctx, ctx.params)
        ctx.body = res
    }

    //  获取会员自定义信息
    static async memberInfo(ctx, next) {
        let res = await userInfo.getMemberInfo(ctx, ctx.params)
        ctx.body = res.data
    }

    //  修改会员自定义信息
    static async updateMemberInfo(ctx, next) {
        let res = await userInfo.updateMemberInfoValue(ctx, ctx.params)
        ctx.body = res
    }

    static async updateChimaInfo(ctx, next) {
        let res = await userInfo.updateChimaInfoValue(ctx, ctx.params)
        ctx.body = res
    }

    //  修改会员自定义信息
    static async updateMemberBodyInfo(ctx, next) {
        let res = await userInfo.updateMemberBodyInfo(ctx, ctx.params)
        ctx.body = res
    }



    //  保存我的足迹
    static async saveFootprint(ctx, next) {
        let res = await userInfo.saveUserFootprintValue(ctx, ctx.params)
        ctx.body = res
    }

    //  获取我的足迹
    static async userFootprint(ctx, next) {
        let res = await userInfo.getUserFootprintValue(ctx, ctx.params)
        ctx.body = res.data
    }

    //  删除我的足迹
    static async deleteFootprint(ctx, next) {
        let res = await userInfo.deleteUserFootprintValue(ctx, ctx.params)
        ctx.body = res
    }

    //  获取消费记录
    static async purchaseHistory(ctx, next) {
        let res = await userInfo.getPurchaseHistoryValue(ctx, ctx.params)
        ctx.body = res.data
    }

    //  获取会员推荐尺码
    static async memberRcmd(ctx, next) {
        let res = await userInfo.getMemberRcmdValue(ctx, ctx.params)
        ctx.body = res.data
    }

    //  保存会员推荐尺码
    static async savememberRcmd(ctx, next) {
        let res = await userInfo.saveMemberRcmdValue(ctx, ctx.params)
        ctx.body = res
    }

    //  获取商品详情的气泡，已购买的用户列表
    static async getGoodsClient(ctx, next) {
        let res = await userInfo.getGoodsClient(ctx, ctx.params)
        ctx.body = res.data
    }
}

module.exports = info