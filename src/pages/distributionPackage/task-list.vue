/*
* createTime：2019/3/8
* author：en.chen
* description:  我的任务列表
*/
<template>
    <div class="task-content">

        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>

        <!-- 广告轮播 begin -->
        <div class="banner-box" v-if="bannerList.length>0">
            <swiper indicator-dots="true" autoplay="true" interval="3000" class="swiper" :indicator-dots="showDots">
                <block v-for="(item,index) in bannerList" :key="index">
                    <swiper-item>
                        <img
                            :src="filter.imgFilter(item,company_id, '710*262')"
                            :key="item.coverFileUrl"
                            class="index-banner-img"
                            lazy-load="true"

                        >
                    </swiper-item>
                </block>
            </swiper>
        </div>
        <!-- 广告轮播 end -->

        <!-- 任务列表 begin -->
        <div class="task-list">
            <div>
                <ul class="list" v-if="taskList.length>0" ref="list">
                    <li class="item-content" v-for="item in taskList" :key="item.id" @click="goDetail(item.id)">
                        <!-- 封面 -->
                        <div class="fl mgR30">
                            <div class="item-cover">
                                <img :src="filter.imgFilter(item.fileUrl,company_id)" :key="item.fileUrl"
                                     lazy-load="true" >
                            </div>
                        </div>

                        <!-- 详情 -->
                        <div class="fl goods-detail">
                            <h2 class="item-name item-txt">{{item.goodsName || item.taskName}}</h2>
                            <p class="item-context item-txt">{{item.saleContent || ''}}</p>
                            <p class="price">
                                ￥{{filter.Fix2(item.salePrice) || 0.00}}
                                <span class="tag-price" v-if="!!item.trgPrice">￥{{filter.Fix2(item.trgPrice)}}</span>
                            </p>
                            <div class="profit">
                                <i class="iconfont iconzhuanduoshao"></i>
                                赚
                                <span class="mini">￥</span>
                                {{filter.Fix2(item.benefitAmount)}}
                            </div>
                            <div class="detail-btn">点击查看</div>
                        </div>
                    </li>
                </ul>
                <div class="fund-empty" v-if="taskList.length<=0 && !loading">
                    <empty :emptyText="emptyText"></empty>
                </div>
            </div>
        </div>
        <!-- 任务列表 end -->

        <van-toast id="van-toast"/>

    </div>
