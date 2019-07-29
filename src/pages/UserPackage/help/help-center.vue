/*
* createTime：2018/11/2
* author：lin.xie
* description: 帮助中心(文章列表)
*/
<template>
    <div class="help-center">
        <wxs module="filter" src="../../../filter/filterCommon.wxs"></wxs>
        <div class="search-box">
            <form @submit.prevent action="javascript:return true">
                <text class="iconfont iconsousuoxiao"></text>
                <!-- 微信昵称 -->
                <van-field
                    class="search-name"
                    v-model="keyWords"
                    placeholder="搜索"
                    @confirm="searchHandel"
                    type="search"
                    clearable
                />
                <!-- v-inputfix -->
            </form>
        </div>
        <div class="article-list">
            <p class="title">常见问题</p>
            <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100"> -->
                <ul class="list clearfix" v-if="articleList.length >0">
                    <li class="article-item" v-for="(item,index) in articleList" :key="index"  @click="routeLink(item.id)">
                        <div class="cover">
                            <img :src="filter.imgFilter(item.fileUrl,company_id)" :key="item.fileUrl" lazy-load="true">
                        </div>
                        <div class="content">
                            <p class="article-title">{{item.title}}</p>
                        </div>
                    </li>
                </ul>
                <div class="list-empty" v-if="articleList.length<=0 && !isLoading">
                    <empty :emptyText="emptyText"></empty>
                </div>
            <!-- </van-pull-refresh> -->
        </div>
    </div>
</template>
<script>
    import { Salon } from '../../../api/service'
    import Empty from '@/components/EmptyContent.vue'
    export default {
        config: {
            navigationBarTitleText: "客服与帮助",
            enablePullDownRefresh: true,
            "backgroundTextStyle": "dark"
        },
        components: {
            'empty': Empty,
        },
        data() {
            return {
                keyWords: '',  // 文章关键词
                articleList: [],  // 文章列表
                loading: false,    // 是否处于加载更多
                isLoading: true,  // 是否处于上拉刷新状态
                finished: true,  // 控制是否允许加载更多商品
                emptyText: '暂无更多~',
                pageNo: 1,
                pageSize: 10,
                showEmpty: null,
                company_id:""
            }
        },
        onShow(){
            this.company_id = global.Storage.get("COMPANYID").company_id;
            this.getList()
            setTimeout(() => {
                this.$nextTick(() => {
                    wx.pageScrollTo({
                        scrollTop: 0,
                        duration: 300
                    })
                })
            },100)
        },
        onUnload(){
            Object.assign(this.$data, this.$options.data())
        },
        //下拉刷新
        onPullDownRefresh: function() {
            this.onRefresh();
            //模拟加载
            setTimeout(function() {
                wx.stopPullDownRefresh(); //停止下拉刷新
            }, 1500);
        },
        methods: {
            //  获取线下沙龙列表
            getList () {
              let data = {
                  title: !!this.keyWords ? this.keyWords : null,
                  pageNum: 0,
                  pageSize: 0,
                  effFlag: 1,
                  seqType: 0,
                  busContsCode: global.baseConstant.busContsCode
              }
              this.isLoading = true
              Salon.getList(data).then((res) =>{
                  this.articleList = res.filter((item) => {
                      return item.articleCatCode !== 'fxsbm'
                  })
                  this.isLoading = false
              },()=>{
                  this.isLoading = false
              })
            },

            //  下拉刷新
            onRefresh() {
                this.getList()
            },

            //  加载更多
            loadMore () {
                if(this.finished === true) {
                    global.Toast('没有更多了~')
                    return
                }else{
                    this.pageNo += 1
                    this.getList()
                }
            },

            //  监听软键盘搜索的事件
            searchHandel(event){
                // if (event.keyCode == 13) {
                    // console.log(event)
                    // event.preventDefault(); //禁止默认事件（默认是换行）
                    this.keyWords = event.mp.detail;
                    this.onRefresh();
                // }
            },

            //  路由跳转
            routeLink(id) {
                this.$router.push('/pages/UserPackage/help/article-detail?id=' + id)
            },
        },
    }
</script>

<style scoped lang="scss" type="text/scss">
    .help-center {
        display: flex;
        width: 100%;
        min-height: 100vh;
        padding-top: computed(106);
        box-sizing: border-box;
        background: $color-white;
        position: relative;
        .search-box{
            box-sizing: border-box;
            width: 100%;
            height: computed(106);
            overflow: hidden;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10;
            background: $color-white;
            border: solid computed(1) $color-background;
            .iconsousuoxiao {
                display: block;
                position: absolute;
                top: computed(42);
                left: computed(46);
                font-size: $font-num;
                line-height: $font-num;
                color: $text-primary;
                z-index: 5;
            }
            .search-name{
                z-index: 4;
                box-sizing: border-box;
                display: block;
                width: auto;
                height: computed(58);
                margin: computed(24) computed(30);
                padding: 0 computed(24) 0 computed(48);
                background: $color-background;
                font-size: $font-common;
                line-height: computed(58);
                color: $text-primary;
                -webkit-border-radius: computed(58);
                -moz-border-radius: computed(58);
                border-radius: computed(58);
                &::placeholder {
                    color: $text-placeholder;
                }
            }
        }
        .article-list{
            width: 100%;
            display: flex;
            flex: 1;
            flex-direction: column;
            padding: computed(30);
            box-sizing: border-box;
            .title{
                font-size: $font-title1;
                line-height: 1;
                color: $text-regular;
            }
            .list{
                flex: 1;
                position: relative;
                .article-item{
                    width: 50%;
                    height: computed(138);
                    float: left;
                    display: flex;
                    align-items: center;
                    position: relative;
                    &:nth-of-type(2n+1){
                        &::after{
                            content: '';
                            width: computed(690);
                            height: 1px;
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            background: $color-background;
                        }
                    }
                    .cover{
                        width: computed(100);
                        height: computed(100);
                        overflow: hidden;
                        img{
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .content{
                        flex: 1;
                        overflow: hidden;
                        margin-left: computed(18);
                        .article-title{
                            word-break: keep-all;
                            height: $font-h1;
                            font-size: $font-title1;
                            line-height: $font-h1;
                            color: $color-black;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .article-desc{
                            word-break: keep-all;
                            margin-top: computed(20);
                            height: $font-common;
                            font-size: $font-common;
                            line-height: $font-common;
                            color: $text-secondary;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }
            }
            .list-empty{
                min-height: calc(100% - #{computed(300)});
                display: flex;
                flex: 1;
            }
        }
    }
</style>
<style lang=scss>
    .help-center{
        .van-cell{
            background-color: transparent;
            padding:0px;
        }
        .van-field__body{
            height: computed(58);
            line-height: computed(58);
        }
    }
</style>
