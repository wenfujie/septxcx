/*
 * createTime：2018/9/5
 * author：en.chen
 * description: 中间层提供给前端的订单模块api
 */

const orderFun = require("../controller/order");

module.exports = {
    "GET/getFreight": orderFun.getFreight, // 获取运费
    "GET/getOrderDiscount": orderFun.getOrderDiscount, // 获取订单优惠信息
    "GET/getOrderList": orderFun.getOrderList, // 获取订单列表数据
    "GET/getOrderListOnly": orderFun.getOrderListOnly, // 获取订单列表（单独无聚合）
    "GET/getOrderDetailOnly": orderFun.getOrderDetailOnly, // 获取订单详情（单独无聚合）
    "GET/getDetail": orderFun.getDetail, // 获取订单详情
    "GET/getDetailInfo": orderFun.getDetailInfo, //获取订单详情新接口
    "GET/getCustomList": orderFun.getCustomList, //获取定制清单数据
    // "GET/getVolumedList": orderFun.getVolumedList, // 获取已量体数据
    "PUT/beforeSignUp": orderFun.beforeSignUp, //确认收货前判断该订单是否存在售后申请单子
    "PUT/confirmReceived": orderFun.confirmReceived, //确认收货
    "PUT/cancelOrder": orderFun.cancelOrder, //取消订单
    "POST/buyAgain": orderFun.buyAgain, //再次购买
    "POST/getWxSignature": orderFun.getWxSignature,
    "POST/saveCartTemp": orderFun.saveCartTemp, //  保存更新结算
    "GET/getOrderSettlementInfo": orderFun.getOrderSettlementInfo, //  获取订单结算页信息
    "GET/getShipType": orderFun.getShipType, //  获取配送方式
    "POST/saveOrder": orderFun.saveOrder, //提交订单
    "PUT/saleCtmmeasureAggregate": orderFun.saleCtmmeasureAggregate, //提交订单
    "GET/getShareItem": orderFun.getShareItem, //订单分享信息查询
    "PUT/saveShareItem": orderFun.saveShareItem, //订单分享信息更新
    "POST/saveOrderComment": orderFun.saveOrderComment, //提交订单评价
    "POST/saveShareInfo": orderFun.saveShareInfo, //订单分享信息保存
    "POST/packLevelUp": orderFun.packLevelUp, //执行会员升级
    "PUT/lockStock": orderFun.lockStock, //订单=》锁库存
    "PUT/handlePoints": orderFun.handlePoints, //订单=》处理会员积分orderPreferCal
    "GET/getOrderPreferCal": orderFun.getOrderPreferCal // 订单优惠计算
};
