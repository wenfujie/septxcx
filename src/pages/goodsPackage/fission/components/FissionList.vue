/*
* createTime：2019/9/23
* author：junyong.hong
* description: 通用：拼团、秒杀列表

goodsList需遵循如下数据格式：
    [
        {
            img: "图片",
            title: "商品名称",
            progressTitle: "进度条标题",
            people: "人团",
            joinPeople: "已参团人数",
            delPrice: "吊牌价",
            salePrice: "销售价",
            time: "时间戳 int类型",
            goodsCode:"商品货号"
            status: "按钮状态",
            func: "按钮方法回调",
            id: '拼团id',
            onlineHdId: '线上促销信息id',
            currentTime: '当前时间'
        },
        ...
    ]
*/
<template>
    <div class="goods-list ">
        <wxs module="filter" src="../../../../filter/filterCommon.wxs"></wxs>

        <ul>
            <li v-for="(item, index) in goodsList" :key="index" @click="navigate(item)">
                <div class="list-img">
                    <img :src="filter.imgFilter(item.img, company_id, '210*210')" />
                    <!-- 已售罄图标显示 -->
                    <span class="sale-none-tip" v-if="item.status==='unBuy'||item.status === 'unStockFn'">已售罄</span>
                    <span class="sale-none-tip" v-else-if="item.status === 'unStockAndhasGroupFn'">拼团成功</span>
                </div>
                <div class="list-container">
                    <p class="title">{{item.title}}</p>
                    <div class="info">
                        <div class="info-left">
                            <p class="people" v-if="fissionType==2">{{item.people}}人团</p>
                            <!-- 进度条 -->
                            <p class="progress">
                                <Progress :proContent="item.progressTitle"
                                          :percent="(item.joinPeople / item.people) * 100"
                                          :proBackColor="item.status === 'unStockFn' || item.status==='unBuy' || item.status === 'unStockAndhasGroupFn'? '#CCCCCC' : '#FFEDE6'"
                                          :proColor="item.status === 'unStockFn' || item.status==='unBuy' || item.status === 'unStockAndhasGroupFn' ? '#CCCCCC' : '#FF3636'"></Progress>
                            </p>

                            <del class="del-price" :style="{marginTop:fissionType==2?'':'50rpx'}">￥{{filter.Fix2(item.delPrice)}}</del>
                            <p class="price">￥{{filter.Fix2(item.salePrice)}}</p>
                        </div>
                        <div class="info-right">
                            <!-- 倒计时 -->
                            <div class="count-down">
                                <count-down
                                    v-if="item.status !== 'unStockFn' || item.status !== 'unStockAndhasGroupFn'"
                                    :spreadServerTime="item.currentTime"
                                    :targetTime="item.time"
                                    :title="item.status === 'waitStartFn' || item.status==='startReady' ? '距开始' : '距结束'"
                                    :key="index"
                                    @over="timeOver(item,index)"></count-down>
                            </div>

                            <div class="group-btn">
                                <!-- 拼团按钮 begin -->
                                <!-- hasGroupFn 已参团（已付款） -->
                                <!-- payforFn 已参团（未付款） -->
                                <div class="red-btn"
                                     v-if="item.status === 'hasGroupFn' || item.status === 'payforFn'"
                                     @click.stop="item.func(item, index)">
                                    已参团
                                </div>

                                <!-- 已售罄，并且付款了 -->
                                <div class="gray-btn"
                                     v-if="item.status === 'unStockAndhasGroupFn'"
                                     @click.stop="item.func(item, index)">
                                    已参团
                                </div>

                                <!-- groupFn 未参团 -->
                                <div class="white-btn"
                                     v-if="item.status === 'groupFn'"
                                     @click.stop="item.func(item, index)">
                                    参团
                                </div>

                                <!-- waitStartFn 待开始 -->
                                <div class="white-btn"
                                     v-if="item.status === 'waitStartFn'"
                                     @click.stop="item.func(item, index)">
                                    待开始
                                </div>

                                <!-- 已经售罄 -->
                                <div class="gray-btn"
                                     v-if="item.status === 'unStockFn'"
                                     @click.stop="item.func(item, index)">
                                    参团
                                </div>
                                <!-- 拼团按钮 end -->
                                <!-- 秒杀按钮 begin -->
                                <!-- 进行中可抢购 -->
                                <div class="red-btn"
                                     v-if="item.status === 'goBuy'"
                                     @click.stop="item.func(item, index)">
                                    去抢购
                                </div>
                                <!-- 进行中已售窑 -->
                                <div class="gray-btn"
                                     v-if="item.status === 'unBuy'"
                                     @click.stop="item.func(item, index)">
                                    去抢购
                                </div>
                                <!-- 待开始 -->
                                <div class="gray-btn"
                                     v-if="item.status === 'startReady'"
                                     @click.stop="item.func(item, index)">
                                    待开始
                                </div>
                                <!-- 秒杀按钮 end -->
                            </div>
                        </div>
                    </div>
                </div>
            </li>

            <div v-if="!goodsList.length" class="empty">
                <empty :emptyText="'暂无商品参与活动'"></empty>
            </div>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    import CountDown from "@/pages/goodsPackage/fission/components/CountDown.vue";
    import Progress from "@/pages/goodsPackage/fission/components/Progress.vue";
    import Empty from '@/components/EmptyContent.vue';

    export default {
        props: {
            // 列表数据
            goodsList: {
                type: String,
                default: ''
            },
            // 类型 1秒杀 2拼团
            fissionType: {
                type: Number,
                default: 1
            }
        },
        components: {
            CountDown,
            Progress,
            Empty
        },
        data() {
            return {
                company_id: global.Storage.get("COMPANYID").company_id
            };
        },
        methods: {
            /**
             * 倒计时结束事件
             * @param item
             * @param index
             */
            timeOver(item, index) {
                this.goodsList.splice(index, 1)
            },
            /**
             * 路由导航
             * @param item
             */
            navigate(item) {
                let url = ''

                if (this.fissionType === 2 && item.billCode) {
                    url = `/pages/goodsPackage/fission/assemble/assemble-record`
                } else {
                    url = `/pages/goodsPackage/wares/wares-detail?goodsCode=${item.goodsCode}&onlineHdId=${item.onlineHdId}&fissionType=${this.fissionType}`
                }

                this.$router.push(url);
            },
        },
        watch: {}
    };
