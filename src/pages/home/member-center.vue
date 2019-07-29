/*
* createTime：2018/11/7
* author：junyong.hong
* description: 账户页
*/
<template>
    <div class="member-center" v-show="isshow">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>
        <scroll-view scroll-y="true" :style="'height:'+screenHeight+'px'">
            <div class="member-center-wrap">
                <!-- 头部：logo、用户名、会员等级 begin -->
                <div class="center-header">
                    <div class="header-body">
                        <div
                            @click="navigate('/pages/UserPackage/member/member-info')"
                            class="header-logo"
                        >
                            <img
                                :src="filter.imgFilter(userInfo.thumb,company_id)"
                                @onerror="global.errImg(event)"
                                lazy-load="true"
                            />
                        </div>
                        <div class="header-info">
                            <p class="info-name">{{userInfo.account}}</p>
                            <!-- 普通卡：vip-common、金卡：vip-golden、黑卡：vip-black -->
                            <!--<p class="info-vip vip-common">{{userInfo.vipLevel}}</p>-->
                        </div>
                    </div>
                </div>
                <!-- 头部 end -->
                <!-- 列表 begin -->
                <div class="center-list">
                    <!-- 我的订单 begin -->
                    <van-cell-group class="common-cell first-cell">
                        <van-cell
                            title="我的订单"
                            value="全部订单"
                            class="title"
                            is-link
                            @click="goToOrdList({code:'',index:0})"
                        />
                        <van-cell class="order-status">
                            <div @click="goToOrdList({code:'D_ORDSPAYING',index:1})" class="item">
                                <div class="item-col num">
                                    <text class="iconfont icon icondaifukuan"></text>
                                    <!-- <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icondaifukuan"></use>
                                    </svg>-->
                                    <span v-if="ordNum[0] > 0">{{ordNum[0]}}</span>
                                    <p>待付款</p>
                                </div>
                            </div>
                            <div @click="goToOrdList({code:'D_ORDSSHIPPING',index:2})" class="item">
                                <div class="item-col num">
                                    <text class="iconfont icon icondaifahuo"></text>
                                    <!-- <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icondaifahuo"></use>
                                    </svg>-->
                                    <span v-if="ordNum[1] > 0">{{ordNum[1]}}</span>
                                    <p>待发货</p>
                                </div>
                            </div>
                            <div @click="goToOrdList({code:'D_ORDSDELIVERY',index:3})" class="item">
                                <div class="item-col num">
                                    <text class="iconfont icon icondaishouhuo"></text>
                                    <!-- <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icondaishouhuo"></use>
                                    </svg>-->
                                    <span v-if="ordNum[2] > 0">{{ordNum[2]}}</span>
                                    <p>待收货</p>
                                </div>
                            </div>
                            <div
                                @click="goToOrdList({code:'D_ORDSCOMMENTING',index:4})"
                                class="item"
                            >
                                <div class="item-col num">
                                    <text class="iconfont icon icondaipingjia"></text>
                                    <!-- <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#icondaipingjia"></use>
                                    </svg>-->
                                    <span v-if="ordNum[4] > 0">{{ordNum[4]}}</span>
                                    <p>待评价</p>
                                </div>
                            </div>
                            <div
                                @click="navigate('/pages/afterSalePackage/afterSale/pages/list/page')"
                                class="item"
                            >
                                <div class="item-col num">
                                    <text class="iconfont icon iconshouhou"></text>
                                    <!-- <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#iconshouhou"></use>
                                    </svg>-->
                                    <span v-if="ordNum[3] > 0">{{ordNum[3]}}</span>
                                    <p>维修/售后</p>
                                </div>
                            </div>
                        </van-cell>
                    </van-cell-group>
                    <!-- 我的订单 end -->

                    <!-- 分销商模块 begin -->
                    <div class="distribution-content" @click="distributionHandle">
                        <p>分销中心</p>
                        <p>{{!!isVipMdt ? '开始您的分销商之旅' : '轻松加入分销商体系'}}</p>
                        <div class="distribution-icon">
                            <text class="iconfont iconfenxiao"></text>
                        </div>
                        <div class="distribution-btn">{{!!isVipMdt ? '立即进入' : '立即申请加入'}}</div>
                    </div>
                    <!-- 分销商模块 end -->

                    <!-- 用户基本属性 begin -->
                    <van-cell-group class="common-cell second-cell">
                        <van-cell
                            title="个人信息"
                            class="title"
                            is-link
                            @click="navigate('/pages/UserPackage/member/member-info')"
                        />
                        <van-cell
                            title="我的抵用券"
                            class="title"
                            is-link
                            @click="navigate('/pages/UserPackage/vouchers/my-vouchers')"
                        />
                        <van-cell
                            title="收货地址"
                            class="title"
                            is-link
                            @click="navigate('/pages/UserPackage/address/address-list?showList=1')"
                        />
                        <van-cell
                            title="我的收藏"
                            class="title"
                            is-link
                            @click="navigate('/pages/UserPackage/member/my-collection')"
                        />
                        <van-cell
                            title="客服与帮助"
                            class="title"
                            is-link
                            @click="navigate('/pages/UserPackage/help/help-center')"
                        />
                        <!--<van-cell title="资金账户" class="title" is-link @click="navigate('/fund-detail')"/>-->
                        <!--<van-cell title="我的会员" class="title" is-link @click="navigate('/member-ship')"/>-->
                        <!--<van-cell title="我的积分" class="title" is-link @click="navigate('/point-detail')"/>-->
                    </van-cell-group>
                    <!-- 用户基本属性 end -->
                    <!-- 预约量体 begin -->
                    <!--<van-cell-group class="common-cell three-cell">-->
                    <!--<van-cell title="量体数据" class="title" is-link @click="navigate('/countBodyData')"/>-->
                    <!--<van-cell title="我的预约" class="title" is-link @click="navigate('/myReserve')"/>-->
                    <!--</van-cell-group>-->
                    <!-- 预约量体 end -->
                    <!-- 售后 begin -->
                    <van-cell-group class="common-cell four-cell">
                        <!--<van-cell title="消费记录" class="title" is-link @click="navigate('/shopping-list')"/>-->
                        <!-- <van-cell title="在线客服" class="title" is-link @click="lineService()"/> -->
                    </van-cell-group>
                    <!-- 售后 end -->
                </div>
                <!-- 列表 end -->
            </div>
        </scroll-view>
    </div>
