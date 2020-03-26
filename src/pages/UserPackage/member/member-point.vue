/*
* createTime：2019/9/17
* author：fujie.wen
* description:  我的积分
*/
<template>
    <div class="member-point">
        <wxs module="filter" src="../../../filter/filterCommon.wxs"></wxs>

        <!--积分预览-->
        <div class="point-preview" id="point-preview">
            <p class="final-point">{{(finalPoints === undefined) || (finalPoints === null) ? 0 : finalPoints}}积分可用</p>
            <p class="freeze-point">{{(freezePoints === undefined) || (freezePoints === null) ? 0 : freezePoints}}积分冻结中<text class="iconfont iconzhuanzishuoming point-icon" @click="showDialog()"></text></p>
        </div>
        <!--积分明细-->
        <div class="point-detail">
            <ul class="point-title clearfix" :class="{'single' : isIntegration === false}">
                <li class="detail">明细</li>
                <li class="amount">积分</li>
                <li class="final">操作后积分</li>
                <li class="source" v-if="isIntegration">来源账号</li>
            </ul>
        </div>
        <!--fixed栏-->
        <!--<div class="point-detail fixed" id="fixed-bar">-->
            <!--<ul class="point-title clearfix" :class="{'single' : isIntegration === false}">-->
                <!--<li class="detail">明细</li>-->
                <!--<li class="amount">积分</li>-->
                <!--<li class="final">操作后积分</li>-->
                <!--<li class="source" v-if="isIntegration">来源账号</li>-->
            <!--</ul>-->
        <!--</div>-->

        <!--积分明细列表 begin-->
        <div>
            <div v-for="(year,index) in yearList" v-if="yearList.length > 0" :key="index">
                <div class="point-box">
                    <p class="year-line">{{ year }}</p>
                    <ul class="point-list" v-if="pointList.length > 0">
                        <li :class="[isIntegration ? 'point-item' : 'single']" v-for="(item,cIndex) in pointList" :key="cIndex" v-if="item.purchaseTime === year">
                            <div class="detail"><p>{{ item.poinTypeName }}</p>{{ filter.dateFilter(item.regTime) }}</div>
                            <div :class="['value',{'deduct': (item.pointsStr) < 0}]">{{ filter.removeFix(item.pointsStr) }}</div>
                            <div class="operate">{{ item.finalPoints + item.freezePoints }}</div>
                            <div class="source" v-if="isIntegration && item.vipInfoHdId === vipInfoHdId">当前账户</div>
                            <div class="source" v-if="isIntegration && item.vipInfoHdId !== vipInfoHdId">{{ filter.phoneMask(item.mobilePhone) }}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="empty-content" v-if="yearList.length <= 0 && !loading">
            <p v-if="!loading">暂无积分记录~</p>
        </div>

        <van-toast id="van-toast" />
    </div>
</template>

<script>
    import Toast from 'vant-weapp/dist/toast/toast';
    import { Point, UserService } from "../../../api/service";
    export default {
        name: 'member-point',
        components: {
        },
        config: {
            navigationBarTitleText: "我的积分",
//            enablePullDownRefresh: true
        },
        data() {
            return {
                pageNum: 1,
                pageSize: 15,
                total: 0,
                pointList: [],
                yearList: [],
                finalPoints: 0,
                freezePoints: 0,
                isIntegration: null,
                statusLock: false,
                loading: true,    // 控制loading显示
                finished: false,  // 控制是否加载更多商品
                vipInfoHdId: global.Storage.get('USER_INFO').vipInfoId
            }
        },
        // 小程序 滚动到底部事件
        onReachBottom(){
            this.loadMore();
        },
        onShow() {
            // 获取会员整合的信息
            this.getRelationAccountList();

            // 滚动监听固定导航栏
//            window.onscroll = function() {
//                let fixedBar = document.getElementById("fixed-bar");
//                let domHeight = document.getElementById("point-preview").offsetHeight;
//                let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
//                if (scrollTop >= domHeight) {
//                    fixedBar.style.top = '0';
//                }
//
//                if (scrollTop < domHeight) {
//                    fixedBar.style.top = '-150px';
//                }
//            }
        },
        onUnload() {
            Object.assign(this.$data, this.$options.data());// 解决重复进页面数据未初始化
        },
        onHide(){
            Object.assign(this.$data, this.$options.data());// 解决重复进页面数据未初始化
        },
        methods: {
            // 获取会员整合的信息
            getRelationAccountList() {
                UserService.getRelationAccountList({}).then((res) => {
                    if (res && res.length > 1) {
                        this.isIntegration = true;
                    }else{
                        this.isIntegration = false;
                    }
                }).then(() => {
                    this.getPointDetail();
                    this.getPointList();
                })
            },
            // 获取积分详情
            async getPointDetail() {
                await Point.getPointTotal().then((res) => {
                    this.finalPoints = res.finalPoints;
                    this.freezePoints = res.freezePoints;
                })
            },
            // 获取积分列表
            getPointList() {
                if(this.statusLock) return
                this.statusLock = true
                if(this.finished === true) {
                    Toast('没有更多了~');
                    this.loading = false
                    return
                }

                let params = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                };
                global.showLoading();
                Point.getPointDetailList(params).then((res) => {
                    this.total = res.total;
                    if (res.total > 0){
                        if (res.list.length > 0){
                            res.list.forEach((item) => {
                                let year = item.regTime.substr(0,4);
                                item.purchaseTime = year
                                if (this.yearList.length === 0) {  // 获取时间年限
                                    this.yearList.push(year)
                                }else{
                                    for (let i=0; i<this.yearList.length; i++) {
                                        if (this.yearList[i] !== year){
                                            this.yearList.push(year)
                                        }
                                    }
                                }
                                // 年份去重
                                this.yearList = Array.from(new Set(this.yearList));
                                this.pointList.push(item);
                            })
                        }
                        if(this.pointList.length && this.pointList.length >= this.total) {  // 判断分页是否结束
                            this.finished = true
                            this.loading = false
                        }
                    }else{
                        this.finished = true
                        this.loading = false
                    }
                }).then(() => {
                    global.hideLoading();
                    this.statusLock = false;
                    this.loading = false;
                });
            },
            // 加载更多
            loadMore () {
                if(this.finished === true) {
                    Toast('没有更多了~');
                    return false;
                }
                else{
                    this.pageNum += 1;
                    this.getPointList();
                }
            },
            // 冻结积分弹窗
            showDialog() {
                Toast({
                    message: '冻结积分暂时无法使用，\n订单确认收货后转为可用积分'
                });
            }
        },
        destroyed() {
            // 清空滚动事件
            window.onscroll = null
        }
    }
