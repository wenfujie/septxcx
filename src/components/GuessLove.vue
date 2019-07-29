<!-- 猜你喜欢 -->
<template>
    <div>
        <wxs module="filter" src="../filter/filterCommon.wxs"></wxs>
        <div class="guessLove-title">猜你喜欢</div>
        <div class="guessLove">
            <div class="guessLove-section" v-for="(item,index) in commendList" :key="index" @click="goDetail(item)">
                <div class="imgWrap">
                    <img :src="filter.imgFilter(item.spmFileUrl,company_id)" alt="" class="guessLove-section-label" mode="aspectFit">
                </div>
                
                <img :src="filter.imgFilter(item.picMainUrl,company_id)" alt="" class="guessLove-section-bgurl">
                <div class="guessLove-section-line overflow">{{item.goodsName}}</div>
                <div class="guessLove-section-line">
                    <span class="guessLove-section-priceNow">￥{{filter.Fix2(item.salePrice)}}</span>
                    <span class="guessLove-section-priceBefore">￥{{filter.Fix2(item.tagPrice)}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Goods } from "../api/service";

    export default {
        name: "GuessLove",
        config: {},
        data() {
            return {
                commendList:[],
                company_id:''
            };
        },
        onLoad() {
            this.company_id = global.Storage.get('COMPANYID').company_id
            this.getGoodsRecommend();
        },
        methods: {
            //获取猜你喜欢数据
            getGoodsRecommend(){
                let data={
                    shopDptId: global.Storage.get('USER_INFO').shopId,
                    buscontsCode: global.baseConstant.busContsCode,
                    pageSize:12,
                    page:1,
                }
                Goods.getGoodsRecommendList(data).then((res)=>{
                    this.commendList=res.list;
                })
            },
            //跳到详情页
            goDetail(item){
                this.$router.push(
                    "/pages/goodsPackage/wares/wares-detail?goodsCode=" + item.goodsCode
                );
            },
        },
    };
</script>
<style lang="scss" scoped>
.guessLove-title{
    font-size:$font-h2;
    color:$text-primary;
    text-align: center;
    margin-bottom:computed(24);
    margin-top:computed(36);
    font-weight: 600;
}
.guessLove{
    display: flex;
    flex-wrap: wrap;
    padding: 0 computed(20);
    justify-content: space-between;
    .guessLove-section{
        position:relative;
        width:computed(345);
        background: $color-white;
        border-radius: computed(20);
        margin-bottom: computed(20);
        overflow: hidden;
        .imgWrap{
            display: flex;
            position:absolute;
            top: computed(20);
            left: computed(20);
            height: computed(32);
            max-width:80%;
        }
        .guessLove-section-label{
            display: inline-block;
            width: auto;
            height: 100%;
        }
        .guessLove-section-bgurl{
            width: computed(345);
            height: computed(345);
            margin-bottom: computed(20);
        }
        .guessLove-section-line{
            font-size: $font-regular;
            padding: 0 computed(20) computed(12) computed(20);
            .guessLove-section-priceNow{
                color:$color-red;
                font-size: $font-title1;
                margin-right:computed(10);
            }
            .guessLove-section-priceBefore{
                color:$text-secondary;
                font-size: $font-common;
                text-decoration: line-through;
            }
        }
    }
}
</style>
