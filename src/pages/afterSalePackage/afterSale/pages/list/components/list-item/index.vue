<style lang='scss' scoped>
.list-item-wraper {
    width: computed(690);
    height: computed(265);
    background: rgba(255, 255, 255, 1);
    margin: 0 computed(30);
    padding: computed(30);
    margin-bottom: computed(30);
    border-radius: 5px;
    box-sizing: border-box;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
    .list-box {
        display: flex;
        color: #0d0e09;
        padding-bottom: computed(16);
        border-bottom: 1px solid #e5e5e5;
        .left-box {
            width: computed(140);
            height: computed(140);
            margin-right: computed(30);
            img {
                width: 100%;
                height: 100%;
            }
        }
        .right-box {
            flex: 1;
            &-top {
                display: flex;
                justify-content: space-between;
                font-family: "PingFang-SC-Medium";
                padding-bottom: computed(20);
                border-bottom: 1px dashed #e6e6e6;
                .label {
                    font-size: computed(24);
                    color: #333333;
                }
                .time {
                    font-size: computed(20);
                    color: #666666;
                }
                .status {
                    font-size: computed(24);
                    color: $domaincolor;
                }
            }
            &-bottom {
                .label-value {
                    margin-top: computed(10);
                    font-size: computed(24);
                    color: #333333;
                }
            }
        }
    }

    .btn-group {
        margin-top: computed(20);
        .button {
            float: right;
            padding: 3rpx 20rpx;
            color: #333333;
            font-size: 24rpx;
            text-align: center;
            margin-left: 20rpx;
            border-radius: 20rpx;
            border: 2rpx solid rgba(204, 204, 204, 1);
            background: #fff;
        }
    }
}
.h32 {
    min-height: computed(32);
}
</style>

<template>
    <div class="list-item-wraper" @click="viewDetail()">
        <wxs module="filter" src="../../../../../../../filter/filterCommon.wxs"></wxs>
        <div class="list-box">
            <div class="left-box">
                <img
                    :src="filter.imgFilter(data.pictUrl,data.companyId)"
                    lazy-load="true"
                    @onerror="global.errImg(event)"
                />
            </div>
            <div class="right-box">
                <div class="right-box-top">
                    <span class="label">申请时间</span>
                    <span class="time">{{ data.applyTime }}</span>
                    <span class="status">{{ curStateName }}</span>
                </div>
                <div class="right-box-bottom">
                    <div class="label-value">
                        <span>售后类型 :&nbsp;</span>
                        <span>{{ curTypeName }}</span>
                    </div>
                    <div class="label-value">
                        <span>{{ moneyName }} :&nbsp;</span>
                        <span>￥{{ money }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-group">
            <div v-if="btnName" @click.stop="btnClick(btnName)" class="button">
                <span>{{ btnName }}</span>
            </div>
            <div v-if="btnModify" @click.stop="btnClick(btnModify)" class="button">
                <span>{{ btnModify }}</span>
            </div>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import ordStateMap from "../../../../common/stateCodeMap";
import Toast from "vant-weapp/dist/toast/toast";
import {
    cancelApply,
    reApply,
    modifyApply,
    btnClickEvent
} from "../../../../common/service";
import payment from "@/utils/payment";
import wxPay from "@/utils/wxPay";
export default {
    props: {
        ord: {},
        reload: {
            type: Function
        }
    },
    data() {
        return {
            data: this.ord,
            stateNameMap: ordStateMap,
            curStateName: "", //当前售后状态
            curTypeName: "", //当前售后类型
            btnName: null,
            btnModify: null,
            money: 0,
            moneyName: "退款金额",
            Rmb: "￥",
            showMoney: true,
            companyId: global.Storage.get("COMPANYID").company_id
        };
    },
    methods: {
        init() {
            this.btnName = null;
            this.btnModify = null;
            this.data = this.ord;
            this.curStateName = this.stateNameMap[this.data.applyStatusCode];
            this.curTypeName = this.data.returnTypeName;
            switch (this.curTypeName) {
                case "返修":
                    this.moneyName = "返修费用";
                    this.Rmb = "-￥";
                    if (this.data.repairPrice) {
                        this.money = this.data.repairPrice;
                    } else {
                        this.showMoney = false;
                    }
                    break;
                case "换货":
                    this.showMoney = false;
                    break;
                case "仅退款":
                    this.money = this.data.applyMoney;
                    break;
                case "退货退款":
                    this.money = this.data.applyMoney;
                    break;
                default:
                    this.money = 0;
                    this.Rmb = "￥";
            }
            switch (this.curStateName) {
                case "待审核":
                    this.btnName = "取消申请";
                    this.btnModify = "修改申请";
                    break;
                case "待寄回":
                    this.btnName = "填写物流";
                    this.btnModify = null;
                    break;
                case "待支付":
                    this.btnName = "支付费用";
                    this.btnModify = null;
                    break;
                case "已完成":
                    this.btnName = null;
                    this.btnModify = null;
                    break;
                case "已关闭":
                    this.btnName = null;
                    this.btnModify = null;
                    break;
                case "已拒绝":
                    this.btnName = null;
                    this.btnModify = null;
                    break;
                default:
                    this.btnName = null;
            }
        },
        goTo() {
            this.$router.push({
                path: "/pages/afterSalePackage/afterSale/pages/detail/page",
                query: {
                    reapplycode: this.data.reapplycode
                }
            });
        },
        // 填写物流
        fillLogis() {
            this.goTo();
        },
        //支付费用
        pay() {
            let reApplycode = this.data.reapplycode;
            let price = this.data.repairPrice;
            let payType = "D_PAY_REPAIR";
            // wxPay(this, reApplycode, price, payType).then(res => {
            //     if (res == 0) {
            //         this.$router.push({
            //             name: "postSaleDetail",
            //             query: {
            //                 reapplycode: reApplycode
            //             }
            //         });
            //     } else {
            //         let successUrl =
            //             "/postSaleDetail?reapplycode=" + reApplycode;
            //         // payment.miniProgramPay(res, successUrl, "/postSaleList");
            //     }
            // });
        },
        // 按钮点击触发事件
        async btnClick(btnName) {
            switch (btnName) {
                case "取消申请":
                    cancelApply(this).then(
                        result => {
                            Toast("取消成功");
                            this.curStateName = "已关闭";
                            this.btnName = null;
                            this.btnModify = null;
                            this.reload();
                        },
                        err => {
                            Toast("取消失败");
                        }
                    );
                    break;
                case "重新申请":
                    reApply(this);
                    break;
                case "修改申请":
                    modifyApply(this, this.data.applyStatusCode);
                    break;
                case "填写物流":
                    this.fillLogis();
                    break;
                case "支付费用":
                    this.pay();
                    break;
            }
        },
        // 查看申请单详情
        viewDetail() {
            this.goTo();
        }
    },
    created() {
        this.init();
    },
    watch: {
        data: function() {
            this.init();
        }
    },
    onHide() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    }
};
</script>
