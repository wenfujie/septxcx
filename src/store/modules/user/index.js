/*
* createTime：2019/3/18
* author：en.chen
* description: 用户模块仓库
*/

import { UserService, ShoppingCart } from "../../../api/service";
import Storage from '../../../utils/storage'

export default {

    namespaced: true,

    state: {
        usrInfo: null,
        shoppingCartNum: null,  // 用户购物车商品数量
    },

    actions: {
        //  获取用户信息
        async getUserInfo({commit, state}) {
            if(!!state.usrInfo) {
                return state.usrInfo
            }else{
                let params = {}
                let res = await UserService.getUserInfo(params);
                let data = {
                    storeKey: 'usrInfo',
                    storeValue: res
                }
                commit("setData", data)
                return res;
            }
        },

        //  更新用户信息
        async updateUserInfo({commit}) {
            let params = {}
            let res = await UserService.getUserInfo(params);
            let data = {
                storeKey: 'usrInfo',
                storeValue: res
            }
            commit("setData", data)
        },

        //  获取购物车数量信息
        async getShoppingCart({commit, state}) {
            if(!!Storage.get('USER_INFO')) {
                let res = await ShoppingCart.getCartCount()
                let data = {
                    storeKey: 'shoppingCartNum',
                    storeValue: res
                }
                commit("setData", data)
                return res;
            }
            else {
                return state.shoppingCartNum
            }
        },

        //  更新购物车数量信息
        async updateShoppingCart({commit}) {
            let res = await ShoppingCart.getCartCount()
            let data = {
                storeKey: 'shoppingCartNum',
                storeValue: res
            }
            commit("setData", data)
        }
    },

    mutations: {
        //  设置数据
        setData(state,data) {
            state[data.storeKey] = data.storeValue
        },
    }
};