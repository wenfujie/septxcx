/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 售后模块业务仓库管理
 * @Date: 2019-03-26 15:42:26
 * @LastEditTime: 2019-07-08 11:30:29
 */
// import list from "./list";
import detail from "./detail";
import apply from './apply'
export default {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {},
    getter: {},
    modules: {
        // list: list,
        apply: apply,
        detail: detail
    }
};
