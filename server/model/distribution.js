/*
* createTime：2019/2/28
* author：en.chen
* description: 分销模块
*/

class distributionModule {

    //  发展下级分销商(绑定上下级关系)
    static async bindLevel(ctx, params) {
        let url = `/vip-info-mdts-aggregate/dev-vipmdt-underling?upVipId=${params.upVipId}&unVipId=${params.unVipId}&busconsCode=${params.busconsCode}&companyId=${params.companyId}&usrId=${params.usrId}`
        let ascriptionId = `&ascriptionId=${params.ascriptionId}`
        let taskId = `&taskId=${params.taskId}`
        if (!!params.ascriptionId) url += ascriptionId
        if (!!params.taskId) url += taskId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取注册协议
    static async getArticle(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/cms-articles-aggregate/article-content', params).then((res) => {
            return res
        });
    }

    //  获取成为分销商奖励金
    static async getReward(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-mdts-aggregate/get-bonus', params).then((res) => {
            return res
        });
    }

    //  申请成为分销商
    static async applyVip(ctx, params) {
        let url = `/vip-info-mdts-aggregate/apply-to-vipmdt?vipInfoHdId=${params.vipInfoHdId}&ascriptionId=${!!params.ascriptionId ? params.ascriptionId : ''}&busconsCode=${params.busconsCode}&companyId=${params.companyId}&usrId=${params.usrId}`
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        }, (err) => {
            return err
        });
    }

    //  分销商账户信息记录
    static async getVipInfo(ctx, params) {
        let url = `/vip-info-mdts/amount-infos/${params.vipInfoHdId}`
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  查询提现、转账失败原因
    static async checkFailReason(ctx, params) {
        let url = `/mdt-casechk-hds/transfer-fail-reason/${params.id}`
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.invoice + url, params).then((res) => {
            return res
        });
    }

    //  查询我的钱包流水列表
    static async getWalletList(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-mdt-dt-erdetails/page', params).then((res) => {
            return res
        });
    }

    //  获取申请提现之前的规则信息
    static async getWithdrawRule(ctx, params) {
        let url = `/mdt-rule-caseset-hds/rule-mdt/${params.id}`
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.invoice + url, params).then((res) => {
            return res
        });
    }

    //  申请提现
    static async applyWithdraw(ctx, params) {
        let url = `/mdt-casechk-hds?companyId=${params.companyId}&usrId=${params.usrId}`
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.invoice + url, params).then((res) => {
            return res
        });
    }

    //  查询提现流水列表
    static async getWithdrawList(ctx, params) {
        let url = `/mdt-casechk-hds/by-mdt-id/${params.id}`
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.invoice + url, params).then((res) => {
            return res
        });
    }

    //  获取分销商下级会员信息
    static async getSubordinateList(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-mdts-aggregate/get-unvipmdtlist', params).then((res) => {
            return res
        });
    }

    //  获取下级会员对账单列表
    static async getBillList(ctx, params) {
        let url = `/vip-info-mdts/bill/${params.id}`
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取次级会员对账单信息
    static async getSecondaryBillInfo(ctx, params) {
        let url = `/vip-info-mdts/secondary/${params.id}`
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  导出到邮箱(下级会员账单)
    static async sendEmail(ctx, params) {
        let url = `/vip-info-mdts/send-mail/${params.id}`
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取分销商直属下级分润排名
    static async getRankList(ctx, params) {
        let url = `/vip-info-mdts/distribution-ranking/${params.id}`
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取分销商任务列表
    static async getTaskList(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/mdt-task-hds/list/dateFlag', params).then((res) => {
            return res
        });
    }

    //  获取分销商任务详情
    static async getTaskDetail(ctx, params) {
        let url = `/mdt-task-hds/${params.id}`
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取分销商任务详情(带商品)
    static async getTaskDetailInfo(ctx, params) {
        let url = '/mdt-task-hds/detail'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  记录转发任务的次数
    static async addShareTaskCount(ctx, params) {
        let url = `/mdt-task-hds/add-count/${params.taskId}?companyId=${params.companyId}&usrId=${params.usrId}`
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取分销商任务详情图片
    static async getTaskDetailImg(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/mdt-task-hds/pic-mix', params).then((res) => {
            return res
        });
    }

    //  判断用户是否是分销商
    static async isDistribution(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-mdts-aggregate/is-vipmdt', params).then((res) => {
            return res
        });
    }

    //  通过vipId获取会员信息
    static async getUserInfo(ctx, params) {
        let url = `/vip-info-hds/${params.vipId}`
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  通过vipId生成会员的小程序二维码
    static async getWechatQrcode(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-mdts-aggregate/get-wechat-qrcode', params).then((res) => {
            return res
        });
    }

    //  通过vipId和转发文字生成会员的小程序二维码(伟生)
    static async qrcodeWithText(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-mdts-aggregate/wechat-qrcode-with-text', params).then((res) => {
            return res
        });
    }

    //  判断用户能否可以成为下级分销商
    static async canBindLevel(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-mdts-aggregate/is-dev-underling', params).then((res) => {
            return res
        });
    }

    //  设置分销商首次登陆标记
    static async setFlag(ctx, params) {
        let url = `/vip-info-mdts/set-first-flag/${params.id}?companyId=${params.companyId}&usrId=${params.usrId}`
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取分销商模块配置规则（用于分销商对账单查询传参）
    static async getLevelRule(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/mdt-rule-level-hds/list', params).then((res) => {
            return res
        });
    }

    //  所有任务标记为已读
    static async readTask(ctx, params) {
        let url = `/vip-info-mdt-dt-tasks/all-read/${params.vipInfoHdId}?companyId=${params.companyId}&usrId=${params.usrId}`
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  会员整合新增查询同账号下的分销商账号列表
    static async getDistributionList(ctx, params) {
        let url = `/vip-info-mdts/get-list-by-related-vip-id/${params.vipInfoHdId}`
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

}

module.exports = distributionModule
