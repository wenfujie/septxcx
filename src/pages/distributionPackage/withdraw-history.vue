/*
* createTime：2019/3/4
* author：en.chen
* description:  历史提现记录
*/
<template>
    <div class="withdraw-history">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>
        <!-- 提现统计 begin -->
        <div class="amount-box">
            <div class="amount-item">
                <h2>{{ filter.Fix2(withdrawInfo.countAmount  || 0) }}</h2>
                <p>累积提现（元）</p>
            </div>
            <div class="amount-item">
                <h2>{{ filter.Fix2(withdrawInfo.withdrawAmount || 0) }}</h2>
                <p>已到账（元）</p>
            </div>
            <div class="amount-item">
                <h2>{{ filter.Fix2(withdrawInfo.checkAmount || 0) }}</h2>
                <p>审核中（元）</p>
            </div>
        </div>
        <!-- 提现统计 end -->

        <!--提现资金列表 begin-->
        <div class="fund-content">

            <div @refresh="onRefresh" :head-height="100">
                <div>
                    <ul class="fund-list" v-if="withdrawList.length>0">
                        <li class="fund-item" v-for="item in withdrawList" :key="item.id">
                            <div class="fund-detail">
                                <div>
                                    <p class="memo">提现</p>
                                    <p class="time">{{item.crtLog}}</p>
                                </div>
                                <div class="amount"
                                     :class="[(item.statusCode === 'D_CASHSTATUS03' || item.statusCode === 'D_CASHSTATUS04') ? 'failTip' : 'successTip']">
                                    <p>-{{ filter.Fix2(item.amount) }}</p>
                                    <p class="fee" v-show="!!item.tdAmount && item.tdAmount > 0">手续费：{{ filter.Fix2(item.tdAmount) }}</p>
                                </div>
                            </div>
                            <div class="fund-tip">
                                <p class="status-tip"
                                   :class="[(item.statusCode === 'D_CASHSTATUS03' || item.statusCode === 'D_CASHSTATUS04') ? 'failTip' : 'successTip']">
                                    {{item.statusName}}{{(item.statusCode === 'D_CASHSTATUS03' || item.statusCode ===
                                    'D_CASHSTATUS04') ? '：'+item.memo : ''}}</p>
                                <div class="show-reason"
                                     v-show="(item.statusCode === 'D_CASHSTATUS03' || item.statusCode === 'D_CASHSTATUS04') && !!item.memo && item.memo.length >= 20"
                                     @click.stop="moreReason(item.memo)">查看更多
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="fund-empty flex-vbox" v-if="withdrawList.length<=0 && !loading && !isLoading">
                        <empty :emptyText="emptyText"></empty>
                    </div>
                </div>
            </div>
        </div>
        <!--提现资金列表 begin-->

        <!-- 提现失败弹窗 end -->
        <!-- <van-dialog
                use-slot
                title="提现失败"
                class="reason-dialog"
                :show="showReason"
                v-if="showReason"
                confirmButtonText="我知道了"
                confirm-button-color="#333"
                @confirm="closeReason"
        >
            <div class="reason">
                <p>{{failReason || ""}}</p>
            </div>
            <div @click="showReason = false" class="close-btn">
                <text class="iconfont iconguanbi"></text>
            </div>
        </van-dialog> -->
        <!-- 提现失败弹窗 end -->

        <van-toast id="van-toast" />
    </div>
