/*
 * createTime：2019/3/1
 * author：en.chen
 * description: 仓库
 */

import Vue from "vue";
import Vuex from "vuex";

// 数据持久化
// import createPersistedState from "vuex-persistedstate";

//  分销商仓库
import distribution from "./modules/distribution/index";
import orderList from "./modules/order/list";
import order from "./modules/order/detail";

import afterSale from "./modules/afterSale";

//  用户模块仓库
import user from "./modules/user/index";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        distribution,
        user,
        orderList,
        order,
        afterSale
    },
    plugins: [
        // createPersistedState({
        //     key: "store",
        //     storage: window.sessionStorage
        // })
    ]
});
