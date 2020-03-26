/*
* createTime：2018/11/8
* author：junyong.hong
* description: 我的优惠券
*/
<template>
    <div class="my-vouchers" ref="list">
        <!-- 标签 begin -->
        <div class="my-vouchers-tab">
            <div
                v-for="(item, index) in tabList"
                :key="index"
                :class="[tabActive === index ? 'active': '']"
                @click="tabClick(item, index)"
            >
                <span>{{item.nameCn}}</span>
            </div>
        </div>
        <!-- 标签 end -->
        <!-- 优惠券列表 begin -->
        <div style="padding-top: 90rpx;">
            <couponList :cardState="tabActive" :cardList="cardList" :reload="handleCarList" />
        </div>

        <empty emptyText="很抱歉，您当前无任何抵用券~" v-if="showEmpty"></empty>

        <!-- 去领券 begin -->
        <div class="btn-parent">
            <div class="go-vouchers-btn radius40" @click.prevent="routeLink()">领取更多抵用券</div>
        </div>
        <van-toast id="van-toast" />
        <!-- 去领券 end -->
    </div>
</template>
<script>
import Toast from "vant-weapp/dist/toast/toast";
import couponList from "./components/couponList";
import { Vouchers } from "@/api/service";
import Empty from "@/components/EmptyContent.vue";
export default {
    config: {
        navigationBarTitleText: "我的抵用券",
        enablePullDownRefresh: true,
        backgroundTextStyle: "dark"
    },
    components: {
        couponList,
        empty: Empty
    },
    data() {
        return {
            pageNum: 1,
            pageSize: 8,
            finished: false, // 是否已加载完成
            tabList: [
                {
                    tabType: 0,
                    nameEn: "unUsed",
                    nameCn: "未使用",
                    state: "D_VALCARDHACED"
                },
                {
                    tabType: 1,
                    nameEn: "used",
                    nameCn: "已使用",
                    state: "D_VALCARDUSEED"
                },
                {
                    tabType: 2,
                    nameEn: "expired",
                    nameCn: "已失效",
                    state: "D_VALCARDOVERD,D_VALCARDWASTE"
                }
            ],
            tabActive: 0,
            cardList: [],
            showEmpty: false
        };
    },
    onShow() {
        // 默认显示未使用优惠券
        this.onRefresh();
        setTimeout(() => {
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 300
            });
        }, 0);
    },
    //下拉刷新
    onPullDownRefresh: function() {
        this.onRefresh();
        //模拟加载
        setTimeout(function() {
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 500);
    },
    onReachBottom: function() {
        this.loadMore();
    },
    onUnload() {
        Object.assign(this.$data, this.$options.data());
    },
    methods: {
        //  下拉刷新
        onRefresh() {
            this.pageNum = 1;
            this.cardList = [];
            this.handleCarList();
        },

        /**
         * 标题切换
         * @param item
         * @param index 索引值
         */
        tabClick(item, index) {
            this.$nextTick(() => {
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
            });
            // 防止重复点击
            if (this.tabActive === index) return;
            this.tabActive = index;
            this.pageNum = 1;
            this.finished = false;
            this.cardList = [];
            this.$nextTick(() => {
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
            });
            this.handleCarList();
        },
        /**
         * 获取卡券列表
         * @param code 卡券类型
         */
        async getCardList() {
            let params = {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                statusCodes: this.tabList[this.tabActive].state
            };
            return Vouchers.userVouchersList(params);
        },
        async handleCarList(type) {
            global.toastLoading();
            this.showEmpty = false;
            let res = await this.getCardList();
            if (!res.list) {
                this.showEmpty = true;
                global.toastLoading(false);
                return;
            }
            let cardList = this.cardList;
            if (this.pageNum == 1) {
                cardList = [];
            }
            res.list.forEach(item => {
                cardList.push(item);
            });
            this.cardList = cardList;
            if (!this.cardList.length) {
                this.showEmpty = true;
            }

            global.toastLoading(false);
            //finished flase 加载 true 停止加载

            if (this.pageSize > res.list.length) {
                this.finished = true;
            } else {
                this.finished = false;
            }
        },
        loadMore() {
            // 有赞推荐写法，防止首次进入，请求2次分页
            if (this.finished) {
                Toast("没有更多了~");
                return;
            } else {
                this.pageNum += 1;
                this.handleCarList();
            }
        },
        /**
         * 跳转到领取优惠券列表
         */
        routeLink() {
            this.$router.replace("/pages/UserPackage/vouchers/vouchers-list");
            // this.$router.replace('/pages/wares/wares-detail')
        }
    }
};
</script>
<style lang="scss" type="text/scss" scoped>
.my-vouchers {
    background-color: $color-white;
    -webkit-overflow-scrolling: touch;
    height: 100%;
    position: relative;
    .my-vouchers-tab {
        width: 100%;
        height: computed(90);
        line-height: computed(90);
        text-align: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        background: $color-background;
        > div {
            width: 33.33%;
            height: computed(90);
            display: inline-block;
            color: $text-regular;
            font-size: computed(30);
            &.active {
                color: $domaincolor;
                > span {
                    padding-bottom: computed(20);
                    border-bottom: 2px solid $domaincolor;
                }
            }
        }
    }
    .btn-parent {
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        padding: computed(13) 4%;
        background-color: $color-white;
        .go-vouchers-btn {
            width: 92%;
            z-index: 999;
            height: computed(80);
            line-height: computed(80);
            font-size: computed(28);
            text-align: center;
            color: $domaincolor;
            border: computed(2) solid $domaincolor;
            font-size: $font-regular;
        }
    }
}
</style>