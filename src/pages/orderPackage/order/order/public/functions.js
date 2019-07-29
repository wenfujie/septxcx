/*
 * @Author: yongtian.hong
 * @Date: 2018-10-13 11:19:22
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-04-19 15:18:27
 * @Description: 订单相关页面公用方法
 */

import check from "@/utils/check";
import * as orderApi from "@/api/service/order";
import postSaleApi from "@/api/service/postSale";
import Toast from 'vant-weapp/dist/toast/toast'
import Dialog from 'vant-weapp/dist/dialog/dialog';

// import { Dialog, Toast } from "vant";

// 取消订处理函数
async function cancelOrderHanler(vm) {
    return new Promise(async function(resolve, reject) {
        let userInfo = vm.Storage.get("USER_INFO");
        let params = {
            flag: 1,
            ctmUsrId: userInfo.usrId,
            billCodes: [vm.order.billCode]
        };
        let result = await orderApi.cancel(params);
        if (result.status === 200) {
            Toast("取消订单成功");
            resolve(200);
        } else {
            Toast("取消订单失败,请稍等再试");
            reject(-1);
        }
    });
}
// 取消订单
export const cancelOrder = async function(vm) {
    return new Promise(function(resolve, reject) {
        Dialog.confirm({
            title: "取消订单",
            message: "您确定要取消订单吗？",
            confirmButtonText: "确定"
        }).then(
            () => {
                cancelOrderHanler(vm).then(
                    res => {
                        resolve(res);
                        handlePoints(vm.order.billCode, "ORDER_CANCEL");
                    },
                    () => {
                        Toast("取消订单失败,请稍等再试");
                    }
                );
            },
            () => {
                reject(-1);
            }
        );
    });
};

// 获取参数
export const getParams = function(vm) {
    let rparams = vm.$route.params;
    if (check.isEmpty(rparams)) rparams = vm.$route.query;
    let params = {};
    if (!check.isEmpty(rparams)) {
        params = {
            busContsCode: global.baseConstant.busContsCode,
            billCode: rparams.billCode
        };
        vm.Storage.set("ordInfo", params);
    } else if (!check.isEmpty(vm.Storage.get("ordInfo"))) {
        params = vm.Storage.get("ordInfo");
    }
    return params;
};

// 获取订单详情
export const getOrdInfo = async function(vm) {
    vm.order = {};
    vm.pkg = {};
    vm.packages = [];
    let order = await orderApi.getDetailInfo(getParams(vm));
    vm.order = order.data;
    vm.Storage.set("billCode", {
        code: vm.order.billCode
    });
    //判断是否存在配货单
    if (!check.isEmpty(order.data.packages)) {
        vm.packages = vm.order.packages;
        vm.pkg = vm.packages[0].data;
    } else {
        vm.pkg = order.data;
    }
    vm.pkg.ordStatusName = vm.$route.params.ordStatusName;
};

// 切换包裹
export const changePkg = async function(vm, pkg) {
    vm.pkg = pkg.data;
};

// 签收订单(确认收货)
export const ordSignUp = async function(vm) {
    return new Promise(async function(resolve, reject) {
        let userInfo = vm.Storage.get("USER_INFO");
        let params = {
            ctmUsrId: userInfo.usrId,
            usrId: userInfo.usrId,
            billCodes: [vm.order.billCode]
        };
        // 判断订单是否存在售后单子
        let result = await orderApi.beforeSignUp(params);

        if (result === 500) {
            Toast("服务器接口错误，请稍后再试!");
            return;
        }
        let messages = {
            0: "请确认全部商品均已收到货?",
            1: "该订单存在正在售后的商品,请在售后完成后再进行确认收货!",
            2: "该订单存在正在售后的商品,确认售后后将自动撤销售后申请,是否继续?"
        };
        let btnName = {
            0: "确定",
            2: "继续"
        };
        if (result == 1) {
            Dialog.alert({
                message: messages[1]
            });
        } else {
            Dialog.confirm({
                message: messages[result],
                confirmButtonText: btnName[result]
            }).then(
                async sucess => {
                    let res = await orderApi.signUp(params);
                    if (res.status === 200) {
                        Toast("确认收货成功");
                        handlePoints(vm.order.billCode, "RECEIPT_CONFIRM");
                        resolve(200);
                    } else {
                        Toast("确认收货失败,请稍等再试");
                        reject(-1);
                    }
                },
                fail => {
                    Toast("您取消了确认收货");
                }
            );
        }
    });
};

//获取订单列表
function getOrdList(code) {
    let param = {
        pageNum: 1,
        pageSize: 10,
        searchCode: code
    };
    return orderApi.getList(param);
}

// 获取售后申请单数量
function getPostSaleNum() {
    let params = {
        pageNum: 1,
        pageSize: 10
    };
    return postSaleApi.getList(params);
}

//获取各类型订单数量 (七匹狼新增待评价订单)
export const getOrdListNum = async function(vm) {
    let res1={};
    let res2={};
    await getOrdList("D_ORDSPAYING").then(res=>{
        res1=res;
    })
    await getPostSaleNum().then(res=>{
        res2=res;
    }).catch(res=>{
        res2=res;
    })
    return [
        res1.ordNums.unPayOrderNum,
        res1.ordNums.unShippingOrderNum,
        res1.ordNums.unReceivingGoodsOrderNum,
        res2.data.total,
        res1.ordNums.unEvaluateOrderNum
    ];
   
};

// 订单 处理会员积分
//业务节点:businessNode订单结算（SETTLEMENT）、收货确认（RECEIPT_CONFIRM）、取消订单（ORDER_CANCEL）
export const handlePoints = async (billCode, businessNode) => {
    let params = {
        ownCompanyId: global.Storage.get("COMPANYID").company_id,
        companyId: global.Storage.get("COMPANYID").company_id,
        ctmUsrId: global.Storage.get("USER_INFO").usrId,
        usrId: global.Storage.get("USER_INFO").usrId,
        busContsCode: global.baseConstant.busContsCode,
        businessNode: businessNode,
        billCode: billCode
    };
    orderApi.handlePoints(params).then(
        res => {
            console.log("积分处理成功");
        },
        err => {
            console.log("积分处理失败");
        }
    );
};
