<template>
    <div>
        <wxs module="filter" src="../../../../filter/filterCommon.wxs"></wxs>
        <!-- 折扣券 -->
        <div class="mgB30" v-if="isDisCoupon">
            <!-- 卡券 -->
            <div :class="card.couponMemo!=null?'coupon-box':'downcoupon'">
                <div class="top">
                    <div class="top-left">
                        <span class="fs48">{{filter.saveOneDecimals(card.couponValue)}}</span>
                        <span class="fs30">折</span>
                    </div>
                    <div class="top-middle">
                        <p class="fs30B">{{card.couponName}}</p>
                        <div class="fs20 date-time">活动有效期至{{valiPeriod}}</div>
                    </div>
                    <div class="top-right coupon-state" @click="operate()">{{operation.name}}</div>
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
                        <!-- 使用说明 -->
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
            <div :class="card.couponMemo!=null?'coupon-box':'downcoupon'">
                <div class="top">
                    <div class="top-left">
                        <span class="fs30">￥</span>
                        <span class="fs48">{{card.couponValue }}</span>
                    </div>
                    <div class="top-middle">
                        <p class="fs30B">{{card.couponName}}</p>
                        <div class="fs20 date-time">活动有效期至{{valiPeriod}}</div>
                    </div>
                    <div class="top-right coupon-state" @click="operate()">{{operation.name}}</div>
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
                        <!-- 说明 -->
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
import { Vouchers, Order } from "@/api/service";
import wxPay from "@/utils/wxPay";
import payment from "@/utils/payment";
import Toast from "vant-weapp/dist/toast/toast";
export default {
    components: {},
    props: {
        card: Object,
        // 来源：默认0为领券中心  1为商品详情页
        source: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            showDesc: false,
            couponNames: {
                D_AONETIMECARD: "一次性储值卡 ",
                D_CASHVOLUME: "现金券",
                D_DISCOUNTCOUPONS: "折扣券",
                D_RECHARGEABLECARD: "充值卡"
            }
        };
    },
    computed: {
        // 有效期
        valiPeriod: function() {
            if (this.card.couponEndTime == null) return;
            let end = this.card.couponEndTime.split(" ")[0].replace(/\-/g, ".");
            // console.log(end)
            return end;
        },
        // 是否现金券
        isCashCoupon: function() {
            return this.card.cardTypeCode === "D_CASHVOLUME" ? true : false;
            // return this.card.cardTypeCode === "002" ? true : false;
        },
        // 是否折扣券
        isDisCoupon: function() {
            return this.card.cardTypeCode === "D_DISCOUNTCOUPONS"
                ? true
                : false;
        },
        // 是否充值卡
        isStoredCard: function() {
            return this.card.cardTypeCode === "D_RECHARGEABLECARD"
                ? true
                : false;
            // return this.card.cardTypeCode === "czk" ? true : false;
        },
        // 是否一次性储值卡
        isOnceCard: function() {
            return this.card.cardTypeCode === "D_AONETIMECARD" ? true : false;
        },
        //操作按钮控制
        operation: function() {
            if (this.card.isBuy === 0 || this.card.buyPrice <= 0) {
                return {
                    name: "立即领取",
                    type: "draw",
                    showPrice: false
                };
            } else {
                return {
                    name: "立即使用",
                    type: "buy",
                    showPrice: false
                };
            }
        }
    },
    methods: {
        // 使用说明显示控制
        showUsage() {
            if (this.card.couponLimit) {
                this.showDesc = !this.showDesc;
            }
        },
        //空参数过滤器
        paramsFilter(params) {
            let keys = Object.keys(params);
            keys.forEach(key => {
                if (!params[key]) {
                    delete params[key];
                }
            });
            // console.log("filter", params);
            return params;
        },
        //领取卡券
        async draw() {
            let params = {
                usrId: global.Storage.get("USER_INFO").usrId,
                companyId: global.Storage.get("COMPANYID").company_id,
                busContsCode: global.baseConstant.busContsCode,
                cardId: this.card.valueCardHdId,
                couponsId: this.card.couponId,
                ownCompanyId: global.Storage.get("COMPANYID").company_id
            };
            params = this.paramsFilter(params);
            let result = await Vouchers.saveCoupons(params);
            // console.log('result', result)
            if (result.length == 0) {
                Toast("来迟一步~已经被领完拉~");
                return;
            }
            switch (result[0].state) {
                case "0":
                    Toast("领取成功");
                    if (this.source === 0) {
                        setTimeout(() => {
                            this.$router.replace(
                                "/pages/UserPackage/vouchers/my-vouchers"
                            );
                        }, 3000);
                    } else {
                        this.$emit("onSelectSuccess");
                    }

                    break;
                case "1":
                    Toast("您已经领取过该优惠券啦~");
                    break;
                case "2":
                    Toast("该优惠券已经被其他会员绑定~");
                    break;
                default:
                    Toast("领取失败");
                    break;
            }
        },
        // 操作
        async operate() {
            switch (this.operation.type) {
                case "draw":
                    this.draw();
                    break;
                default:
                    break;
            }
        }
    }
};
</script>
<style lang='scss' scoped>
@import "@/assets/scss/common/vouchers.scss";
</style>

