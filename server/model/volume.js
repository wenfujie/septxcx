/*
 * createTime：2018/8/14
 * author：en.chen
 * description: 预约量体模块用于处理前端请求的中间层接口
 */
const common = require('./common')

class userVolume {

    //  获取预约金
    static async getMsrAmountValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + '/glb-parameters-vips/order-amount', params).then((res) => {
            return res
        });
    }

    //  获取量体项目
    static async getVolumnsValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.goodsService + common.newUrlKey +
                '/measure-hds/info-code-list', params).then((res) => {
            return res
        });
    }

    static async getMeasureOpInfo(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-goods-list/getMeasureOpInfo', params).then((res) => {
            return res
        });
    }


    //  根据商品ids过滤会员量体数据
    static async getMeasureTypeValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/ctmmeasure-hds/measure-type', params).then((res) => {
            return res
        });
    }

    //  删除我的预约
    static async delSaleMeasureValue(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.memberService + '/salemeasure-hds', params).then((res) => {
            return res
        });
    }
    static async delCtmMeasure(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.memberService + '/ctmmeasure-dt-msrtypes', params).then((res) => {
            return res
        });
    }
    static async getBillTypeValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/sale-ctm-measure-aggregates/' + params.ordHdCode + '/dt-ord-list', params).then((res) => {
            return res
        });
    }

    //  获取支付cardbillcode
    
    static async getSaleMeasureIdValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-ord-level-hds/sale-measure-id', params).then((res) => {
            return res
        });
    }
    

    //  获取预约/上门量体可用地址
    static async getDoorAddrValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + common.newUrlKey +
                '/measure-dest-aggregats/dest-list', params).then((res) => {
            return res
        });
    }
    //  获取到店量体可用地址
    static async getStoreListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/measure-shop-list-aggregats/shop-list', params).then((res) => {
            return res
        });
        //  一期暂时使用以下代码
        // return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/measure-shop-list-aggregats/shop-list2', params).then((res) => {
        //     return res
        // });
    }
    //  获取预约量体时间
    static async getRegmeasureTimeValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/measure-aggregats/measure-time', params).then((res) => {
            return res
        });
    }

    //  获取订单goodsCode
    static async getSalemeasurehdsCode(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/salemeasure-hds/' + params.id + '?usrId=' + params.usrId + '&companyId=' + params.companyId, params).then((res) => {
            return res
        });
    }


    //  提交预约量体
    static async saveRegMeasureValue(ctx, params) {
        let url = '/salemeasure-hds/sp-interface?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }


    //  获取静态量体数据
    static async getCtmmeasure(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + common.newUrlKey +
                '/ctmmeasure-hd-aggregates/msrtype/measure-data', params).then((res) => {
            return res
        }, (err) => {});
    }

    //  赠送促销卡券
    static async sendCoupons(ctx, params) {
        let url = '/rtl-online-result-dt-coupons/send-coupons?billCode=' + params.billCode + '&usrId=' + params.usrId +'&companyId=' + params.companyId
        return ctx.$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + common.newUrlKey +
                url, params).then((res) => {
            return res
        });
    }

    //  获取预约量体时间
    static async getRegmeasureTimeValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/measure-aggregats/measure-time', params).then((res) => {
            return res
        });
    }

    //  提交预约量体
    // static async saveRegMeasureValue(ctx, params) {
    //     let url = '/salemeasure-hds/sp-interface?usrId=' + params.usrId + '&companyId=' + params.companyId
    //     return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
    //         return res
    //     });
    // }
    // 获取历史量体数据
    static async getHistoryMeasureData(ctx, params) {
        let url = '/rtl-ord-dttt-msrs/get-hist-measure-batch?usrId=' + params.usrId + '&companyId=' + params.companyId;
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params)
    }

    // 查询预约量体信息
    static async getVolumeList(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.memberService + common.newUrlKey +
                '/salemeasure-hds/page-measure-info', params).then((res) => {
            return res
        });
    }
    //查询预约量体信息(GS_MSR_GETREGMEASUREINFO)
    static async getVolumeDataList(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/ctmmeasure-hd-aggregates/measure-data', params).then((res) => {
            return res
        });
    }
}

module.exports = userVolume