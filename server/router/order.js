/*
 * createTime：2018/9/5
 * author：en.chen
 * description: 中间层提供给前端的订单模块api
 */

const orderService = require("../controller/order/order-service");

module.exports = {
    "GET/freight": orderService.getFreight, //  运费
    "GET/orderDiscount": orderService.getDiscount, //  订单优惠信息
    "GET/getList": orderService.getList, // 获取订单列表数据
    "GET/getOrderListOnly": orderService.getOrderListOnly, // 获取订单列表（单独无聚合）
    "GET/getOrderDetailOnly": orderService.getOrderDetailOnly, // 获取订单详情（单独无聚合）
    "GET/getDetail": orderService.getDetail, // 获取订单详情
    "GET/getDetailInfo": orderService.getDetailInfo, //获取订单详情新接口
    "GET/getCustomList": orderService.getCustomList, //获取定制清单数据
    "GET/getVolumedList": orderService.getVolumedList, // 获取已量体数据
    "PUT/beforeSignUp": orderService.beforeSignUp, //确认收货前判断该订单是否存在售后申请单子
    "PUT/confirmRcieved": orderService.confirmRcieved, //确认收货
    "PUT/cancel": orderService.cancel, //取消订单
    "POST/buyAgain": orderService.buyAgain, //再次购买
    "POST/getWxSignature": orderService.getWxSignature,
    "POST/saveCartTemp": orderService.saveCartTemp, //  保存更新结算
    "GET/orderSettlementInfo": orderService.orderSettlementInfo, //  获取订单结算页信息
    "GET/shipType": orderService.shipType, //  获取配送方式
    "POST/saveOrder": orderService.saveOrder, //提交订单
    "PUT/saleCtmmeasureAggregate": orderService.saleCtmmeasureAggregate, //提交订单
    "GET/getShareItem": orderService.getShareItem, //订单分享信息查询
    "PUT/saveShareItem": orderService.saveShareItem, //订单分享信息更新
    "POST/ordComment": orderService.ordComment, //提交订单评价
    "POST/saveShareInfo": orderService.saveShareInfo, //订单分享信息保存
    "POST/packLvUp": orderService.packLvUp, //执行会员升级
    "PUT/lockStock": orderService.lockStock, //订单=》锁库存
    "PUT/handlePoints": orderService.handlePoints, //订单=》处理会员积分orderPreferCal
    "GET/orderPreferCal": orderService.orderPreferCal // 订单优惠计算
};
