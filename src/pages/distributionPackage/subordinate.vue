/*
* createTime：2019/3/6
* author：en.chen
* description:  我的下级
*/
<template>
    <div class="subordinate">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>
        <!--顶部内容 begin-->
        <div class="top-content">
            <!-- 提示 begin -->
            <p class="tip">提示：由于涉及用户隐私问题，您只能看到您直接推广的直属用户</p>
            <!-- 提示 end -->

            <!-- 下级数量统计 begin -->
            <div class="amount-box">
                <div class="amount-item">
                    <h2>{{dirUnMdtNum || 0}}</h2>
                    <p>直属用户量</p>
                </div>
                <div class="amount-item">
                    <h2>{{secUnMdtNum || 0}}</h2>
                    <p>次级用户量</p>
                </div>
            </div>
            <!-- 下级数量统计 end -->
        </div>
        <!-- 顶部内容 end -->
        <!-- 下级列表 begin -->
        <div class="fund-content">
            <div :head-height="100">
                <div>
                    <ul class="fund-list" v-if="memberList.length>0">
                        <li class="fund-item" v-for="item in memberList" :key="item.id">
                            <div class="avatar">
                                <img v-if="!!item.photoFileUrl && item.photoFileUrl.indexOf('https') !== -1" :src="item.photoFileUrl" :key="item.photoFileUrl">
                                <img v-if="!!item.photoFileUrl && item.photoFileUrl.indexOf('https') === -1" :src="filter.imgFilter(item.photoFileUrl,company_id)" :key="item.photoFileUrl">
                                <img v-else="!item.photoFileUrl" :src="filter.imgFilter('',company_id)" @error="errImg($event)" :key="">
                            </div>
                            <div class="mgL20">
                                <p class="memo">{{item.vipName}}</p>
                                <p class="time">注册时间：{{item.crtLog}}</p>
                            </div>
                            <div class="subordinate-box">
                                <p class="amount-text">下级用户量</p>
                                <p class="amount-value">{{item.allUnMdtNum}}</p>
                            </div>
                        </li>
                    </ul>
                    <div class="fund-empty flex-vbox" v-if="memberList.length<=0 && !loading && !isLoading">
                        <empty :emptyText="emptyText"></empty>
                    </div>
                </div>
            </div>
        </div>
        <!-- 下级列表 end -->

        <van-toast id="van-toast" />

    </div>
