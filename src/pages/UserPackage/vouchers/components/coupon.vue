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
                        <!-- <p class="fs30B">{{card.couponName}}</p>
                        <div class="fs20 date-time">有效期至{{valiPeriod}}</div>-->
                    </div>
                    <div class="top-middle">
                        <p class="fs30B">{{card.couponName}}</p>
                        <div class="fs20 date-time">有效期至{{valiPeriod}}</div>
                    </div>
                    <div class="top-right coupon-state fs24">
                        <span v-if="card.state===0" @click="goToGoodsList">立即使用</span>
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
                        <span v-if="card.state===0" @click="goToGoodsList">立即使用</span>
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
        // 获取微信卡包配置
        async getCardConfig() {
            let params = {
                card_id: this.card.weixinId, //卡券weixinId,
                code: this.card.cardCode,
                isNeedOpenid: 0,
                wxuuid: global.Storage.get("properties").publicAccount
            };
            return vouchersApi.getWxconfig(params);
        },
        // 获取微信签名配置
        async getWxConfig() {
            let url = window.location.href.split("#")[0];
            let params = {
                wxUUID: global.Storage.get("properties").publicAccount,
                unAuthorizedUrl: encodeURIComponent(url)
            };
            return orderApi.getWxSignature(params);
        },
        // 添加卡包
        addCards(wxCofig, cardConfig) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: wxCofig.appId, // 必填，公众号的唯一标识
                timestamp: wxCofig.timeStamp, // 必填，生成签名的时间戳
                nonceStr: wxCofig.nonceStr, // 必填，生成签名的随机串
                signature: wxCofig.signature, // 必填，签名
                jsApiList: ["addCard"] // 必填，需要使用的JS接口列表
            });
            wx.ready(function() {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                wx.addCard({
                    cardList: [
                        {
                            cardId: this.card.weixinId,
                            cardExt: JSON.stringify(cardConfig)
                        }
                    ], // 需要添加的卡券列表
                    success: function(res) {
                        Toast("添加成功~");
                        var cardList = res.cardList; // 添加的卡券列表信息
                    },
                    error: function(err) {
                        Toast("添加成功~" + err);
                        console.error("err", err);
                    }
                });
            });
        },
        // 加入微信卡包
        async addToWxCardPkgs() {
            if (this.card.expiringFlag === 0) return;
            let res1 = {};
            let res2 = {};
            await this.getWxConfig().then(res => {
                res1 = res;
            });
            await this.getCardConfig()
                .then(res => {
                    res2 = res;
                })
                .catch(res => {
                    res2 = res;
                });
            this.addCards(res1, res2);
            // this.$requestAll([this.getWxConfig(), this.getCardConfig()]).then((res) => {
            //     console.log("request", res)
            //     this.addCards(res[0], res[1])
            // })
        },
        // 使用卡券时,跳转至商品详情
        goToGoodsList() {
            this.$router.push(
                "/pages/goodsPackage/goods/good-list?couponId=" + this.card.id
            );
        },
        // 通过卡号充值,点击使用时触发该方法
        async chargeByCardId() {
            let params = {
                cardId: this.card.cardId
            };
            fundApi.chargeByCardId(params).then(
                res => {
                    if (res === 1) {
                        Toast("充值成功");
                        this.$emit("reload");
                    } else {
                        Toast("充值失败");
                    }
                },
                err => {
                    Toast("充值失败~");
                }
            );
        },
        charge() {
            Dialog.confirm({
                message: "是否确定将金额充值至我的资金账户?"
            }).then(() => {
                this.chargeByCardId();
            });
        }
    }
};
</script>
<style lang='scss' scoped>
@import "@/assets/scss/common/vouchers.scss";
</style>