</template>
<script>
    // import { Toast, PullRefresh } from 'vant'
    import {Distribution, Cms} from '../../api/service'
    import Empty from '../../components/EmptyContent.vue'

    export default {
        config: {
            navigationBarTitleText: "我的任务",
            enablePullDownRefresh: true
        },
        components: {
            'empty': Empty,
            // 'van-pull-refresh': PullRefresh,
        },
        // 小程序 下拉刷新事件
        onPullDownRefresh() {
            this.onRefresh();
        },
        data() {
            return {
                tabMenu: [  // 标签菜单
                    {
                        title: '进行中',
                        value: 1,
                    },
                    {
                        title: '已结束',
                        value: 0,
                    }
                ],
                activeIndex: 1,  // 选中的标签
                loading: false,  // 是否处于加载中
                isLoading: false,  // 是否处于上拉刷新状态
                taskList: [],  // 下级会员对账单列表
                emptyText: '暂无数据~',
                canRefresh: false,
                bannerList: [],
                company_id: global.Storage.get('COMPANYID').company_id,
                showDots: false
            }
        },
        methods: {
            //  切换tab标签
            tabHandle(index) {
                if (this.activeIndex === index) return
                this.activeIndex = index
                this.getList()
            },

            //  获取分销商任务列表
            getList() {
                this.loading = true
                let data = {
                    dateFlag: this.activeIndex,
                    busContsCode: !!global.baseConstant.busContsCode ? global.baseConstant.busContsCode : global.Storage.get('properties').busContsCode,
                    shopId: global.Storage.get('properties').shopId
                }
                Distribution.getTaskList(data).then((res) => {
                    if (!!res.length && res.length > 0) {
                        res.forEach((item) => {
                            item.contentText = item.contentText.match("<p.*?>([\\s\\S]*)</p>")[0].replace("<p>", "")
                                .replace("</p>", "")
                                .trim();
                        })
                    }
                    this.taskList = res
                    this.loading = false
                    this.isLoading = false
                    global.toastLoading(false);// 关闭
                    wx.stopPullDownRefresh();
                }, () => {
                    this.loading = false
                    this.isLoading = false
                })
            },

            //  将所有未读任务置为已读
            readTask() {
                let data = {
                    vipInfoHdId: global.Storage.get('USER_INFO').vipInfoId
                }

                //  会员整合新增选中分销商查询
                if(!!this.$store.state.distribution.accountInfo.id) {
                    data.vipInfoHdId = this.$store.state.distribution.accountInfo.vipInfoHdId
                }

                Distribution.readTask(data).then((res) => {})
            },

            //  下拉刷新
            onRefresh() {
                this.statusInit()
                this.getList()
                this.getBanner()
            },

            //  状态初始化
            statusInit() {
                this.pageNum = 1
                this.taskList = []
                this.bannerList = []
                this.finished = false
                this.loading = false
            },

            //  跳转任务详情
            goDetail(id) {
                this.$router.push(`/pages/distributionPackage/task-detail?taskId=${id}`)
            },

            //  获取任务页广告图
            getBanner() {
                let data = {
                    cmsTemplateCode: global.Storage.get("TEMPLATE_INFO").cmsTemplateCode,
                    cmsWebCode: global.pageCode.distribution.children.task.name,
                    busContsCode: !!global.baseConstant.busContsCode ? global.baseConstant.busContsCode : global.Storage.get('properties').busContsCode
                }
                Cms.getUsrCmsInfoV2(data).then((res) => {
                    if (res.cmsModulepageHdList.length > 0 && !!res.cmsModulepageHdList[0] && !!res.cmsModulepageHdList[0].cmsBackpageDtDtoList && !!res.cmsModulepageHdList[0].cmsBackpageDtDtoList.length > 0) {
                        let list = res.cmsModulepageHdList[0].cmsBackpageDtDtoList
                        list.forEach((item) => {
                            if (item.cmsBackpageDtCode === global.pageCode.distribution.children.task.code) {
                                if (!!item.cmsBackpageDttList && !!item.cmsBackpageDttList.length > 0) {
                                    item.cmsBackpageDttList.forEach((image) => {
                                        this.bannerList.push(image.coverFileUrl)
                                    })
                                }
                            }
                        })
                        if(this.bannerList.length>1) {
                            this.showDots = true
                        }else{
                            this.showDots = false
                        }
                    }
                })
            }

        },
        onLoad() {
            global.toastLoading();// 开启
            this.getList()
            this.getBanner()
            this.readTask()
        },
        onUnload() {
            Object.assign(this.$data, this.$options.data());
        },
        mounted() {
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
    .task-content {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        min-height: 100%;
        background: $color-border;
        -webkit-overflow-scrolling: touch;
        .task-list {
            display: flex;
            flex-direction: column;
            position: relative;
            .list {
                .item-content {
                    box-sizing: border-box;
                    height: computed(300);
                    margin: computed(20);
                    padding: computed(30);
                    position: relative;
                    overflow: hidden;
                    border-bottom: solid 1px $text-placeholder;
                    background: $color-white;
                    .item-cover {
                        width: computed(240);
                        height: computed(240);
                        overflow: hidden;
                        box-shadow: 0 computed(10) computed(30) 0 rgba(69,69,69,0.2);
                        -webkit-border-radius: computed(10);
                        -moz-border-radius: computed(10);
                        border-radius: computed(10);
                        img {
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .goods-detail {
                        width: computed(380);
                        height: computed(240);
                        position: relative;
                        .item-txt {
                            max-width: computed(380);
                            max-height: computed(50);
                            word-break: break-all;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                        }
                        .item-name {
                            box-sizing: border-box;
                            font-size: $font-h2;
                            color: $text-primary;
                            line-height: computed(56);
                            border-bottom: solid 1px $color-border;
                            -webkit-line-clamp: 1 !important;
                        }
                        .item-context {
                            margin-top: computed(18);
                            font-size: $font-common;
                            line-height: $font-num;
                            color: $text-placeholder;
                        }
                        .price {
                            margin-top: computed(18);
                            font-size: $font-h1;
                            line-height: computed(38);
                            vertical-align: text-bottom;
                            color: $color-red;
                            font-weight: bold;
                            .tag-price {
                                font-size: $font-small;
                                line-height: computed(38);
                                font-weight: normal;
                                color: $text-placeholder;
                                vertical-align: text-bottom;
                                text-decoration: line-through;
                            }
                        }
                        .profit {
                            margin-top: computed(16);
                            width: computed(144);
                            height: computed(32);
                            -webkit-border-radius: computed(32);
                            -moz-border-radius: computed(32);
                            border-radius: computed(32);
                            font-size: $font-small;
                            line-height: computed(32);
                            color: $color-red;
                            text-align: center;
                            background: #FAEDE7;
                            .mini {
                                font-size: $font-mini;
                            }
                            .iconzhuanduoshao{
                                font-size: $font-common;
                                display: inline;
                            }
                        }
                        .detail-btn {
                            width: computed(168);
                            height: computed(60);
                            -webkit-border-radius: computed(60);
                            -moz-border-radius: computed(60);
                            border-radius: computed(60);
                            background: $bggradientcolor;
                            font-size: $font-regular;
                            line-height: computed(60);
                            color: $color-white;
                            text-align: center;
                            box-shadow: 0 computed(6) computed(17) 0 rgba(255, 95, 43, 0.3);
                            position: absolute;
                            bottom: 0;
                            right: 0;
                        }

                    }
                }
            }
        }
        .fund-empty {
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .banner-box {
            margin: computed(20);
            height: computed(262);
            color: white;
            .swiper {
                height: 100%;
                .index-banner-img {
                    height: 100%;
                    width: 100%;
                }
            }
        }
    }

    @keyframes line-animation {
        from {
            width: computed(10);
        }
        to {
            width: computed(100);
        }
    }
</style>