</template>
<script>
    import Empty from '@/components/EmptyContent.vue'
    import {Distribution} from '../../api/service'
    // import {PullRefresh, List, Toast} from 'vant'
    import Toast from 'vant-weapp/dist/toast/toast';

    export default {
        config: {
            navigationBarTitleText: "历史提现记录",
            enablePullDownRefresh: true
        },
        components: {
            // 'van-pull-refresh': PullRefresh,
            // 'van-list': List,
            // Toast,
            'empty': Empty
        },
        data() {
            return {
                loading: false,    // 是否处于加载更多
                isLoading: false,  // 是否处于上拉刷新状态
                finished: true,  // 控制是否允许加载更多商品
                withdrawList: [],  // 资金列表
                pageNum: 1,
                pageSize: 10,
                emptyText: '暂无数据~',
                // showReason: false,
                // failReason: ''
            }
        },
        // 小程序 滚动到底部事件
        onReachBottom(){
            this.loadMore();
        },
        // 小程序 下拉刷新事件
        onPullDownRefresh(){
            this.onRefresh();
        },
        methods: {
            //  获取提现列表
            async getWithdrawList() {
                if (this.isLoading) return
                this.isLoading = true
                let data = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    id: await this.$store.dispatch('distribution/getDistributionId')
                }

                //  会员整合新增选中分销商查询
                if(!!this.$store.state.distribution.accountInfo.id) {
                    data.id = this.$store.state.distribution.accountInfo.id
                    data.vipInfoHdId = this.$store.state.distribution.accountInfo.vipInfoHdId
                }

                Distribution.getWithdrawList(data).then((res) => {
                    this.withdrawList.push.apply(this.withdrawList, res.list)
                    if (this.withdrawList.length >= res.total || this.pageNum >= res.pages || res.total <= 0) {
                        this.finished = true
                    } else {
                        this.finished = false
                    }
                    global.toastLoading(false);// 关闭
                    wx.stopPullDownRefresh();
                    this.loading = false
                    this.isLoading = false
                }, () => {
                    this.loading = false
                    this.isLoading = false
                })
            },

            //  下拉刷新
            onRefresh() {
                this.statusInit()
                this.getWithdrawList()
            },

            //  上拉加载更多
            loadMore() {
                if (!!this.finished) {
                    Toast('没有更多了~')
                    return
                } else {
                    this.pageNum += 1
                    this.getWithdrawList()
                }
            },

            //  状态初始化
            statusInit() {
                this.pageNum = 1
                this.withdrawList = []
                this.finished = false
                this.loading = false
                this.isLoading = false
            },

            //  查看提现失败原因
            moreReason(text) {
                if(!text)return;
                wx.showModal({
                    title: '提现失败',
                    showCancel: false,
                    confirmText: '我知道了',
                    confirmColor: '#333',
                    content: text,
                    success (res) {
                        if (res.confirm) {
                        } else if (res.cancel) {
                        }
                    }
                })
            },
        },
        computed: {
            //  提现信息
            withdrawInfo: function () {
                let map = {}
                if (this.withdrawList.length > 0) {
                    map.withdrawAmount = this.withdrawList[0].withdrawAmount  // 已到账金额
                    map.checkAmount = this.withdrawList[0].checkAmount  // 审核中金额
                    map.countAmount = this.withdrawList[0].countAmount  // 累计提现金额
                }
                return map
            }
        },
        onLoad() {

            global.toastLoading();// 开启

            this.getWithdrawList()
        },
        onUnload(){
            // 解决重复进页面数据未初始化问题
            Object.assign(this.$data, this.$options.data());
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
    .withdraw-history {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        min-height: 100%;
        background: $color-background;
        padding-top: computed(220);
        .amount-box {
            position: fixed;
            top: computed(0);
            left: computed(0);
            box-sizing: border-box;
            display: flex;
            width: 100%;
            height: computed(220);
            border: solid computed(30) $color-background;
            background: $bggradientcolor;
            align-items: center;
            justify-content: center;
            -webkit-border-radius: computed(5);
            -moz-border-radius: computed(5);
            border-radius: computed(5);
            z-index: 9;
            .amount-item {
                flex: 1;
                text-align: center;
                h2 {
                    font-size: $font-h1;
                    line-height: 1;
                    color: $color-white;
                }
                p {
                    font-size: $font-regular;
                    line-height: 1;
                    color: $color-white;
                    margin-top: computed(20);
                }
            }
        }
        .fund-content {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: calc(100% - #{computed(220)});
            position: relative;
            z-index: 3;
            .van-list {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            .fund-list {
                .fund-item {
                    background: $color-white;
                    display: flex;
                    box-sizing: border-box;
                    padding: 0 computed(30);
                    border-bottom: solid 1px $text-placeholder;
                    align-items: center;
                    justify-content: space-between;
                    flex-direction: column;
                    &:first-of-type {
                        border-top: solid 1px $text-placeholder;
                    }
                    .fund-detail {
                        flex: 1;
                        width: 100%;
                        min-height: computed(138);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .memo {
                            font-size: $font-h2;
                            line-height: 1;
                            color: $color-black;
                        }
                        .time {
                            margin-top: computed(24);
                            font-size: $font-common;
                            color: $text-secondary;
                            line-height: 1;
                        }
                        .amount {
                            font-size: $font-h1;
                            line-height: 1;
                            text-align: right;
                            &.in {
                                color: $text-warn;
                            }
                            &.out {
                                color: $text-green;
                            }
                            .fee {
                                font-size: $font-small;
                                line-height: 1;
                                margin-top: computed(20);
                                color: $text-secondary;
                            }
                        }
                    }
                    .fund-tip {
                        display: flex;
                        width: 100%;
                        font-size: $font-small;
                        line-height: $font-common;
                        height: $font-common;
                        padding-bottom: computed(20);
                        word-break: keep-all;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        .status-tip {
                            flex: 1;
                            width: 100%;
                            padding-right: computed(20);
                            font-size: $font-small;
                            line-height: $font-common;
                            height: $font-common;
                            word-break: keep-all;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .show-reason {
                            font-size: $font-small;
                            line-height: $font-common;
                            height: $font-common;
                            text-decoration: underline;
                        }
                    }
                    .successTip {
                        color: $text-green !important;
                    }
                    .failTip {
                        color: $domaincolor !important;
                    }
                }
            }
        }
        .fund-empty {
            background: $color-background;
            flex: 1;
        }
        .reason-dialog {
            box-sizing: border-box;
            width: computed(560);
            height: computed(345);
            padding: computed(30);
            .reason {
                box-sizing: border-box;
                margin: computed(34) 0;
                overflow: auto;
                word-break: break-all;
                font-size: $font-regular;
                line-height: $font-h1;
                padding: 0 computed(60);

                p{
                    text-align: center;
                }
            }
            .close-btn {
                position: absolute;
                width: computed(30);
                height: computed(30);
                right: computed(30);
                top: computed(20);
                text-align: center;
                line-height: computed(30);
                .iconfont {
                    font-size: computed(26);
                    color: $text-placeholder;
                }
            }
        }
    }
</style>
