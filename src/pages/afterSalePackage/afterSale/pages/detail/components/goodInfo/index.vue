<style lang='scss' scoped>
.goods-detail-info {
    width: computed(690);
    height: computed(212);
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
    margin-bottom: computed(30);
    .goods-box {
        display: flex;
        padding: computed(30);
        &-left {
            width: computed(150);
            height: computed(150);
            margin-right: computed(20);
            img {
                width: 100%;
                height: 100%;
            }
        }
        &-right {
            flex: 1;
            .goodsTitle {
                font-size: computed(30);
                font-family: "PingFang-SC-Medium";
                font-weight: 500;
                color: #333333;
                margin-bottom: computed(30);
            }
            .good-price {
                font-size: computed(32);
                font-family: "PingFang-SC-Heavy";
                font-weight: 800;
                color: rgba(51, 51, 51, 1);
            }

            .good-qty {
                font-size: computed(32);
                font-family: "PingFang-SC-Medium";
                font-weight: 500;
                color: rgba(153, 153, 153, 1);
            }
        }
    }
}
</style>

<template>
    <div class="goods-detail-info">
        <wxs module="filter" src="../../../../../../../filter/filterCommon.wxs"></wxs>
        <div class="goods-box" v-for="(good, index) in data.goodsList" :key="index">
            <div class="goods-box-left">
                <img
                    :src="filter.imgFilter(good.thumb,companyId)"
                    lazy-load="true"
                    @onerror="global.errImg(event)"
                />
            </div>
            <div class="goods-box-right">
                <div class="goodsTitle">{{ good.goodsName }}</div>
                <!-- <div class="fw-bold mgB15 fs28B">¥ {{good.averagePrice}}</div> -->
                <div class="flex-between">
                    <span class="good-price">¥ {{ good.averagePrice }}</span>
                    <span class="good-qty">x{{ good.ordQty }}</span>
                </div>
                <!-- <div class="flex-between fs28 grey99">
                                <span>{{good.colorName}} {{good.sizeName}}</span>
                                <span>x{{good.ordQty}}</span>
                </div>-->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {}
    },
    data() {
        return {
            companyId: global.Storage.get("COMPANYID").company_id
        };
    },
    onUnload() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    }
};
</script>