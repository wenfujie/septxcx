/*
* createTime：2018/11/21
* author：en.chen
* description: 提交企业团购
*/

const teamPurchase = require('../../model/team-purchase')

class teamPurchaseFun {

    //  获取积分详情
    static async postPurchase (ctx, next) {
        let res = await teamPurchase.postPurchase(ctx,ctx.params)
        ctx.body = res
    }

}

module.exports = teamPurchaseFun