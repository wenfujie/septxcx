/*
* createTime：2019/9/25
* author：junyong.hong
* description: 拼团记录
*/
<template>
    <div class="assemble-record" :class="{'padding-0': !recordList.length && isLoadding}">
        <wxs module="filter" src="../../../../filter/filterCommon.wxs"></wxs>

        <ul>
            <li v-for="(item, index) in recordList" :key="index" @click="navigate(item)">
                <div class="header">
                    <span class="header-title">拼团</span>
                    <p class="header-time">
                        <span>{{item.orderYear}}</span>
                        <span>({{item.orderTime}})</span>
                    </p>
                    <span v-if="item.payNo === 0 && item.finishFlag === 0" class="header-status">待付款</span>
                    <span v-if="item.payNo === 1 && item.finishFlag === 0" class="header-status">待成团</span>
                    <span v-if="item.payNo === 1 && item.finishFlag === 1" class="header-status">已成团</span>
                    <span v-if="item.payNo === 1 && item.finishFlag === 2" class="header-status">拼团失败</span>
                    <span v-else-if="item.ordBoolean" class="header-status">交易关闭</span>
                </div>
                <div class="body">
                    <div class="list-img">
                        <img :src="filter.imgFilter(item.glbFileUrl, company_id, '160*160')">
                    </div>
                    <div class="list-container">
                        <p class="title">{{item.ptiPartHdName}}</p>
                        <div class="info">
                            <div class="info-left">
                                <p class="people">{{item.qty}}人团</p>

                                <!-- 进度条 -->
                                <div class="progress">
                                    <Progress :proContent="item.progressTitle"
                                              :percent="(item.clustNum / item.qty) * 100"></Progress>
                                </div>

                                <p>
                                    <span class="price">￥{{filter.Fix2(item.price)}}</span>
                                    <del class="del-price">￥{{filter.Fix2(item.oldPrice)}}</del>
                                </p>
                            </div>
                            <div class="info-right">
                                <!-- 倒计时 -->
                                <div class="count-down">
                                    <!-- 已经成团、交易关闭不显示倒计时 -->
                                    <count-down v-if="!(item.payNo === 1 && item.finishFlag === 1) || !item.ordBoolean"
                                                :spreadServerTime="item.currentTime"
                                                :targetTime="item.time"
                                                :title="'距结束'"
                                                :key="index"
                                                :titleAlign="'right'"
                                                @over="timeOver(item,index)">
                                        <div class="btn-status">
                                            <p v-if="item.payNo === 1 && item.finishFlag === 1">已完成</p>
                                            <p v-if="item.ordBoolean">已结束</p>
                                        </div>
                                    </count-down>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <p>
                        <span class="footer-price">应付:￥{{filter.Fix2(item.price)}}</span>
                        <span class="footer-num">(共{{item.ttlQty}}件)</span>
                    </p>
                    <div class="group-btn">
                        <button @click.stop="cancel(item, index)"
                             v-if="item.payNo === 0 && item.finishFlag === 0"
                             class="white-btn">
                            取消订单
                        </button>

                        <button v-if="item.payNo === 1 && item.finishFlag === 0"
                                open-type="share"
                                :data-item="item"
                                :data-index="index"
                                @click.stop="shareToFriend(item, index)"
                                class="red-btn">
                            邀请好友
                        </button>

                        <button @click.stop="navigate(item)"
                             v-if="item.payNo === 1 && item.finishFlag === 1"
                             class="white-btn">
                            查看订单
                        </button>

                        <button @click.stop="del(item, index)"
                             v-if="item.finishFlag === 2"
                             class="white-btn">
                            删除记录
                        </button>

                        <button @click.stop="payfor(item, index)"
                             v-if="item.payNo === 0 && item.finishFlag === 0"
                             class="red-btn">
                            立即付款
                        </button>
                    </div>
                </div>
            </li>

            <div v-if="!recordList.length && isLoadding" class="empty">
                <empty :emptyText="'暂无记录'"></empty>
            </div>
        </ul>

        <van-toast id="van-toast"/>
        <van-dialog id="van-dialog" />
    </div>
