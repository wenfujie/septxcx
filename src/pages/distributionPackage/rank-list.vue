/*
* createTime：2019/3/7
* author：en.chen
* description:  分润排行版
*/
<template>
    <div class="rank-list-box">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>
        <!-- 筛选条件及列表表头 begin -->
        <div class="top-content">
            <form @submit.prevent action="javascript:return true">
                <!-- 微信昵称 -->
                <van-field
                        class="nickName"
                        :value="nickName"
                        type="search"
                        placeholder="请输入微信昵称"
                        @blur="searchHandel"
                        @change="fieldChange('nickName',$event)"
                        clearable
                />
            </form>
            <!-- 筛选类型 -->
            <div class="sort-box clearfix">
                <label>筛选排序</label>
                <van-radio-group :value="sort" class="radio-box fl" @change="fieldChange('sort',$event)">
                    <van-radio class="fl radio" name ='1'>下级人数</van-radio>
                    <van-radio class="fl radio" name ='0'>分润金额</van-radio>
                </van-radio-group>
            </div>
            <!-- 分润列表表头 -->
            <div class="rank-list list-head">
                <div class="list-item">名次</div>
                <div class="list-item">微信昵称</div>
                <div class="list-item">下级人数</div>
                <div class="list-item">分润金额</div>
            </div>
        </div>
        <!-- 筛选条件及列表表头 begin -->

        <!-- 分润排行榜 begin -->
        <div class="rank-content">
            <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100">
                <van-list
                        v-model="loading"
                        :finished="finished"
                        @load="loadMore"
                        :offset="100"
                >
                    <ul class="rank-content-list" v-if="rankList.length>0">
                        <li class="rank-list" v-for="(item,index) in rankList" :key="item.id">
                            <div class="list-item">{{index + 1}}</div>
                            <div class="list-item">{{item.nickName || '匿名用户'}}</div>
                            <div class="list-item">{{item.allUnMdtNum}}</div>
                            <div class="list-item">{{item.totalAmount | Fix2}}</div>
                        </li>
                    </ul>
                </van-list>
                <div class="fund-empty" v-show="rankList.length<=0 && !loading && !isLoading">
                    <empty :emptyText="emptyText"></empty>
                </div>
            </van-pull-refresh> -->

            <div>
                <div>
                    <ul class="rank-content-list" v-if="rankList.length>0">
                        <li class="rank-list" v-for="(item,index) in rankList" :key="item.id">
                            <div class="list-item">{{index + 1}}</div>
                            <div class="list-item">{{item.nickName || '匿名用户'}}</div>
                            <div class="list-item">{{item.allUnMdtNum}}</div>
                            <div class="list-item">{{filter.Fix2(item.totalAmount)}}</div>
                        </li>
                    </ul>
                </div>
                <div class="fund-empty" v-if="rankList.length<=0 && !loading && !isLoading">
                    <empty :emptyText="emptyText"></empty>
                </div>
            </div>
        </div>
        <!-- 分润排行榜 end -->

        <van-toast id="van-toast" />
    </div>
