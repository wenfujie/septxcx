/*
 * @Author: yongtian.hong
 * @Date: 2019-08-05 13:18:56
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-08-12 11:49:41
 * @Description:
 */
// import { Dialog, Toast } from "vant";

import { getShopList } from "@/api/service/base";
// import { cityData } from "@/assets/js/cityData.js";
import Toast from 'vant-weapp/dist/toast/toast';
import Dialog from '@/components/dialog/dialog';
import check from "@/utils/check";
import payment from "@/utils/payment";
import wxPay from "@/utils/wxPay";
import ordStateMap from "./stateCodeMap";
import btnMap from './btnMap'
import postSaleApi from "@/api/service/postSale";
import store from "@/store";
import debounce from "@/utils/debounce";

// 路由跳转
export const goTo = (vm, path) => {
    vm.$router.push({
        path: path,
        query: {
            reapplycode: vm.data.reapplycode
        }
    });
};

// 取消申请处理函数
export const cancelApplyHandler = vm => {
    return new Promise(async function (resolve, reject) {
        let params = {
            reApplyCode: ""
        };
        // 通过不同路由取参数
        params.reApplyCode = vm.$route.query.reapplycode || vm.data.reapplycode;

        let result = await postSaleApi.cancelApply(params)
        resolve(result);
    });
};




// 取消申请弹窗
export const cancelApply = vm => {
    return new Promise(async function (resolve, reject) {
        Dialog.confirm({
            content: "您确定要取消该售后申请单吗？"
        }).then(() => {
            cancelApplyHandler(vm).then(result => {
                if (result.statusCode === 200) {
                    Toast("取消成功");
                    resolve(result);
                } else {
                    Toast("取消失败");
                    reject(-1);
                }
            });
        });
    });
}

// 重新申请
export const reApply = vm => {
    let good = vm.data.goodsList[0];
    let params = Object.assign(good, {
        applyNum: vm.data.applyAmountQty,
        reApplyCode: null,
        returnTypeCode: vm.data.returnTypeCode || null,
        returnsReasonCode: vm.data.returnsReasonCode || null,
        reasonMemo: vm.data.reasonMemo || "",
        applyMoney: vm.data.money || vm.data.applyMoney,
        applyAmountQty: vm.data.applyAmountQty
    });
    vm.$router.push({
        path: "/pages/afterSalePackage/afterSale/pages/apply/page",
        params: params
    });
};
// 修改申请
export const modifyApply = (vm, code) => {
    let startTime = new Date();
    let stateName = ordStateMap[code];
    if (stateName != "待审核") {
        Toast("当前申请单订单" + stateName + "无法修改申请,请重新刷新");
        return false;
    }
    let good = vm.data.goodsList[0];
    postSaleApi.getApplyNum({ rtlOrdDtId: good.saleOrdDtId })
        .then(
            result => {
                good = Object.assign(good, {
                    applyNum: vm.data.applyAmountQty + result.applyNum,
                    reApplyCode: vm.data.reApplycode || vm.data.reapplycode,
                    returnTypeCode: vm.data.returnTypeCode || null,
                    returnsReasonCode: vm.data.returnsReasonCode || null,
                    reasonMemo: vm.data.reasonMemo || "",
                    applyMoney: vm.data.money || vm.data.applyMoney,
                    applyAmountQty: vm.data.applyAmountQty
                });
                // 缓存当前要修改的申请单
                store.commit('afterSale/apply/updateApplyGood', good)
                // vm.$router.push("/pages/afterSale/pages/apply/page");
                vm.$router.push("/pages/afterSalePackage/afterSale/pages/apply/page");

                console.log('modifyEnd', new Date() - startTime)
            },
            err => {
                Toast("获取可申请数量失败");
            }
        );

};

// 获取售后详情
export const getDetailAsync = async vm => {
    let param = {
        reApplyCode: vm.$route.query.reapplycode
    };
    let result = await postSaleApi.getDetail(param)
    return result.data;
};

// 获取商店列表
export const getStoreList = async (vm, code) => {
    let params = {
        code: code,
        pageNo: 1,
        pageSize: 10
    };
    let result = await getShopList(params);
    return result.list;
};

//获取快递公司列表
export const getExpressCompanies = async () => {
    let params = {
        pageNum: 1,
        pageSize: 0,
        effFlag: 1
    };
    let result = await postSaleApi.getDeliverCompanies(params)
    return result.data;
};