</template>
<script>
import { UserService, Base, Login, Cms, Distribution } from "../../api/service";
// 获取订单状态数量
import { getOrdListNum } from "@/pages/orderPackage/order/order/public/functions";
import Toast from "vant-weapp/dist/toast/toast";
export default {
    props: ["isshow", "query"],
    data() {
        return {
            vipId: null, // 分销商模块使用的上级会员id（目前只通过小程序传进路由）
            ascriptionId: null, // 归属地id（目前只通过小程序传进路由）
            userInfo: {},
            ordNum: [],
            isVipMdt: null, // 当前用户是否是分销商
            company_id: "",
            screenHeight: 667
        };
    },
    created() {
        this.createdMethods();
    },
    methods: {
        createdMethods() {
            const systemInfo = wx.getSystemInfoSync();
            this.screenHeight = systemInfo.windowHeight;
            this.company_id = global.Storage.get("COMPANYID").company_id;
            this.vipId = this.$root.$mp.query.vipId
            this.getVipInfo()
            this.isDistribution()
            // 获取订单数量
            this.getOrdNum();
        },
        onRefresh() {
            this.createdMethods();
        },
        /**
         * 路由导航
         * @param url 路由连接
         */
        navigate(url) {
            this.$router.push(url);
        },
        /**
         * 在线客服
         */
        lineService() {
            contact();
        },
        /**
         * 跳转到订单
         * @param params 路由参数
         */
        goToOrdList(tab) {
            this.$store.commit("orderList/tabChange", tab);
            this.$router.push("/pages/orderPackage/order/orderList/order-list");
        },
        /**
         * 获取会员信息
         */
        async getVipInfo() {
            let data = {
                busContsCode: global.baseConstant.busContsCode
            };
            UserService.getVipInfo(data).then(res => {
                // 处理会员等级
                if (res.vipLevel === null) {
                    res.vipLevel = "普通会员";
                }
                this.userInfo = res;
            });
        },
        /**
         * 获取订单数量
         * @returns {Promise.<void>}
         */
        async getOrdNum() {
            this.ordNum = await getOrdListNum(this);
        },

        //  提示分销商上下级关系
        showLevelToast() {
            let data = {
                vipId: this.vipId
            };
            return Distribution.getUserInfo(data).then(res => {
                Toast(
                    `${this.userInfo.account}无法再次成为${res.vipName}的下级~`
                );
            });
        },

        //  判断会员是否是分销商
        isDistribution() {
            let data = {
                vipInfoHdId: global.Storage.get("USER_INFO").vipInfoId,
                busconsCode: global.baseConstant.busContsCode
            };
            Distribution.isDistribution(data).then(res => {
                this.isVipMdt = res.isVipMdt;
            });
        },

        //  根据会员是否是分销商进行跳转
        distributionHandle() {
            //  是分销商的情况跳转分销商中心，非分销商跳转注册
            if (!!this.isVipMdt) {
                this.$router.push("/pages/distributionPackage/center");
            } else {
                let url = `/pages/distributionPackage/spread?vipId=${
                    !!this.vipId ? this.vipId : ""
                }&taskId=${!!this.taskId ? this.taskId : ""}&ascriptionId=${
                    !!this.$route.ascriptionId ? this.$route.ascriptionId : ""
                }`;
                this.$router.push(url);
            }
        }
    }
};
</script>

