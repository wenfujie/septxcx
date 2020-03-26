/*
* createTime：2018/11/7
* author：junyong.hong
* description: 领取优惠券列表
*/
<template>
    <div class="vouchers-list">
        <div>
            <voucherList :cardList="cardList" />
        </div>
        <empty emptyText="很抱歉，您当前无任何抵用券~" v-if="showEmpty"></empty>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import voucherList from "@/components/voucherList";
import { Vouchers } from "@/api/service";
import Empty from "@/components/EmptyContent.vue";
export default {
    config: {
        navigationBarTitleText: "领券中心",
        enablePullDownRefresh: true,
        backgroundTextStyle: "dark"
    },
    components: {
        voucherList,
        empty: Empty
    },
    data() {
        return {
            // 优惠券列表
            cardList: [],
            showEmpty: false,
            isLoading: false, //下拉刷新
            pageNum: 1,
            pageSize: 8,
            loading: false,
            finished: false
        };
    },
    onShow() {
        setTimeout(() => {
            this.$nextTick(() => {
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
            });
        }, 0);
        this.getCouponList();
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
        //  下拉刷新
        onRefresh() {
            this.pageNum = 1;
            this.cardList = [];
            this.getCouponList(1);
        },
        //  获取优惠券列表
        async getCouponList(type) {
            type == 1 ? (this.loading = false) : (this.loading = true);
            let cardList = [];
            let params = {
                busContsCode: global.baseConstant.busContsCode,
                isWeixin: 2,
                wxUnionid: global.Storage.get("properties").wxUnionid,
                shopId: global.Storage.get("properties").shopId,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            };
            let result = await Vouchers.getVouchersList(params);
            if (result && Array.isArray(result.couponTypesList)) {
                result.couponTypesList.forEach(item => {
                    item.couponsList.forEach(coupon => {
                        if (coupon.couponCount > 0 &&coupon.isBuy!=1) {
                            coupon.cardTypeCode = item.couponsTypeCode;
                            this.isLoading = false;
                            cardList.push(coupon);
                        }
                    });
                });
            }
            this.cardList = cardList;
            if (this.cardList.length===0) {
                this.showEmpty = true;
            }else{
                this.showEmpty = false;
            }
            this.isLoading = false;
            this.finished = true;
            this.loading = false;
        }
    }
};
</script>
<style lang="scss" type="text/scss" scoped>
$grayColor: #f5f5f5;
.vouchers-list {
    background-color: $color-background;
    -webkit-overflow-scrolling: touch;
    min-height: 100%;
    position: relative;
}
</style>
