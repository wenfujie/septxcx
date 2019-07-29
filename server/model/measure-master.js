/*
* createTime：2018/11/13
* author：en.chen
* description: 量体师模块
*/
const common = require('./common')

class measureMaster {

    //  量体师登陆
    static async login(ctx, params) {
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-hds/verify-measure-mobile', params).then((res) => {
            return res
        }, (err) => {});
    }

    //  通过手机号查询量体师信息
    static async checkPhone(ctx, params) {
        let url = '/per-persons/mobile/measure-body-info'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params).then((res) => {
            return res
        }, (err) => {});
    }

    //  量体师信息
    static async getInfo(ctx, params) {
        let url = '/per-persons/measure-usr/' + params.usrId
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params).then((res) => {
            return res
        }, (err) => {});
    }

    //  修改量体师信息
    static async putInfo(ctx, params) {
        let url = '/cud-dpt-dt-addrs/person/' + params.usrId
        return ctx.$putUrl(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params).then((res) => {
            return res
        }, (err) => {});
    }

    //  获取会员量体数据
    static async getMeasureData(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/ctmmeasure-hds/measure-data', params).then((res) => {
            return res
        }, (err) => {});
    }

    //  获取量体工单的净体数据
    static async getCleanData(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + common.newUrlKey +
                '/ctmmeasure-hd-aggregates/msrtype/measure-data', params).then((res) => {
            return res
        }, (err) => {});
    }

    //  获取预约工单的净体数据
    static async getMsrCleanData(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/salemeasure-dt-attrs/list/hdCode', params).then((res) => {
            return res
        }, (err) => {});
    }


    //  获取量体类别(量体工单绑定订单)
    static async getMeasureType(ctx, params) {
        let url = '/sale-ctm-measure-aggregates/' + params.saleCode + '/measure-class-list'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        }, (err) => {});
    }

    
    //  获取量体类别(默认)
    static async getDefaultMeasureType(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + '/measure-class-infos', params).then((res) => {
            return res
        }, (err) => {});
    }

    //  通过参照商品获取参照数据
    static async getGoodsData(ctx, params) {
        let url = '/part-hds/measure/' + params.id
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        }, (err) => {});
    }

    //  通过量体id获取实际量体数据
    static async getBodyData(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + '/measure-hds', params).then((res) => {
            return res
        }, (err) => {});
    }

    //  根据商品分类id获取相同量体类别的量体类别关联数据
    static async getGoodsMeasureType(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + '/part-class-measures/class-ids', params).then((res) => {
            return res
        }, (err) => {});
    }

    //  通过商品货号精确查询商品信息
    static async getGoodsInfo(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + '/part-hds/code', params).then((res) => {
            return res
        }, (err) => {});
    }

    //  根据预约工单查询 推荐尺码的 名称--尺码id
    static async getRcmdSize(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/salemeasure-hds/rec-size/billCode', params).then((res) => {
            return res
        }, (err) => {});
    }

    //  根据商品id获取商品类别及量体项信息
    static async getGoodsMsrInfo(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + '/part-class/measure-info', params).then((res) => {
            return res
        }, (err) => {});
    }

    //  获取自动放量（成衣尺寸）
    static async getReleaseValue(ctx, params) {
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.goodsService + '/gct-autorele-dtt-msrtypes/release-values', params.list).then((res) => {
            return res
        }, (err) => {});
    }

    //  自动推码（获取推荐尺码，获取可用于与成衣尺寸计算差异值的数据）
    static async getAutoSize(ctx, params) {
        let url = '/measure-hds/auto-size?companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params.list).then((res) => {
            return res
        }, (err) => {});
    }

    //  保存量体数据
    static async saveMeasure(ctx, params) {
        let url = '/ctmmeasure-hds/save-msr-cloth?companyId=' + params.companyId + '&usrId=' + params.usrId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        }, (err) => {});
    }

}

module.exports = measureMaster