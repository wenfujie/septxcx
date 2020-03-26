<template>
    <div>
        <wxs module="filter" src="../../../../filter/filterCommon.wxs"></wxs>
        <!-- 折扣券 -->
        <div class="mgB30" v-if="isDisCoupon">
            <!-- 卡券 -->
            <div
                :class="[{'unuse-coupon':card.state===0,'my-coupon':card.state!=0}, {'unuseCoupon-explain':card.state===0&&card.projectRmk==null,'coupon-explain':card.state!=0&&card.projectRmk==null}]"
            >
                <div class="top">
                    <div class="top-left">
                        <span class="fs48">{{filter.saveOneDecimals(card.discount)}}</span>
                        <span class="fs30">折</span>
                    </div>
                    <div class="top-middle">
                        <p class="fs30B">{{card.couponName}}</p>
                        <div class="fs20 date-time">有效期至{{valiPeriod}}</div>
                    </div>
                    <div class="top-right coupon-state fs24">
                        <span v-if="card.state===0" @click="goToGoodsList(card)">立即使用</span>
                        <span v-if="card.state===1">已使用</span>
                        <span v-if="card.state===2">已失效</span>
                    </div>
                </div>
                <div class="dashed"></div>
                <div class="bottom">
                    <div class="describe-detail fs20">
                        <!-- 使用范围 -->
                        <div class="describe">
                            <span>仅限{{card.couponLimit}}</span>
                            <text
                                @click="showUsage()"
                                v-if="card.instructions&&card.instructions.length>26"
                                :class="['iconfont iconicondown-copy',{'rotatingUp':showDesc,'rotatingDown':!showDesc}]"
                            ></text>
                        </div>
                        <div class="fs24 desc" v-show="card.instructions">
                            <span
                                :class="{'shuoming':showDesc,'down':!showDesc}"
                            >说明:{{card.instructions}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 现金抵用券 -->
        <div class="mgB30" v-if="isCashCoupon">
            <!-- 卡券 -->
            <div
                :class="[{'unuse-coupon':card.state===0,'my-coupon':card.state!=0}, {'unuseCoupon-explain':card.state===0&&card.projectRmk==null,'coupon-explain':card.state!=0&&card.projectRmk==null}]"
            >
                <div class="top">
                    <div class="top-left">
                        <span class="fs30">￥</span>
                        <span class="fs48">{{card.initialValue }}</span>
                    </div>
                    <div class="top-middle">
                        <p class="fs30B">{{card.couponName}}</p>
                        <div class="fs20 date-time">有效期至{{valiPeriod}}</div>
                    </div>
                    <div class="top-right coupon-state fs24">
                        <span v-if="card.state===0" @click="goToGoodsList(card)">立即使用</span>
                        <span v-if="card.state===1">已使用</span>
                        <span v-if="card.state===2">已失效</span>
                    </div>
                </div>
                <div class="dashed"></div>
                <div class="bottom">
                    <div class="describe-detail fs20">
                        <!-- 使用范围 -->
                        <div class="describe">
                            <span>仅限{{card.couponLimit}}</span>
                            <span
                                @click="showUsage()"
                                v-if="card.instructions&&card.instructions.length>26"
                                :class="['iconfont iconicondown-copy',{'rotatingUp':showDesc,'rotatingDown':!showDesc}]"
                            ></span>
                        </div>
                        <div class="fs24 desc" v-show="card.instructions">
                            <span
                                :class="{'shuoming':showDesc,'down':!showDesc}"
                            >说明:{{card.instructions}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as fundApi from "@/api/service/fund";
import Toast from "vant-weapp/dist/toast/toast";
import Dialog from "vant-weapp/dist/dialog/dialog";
export default {
    props: {
        card: Object,
        refreshIndex: Number
    },
    data() {
        return {
            showDesc: false,
            couponNames: {
                10060201: "一次性储值卡",
                10060202: "现金券",
                10060203: "折扣券",
                10060206: "充值卡"
            },
            backgrounds: [
                {
                    back:
                        global.baseConstant.serverUrl + "images/goods/noup.png"
                }
            ]
        };
    },
    computed: {
        // 有效期
        valiPeriod: function() {
            if (this.card.couponTimeEnd == null) return;
            let end = this.card.couponTimeEnd.split(" ")[0].replace(/\-/g, ".");
            return end;
        },
        // 是否现金券
        isCashCoupon: function() {
            return this.card.cardTypeCode === "D_CASHVOLUME" ? true : false;
        },
        // 是否折扣券
        isDisCoupon: function() {
            return this.card.cardTypeCode === "D_DISCOUNTCOUPONS"
                ? true
                : false;
        }
    },
    methods: {
        // 使用说明显示控制
        showUsage() {
            if (this.card.couponLimit) {
                this.showDesc = !this.showDesc;
            }
        },
        // 使用卡券时,跳转至商品详情
        goToGoodsList(card) {
            card.couponTimeStart = Date.parse(card.couponTimeStart.replace(/-/g,"/"));  //否则iphone上new Date(card.couponTimeStart)为NAN
            if (
                new Date(card.couponTimeStart).getTime() <= new Date().getTime()
            ) {
                this.$router.push(
                    "/pages/goodsPackage/goods/good-list?" +
                        (!this.card.id
                            ? "couponCardId=" + this.card.cardId
                            : "couponId=" + this.card.id)
                );
            } else {
                Toast("抱歉，还未到该券的使用时间");
                return false;
            }
        }
    }
};
</script>
<style lang='scss' scoped>
@import "@/assets/scss/common/vouchers.scss";
</style>
