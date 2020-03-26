/*
* createTime：2018/7/25
* author：en.chen
* description:  会员模块-地址增删改查功能api
*/

const userAddr = require('../../model/user-address')

class address {

    // 获取地址列表
    static async getAddrList(ctx, next) {
        let res = await userAddr.getAddrList(ctx, ctx.params)
        ctx.body = res.data
    }

    //  新增/修改用户地址
    static async changeAddrInfo(ctx, next) {
        let res = await userAddr.changeAddrInfo(ctx, ctx.params)
        ctx.body = res
    }

    // 删除地址列表
    static async deleteAddrList(ctx, next) {
        let res = await userAddr.deleteAddrList(ctx, ctx.params)
        ctx.body = res
    }

    // 获取地址详情
    static async getAddrDetail(ctx, next) {
        let res = await userAddr.getAddrDetail(ctx, ctx.params)
        ctx.body = res.data
    }


}

module.exports = address
