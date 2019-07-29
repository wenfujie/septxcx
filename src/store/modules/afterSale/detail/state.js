/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description:
 * @Date: 2019-03-12 19:38:14
 * @LastEditTime: 2019-07-11 21:25:28
 */

export default {
    // 快递退回填写信息
    kdInfo: {
        expressNo: "", //快递单号
        company: "" //快递公司
    },
    // 物流信息
    logisInfo: {
        id: "",
        shippingId: "",
        shippingName: ""
    },
    //用户地址信息
    address: {
        id: "",
        isDefault: false,
        cargousrName: "",
        cargoMobile: "",
        address: ""
    },
    // 退回门店
    mdInfo: {
        name: "",
        phone: "",
        area: {}, //地区
        store: {} //门店
    },
    //门店
    store: {},
    //门店地址列表
    storeList: [],
    //展示门店列表
    showStoreList: false,


};
