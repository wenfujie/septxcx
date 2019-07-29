/*
 * createTime：2018/9/5
 * author：en.chen
 * description: 订单模块功能api
 */

const order = require("../../model/order");
const custom = require("../../model/custom");
const volume = require("../../model/volume");
const thirdPartyModel = require("../../model/third-party");
const check = require("../../util/check");

// 根据订单生成包裹
function createTabs(packages) {
    let length = packages.length;
    let packageTabs = [];
    for (let i = 0; i < length; i++) {
        let obj = {
            name: ""
        };
        obj.name = "包裹 " + (i + 1);
        obj.data = packages[i];
        packageTabs.push(obj);
    }
    return packageTabs;
}

class orderService {
    // 获取运费
    static async getFreight(ctx, next) {
        let res = await order.getFreightValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取订单优惠信息
    static async getDiscount(ctx, next) {
        let res = await order.getDiscountValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取订单列表
    static async getList(ctx, next) {
        let params = Object.assign(ctx.params, {
            ctmUsrId: ctx.params.usrId
        });
        let res = await ctx.$requestAll([
            order.getList(ctx, params),
            order.getorderNum(ctx, params)
        ]);
        ctx.body = Object.assign(res[0].data, {
            ordNums: res[1].data
        });
    }

    // 获取订单列表（单独无聚合）
    static async getOrderListOnly(ctx, next) {
        let res = await order.getList(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取订单详情（单独无聚合）
    static async getOrderDetailOnly(ctx, next) {
        let res = await order.getDetail(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取订单详情
    static async getDetail(ctx, next) {
        console.log("detal");
        let ordInfo = await order.getDiscountValue(ctx, ctx.params);
        let res = await order.getDetail(ctx, ctx.params);
        let result = Object.assign(res.data, ordInfo.data);
        // console.log("res", result);
        ctx.body = {
            status: res.status,
            statusText: res.statusText,
            data: result
        };
    }

    // 获取订单详情
    static async getDetailInfo(ctx, next) {
        let mergeRes = await ctx.$requestAll([
            order.getDetail(ctx, ctx.params),
            order.getBillList(ctx, ctx.params)
        ]);
        let ordDetailInfo = mergeRes[0];
        let billResult = mergeRes[1];
        let packagesList = [];

        if (!check.isEmpty(billResult.data)) {
            packagesList = billResult.data;
        }

        let packages = createTabs(packagesList);
        if (!check.isEmpty(packagesList)) {
            ordDetailInfo.data.packages = packages;
        }
        ordDetailInfo.data.packages = packages;
        ctx.body = {
            data: ordDetailInfo.data,
            status: 200
        };
    }

    // 获取商品定制清单
    static async getCustomList(ctx, next) {
        // 请求参数
        console.log("customP", ctx.params);
        let result = await custom.getList(ctx, ctx.params);
        console.log("customR", result);
        ctx.body = {
            data: result.data
        };
    }
    // 获取已量体数据
    static async getVolumedList(ctx, next) {
        console.log("volP", ctx.params);
        let result = await volume.getHistoryMeasureData(ctx, ctx.params);
        console.log("volR", result);
        ctx.body = {
            data: result
        };
    }

    // 确认收货前判断该订单是否存在售后申请单子
    /******
     * 0:没有售后单
     * 1:有未完成的售后申请单
     * 2:有待审核的售后申请单
     * *** */
    static async beforeSignUp(ctx, next) {
        let res = await order.beforeSignUp(ctx, ctx.params).catch(() => {
            return 500;
        });
        if (!res) res = 0;
        ctx.body = res;
    }
    // 确认收货
    static async confirmRcieved(ctx, next) {
        let res = await order.confirmRcieved(ctx, ctx.params);
        if (res === 1) res = 200;
        ctx.body = {
            status: res
        };
    }
    // 取消订单
    static async cancel(ctx, next) {
        let res = await order.cancel(ctx, ctx.params);
        if (res === 1) res = 200;
        ctx.body = {
            status: res
        };
    }

    // 再次购买
    static async buyAgain(ctx, next) {
        let res = await order.buyAgain(ctx, ctx.params);
        ctx.body = res;
    }

    // 订单分享
    static async getWxSignature(ctx, next) {
        let params = {
            ownCompanyId: ctx.params.companyId,
            wxUUID: ctx.params.wxUUID,
            unAuthorizedUrl: ctx.params.unAuthorizedUrl
        };
        let result = await thirdPartyModel.getWxSignature(ctx, params);
        // console.error('result', result)
        ctx.body = result;
    }

    // 保存更新结算
    static async saveCartTemp(ctx, next) {
        let res = await order.saveCartTempValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 执行会员升级
    static async packLvUp(ctx, next) {
        let res = await order.packLvUpValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 订单=》锁库存
    static async lockStock(ctx, next) {
        let res = await order.lockStockValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 获取结算页信息
    static async orderSettlementInfo(ctx, next) {
        let res = await order.getOrderSettlementValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 获取配送方式
    static async shipType(ctx, next) {
        let res = await order.getShipTypeValue(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 提交订单
    static async saveOrder(ctx, next) {
        let res = await order.saveOrderValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 预约量体-工单 聚合
    static async saleCtmmeasureAggregate(ctx, next) {
        let res = await order.saleCtmmeasureAggregateValue(ctx, ctx.params);
        ctx.body = res;
    }

    // 订单分享信息查询
    static async getShareItem(ctx, next) {
        let res = await order.getShareItem(ctx, ctx.params);
        ctx.body = res.data;
    }

    // 订单分享信息更新
    static async saveShareItem(ctx, next) {
        let res = await order.saveShareItem(ctx, ctx.params);
        ctx.body = res;
    }

    // 提交订单评价
    static async ordComment(ctx, next) {
        let res = await order.ordComment(ctx, ctx.params);
        ctx.body = res;
    }

    // 订单分享信息保存
    static async saveShareInfo(ctx, next) {
        let res = await order.saveShareInfo(ctx, ctx.params);
        ctx.body = res;
    }

    // 订单=》处理会员积分
    static async handlePoints(ctx, next) {
        let res = await order.handlePoints(ctx, ctx.params);
        ctx.body = res;
    }

    //  订单促销优惠计算
    static async orderPreferCal(ctx, params) {
        let res = await order.orderPreferCal(ctx, ctx.params);
        ctx.body = {
            status: 200,
            data: res.data
        };
    }
}

module.exports = orderService;