</template>
<script>
    import Empty from '@/components/EmptyContent.vue'
    import { Distribution } from '../../api/service'
    // import { PullRefresh, List, Toast } from 'vant'
    import Toast from 'vant-weapp/dist/toast/toast';

    export default {
        config:{
            navigationBarTitleText: '我的团队',
            enablePullDownRefresh: true
        },
        components:{
            // 'van-pull-refresh': PullRefresh,
            // 'van-list': List,
            // Toast,
            'empty': Empty
        },
        data() {
            return {
                dirUnMdtNum: null,  // 直属下级量
                secUnMdtNum: null,  // 次级用户量
                loading: false,    // 是否处于加载更多
                isLoading: false,  // 是否处于上拉刷新状态
                finished: true,  // 控制是否允许加载更多商品
                memberList: [],  // 下级会员列表
                pageNum: 1,
                pageSize: 10,
                emptyText: '暂无数据~',
                company_id:'',//公司id
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
            //  获取我的下级列表
            async getList() {
                let data = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    vipId: global.Storage.get('USER_INFO').vipInfoId,
                    busconsCode: global.baseConstant.busContsCode
                }
                Distribution.getSubordinateList(data).then((response) => {
                    this.dirUnMdtNum = response.dirUnMdtNum
                    this.secUnMdtNum = response.secUnMdtNum
                    let res = response.dirUnMdtList
                    this.memberList.push.apply(this.memberList,res.list)
                    if(this.memberList.length >= res.total || res.total <= 0) {
                        this.finished = true
                    }else{
                        this.finished = false
                    }
                    global.toastLoading(false);// 关闭
                    wx.stopPullDownRefresh();
                    this.loading = false
                    this.isLoading = false
                },()=>{
                    this.loading = false
                    this.isLoading = false
                })
            },

            //  下拉刷新
            onRefresh() {
                this.statusInit()
                this.getList()
            },

            //  上拉加载更多
            loadMore() {
                if(!!this.finished) {
                    Toast('没有更多了~')
                    return
                }else{
                    setTimeout(() => {
                        this.pageNum += 1
                        this.getList()
                    },100)
                }
            },

            //  状态初始化
            statusInit() {
                this.pageNum = 1
                this.memberList = []
                this.finished = true
                this.loading = false
            },
        },
        onLoad() {
            global.toastLoading();// 开启

            this.company_id = global.Storage.get('COMPANYID').company_id;
            this.getList()
        },
        onUnload(){
            Object.assign(this.$data, this.$options.data());
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
    .subordinate{
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: $color-background;
        padding-top: computed(300);
        .top-content{
            width: 100%;
            height: computed(300);
            position: fixed;
            top: 0;
            left: 0;
            overflow: hidden;
            z-index: 99;
            background: $color-white;
            .tip{
                font-size: $font-common;
                line-height: 1.2;
                background: $color-white;
                color: $domaincolor;
                padding: computed(15) computed(25);
                box-sizing: border-box;
            }
            .amount-box{
                box-sizing: border-box;
                display: flex;
                margin: computed(30);
                height: computed(160);
                background: $bggradientcolor;
                align-items: center;
                justify-content: center;
                -webkit-border-radius: computed(5);
                -moz-border-radius: computed(5);
                border-radius: computed(5);
                z-index: 9;
                position: relative;
                &::after {
                    content: '';
                    width: computed(4);
                    height: computed(60);
                    background: $text-placeholder;
                    position: absolute;
                    left: 50%;
                    top: computed(50);
                    transform: translateX(-50%);
                }
                .amount-item{
                    flex: 1;
                    text-align: center;
                    h2{
                        font-size: $font-h1;
                        line-height: 1;
                        color: $color-white;
                    }
                    p{
                        font-size: $font-regular;
                        line-height: 1;
                        color: $color-white;
                        margin-top: computed(20);
                    }
                }
            }
        }
        .fund-content{
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: calc(100% - #{computed(220)});
            position: relative;
            z-index: 3;
            .van-list{
                display: flex;
                flex-direction: column;
                flex: 1;
            }
            .fund-list{
                .fund-item{
                    background: $color-white;
                    display: flex;
                    box-sizing: border-box;
                    height: computed(138);
                    padding: 0 computed(30);
                    border-bottom: solid 1px $text-placeholder;
                    align-items: center;
                    position: relative;
                    &:first-of-type{
                        border-top: solid 1px $text-placeholder;
                    }
                    .memo{
                        max-width: computed(400);
                        font-size: $font-h2;
                        line-height: 1;
                        color: $color-black;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .time{
                        margin-top: computed(24);
                        font-size: $font-common;
                        color: $text-secondary;
                        line-height: 1;
                    }
                    .avatar{
                        width: computed(100);
                        height: computed(100);
                        -webkit-border-radius: computed(5);
                        -moz-border-radius: computed(5);
                        border-radius: computed(5);
                        overflow: hidden;
                        img {
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .subordinate-box{
                        position: absolute;
                        top: 50%;
                        right: computed(30);
                        transform: translateY(-50%);
                        .amount-text{
                            font-size: $font-common;
                            line-height: 1;
                            color: $text-regular;
                        }
                        .amount-value{
                            margin-top: computed(24);
                            font-size: $font-h2;
                            line-height: 1;
                            color: $domaincolor;
                            text-align: right;
                            font-weight: bold;
                        }
                    }
                }
            }
        }
        .fund-empty{
            background: $color-background;
            flex: 1;
        }
    }
</style>