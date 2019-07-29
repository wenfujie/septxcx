/*
* createTime：2019/2/28
* author：en.chen
* description:  分销模块
*/
const distributionModule = require('../../model/distribution')

class distribution {

    //  发展下级分销商(绑定上下级关系)
    static async bindLevel (ctx, next) {
        let res = await distributionModule.bindLevel(ctx,ctx.params)
        ctx.body = res
    }

    //  获取注册协议
    static async getArticle (ctx, next) {
        let res = await distributionModule.getArticle(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取成为分销商奖励金
    static async getReward (ctx, next) {
        let res = await distributionModule.getReward(ctx,ctx.params)
        ctx.body = res.data
    }

    //  申请成为分销商
    static async applyVip (ctx, next) {
        let res = await distributionModule.applyVip(ctx,ctx.params)
        ctx.body = res
    }

    //  分销商账户信息记录
    static async getVipInfo (ctx, next) {
        let res = await distributionModule.getVipInfo(ctx,ctx.params)
        ctx.body = res.data
    }

    //  查询提现、转账失败原因
    static async checkFailReason (ctx, next) {
        let res = await distributionModule.checkFailReason(ctx,ctx.params)
        ctx.body = res.data
    }

    //  查询我的钱包流水列表
    static async getWalletList (ctx, next) {
        let res = await distributionModule.getWalletList(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取申请提现之前的规则信息
    static async getWithdrawRule (ctx, next) {
        let res = await distributionModule.getWithdrawRule(ctx,ctx.params)
        ctx.body = res.data
    }

    //  申请提现
    static async applyWithdraw (ctx, next) {
        let res = await distributionModule.applyWithdraw(ctx,ctx.params)
        ctx.body = res
    }

    //  查询提现流水列表
    static async getWithdrawList (ctx, next) {
        let res = await distributionModule.getWithdrawList(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取分销商下级会员信息
    static async getSubordinateList (ctx, next) {
        let res = await distributionModule.getSubordinateList(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取下级会员对账单列表
    static async getBillList (ctx, next) {
        let res = await distributionModule.getBillList(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取次级会员对账单信息
    static async getSecondaryBillInfo (ctx, next) {
        let res = await distributionModule.getSecondaryBillInfo(ctx,ctx.params)
        ctx.body = res.data
    }

    //  导出到邮箱(下级会员账单)
    static async sendEmail (ctx, next) {
        let res = await distributionModule.sendEmail(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取分销商直属下级分润排名
    static async getRankList (ctx, next) {
        let res = await distributionModule.getRankList(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取分销商任务列表
    static async getTaskList (ctx, next) {
        let res = await distributionModule.getTaskList(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取分销商任务详情
    static async getTaskDetail (ctx, next) {
        let result = {}
        let imgList = []
        result.imgList = []
        let response = await distributionModule.getTaskDetail(ctx,ctx.params)
        let res = response.data
        if(!res.errorMsg) {
            let map = {}
            if(!!res.mdtTaskDtPicDtoList && res.mdtTaskDtPicDtoList.length>0) {
                //  前端并发请求
                imgList = await ctx.$requestAll(res.mdtTaskDtPicDtoList.map((item) => {
                    map.vipId = ctx.params.vipId
                    map.taskDtId = item.id
                    if(item.qrParameterCode === 'D_QRPARAMETER02') {  // 二维码任务带商品
                        map.goodsCode = item.mdtTaskDttPartDto.partCode
                    }
                    let data = {
                        usrId: ctx.params.usrId,
                        ownCompanyId: ctx.params.companyId,
                        companyId: ctx.params.companyId,
                        param: JSON.stringify([map])
                    }
                    return distributionModule.getTaskDetailImg(ctx,data)
                }));
            }
            imgList.forEach((item) => {
                let data = item.data
                result.imgList.push(data[0])
            })
            result.taskInfo = res
            ctx.body = result

        }else{
            ctx.body = res
        }
    }

    //  判断用户是否是分销商
    static async isDistribution (ctx, next) {
        let res = await distributionModule.isDistribution(ctx,ctx.params)
        ctx.body = res.data
    }

    //  通过vipId获取会员信息
    static async getUserInfo (ctx, next) {
        let res = await distributionModule.getUserInfo(ctx,ctx.params)
        ctx.body = res.data
    }

    //  通过vipId生成会员的小程序二维码
    static async getWechatQrcode (ctx, next) {
        let res = await distributionModule.getWechatQrcode(ctx,ctx.params)
        ctx.body = res.data
    }

    //  通过vipId和转发文字生成会员的小程序二维码(伟生)
    static async qrcodeWithText (ctx, next) {
        let res = await distributionModule.qrcodeWithText(ctx,ctx.params)
        ctx.body = res.data
    }

    //  判断用户能否可以成为下级分销商
    static async canBindLevel (ctx, next) {
        let res = await distributionModule.canBindLevel(ctx,ctx.params)
        ctx.body = res.data
    }

    //  设置分销商首次登陆标记
    static async setFlag (ctx, next) {
        let res = await distributionModule.setFlag(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取分销商模块配置规则（用于分销商对账单查询传参）
    static async getLevelRule (ctx, next) {
        let res = await distributionModule.getLevelRule(ctx,ctx.params)
        ctx.body = res.data
    }
}

module.exports = distribution