</script>
<style lang="scss" type="text/scss" scoped>
    .goods-list {
        ul {
            li {
                display: flex;
                flex-direction: row;
                padding-bottom: computed(30);
                margin: computed(30) computed(30) 0 computed(30);
                border-bottom: 1px solid $color-gray-border;
                .list-img {
                    width: computed(220);
                    height: computed(220);
                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: computed(5);
                        position: relative;
                    }
                    .sale-none-tip{
                        display: inline-block;
                        position: absolute;
                        margin-left:computed(-220);
                        margin-top:computed(180);
                        width:computed(220);
                        height:computed(40);
                        background:rgba(0,0,0,0.36);
                        text-align: center;
                        color:$color-white;
                        font-size: $font-common;
                    }
                }
                .list-container {
                    flex: 1;
                    margin-left: computed(31);
                    max-width: computed(419);

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
                            .del-price {
                                font-size: $font-common;
                                color: $text-placeholder;
                                text-decoration: line-through;
                                margin-top: computed(25);
                            }
                            .price {
                                font-size: $font-h2;
                                font-weight: 600;
                                margin: computed(5) 0 0 computed(-5);
                                color: $domaincolor;
                            }
                        }
                        .info-right {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            margin-left: computed(32);
                            .count-down {
                                flex: 1;
                                margin-top: computed(34);

                            }
                            .group-btn {
                                height: computed(60);
                                width: computed(168);
                                line-height: computed(60);
                                font-size: $font-regular;
                                color: white;
                                font-weight: 600;
                                border-radius: 30px;
                                text-align: center;
                                > div {
                                    height: 100%;
                                    border-radius: computed(30);
                                }
                                .red-btn {
                                    background: linear-gradient(
                                            90deg,
                                            rgba(255, 54, 54, 1),
                                            rgba(255, 99, 42, 1)
                                    );
                                    box-shadow: 0 computed(6) computed(17) 0 rgba(255, 95, 43, 0.3);
                                }
                                .white-btn {
                                    background-color: $color-white;
                                    color: $domaincolor !important;
                                    border: 1px solid $domaincolor;
                                }
                                .gray-btn {
                                    background-color: $text-placeholder;
                                }
                            }
                        }
                    }
                }
            }
            .empty {
                margin-top: computed(277);
                text-align: center;
                > img {
                    width: computed(300);
                    height: computed(300);
                }
                > p {
                    margin-top: computed(23);
                    font-size: $font-common;
                    color: $text-secondary;
                }
            }
        }
    }
</style>
