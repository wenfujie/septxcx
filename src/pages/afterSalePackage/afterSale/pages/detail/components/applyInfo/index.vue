/*
 * @Author: yongtian.hong
 * @Date: 2018-08-13 13:42:39
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-17 15:24:20
 * @Description: 售后服务公用商品描述组件
 */

<style lang='scss' scoped>
.apply-info-wrapper {
    margin-top: computed(30);
    padding: computed(30);
    background: #fff;
    //售后信息
    .after-sale-info {
        font-size: computed(24);
        .cell {
            display: flex;
            margin-bottom: computed(20);
            .left {
                color: #999999;
            }
            .right {
                flex: 1;
                color: #333333;
            }
        }
    }
    //用户上传图片回显
    .imgs {
        display: flex;
        flex-wrap: wrap;
        img {
            width: computed(150);
            height: computed(150);
            margin-left: computed(6);
        }
    }
}
</style>

<template>
    <div class="apply-info-wrapper box-shadow" v-if="data">
        <wxs module="filter" src="../../../../../../../filter/filterCommon.wxs"></wxs>
        <!-- 说明 -->
        <div class="after-sale-info">
            <div class="cell">
                <div class="left">售后类型 :&nbsp;</div>
                <div class="right">{{ data.returnTypeName }}</div>
            </div>
            <div class="cell">
                <div class="left">售后原因 :&nbsp;</div>
                <div class="right">{{ data.returnsReason }}</div>
            </div>

            <div class="cell" v-if="isRefund && data.goodsList">
                <div class="left">退款金额 :&nbsp;</div>
                <div class="right">¥{{ data.applyMoney }}</div>
            </div>

            <div v-if="isReturn">
                <div class="cell" v-if="data.goodsList">
                    <div class="left">退货数量 :&nbsp;</div>
                    <div class="right">{{ data.applyAmountQty }}</div>
                </div>
                <div class="cell" v-if="data.goodsList">
                    <div class="left">预计退款 :&nbsp;</div>
                    <div class="right">¥{{ data.applyMoney }}</div>
                </div>
            </div>
            <!-- 换货商品显示 -->
            <div class="flex-box mgB30" v-if="isChange">
                <div>换货商品 :</div>
                <div class="mgL20">
                    <div v-for="(good, index) in data.changeGoodsList" :key="index" class="mgB30">
                        <span>{{ good.colorName }}</span>
                        <span class="mgL30">{{ good.sizeName }}</span>
                        <span class="mgL30">x{{ good.amount }}</span>
                    </div>
                </div>
            </div>

            <div class="cell">
                <div class="left">售后说明 :&nbsp;</div>
                <div class="right">{{ data.reasonMemo || "无" }}</div>
            </div>
            <div class="cell">
                <div class="left">上传图片 :&nbsp;</div>
                <div class="right" v-if="data.pictList && data.pictList.length == 0">无</div>
            </div>
        </div>
        <!-- 用户上传的图片 -->
        <div class="imgs">
            <img
                v-for="(item, index) in data.pictList"
                :key="index"
                :src="filter.imgFilter(item.pictUrl,companyId)"
                lazy-load="true"
            />
        </div>
    </div>
</template>

<script>
import check from "@/utils/check";

export default {
    props: {
        data: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            isRefund: false, //仅退款
            isReturn: false, //退货退款
            isChange: false, //换货
            isRepair: false, //返修
            companyId: global.Storage.get("COMPANYID").company_id
        };
    },
    methods: {
        initCurType() {
            this.isRefund = false; //仅退款
            this.isReturn = false; //退货退款
            this.isChange = false; //换货
            this.isRepair = false; //返修
            switch (this.data.returnTypeCode) {
                // 仅退款
                case "D_ONLYDRAWBACK":
                    this.isRefund = true;
                    break;
                // 换货
                case "D_CHANGEPART":
                    this.isChange = true;
                    break;
                // 返修
                case "D_REPAIR":
                    this.isRepair = true;
                    break;
                // 退货退款
                case "D_RETURNSALES":
                    this.isReturn = true;
                    break;
            }
        }
    },
    // computed: {
    //     returnMoney: function () {
    //         const good = this.data.goodsList[0];
    //         return (good.amountAverage / good.ordQty * this.data.applyAmountQty)
    //     }
    // },
    watch: {
        data: {
            handler() {
                this.initCurType();
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