// 初始化详情状态
export const initState = async vm => {
    // 按钮置空，防止初始化渲染出按钮
    vm.btnName = null;
    vm.btnModify = null;
    //清空数据,防止缓存
    vm.data = {};
    //退回方式,默认快递退回
    vm.returnWayCode = "kdth";
    //获取售后详情
    vm.data = await getDetailAsync(vm);
    //获取省市区
    vm.cityList = await global.getCityData();
    //获取快递列表
    vm.logisList = await getExpressCompanies(vm);
    // 当前状态名
    const stateName = vm.ordStateMap[vm.data.applyStatusCode].trim();
    // 重置按钮名称
    vm.btnName = btnMap[stateName].btnName;
    vm.btnModify = btnMap[stateName].btnModify;
    // 获取门店列表,该项目不使用
    // vm.storeList = await getStoreList(vm);
};

// 获取门店列表
export const selectArea = async (vm, list) => {
    vm.area = list;
    vm.store = {};
    try {
        vm.storeList = await getStoreList(vm, list[2].code);
        vm.showAreaList = false;

    } catch (err) {
        alert("请求失败", err);
    }
};

// 选择门店
export const selectStore = async (vm, store) => {
    vm.store = store;
    vm.showStoreList = true;
};

// 选择物流
export const selectLogis = async (vm, logis) => {
    vm.logis = logis;
};

// 返修付款
export const payMoney = async vm => {
    let code = vm.data.reApplycode;
    let price = vm.data.ticketMoney;
    let payType = "D_PAY_REPAIR";
    wxPay(vm, code, price, payType).then(res => {
        // Toast("支付成功");
        if (res == 0) {
            vm.initState();
        } else {
            let targetUrl = "/postSaleDetail?reapplycode=" + code;
            payment.miniProgramPay(res, targetUrl, targetUrl);
        }
    });
};

// 退回方式切换回调
export const switchBackMode = (vm, code) => {
    vm.returnWayCode = code;
    vm.store = {};
    vm.logis = {};
};

// 提交保存物流前做参数校验
export const validBeforeSubmit = (vm, params) => {
    switch (vm.returnWayCode) {
        case "kdth":
            if (check.isEmpty(params.expressCode)) {
                Toast("请填写快递单号");
                return false;
            } else if (check.isEmpty(params.shippingId)) {
                Toast("请选择物流公司");
                return false;
            } else if (check.isEmpty(params.addressId)) {
                Toast("请选择地址");
                return false;
            } else {
                params.shopId = global.Storage.get("properties").shopId;
                return true;
            }

        case "mdth":
            params.shippingId = null;
            if (check.isEmpty(params.shopId)) {
                Toast("请选择门店地址");
                return false;
            } else {
                params.addressId = null;
                return true;
            }
    }
};

// 提交物流
const submitLogis = debounce(async (vm, params) => {
    let result = await postSaleApi.saveLogis(params)
        .catch(err => { });
    if (result == 500) {
        Toast("提交失败");
    } else {
        Toast("提交成功");
        initState(vm);
        vm.$store.commit("afterSale/detail/clearAll");
        //提交后清空原先选中的门店与物流信息
        vm.store = {};
        vm.logis = {};
    }

}, 5000)

// 保存物流
export const saveLogis = async vm => {
    let params = {
        reApplyCode: vm.data.reApplycode,
        returnWayCode: vm.returnWayCode,
        shippingId: vm.$store.state.afterSale.detail.logisInfo.shippingId,
        addressId: vm.$store.state.afterSale.detail.address.id,
        expressCode: vm.$store.state.afterSale.detail.kdInfo.expressNo,
        shopId: vm.store.id
    };
    if (!validBeforeSubmit(vm, params)) return;

    // 防抖
    submitLogis(vm, params)

};

//   按钮点击触发事件
export const btnClickEvent = async (vm, btnName, from) => {

    switch (btnName) {
        case "取消申请":
            cancelApply(vm)
                .then(() => {
                    initState(vm);
                    Toast("取消成功");
                }, err => {
                    Toast("取消失败");
                });
            break;
        case "重新申请":
            reApply(vm);
            break;
        case "修改申请":
            modifyApply(vm, vm.data.applyStatusCode);
            break;
        case "提交":
            saveLogis(vm);
            break;
        case "立即支付":
            payMoney(vm);
            break;
    }
};
