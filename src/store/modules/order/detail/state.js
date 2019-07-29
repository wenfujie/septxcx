/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description:
 * @Date: 2019-03-16 14:28:59
 * @LastEditTime: 2019-04-22 15:35:04
 */
export default {
    order: {},
    pkgs: [],
    pkg: {},
    params: {
        busContsCode: global.baseConstant.busContsCode,
        billCode: ""
    },
    billCode: "",
    cusParams: {
        billCode: "",
        saleOrdDtIds: ""
    },
    userInfo: null,
    companyId: null,
    busContsCode: global.baseConstant.busContsCode,
    ordStatuNameMap: {
        D_ORDSPAYING: "待付款", //待付款
        D_ORDSDELIVERY: "待收货", //待收货
        D_ORDSCOMMENTING: "待评价", //待评价
        D_ORDSSHIPPING: "待发货",
        D_ORDCANCEL: "交易关闭" //取消订单=>关闭
    },
    address: {}
};
