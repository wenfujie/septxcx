/*
* createTime：2018/7/25
* author：en.chen
* description:  会员模块-地址增删改查功能api
*/

const userAddr = require('../../model/user-address')

class address {

    // 获取地址列表
    static async getAddrList (ctx, next) {
        let res = await userAddr.getAddrListValue(ctx,ctx.params)
        ctx.body = res.data
    }

    //  新增/修改用户地址
    static async changeAddrInfo (ctx, next) {
        let res = await userAddr.changeAddrValue(ctx,ctx.params)
        ctx.body = res
    }

    // 删除地址列表
    static async deleteAddrList (ctx, next) {
        let res = await userAddr.deleteAddrListValue(ctx,ctx.params)
        ctx.body = res
    }

    // 获取地址详情
    static async addrDetail (ctx, next) {
        let res = await userAddr.addressDetailValue(ctx,ctx.params)
        ctx.body = res.data
    }


}

module.exports = address