</template>
<script>
    import { Fission, Order } from "../../../../api/service";
    import CountDown from '@/pages/goodsPackage/fission/components/CountDown.vue';
    import Toast from 'vant-weapp/dist/toast/toast';
    import Dialog from 'vant-weapp/dist/dialog/dialog';
    import Empty from '@/components/EmptyContent.vue'
    import Progress from "@/pages/goodsPackage/fission/components/Progress.vue";
    import wxPay from "@/utils/wxPay";

    export default {
        config: {
            navigationBarTitleText: '拼团记录'
        },
        components: {
            CountDown,
            Empty,
            Progress
        },
        data() {
            return {
                serverUrl: global.baseConstant.serverUrl,
                company_id: global.Storage.get('COMPANYID').company_id,
                recordList: [],
                isLoadding: false,
                saving: false
            }
        },
        onLoad() {
            this._initData()
        },
        methods: {
            _initData () {
                this._findAllVipinforid()
            },
            /**
             * 拼团记录
             */
            async _findAllVipinforid () {
                let params = {
                    shopId: global.Storage.get("properties").shopId,
                    busContsCode: global.Storage.get("properties").busContsCode,
                    companyId: global.Storage.get("properties").companyId,
                    vipInfoHdId: global.Storage.get("USER_INFO").vipInfoId,
                }
                Fission.findAllVipinforid(params).then(async (res) => {
                    if (res.length) {
                        let currentTime = await this.getServerDate()

                        res.forEach((item, index) => {
                            let joinPeople = item.clustNum || 0
                            let people = item.qty || 0
                            let orderYear = item.ordDate.split(' ')[0]
                            let orderTime = item.ordDate.split(' ')[1]
                            let time = global.c_getDateStamp(item.beginTime) + (item.times * 60 * 1000 * 60)
                            let progressTitle = `已有${joinPeople}人参团`
                            let isOverTime = time <= currentTime ? true : false  // 是否结束 true结束 false未结束

                            if (joinPeople === people) {
                                progressTitle = '拼团成功'
                            }

                            let obj = {
                                progressTitle: progressTitle,
                                time: time,
                                orderYear: orderYear,
                                orderTime: orderTime,
                                isOverTime: isOverTime,
                                currentTime: currentTime
                            }

                            Object.assign(item, obj)
                        })
                        this.recordList = res
                    } else {
                        this.isLoadding = true
                    }


                }, err => {
                    this.isLoadding = true
                })
            },
            /**
             * 获取服务器时间
             */
            getServerDate(){
                return Fission.getServerDate().then(res=>{
                    return global.c_getDateStamp(res)
                })
            },
            /**
             * 倒计时结束事件
             * @param item 当前对象
             * @param index 索引
             */
            timeOver(item,index){
//                console.log('即将打印item,index=====》', item,index)
            },
            /**
             * 取消订单
             * @param item 当前对象
             * @param index 索引
             */
            async cancel (item, index) {
//                console.log('取消订单=====', item,index)

                Dialog.confirm({
                    title: '取消订单',
                    message: '是否取消订单？'
                }).then(async () => {
                    let params = {
                        flag: 1,
                        ctmUsrId: global.Storage.get('USER_INFO').usrId,
                        billCodes: [item.billCode]
                    };
                    let result = await Order.cancel(params);
                    if (result.status === 200) {
                        item.payNo = 0          // 未付款
                        item.finishFlag = 2     // 成团失败
                        item.ordBoolean = true  // 交易关闭
                        Toast("取消订单成功");
                    } else {
                        Toast("取消订单失败,请稍等再试");
                    }

                }).catch(() => {})
            },
            /**
             * 跳转
             * @param item
             */
            navigate(item) {
                let url = `/pages/orderPackage/order/orderDetail/order-detail?billCode=${item.billCode}&vipInfoDtFss=${item.vipInfoDtFss}&fissionType=2`

                this.$router.push(url);
            },
            /**
             * 删除订单
             * @param item 当前对象
             * @param index 索引
             */
            del (item, index) {
//                console.log('删除订单', item,index)

                Dialog.confirm({
                    title: '删除订单',
                    message: '是否删除？'
                }).then(() => {
                    Fission.delVipDtFss({
                        ids: item.vipInfoDtFss
                    }).then((res) => {
                        if (res > 0) {
                            this.recordList.splice(index, 1)
                        }
                    }, err => {
                        Toast(err)
                    })
                }).catch(() => {})
            },
            /**
             * 立即支付
             * @param item 当前对象
             * @param index 索引
             */
            payfor (item, index) {
//                console.log('立即支付', item,index)

                if (this.saving) {
                    this.btnLock = false
                    return;
                }
                this.saving = true

                this.toPay(item)
            },
            // 订单支付支付
            toPay(item) {
                let price = item.price * item.ttlQty
                let billCode = item.billCode

                let successUrl = `/pages/orderPackage/order/orderDetail/order-detail?billCode=${billCode}&vipInfoDtFss=${item.vipInfoDtFss}&fissionType=2`;
                if (price <= 0) {
                    this.saving = false;
                    this.$router.replace(successUrl + '&fromPage=payCode');
                    Order.packLevelUp({ billCode: billCode });
                    return;
                }

                wxPay(billCode, price).then(
                    res => {
                        this.$router.replace(successUrl + '&fromPage=payCode');
                    },
                    err => {
                        this.$router.replace(successUrl);
                    }
                ).catch(()=>{
                    Toast("支付出错了~");
                    this.$router.replace(successUrl);
                }).then(()=>{
                    this.saving = false;
                });
            },
            /**
             * 分享
             */
            shareToFriend() {

            }
        },
        onShareAppMessage: function (res) {
            let root = this;
            let item = res.target.dataset.item
            let imageurl = root.filter.imgFilter(item.glbFileUrl, root.company_id) || "";
            let url = `pages/goodsPackage/wares/wares-detail?goodsCode=${item.ptiPartHdCode}&dttGrpartId=${item.id}&onlineHdId=${item.onlineHdId}&fissionType=2`

            let shareUrl = global.getShareUrl(url);

            return {
                title: item.ptiPartHdName,
                path: shareUrl,
                imageUrl: imageurl
            }
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    .assemble-record{
        min-height: 100%;
        background-color: $bg-gray-fission;
        padding: computed(30);

        &.padding-0{
            padding: 0;
        }
        > ul {
            > li{
                background-color: $color-white;
                box-shadow:0 computed(4) computed(12) 0 rgba(0, 0, 0, 0.1);
                border-radius: computed(5);
                padding: computed(30);
                margin-bottom: computed(30);
                .header{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    padding-bottom: computed(30);
                    border-bottom: 1px dashed $border-gray;

                    .header-title{
                        width: computed(60);
                        height:computed(32);
                        background-color: $color-red;
                        color: $color-white;
                        border-radius: computed(5);
                        font-size: $font-small;
                        text-align: center;
                    }
                    .header-time{
                        flex: 1;
                        margin-left: computed(23);
                        span:nth-child(1) {
                            color: $text-primary;
                            font-size: $font-title1;
                        }
                        span:nth-child(2) {
                            margin-left: computed(23);
                            color: $text-secondary;
                            font-size: $font-common;
                        }
                    }
                    .header-status{
                        color: $color-red;
                        font-size: $font-title1;
                    }
                }
                .body{
                    display: flex;
                    flex-direction: row;
                    padding: computed(30) 0;
                    .list-img {
                        width: computed(160);
                        height: computed(160);
                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: computed(5);
                        }
                    }
                    .list-container {
                        flex: 1;
                        margin-left: computed(31);
                        max-width: computed(430);

                        .title {
                            word-break: keep-all;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            color: $text-primary;
                            font-size: $font-regular;
                        }

                        .info {
                            display: flex;
                            flex-direction: row;
                            .info-left {
                                width: computed(240);
                                .people {
                                    display: inline-block;
                                    min-width: computed(126);
                                    max-height: computed(32);
                                    margin-top: computed(20);
                                    border-radius: computed(16);
                                    font-size: $font-mini;
                                    color: $domaincolor;
                                    border: 1px solid $domaincolor;
                                    text-align: center;
                                }
                                .progress {
                                    width: computed(240);
                                    height: computed(26);
                                    margin-top: computed(15);
                                }
                                > p{
                                    margin-top: computed(12);
                                    word-break: keep-all;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    .price {
                                        font-size: $font-regular;
                                        font-weight: 600;
                                        color: $domaincolor;
                                    }
                                    .del-price {
                                        display: inline-block;
                                        margin-left: computed(12);
                                        font-size: $font-mini;
                                        color: $text-placeholder;
                                        text-decoration: line-through;
                                    }
                                }
                            }
                            .info-right {
                                flex: 1;
                                position: relative;
                                margin-left: computed(10);
                                .count-down {
                                    position: absolute;
                                    bottom: 0;
                                    right: 0;
                                    .btn-status{
                                        font-size: computed(24);
                                        color: $text-primary;
                                    }
                                }
                            }
                        }
                    }
                }
                .footer{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    border-top: 1px dashed $border-gray;
                    padding-top: computed(30);

                    > p {
                        margin-top: computed(5);
                        .footer-price{
                            color: $text-primary;
                            font-size: $font-title1;
                        }
                        .footer-num{
                            margin-left: computed(23);
                            color: $text-secondary;
                            font-size: $font-common;
                        }
                    }
                    .group-btn {
                        display: flex;
                        flex-direction: row;
                        > div, button{
                            max-height: computed(50);
                            line-height: computed(50);
                            font-size:computed(24);
                            border-radius:computed(25);
                            /*padding: computed(10) computed(18);*/
                            margin-left: computed(18);
                            background-color: $color-white !important;
                        }
                        .white-btn{
                            border:1px solid $text-secondary;
                            color: $text-regular;
                        }
                        .red-btn{
                            border:1px solid $color-red;
                            color: $color-red;
                        }
                    }
                }
            }
        }
    }
</style>