</template>
<script>
    // import { Field, Toast, PullRefresh, List, RadioGroup, Radio } from 'vant'
    import { Distribution } from '../../api/service'
    import Empty from '@/components/EmptyContent.vue'
    import Toast from 'vant-weapp/dist/toast/toast';

    export default {
        config: {
            navigationBarTitleText: "分润排名",
            enablePullDownRefresh: true
        },
        // 小程序 滚动到底部事件
        onReachBottom(){
            this.loadMore();
        },
        // 小程序 下拉刷新事件
        onPullDownRefresh(){
            this.onRefresh();
        },
        components: {
            // 'van-field': Field,
            'empty': Empty,
            // 'van-pull-refresh': PullRefresh,
            // 'van-list': List,
            // 'van-radio-group': RadioGroup,
            // 'van-radio': Radio
        },
        data() {
            return {
                nickName: null, // 微信昵称（筛选条件）
                sort: '1',  // 筛选排序条件
                loading: false,    // 是否处于加载更多
                isLoading: false,  // 是否处于上拉刷新状态
                finished: true,  // 控制上拉加载更多的结束状态
                rankList: [],  // 下级会员对账单列表
                billInfo: {},  // 次级会员对账单列表
                pageNum: 1,
                pageSize: 10,
                emptyText: '暂无数据~',
            }
        },
        methods: {
            handleBlur(){
                // setTimeout(()=>{
                //     this.$nextTick(() => {
                //         window.scrollTo(0, 1)
                //     })
                // }, 0)
            },
            // field组件change事件
            fieldChange(key,event){
                this[key] = event.mp.detail;
                // 切换筛选排序radio时触发
                if(key === 'sort'){
                    this.onRefresh();
                }
            },
            //  获取分润排行榜
            async getList() {
                let data = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    id: await this.$store.dispatch('distribution/getDistributionId'),
                    ordFlag: parseInt(this.sort),
                    nickName:  this.nickName,
                }

                //  会员整合新增选中分销商查询
                if(!!this.$store.state.distribution.accountInfo.id) {
                    data.id = this.$store.state.distribution.accountInfo.id
                    data.vipInfoHdId = this.$store.state.distribution.accountInfo.vipInfoHdId
                }

                Distribution.getRankList(data).then((res) => {
                    this.rankList.push.apply(this.rankList,res.list)
                    if(this.rankList.length >= res.total ||  res.total <= 0) {
                        this.finished = true
                    }else{
                        this.finished = false
                    }
                    global.toastLoading(false);// 关闭
                    wx.stopPullDownRefresh();
                    this.loading = false
                    this.isLoading = false
                },() => {
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

            //  监听软键盘搜索的事件
            searchHandel(event){
                // if (event.keyCode == 'enter') {
                    event.preventDefault();
                    this.nickName = event.target.value;
                    this.onRefresh();
                // }
            },

            //  状态初始化
            statusInit() {
                this.pageNum = 1
                this.rankList = []
                this.finished = true
                this.loading = false
            },
        },
        onLoad() {
            global.toastLoading();// 开启

            this.getList()
        },
        onUnload(){
            Object.assign(this.$data, this.$options.data());// 解决重复进页面数据未初始化
        },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
    .rank-list-box{
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding-top: computed(300);
        min-height: 100%;
        position: relative;
        overflow: scroll;
        background: $color-white;
        .sort-box{
            display: flex;
            align-items: center;
            .radio-box{
                height: 100%;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .top-content{
            box-sizing: border-box;
            width: 100%;
            height: computed(300);
            position: fixed;
            top: 0;
            left: 0;
            background: $color-white;
            overflow: hidden;
            z-index: 99;
            .nickName{
                display: block;
                box-sizing: border-box;
                width: auto;
                margin: computed(30);
                padding: computed(15) computed(10);
                font-size: $font-common;
                line-height: computed(40);
                color: $text-primary;
                background: $color-background;
                -webkit-border-radius: computed(5);
                -moz-border-radius: computed(5);
                border-radius: computed(5);
                &::placeholder{
                    color: $text-placeholder;
                }
                .van-icon{
                    font-size: $font-common;
                    line-height: 1;
                }
            }
            .sort-box{
                background: $color-white;
                box-sizing: border-box;
                height: computed(90);
                padding: 0 computed(30);
                border-top: solid 1px $text-placeholder;
                overflow: hidden;
                label{
                    float: left;
                    font-size: $font-regular;
                    line-height: computed(90);
                    font-weight: bold;
                    color: $text-primary;
                }
            }
        }
        .rank-content{
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            flex: 1;
        }
        .rank-list{
            box-sizing: border-box;
            display: flex;
            padding: 0 computed(30);
            min-height: computed(90);
            .list-item{
                box-sizing: border-box;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: $font-regular;
                line-height: computed(30);
                padding: computed(5);
                word-break: break-all;
            }
            &.list-head{
                background: $color-background;
                .list-item{
                    color: $text-primary;
                }
            }
            &:nth-of-type(2n) {
                background: $color-background;
            }
        }
        .fund-empty{
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .rank-content-list{
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .van-radio__icon--checked{
            background-color: $maincolor !important;
            border-color: $maincolor !important;
        }
    }
</style>
