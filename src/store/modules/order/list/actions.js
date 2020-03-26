/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description:
 * @Date: 2019-03-12 19:38:14
 * @LastEditTime: 2019-08-14 15:56:33
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
        let newParams={}//获取订单列表的传参
        Object.assign(newParams, state.params)
        console.log(state,'state.curAccountId')
        if(state.curAccountId!=''){
            newParams.vipInfoHdIds=state.curAccountId
        }
        console.log(newParams,'newParams')
        let result = await orderApi.getList(newParams).catch(err => {
            console.log('err', err)
        });
        wx.hideLoading();
        if (!result) return;
        commit("updateOrderList", { result: result, list: result.list });

        state.isDownLoading = false;
    },
    // 加载更多
    async loadMoreOrder({ commit, state }, params) {
        state.isUpLoading = true;
        state.isEmpty = false;
        state.loadFinished = true;
        wx.showLoading({
            title: '加载中',
        })
        commit("pageNumIncrease");
        let result = await orderApi.getList(state.params);
        wx.hideLoading()
        const orderList = state.orderList.concat(result.list);
        commit("updateOrderList", { result: result, list: orderList });
        state.isUpLoading = false;

    },
    //通过状态条件搜索列表
    async searchList({ commit, dispatch }, tab) {
        commit("tabChange", tab);
        dispatch("getOrderList");
    },
    //设置账号id
    async setAccountId({ commit }, account_id) {
        commit("setAccountId", {account_id:account_id});
    },
};
