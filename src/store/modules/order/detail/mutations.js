/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description:
 * @Date: 2019-03-16 14:28:59
 * @LastEditTime: 2019-04-22 15:35:26
 */
import Storage from "@/utils/storage";
// import { Dialog, Toast } from "vant";
export default {
    //重置订单数据
    clear(state) {
        state.order = {};
        state.pkgs = [];
        state.pkg = {};
    },
    //更新请求参数
    updateParams(state, { billCode }) {
        state.params.billCode = billCode || state.order.billCode;
    },
    //更新订单数据
    updateOrder(state, order) {
        state.order = order;
        console.log(order,'orderorederoreddk')
        const { packages } = order;

        // 更新包裹
        state.pkgs = packages;
        
        // 判断配货单包裹是否存在,不存在则直接取订单，存在则取包裹1为默认
        state.pkg = packages.length > 0 ? packages[0].data : order;

    },
    //切换包裹
    changePkg(state, pkg) {
        state.pkg = pkg.data;
    },
    //获取用户信息与公司ID
    getUserInfoAndCompanyId(state) {
        console.log('122')
        if (!state.userInfo) {
  
            state.userInfo = global.Storage.get("USER_INFO");
        }

        if (!state.companyId) {
            state.companyId = global.Storage .get("COMPANYID").company_id;
        }
    },

    saveAddress(state, addr) {
        state.address = addr;
    }
};
