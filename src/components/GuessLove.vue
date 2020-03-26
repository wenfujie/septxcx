<!--
 * @Author: lan.chen
 * @Date: 2019-07-29 19:28:18
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-08-12 13:14:30
 * @Description:
 -->
<!-- 猜你喜欢 -->
<template>
    <div v-if="commendList.length!=0">
        <wxs module="filter" src="../filter/filterCommon.wxs"></wxs>
        <div class="guessLove-title">猜你喜欢</div>
        <div class="guessLove">
            <div
                class="guessLove-section"
                v-for="(item,index) in commendList"
                :key="index"
                @click="goDetail(item)"
            >
                <img
                    :src="!!item.spmFileUrl?filter.imgFilter(item.spmFileUrl,company_id, '60*60'):''"
                    alt
                    class="imgWrap"
                />
                <img
                    :src="filter.imgFilter(item.picMainUrl,company_id, '345*345')"
                    alt
                    class="guessLove-section-bgurl"
                />
                <div class="guessLove-section-line overflow">{{item.goodsName}}</div>
                <div class="guessLove-section-line">
                    <span class="guessLove-section-priceNow">￥{{filter.Fix2(item.salePrice)}}</span>
                    <span
                        class="guessLove-section-priceBefore"
                        v-if="item.trgPrice && item.trgPrice != 0"
                    >￥{{filter.Fix2(item.trgPrice)}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Goods } from "../api/service";

export default {
    props: {
        // 跳转到商品详情是否用redirect
        state: {
            type: Boolean, // Object
            default: false
        },
        shopId: {},
        btnLock:false,//锁
    },
    data() {
        return {
            commendList: [],
            company_id: global.Storage.get("COMPANYID").company_id
        };
    },
    created() {
        if (!this.state) {
            this.getGoodsRecommend();
        }
    },
    onHide(){
        setTimeout((res)=>{
            this.btnLock=false;
        },1000)
    },
    onUnload(){
        setTimeout((res)=>{
            this.btnLock=false;
        },1000)
    },
    methods: {
        //获取猜你喜欢数据
        getGoodsRecommend() {
            let data = {
                shopDptId: global.Storage.get("properties").shopId,
                buscontsCode: global.baseConstant.busContsCode,
                pageSize: 12,
                page: 1
            };
            Goods.getGoodsRecommendList(data).then(res => {
                if (!!res && !!res.list) {
                    this.commendList = res.list;
                } else {
                    this.commendList = [];
                }
            });
        },
        //获取猜你喜欢数据（商品详情）
        getHighestSelling(shopId) {
            let data = {
                companyId: global.Storage.get("COMPANYID").company_id,
                shopDptId: global.Storage.get("properties").shopId,
                buscontsCode: global.baseConstant.busContsCode,
                usrId: global.Storage.get("USER_INFO").userId,
                partHdId: shopId
            };
            console.log('getHighestSelling')
            Goods.getHighestSellingList(data).then(res => {
                if (!!res) {
                    this.commendList = res;
                } else {
                    this.commendList = [];
                }
            });
        },
        //跳到详情页
        goDetail(item) {
            if(this.btnLock){
                return
            }
            this.btnLock=true;
            let params = {
                ownCompanyId: global.Storage.get("COMPANYID").company_id,
                goodsCode: item.goodsCode,
                buscontsCode: global.baseConstant.busContsCode
            };
            Goods.isShelves(params).then(res => {
                // 未导入微信平台和全平台跳转至商品未上架页面
                if (!res) {
                    this.$router.push("/pages/goodsPackage/goods/off-shelves");
                }else{
                    this.$router.push("/pages/goodsPackage/wares/wares-detail?goodsCode=" + item.goodsCode);
                }
            },()=>{this.btnLock=false;});
        }
    }
};
</script>
<style lang="scss" scoped>
.guessLove-title {
    font-size: $font-h2;
    color: $text-primary;
    text-align: center;
    margin-bottom: computed(24);
    margin-top: computed(36);
    font-weight: 600;
}
.guessLove {
    display: flex;
    flex-wrap: wrap;
    padding: 0 computed(20) computed(100) computed(20);
    justify-content: space-between;
    .guessLove-section {
        position: relative;
        width: computed(345);
        background: $color-white;
        border-radius: computed(20);
        margin-bottom: computed(20);
        overflow: hidden;
        .imgWrap {
            position: absolute;
            top: computed(12);
            right: computed(12);
            width: computed(60);
            height: computed(60);
            border-radius: computed(10);
        }
        .guessLove-section-bgurl {
            width: computed(345);
            height: computed(345);
            margin-bottom: computed(20);
        }
        .guessLove-section-line {
            font-size: $font-regular;
            padding: 0 computed(20) computed(12) computed(20);
            .guessLove-section-priceNow {
                color: $color-red;
                font-size: $font-title1;
                margin-right: computed(10);
            }
            .guessLove-section-priceBefore {
                color: $text-secondary;
                font-size: $font-common;
                text-decoration: line-through;
            }
        }
    }
}
</style>
