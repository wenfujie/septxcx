/*
* createTime：2018/11/8
* author：junyong.hong
* description: 优惠券列表组件封装
*/
<template>
    <div class="vouchers">
        <!-- 优惠券列表 begin -->
        <ul
            v-if="cardList.length > 0"
            v-for="(item, index) in cardList"
            :key="index"
            class="vouchers-list"
        >
            <li class="vouchers-item">
                <div class="item">
                    <div class="item-price">
                        <!-- 显示：价格  -->
                        <!-- 灰色字体：gray-color -->
                        <div
                            class="price"
                            v-if="item.cardType != 10060203"
                            :class="[{'gray-color': tabType === 1 || tabType === 2}]"
                        >
                            <div v-if="item.remainAmount>0">
                                <div class="gray-color">余额</div>
                                <div>
                                    <span>¥</span>
                                    <span>{{item.remainAmount | Fix2}}</span>
                                </div>
                            </div>
                            <div v-if="item.remainAmount===0">
                                <span>¥</span>
                                <span>{{item.initialValue | Fix2}}</span>
                            </div>
                        </div>

                        <!-- 显示：折扣 -->
                        <!-- 灰色字体：gray-color -->
                        <div
                            class="discount"
                            v-if="item.cardType === 10060203"
                            :class="[{'gray-color': tabType === 1 || tabType === 2}]"
                        >
                            <span>{{item.discount}}</span>
                            <span>折</span>
                        </div>
                    </div>
                    <div class="item-info">
                        <!-- 灰色字体：gray-color -->
                        <div
                            class="info-title"
                            :class="[{'gray-color': tabType === 1 || tabType === 2}]"
                        >
                            <span>{{item.couponName}}</span>
                            
                            <span v-if="tabType === 1" class="info-title-status">已使用</span>
                            <span v-if="tabType === 2" class="info-title-status">已失效</span>
                        </div>
                        <p class="info-date">{{item.couponTimeStart}} - {{item.couponTimeEnd}}</p>
                        <p @click="showDesc(item, index)" class="info-description">
                            使用说明
                            <i
                                class="iconfont icon-down"
                                :class="[item.showOrHide ? 'tran-up': 'tran-down']"
                            ></i>
                        </p>
                    </div>
                    <div v-if="tabType === 0" class="item-buy">
                        <!-- 字体：fs32 fs24 fs24-gray -->
                        <!-- 未使用 -->
                        <div v-if="tabType === 0">
                            <p
                                v-if="item.weixinId && item.weixinId !==null && item.isSyncToWechet === 0"
                                @click="getWechatConfig(item)"
                                class="buy-price fs24"
                            >加入微信卡包</p>
                            <p v-if="item.isSyncToWechet === 1" class="buy-price fs24-gray">已加入微信卡包</p>
                            <div @click="gotoGoodsList()" class="buy-btn">使用</div>
                        </div>
                    </div>
                </div>

                <!-- none控制显示隐藏 -->
                <div
                    :class="[item.showOrHide ? 'none': '']"
                    v-if="item.projectRmk"
                    class="item-desc"
                >{{item.projectRmk}}</div>
            </li>
        </ul>
        <!-- 优惠券列表 end -->
        <!-- 优惠券为空 begin -->
        <div v-if="cardList.length === 0" class="empty-content bg-gray">
            <p>优惠券为空</p>
        </div>
        <!-- 优惠券为空 end -->
    </div>
</template>
<script>
import { Vouchers, Order } from '../api/service'
import Toast from 'vant-weapp/dist/toast/toast'
export default {
    props: [
        'tabType',
        'cardList'
    ],
    data() {
        return {}
    },
    created() {
    },
    methods: {
        /**
         * 使用说明展开 或 收起
         * @param item 当前点击的对象
         * @param index 索引
         */
        showDesc(item, index) {
            item.showOrHide = !item.showOrHide
        },
        /**
         * 加入微信卡包
         * @param item 当前点击的对象
         */
        getWechatConfig(item) {
            if (item.expiringFlag === 0) {
                return
            }
            let data = {
                card_id: item.weixinId,  //卡券weixinId,
                code: item.cardCode,
                isNeedOpenid: 0,
                wxuuid: global.baseConstant.publicAccount || global.Storage.get('properties').publicAccount
            }
            Vouchers.getWxconfig(data).then((res) => {
                let url = window.location.href.split("#")[0];
                let wxData = {
                    //  加入微信卡包的wxUUID使用小程序的wxUnionid
                    wxUUID: global.baseConstant.publicAccount || global.Storage.get('properties').publicAccount,
                    unAuthorizedUrl: encodeURIComponent(url)
                }
                Order.getWxSignature(wxData).then((config) => {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: config.appId, // 必填，公众号的唯一标识
                        timestamp: config.timeStamp, // 必填，生成签名的时间戳
                        nonceStr: config.nonceStr, // 必填，生成签名的随机串
                        signature: config.signature,// 必填，签名
                        jsApiList: ["addCard"] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function () {
                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                        wx.addCard({
                            cardList: [{
                                cardId: item.weixinId,
                                cardExt: JSON.stringify(res)
                            }], // 需要添加的卡券列表
                            success: function (res) {
                                Toast('添加成功~')
                                var cardList = res.cardList; // 添加的卡券列表信息
                            }
                        });
                    });
                })
            })
        },
        /**
         * 跳转到商品列表
         */
        gotoGoodsList() {
            this.$router.push('/goods')
        }
    },
    computed: {
        // 控制储值卡余额是否显示
        showRemainTag: function () {

        }
    }
}
</script>
<style lang="scss" scoped>
    @import '../assets/scss/common/vouchers.scss';

    .empty-content {
        height: calc(100vh - #{computed(184)});
    }
</style>