</script>

<style scoped lang="scss">
    .member-point {
        background: $color-background;
        min-height: 100%;
        .point-preview {
            text-align: center;
            background: $color-white;
            .final-point {
                color: $domaincolor;
                font-size: computed(32);
                padding: computed(40) 0 computed(14) 0;
            }
            .freeze-point {
                color: $text-secondary;
                font-size: computed(20);
                padding-bottom: computed(40);
                .point-icon {
                    margin-left: computed(8);
                }
            }
        }
        .point-detail {
            z-index: 100;
            width: 100%;
            .point-title{
                box-sizing: border-box;
                width: 100%;
                height: computed(88);
                padding: 0 computed(30);
                background: #EDF0F7;
                z-index: 9;
                display: flex;
                justify-content: space-between;
                li{
                    float: left;
                    font-size: computed(28);
                    line-height: computed(88);
                    color: #333333;
                    overflow: hidden;
                    text-align: left;
                    &.detail{
                        width: 20%;
                    }
                    &.amount{
                        width: 16%;
                    }
                    &.final {
                        width: 26%;
                    }
                    &.source{
                        width: 18%;
                    }
                }
                &.single{
                    display: flex;
                    flex-direction: row;
                    li{
                        &.detail {
                            width: 40%;
                        }
                        &.amount{
                            width: 30%;
                        }
                        &.final {
                            width: 22%;
                        }
                    }
                }
            }
            &.fixed {
                position: fixed;
                top: -150px;
            }
        }
        .point-box{
            background: $color-white;
            position: relative;
            margin-bottom: computed(10);
            overflow: hidden;
            .year-line{
                box-sizing: border-box;
                font-size: computed(36);
                line-height: computed(80);
                color: $text-secondary;
                position: relative;
                text-align: center;
                border-bottom: solid computed(1) #E6E6E6;
            }
            .point-list{
                padding: 0 computed(30);
                .point-item{
                    display: flex;
                    height: computed(110);
                    align-items: center;
                    justify-content: space-between;
                    .detail{
                        width: 20%;
                        overflow: hidden;
                        font-size: computed(20);
                        color: $text-secondary;
                        p {
                            margin-bottom: computed(10);
                            font-size: computed(24);
                            color: #0D0E09;
                        }
                    }
                    .value{
                        width: 14%;
                        font-size: computed(24);
                        line-height: computed(28);
                    }
                    .operate {
                        width: 22%;
                        font-size: computed(24);
                        line-height: computed(28);
                        color: #0D0E09;
                    }
                    .source{
                        width: 24%;
                        font-size: computed(24);
                        line-height: computed(28);
                        color: #0D0E09;
                    }
                }
                .single{
                    display: flex;
                    height: computed(110);
                    align-items: center;
                    justify-content: space-between;
                    .detail{
                        width: 30%;
                        overflow: hidden;
                        font-size: computed(20);
                        color: $text-secondary;
                        p {
                            margin-bottom: computed(10);
                            font-size: computed(24);
                            color: #0D0E09;
                        }
                    }
                    .value{
                        width: 20%;
                        font-size: computed(24);
                        line-height: computed(28);
                        color: #0D0E09;
                    }
                    .operate {
                        width: 24%;
                        font-size: computed(24);
                        line-height: computed(28);
                        color: #0D0E09;
                    }
                }
            }
        }
        .empty-content{
            width: 100%;
            text-align: center;
            font-size: computed(30);
            color: #333333;
            line-height: computed(70);
        }
    }
    .deduct {
        color: $domaincolor!important;
    }
    /deep/.van-toast {
        text-align: center;
    }
</style>
