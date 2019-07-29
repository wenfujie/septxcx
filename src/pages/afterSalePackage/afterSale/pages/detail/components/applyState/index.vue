<!--
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 售后状态组件
 * @Date: 2019-03-12 15:58:49
 * @LastEditTime: 2019-07-04 19:29:18
 -->
<style lang='scss' scoped>
.state-wrap {
    padding: computed(30);
    margin-bottom: computed(30);
    background: #fff;
    box-sizing: border-box;
    .status {
        color: $domaincolor;
        font-size: computed(30);
        font-weight: bold;
        margin-bottom: computed(10);
    }
    .reason {
        color: #333333;
        font-size: computed(24);
        margin-bottom: computed(10);
    }
    .cell {
        font-size: computed(24);
        margin: computed(20) 0;
        .left {
            color: #999999;
        }
    }
}
</style>]

<template>
    <div v-if="data" class="state-wrap box-shadow">
        <div class="status">状态:{{ordStateMap[data.applyStatusCode]}}</div>
        <div class="reason" v-if="reasonInfo">{{reasonInfo}}</div>
        <div class="cell">
            <span class="left">申请单编号&nbsp;:&nbsp;</span>
            <span class="right">{{ data.reApplycode}}</span>
        </div>
        <div class="cell">
            <span class="left">原订单号&nbsp;:&nbsp;</span>
            <span class="right">{{ data.billCode}}</span>
        </div>
        <div class="cell">
            <span class="left">申请时间&nbsp;:&nbsp;</span>
            <span class="right">{{ data.applyTime}}</span>
        </div>
    </div>
</template>

<script>
import { getDestnation, getShopList } from "@/api/service/base";
import ordStateMap from "../../../../common/stateCodeMap";
export default {
    props: {
        data: {}
    },
    data() {
        return {
            reasonInfo: "",
            repairDesc: "",
            showRepairPrice: false,
            showReasonInfo: false,
            ordStateMap: ordStateMap
        };
    },
    methods: {
        init() {
            this.reasonInfo = null;
            switch (this.data.returnTypeName) {
                case "仅退款":
                    this.refunds();
                    console.log("仅退款");
                    break;
                case "退货退款":
                    this.returnGood();
                    console.log("退货退款");
                    break;
                case "返修":
                    this.repaired();
                    console.log("返修");
                    break;
                case "换货":
                    this.changeGood();
                    console.log("换货");
                    break;
            }
        },
        // 退款处理
        refunds() {
            switch (this.ordStateMap[this.data.applyStatusCode]) {
                case "待审核":
                    this.reasonInfo = null;
                    break;
                case "处理中":
                    this.reasonInfo = null;
                    break;
                case "已完成":
                    this.reasonInfo = "退款资金已原路返回，以实际到账为准";
                    break;
                case "已关闭":
                    this.reasonInfo = null;
                    break;
                case "已拒绝":
                    this.reasonInfo = "拒绝原因:" + this.data.refuseReason;
                    break;
                default:
                    this.reasonInfo = null;
            }
        },
        // 退货
        returnGood() {
            switch (this.ordStateMap[this.data.applyStatusCode]) {
                case "待审核":
                    this.reasonInfo = null;
                    break;
                case "待寄回":
                    this.reasonInfo = "请寄回并填写物流信息";
                    break;
                case "已寄回":
                    this.reasonInfo = "处理中";
                    break;
                case "已完成":
                    this.reasonInfo = "退款资金已原路返回，以实际到账为准";
                    break;
                case "已关闭":
                    this.reasonInfo = null;
                    break;
                case "已拒绝":
                    this.reasonInfo = "拒绝原因:" + this.data.refuseReason;
                    break;
                default:
                    this.reasonInfo = null;
            }
        },
        // 返修
        repaired() {
            switch (this.ordStateMap[this.data.applyStatusCode]) {
                case "待审核":
                    this.reasonInfo = null;
                    break;
                case "待支付":
                    this.reasonInfo = "请先支付返修费用";
                    this.repairDesc = "返修费用: ";
                    break;
                case "待寄回":
                    this.reasonInfo = "请寄回并填写物流信息";
                    this.repairDesc = "已支付返修费用";
                    break;
                case "已寄回":
                    this.reasonInfo = "等待维修中";
                    this.repairDesc = "已支付返修费用";
                    break;
                case "待处理":
                    this.reasonInfo = "等待维修中";
                    this.repairDesc = "已支付返修费用";
                    break;
                case "维修中":
                    this.reasonInfo = "维修中";
                    this.repairDesc = "已支付返修费用";
                    break;
                case "维修完成":
                    this.repairDesc = "已支付返修费用";
                    break;
                case "已完成":
                    this.repairDesc = "已支付返修费用";
                    break;
                case "已关闭":
                    this.reasonInfo = null;
                    break;
                case "已取消":
                    this.reasonInfo = null;
                    break;
                case "已拒绝":
                    this.reasonInfo = "拒绝原因:" + this.data.refuseReason;
                    break;
                default:
                    this.reasonInfo = null;
            }
        },
        // 换货
        changeGood() {
            switch (this.ordStateMap[this.data.applyStatusCode]) {
                case "待审核":
                    this.reasonInfo = null;
                    break;
                case "待寄回":
                    this.reasonInfo = "请寄回并填写物流信息";
                    break;
                case "已寄回":
                    this.reasonInfo = "处理中";
                    break;
                case "已完成":
                    this.reasonInfo = null;
                    break;
                case "已关闭":
                    this.reasonInfo = null;
                    break;
                case "已拒绝":
                    this.reasonInfo = "拒绝原因:" + this.data.refuseReason;
                    break;
                default:
                    this.reasonInfo = null;
            }
        },
        // 获取地区
        async getArea() {
            let result = await getDestnation();
        }
    },
    watch: {
        data: {
            handler() {
                this.init();
            },
            deep: true
        }
    },
    onUnload() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    }
};
</script>