<style lang="scss" type="text/scss" scoped>
.member-center {
    $whiteColor: #ffffff;
    $grayColor: #f5f5f5;
    $titleColor: #333333;
    $orderStatusColor: #666666;
    $rightColor: #0d0e09;
    $redColor: #c41717;

    position: relative;
    height: 98%;
    background-color: $grayColor;
    /* 头部 */
    .member-center-wrap {
        height: 110%;
        width: 100%;
    }
    .center-header {
        width: 100%;
        height: computed(349);
        /*background: url("../../assets/images/member/member-bg.png");*/
        /*background-size: 100% 100%;*/
        background: $bggradientcolorbt;
        .header-body {
            box-sizing: border-box;
            padding-top: computed(30);
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: center;
            align-items: center;
            .header-logo {
                img {
                    width: computed(100);
                    height: computed(100);
                    border-radius: 50%;
                }
            }
            .header-info {
                flex: 1 1 auto;
                .info-name {
                    margin-top: computed(10);
                    font-size: $font-common;
                    line-height: 1;
                    color: $color-white;
                }
                .info-vip {
                    display: inline-block;
                    margin: computed(22) 0 0 computed(28);
                    padding: computed(3) computed(17);
                    font-size: computed(22);
                    color: $whiteColor;
                    &.vip-common {
                        background: url($serverUrl+"images/member/commonCard.png");
                        background-size: 100% 100%;
                    }
                    &.vip-golden {
                        background: url($serverUrl+"images/member/goldenCard.png");
                        background-size: 100% 100%;
                    }
                    &.vip-black {
                        background: url($serverUrl+"images/member/blackCard.png");
                        background-size: 100% 100%;
                    }
                }
            }
        }
    }

    .distribution-content {
        box-sizing: border-box;
        height: computed(150);
        margin-bottom: computed(30);
        margin-top: computed(30);
        padding-left: computed(116);
        background: linear-gradient(
            90deg,
            $domaincolor,
            $gradientcolor
        ) !important;
        position: relative;
        overflow: hidden;
        color: $color-white;
        border-radius: computed(5);
        p:first-child {
            margin-top: computed(40);
            font-size: $font-h2;
            line-height: 1;
        }
        p:nth-child(2) {
            margin-top: computed(10);
            font-size: $font-small;
            line-height: 1;
        }
        .distribution-icon {
            width: computed(60);
            height: computed(60);
            position: absolute;
            top: computed(40);
            left: computed(35);
            text-align: center;
            .iconfont {
                font-size: computed(60);
                line-height: 1;
            }
        }
        .distribution-btn {
            width: computed(204);
            height: computed(50);
            position: absolute;
            top: computed(50);
            right: computed(30);
            background: $color-white;
            font-size: $font-num;
            line-height: computed(50);
            text-align: center;
            color: $domaincolor;
            border-radius: $btn-radius25;
        }
    }
}
</style>
<style lang="scss">
.member-center {
    $whiteColor: #ffffff;
    $grayColor: #f5f5f5;
    $titleColor: #333333;
    $orderStatusColor: #666666;
    $rightColor: #0d0e09;
    $redColor: #c41717;
    scroll-view {
        height: 667px;
        width: 100%;
    }
    .order-status {
        .van-cell {
            padding: 0;
        }
    }
    /* 列表 */
    .center-list {
        width: calc(100% - #{computed(60)});
        z-index: 999;
        margin: computed(-127) computed(30) 0 computed(30);
        .common-cell {
            background: $whiteColor;
            margin-bottom: computed(30);
            &:last-child {
                margin-bottom: 0;
            }
            &.first-cell {
                .order-status {
                    padding: 0;
                    .item {
                        display: inline-block;
                        width: 20%;
                        height: computed(154);
                        vertical-align: middle;
                        text-align: center;
                        position: relative;
                        .item-col {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            width: 100%;
                            transform: translate(-50%, -50%);
                            text-align: center;
                            .icon {
                                width: computed(38);
                                height: computed(38);
                                background: white;
                                color: $titleColor;
                            }
                            &.num {
                                position: relative;
                                span {
                                    position: absolute;
                                    top: computed(-17);
                                    right: computed(30);
                                    font-style: normal;
                                    font-size: computed(24);
                                    min-width: computed(32);
                                    height: computed(32);
                                    line-height: computed(32);
                                    border-radius: 50%;
                                    background: $domaincolor;
                                    color: $whiteColor;
                                }
                            }
                            > p {
                                color: $orderStatusColor;
                                font-size: computed(24);
                                line-height: computed(24);
                            }
                        }
                    }
                }
                van-cell {
                    &:not(:last-child) {
                        .van-cell::after {
                            width: calc(100% - 30px);
                            border: dashed computed(1) $text-placeholder;
                        }
                    }
                    &.title {
                        position: relative;
                        color: $titleColor;
                        font-size: computed(26);
                        font-weight: bold;
                        bottom: -1px;
                        .van-cell__value {
                            font-weight: normal;
                        }
                    }
                }
            }
            van-cell {
                &:not(:last-child) {
                    .van-cell::after {
                        width: calc(100% - 30px);
                        border: dashed computed(1) $text-placeholder;
                    }
                }
                &.title {
                    position: relative;
                    color: $titleColor;
                    font-size: computed(26);
                    font-weight: bold;
                    bottom: -1px;
                    .van-cell__value {
                        font-weight: normal;
                    }
                }
            }
        }
    }
}
</style>
