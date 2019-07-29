/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description:
 * @Date: 2019-03-12 19:38:14
 * @LastEditTime: 2019-07-07 22:42:34
 */
import * as orderApi from "@/api/service/order";
export default {
    // 获取订单列表
    async getOrderList({ commit, state }, params) {
        state.isDownLoading = true;
        state.isEmpty = false;
        state.loadFinished = true;
        commit("resetPageNum");
        commit("clearOrdList");
        wx.showLoading({
            title: '加载中',
          })  
        let result = await orderApi.getList(state.params).catch(err => {
            console.log('err', err)
        });
        if (!result) return;
        commit("updateOrderList", { result: result, list: result.list });
        setTimeout(function () {
            wx.hideLoading()
        }, 1000)
        state.isDownLoading = false;
    },
    // 加载更多
    async loadMoreOrder({ commit, state }, params) {
        state.isUpLoading = true;
        state.isEmpty = false;
        state.loadFinished = true;
        commit("pageNumIncrease");
        let result = await orderApi.getList(state.params);
        const orderList = state.orderList.concat(result.list);
        commit("updateOrderList", { result: result, list: orderList });
        state.isUpLoading = false;
    },
    //通过状态条件搜索列表
    async searchList({ commit, dispatch }, tab) {
        commit("tabChange", tab);
        dispatch("getOrderList");
    }
};
