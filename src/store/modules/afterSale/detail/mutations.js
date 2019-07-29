/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description:
 * @Date: 2019-03-12 19:38:14
 * @LastEditTime: 2019-07-11 21:26:07
 */

export default {
    //保存快递寄回的快递信息
    updateKdInfo(state, { expressNo, company }) {
        state.kdInfo.expressNo = expressNo;
        state.kdInfo.company = company;
    },
    //清除快递寄回的快递信息
    clearKdInfo(state) {
        state.kdInfo.expressNo = "";
        state.kdInfo.company = "";
    },
    //保存物流信息
    updateLogisInfo(state, { shippingName, id, shippingId }) {
        state.logisInfo.shippingName = shippingName;
        state.logisInfo.id = id;
        state.logisInfo.shippingId = shippingId;
    },
    //清除物流信息
    clearLogisInfo(state) {
        state.logisInfo.id = "";
        state.logisInfo.shippingName = "";
        state.logisInfo.shippingId = "";

    },
    // 填写物流提交的地址
    saveAddress(state, addr) {
        state.address = {
            id: addr.id,
            isDefault: !!addr.defaultFlag,
            cargousrName: addr.cargousrName,
            cargoMobile: addr.cargoMobile,
            address: addr.destDesc ? addr.destDesc + addr.address : addr.address
        };
    },
    //清空地址
    clearAddress(state) {
        state.address = {
            id: "",
            cargousrName: "",
            cargoMobile: "",
            address: ""
        };
    },

    //清除详情所有信息
    clearAll() {
        this.commit("afterSale/detail/clearAddress");
        this.commit("afterSale/detail/clearKdInfo");
        this.commit("afterSale/detail/clearLogisInfo");
    }
};
