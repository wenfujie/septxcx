/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description:
 * @Date: 2019-03-12 19:38:14
 * @LastEditTime: 2019-04-23 20:38:43
 */
import * as orderApi from "@/api/service/order";
import * as goodsApi from "@/api/service/goods";

import wxPay from "@/utils/wxPay";

import Toast from 'vant-weapp/dist/toast/toast'
import Dialog from '../../../../components/dialog/dialog';

export default {
    // 获取订单详情
    async getOrderDetail({ commit, state }, params) {
     
        return new Promise(async function(resolve, reject) {
            wx.showLoading({
                title: '加载中',
              }) 
            params = params || { billCode: "" };
           
    
            commit("updateParams", params);
            let order = await orderApi.getDetailInfo(state.params);
            console.log(order.data,'datadtadatdatadatadata')
            if (!order.data || order.data.errorCode) {
                reject(order);
                return;
            }
                
            commit("updateOrder", order.data);
            setTimeout(function () {
                wx.hideLoading()
            }, 1000)
            resolve();
        });
    },
    //订单操作处理函数 flag 1 取消 2删除 3还原 4订单放入回收网站
    async orderOperateHanler({ commit, state }, { billCode, flag } = payLoad) {
        return new Promise(async function(resolve, reject) {
            let params = {
                flag: flag,
                ctmUsrId: state.userInfo.usrId,
                billCodes: [billCode]
            };
            let result = await orderApi.cancel(params);
            if (result.status === 200) {
                resolve(200);
            } else {
                reject(-1);
            }
        });
    },

    //订单操作 处理会员积分赠送
    //业务节点:businessNode订单结算（SETTLEMENT）、收货确认（RECEIPT_CONFIRM）、取消订单（ORDER_CANCEL）
    async handlePoints({ state }, { billCode, businessNode }) {
        let params = {
            ownCompanyId: state.companyId,
            companyId: state.companyId,
            ctmUsrId: state.userInfo.usrId,
            usrId: state.userInfo.usrId,
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
    },
    //取消订单
    async cancel({ dispatch }, billCode) {
        return new Promise(function(resolve, reject) {
            Dialog.confirm({
                content: "您确定要取消该订单吗？",
                
            }).then(
                () => {
                    dispatch("orderOperateHanler", {
                        billCode: billCode,
                        flag: 1
                    }).then(
                        res => {
                            Toast("订单取消成功!");
                            resolve(res);
                            //取消成功后积分处理,有积分业务可开放此函数
                            // dispatch("handlePoints", {
                            //     billCode: billCode,
                            //     businessNode: "ORDER_CANCEL"
                            // });
                        },
                        err => {
                            Toast("取消订单失败,请稍等再试!");
                        }
                    );
                },
                () => {
                    reject(-1);
                }
            );
        });
    },
    //删除订单
    async delete({ dispatch }, billCode) {
        return new Promise(function(resolve, reject) {
            Dialog.confirm({
                content: "您确定要删除该订单吗？",
            }).then(
                () => {
                    dispatch("orderOperateHanler", {
                        billCode: billCode,
                        flag: 2
                    }).then(
                        res => {
                            Toast("订单删除成功!");
                            resolve(res);
                        },
                        err => {
                            Toast("订单删除失败,请稍等再试");
                        }
                    );
                },
                () => {
                    reject(-1);
                }
            );
        });
    },

    // 再次购买
    async buyAgain({ state }, order) {
        let goodList = [];
        order.goodsList.forEach(good => {
            goodList.push({
                busContsCode: state.busContsCode, //业务触点
                goodsCode: good.goodsCode, // 商品编码
                ptiPartDtSkuId: good.ptiPartDtSkuId, // 商品skuid
                amount: good.ordQty, // 数量
                orderFlag: good.orderFlag, // 是否定制商品标识
                ptiPartHdId: good.ptiPartHdId //商品id
            });
        });
        const paramsForStockCheck = {
            ctmUsrId: state.userInfo.usrId,
            shopId: state.userInfo.shopId,
            goodList: goodList
        };

        // 库存与上下架校验
        let result = await goodsApi.getUseableGood(paramsForStockCheck);

        if (result.sellAll == 1 && result.stockAll == 1) {
            const params = {
                ctmUsrId: state.userInfo.usrId,
                shopCode: state.userInfo.shopCode,
                billCode: order.billCode
            };
            return orderApi.buyAgain(params);
        } else {
            confirm({
                message: "抱歉,商品已下架或库存不足商品！",
                confirmButtonText: "确定"
            });
            return false;
        }
    },
    // 支付超时取消订单
    async cancelWhenPayTimeout({ dispatch, state }, billCode) {
        return new Promise(async function(resolve, reject) {
            let params = {
                flag: 1,
                ctmUsrId: state.userInfo.usrId,
                billCodes: [billCode]
            };
            let result = await orderApi.cancel(params);
            if (result.status === 200) {
                resolve(200);
                dispatch("getOrderDetail", { billCode: billCode });
            } else {
                reject(-1);
            }
        });
    },
    // 订单签收(确认收货)
    async signUp({ dispatch, state }, billCode) {
  
        return new Promise(async function(resolve, reject) {
            let params = {
                ctmUsrId: state.userInfo.usrId,
                usrId: state.userInfo.usrId,
                billCodes: [billCode]
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

                Toast(messages[1]);
             
            } else {
                Dialog.confirm({
                    content: messages[result],
                }).then(
                    async sucess => {
                        let res = await orderApi.signUp(params);
                        if (res.status === 200) {
                            Toast("确认收货成功");
                            dispatch("handlePoints", {
                                billCode: billCode,
                                businessNode: "ORDER_CANCEL"
                            });
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
    },
    // 订单支付(小程序)
    async pay({ dispatch, state }, params) { 
        let billCode = params.order.billCode;
        let price = params.order.amountUnPay;
        return wxPay(billCode, price);

    }
};
