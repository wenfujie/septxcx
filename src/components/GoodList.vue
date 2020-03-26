/*
* createTime：2019/7/22
* author：fujie.wen
* description: 商品列表
*/
<template>
    <div class="goods-main">
        <wxs module="filter" src="../filter/filterCommon.wxs"></wxs>
        <ul class="goods-list">
            <li class="goods-item"
                v-for="(item, index) in goodsList"
                :key="index"
            >
                <div
                    @click="goDetail(item)"
                    class="goods-main-item">
                    <img :src="filter.imgFilter(item.goodsFilePath,company_id, '345*345')" lazy-load="true">
                    <div class="goods-main-item__info">
                        <div class="goods-main-item__describe">{{item.goodsName}}</div>
                        <p class="overflow">
                            <span>￥{{filter.Fix2(item.salePrice)}}</span>
                            <text
                                v-if="item.orderFlag != 1 && !!item.tagPrice && item.tagPrice != 0"
                            >￥{{filter.Fix2(item.tagPrice)}}
                            </text>
                        </p>
                    </div>
                    <img :src="filter.imgFilter(item.spmFileUrl,company_id, '60*60')"
                         v-if="item.spmFileUrl"

                         class="goods-main-item__logo"
                         lazy-load="true">
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        components:{},
        props:{
            goodsList:{
                type: Array,
                default:[]
            }
        },
        data() {
            return {
                company_id: "",
            }
        },

        methods: {
            /**
             * 热卖商品跳转到详情页
             * @param item 当前对象
             */
            goDetail(item) {
                if (item.orderFlag === 0) {
                    this.$router.push(
                        "/pages/goodsPackage/wares/wares-detail?goodsCode=" + item.goodsCode
                    );
                } else {
                    this.$router.push("/pages/goods/web-design?goodsCode=" + item.goodsCode);
                }
            },
        },
        created() {
            this.company_id = global.Storage.get("COMPANYID").company_id;

        },
    }
</script>

<style scoped lang="scss">
    .goods-main {
        .goods-list {
            display: flex;
            flex-wrap: wrap;

            .goods-item {
                width: 49%;
                &:nth-child(2n){
                    margin-left: 2%;
                }
                .goods-main-item {
                    margin-bottom: computed(20);
                    box-sizing: border-box;
                    position: relative;
                    border-radius: computed(20);
                    overflow: hidden;
                    background: $color-white;
                    position: relative;
                    width: 100%;
                    .goods-main-item__info{
                        margin: 0 computed(20);
                        .goods-main-item__describe{
                            font-size: $font-regular;
                            width: 100%;
                            white-space:nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            margin-top: computed(10);
                        }
                        > p {
                            margin-top: computed(10);
                            font-size: $font-title1;
                            color: $domaincolor;
                            font-weight: 600;
                            > text {
                                margin-left: computed(20);
                                color: $text-secondary;
                                font-weight: normal;
                                font-size: $font-common;
                                text-decoration: line-through;
                            }
                            &:last-child {
                                margin: computed(10) 0 computed(15) 0;
                            }
                        }
                    }

                    > span {
                        position: absolute;
                        padding: computed(10) computed(40) computed(10) computed(15);
                        background-size: 100% 100%;
                        color: $color-white;
                        font-size: $font-common;
                    }
                    > img {
                        display: block;
                        width: 100%;
                        height: computed(345);
                    }
                    .goods-main-item__logo{
                        position: absolute;
                        top: computed(20);
                        right:computed(20);
                        width:computed(60) !important;
                        height: computed(60) !important;;
                        border-radius: computed(16);
                        overflow: hidden;
                    }
                }
            }

        }
    }
</style>
