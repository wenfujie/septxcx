/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description:
 * @Date: 2019-03-12 19:38:14
 * @LastEditTime: 2019-06-18 16:48:08
 */
import postSaleApi from "@/api/service/postSale";
export default {
    //获取售后申请单列表
    async getList({ commit, state }) {
        commit('resetPageNum');
        state.isDownLoading = true;
        // try {
        //     state.result = await postSaleApi.getList(state.params);
        //     state.isDownLoading = false;
        //     if (!this.result.data) {
        //         return false;
        //     } else {
        //         state.list = state.result.data.list;
        //     }
        //     state.isEmpty = state.list.length === 0 ? true : false;
        //     state.finished = !this.result.data.hasNextPage;
        // } catch{
        //     state.isDownLoading = false;
        // }
        return state.list;
    },
};
