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
        if(order.packages.length !==0 && order.fpsCode ){
            order.packages[0].data.fpsCode = order.fpsCode;
            order.packages[0].data.onlineHdId = order.onlineHdId;
        }
        const { packages } = order;
       
        // 更新包裹
       
        state.pkgs = packages;
        // 判断配货单包裹是否存在,不存在则直接取订单，存在则取包裹1为默认
        state.pkg = packages.length > 0 ? packages[0].data : order;

    },
    // 待成团不能申请售后
    isShowApplyBtn(state) {
        let newPkg = JSON.parse(JSON.stringify(state.pkg))
        newPkg.goodsList.forEach((item, index) => {
            item.applyable = null
        })
        state.pkg = newPkg
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
