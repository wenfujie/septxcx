
<!--
 * @Author: lan.chen
 * @Date: 2019-06-29 14:02:08
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-07-26 13:22:31
 * @Description: 专题活动type=0，每日搭配页type=1  
 -->

<template>
    <div class="goods-box">
        <wxs module="filter" src="../../../filter/filterCommon.wxs"></wxs>
        <div class="good-collocation">
            <!-- 标签页 -->
            <div class="tabs-box" v-if="type==1">
                <div
                    v-for="(item, index) in tabList"
                    :key="index"
                    :class="[tabActive === index ? 'active': '']"
                    @click="tabClick(item, index)"
                >
                    <span>{{item.cmsBackpageDttName}}</span>
                </div>
            </div>
            <!-- 轮播图 -->
            <div class="banner">
                <!-- 轮播图 -->
                <swiper autoplay="true" interval="3000" class="swipe-box">
                    <block v-for="(image, index) in imageList" :key="index">
                        <swiper-item>
                            <img
                                lazy-load="true"
                                :src="filter.imgFilter(image.coverFileUrl,company_id)"
                                :key="image.coverFileUrl"
                                @click="goUrl(image.url)"
                                @onerror="global.errImg(event)"
                            />
                        </swiper-item>
                    </block>
                </swiper>
            </div>
            <!-- 优惠券 -->
            <div class="goods-vouchers" v-if="type!=1">
                <div v-for="(item, index) in voucherList" :key="index" class="img-box">
                    <img
                        lazy-load="true"
                        :src="filter.imgFilter(item.coverFileUrl,company_id)"
                        :key="index"
                        @click="goUrl(item.url)"
                        @onerror="global.errImg(event)"
                        mode="widthFix"
                    />
                </div>
            </div>
            <!-- 商品描述 -->
            <div class="goods-describe">
                <div v-for="(item, index) in detailList" :key="index" class="img-box">
                    <img
                        lazy-load="true"
                        :src="filter.imgFilter(item.coverFileUrl,company_id)"
                        :key="index"
                        @click="goUrl(item.url)"
                        @onerror="global.errImg(event)"
                        mode="widthFix"
                    />
                </div>
            </div>
        </div>
        <!--商品列表 end-->
    </div>
</template>
<script>
import { Collection, Cms, Goods } from "../../../api/service";
import EmptyContent from "@/components/EmptyContent";
export default {
    config: {
        enablePullDownRefresh: true,
        backgroundTextStyle: "dark",
        onReachBottomDistance: 80
    },
    components: {
        "empty-content": EmptyContent
    },
    data() {
        return {
            tabList: [],
            tabActive: 0,
            imageList: [], //头部轮播图
            mrdpbanner: global.pageCode.index.children.mrdpbanner, // 爆款全场
            type: 0, //判断是专题活动页（为0） 还是每日搭配（为1），
            company_id: "",
            detailList: [], //商品详细信息
            voucherList: [], //优惠信息
            tabCode: "mrdp_cd",
            detailCode: "mrdp01"
        };
    },
    onLoad() {
        this.company_id = global.Storage.get("COMPANYID").company_id;
        this.type = this.$route.query.type; //type为0 专题活动页  1 为每日搭配
        this.getDetailImage();
        wx.setNavigationBarTitle({
            title: this.type == 0 ? "专题活动页" : "每日搭配" //动态修改小程序头部标题
        });
    },
    onUnload() {
        Object.assign(this.$data, this.$options.data());
    },
    // 下拉刷新事件
    onPullDownRefresh() {
        console.log("下拉刷新");
        // 初始化页码
        this.imageList = [];
        this.detailList = [];
        this.voucherList = [];
        this.tabList = [];
        this.getDetailImage();
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1500);
    },

    methods: {
        tabClick(item, index) {
            // 防止重复点击
            if (this.tabActive === index) return;
            this.tabActive = index;
            if (this.tabActive == 0) {
                this.detailCode = "mrdp01";
            } else if (this.tabActive == 1) {
                this.detailCode = "mrdp02";
            } else {
                this.detailCode = "mrdp03";
            }
            this.imageList = [];
            this.detailList = [];
            this.tabList = [];
            this.getDetailImage();
            this.$nextTick(() => {
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
            });
        },
        getDetailImage() {
            if (this.type == 1) {
                var bannerCode = global.pageCode.index.children.mrdpbanner;
                var detailCode = this.detailCode;
            } else {
                var bannerCode = global.pageCode.index.children.zshdbanner;
                var detailCode = global.pageCode.index.children.zshd;
            }
            let data = {
                cmsTemplateCode: global.Storage.get("TEMPLATE_INFO")
                    .cmsTemplateCode,
                busContsCode: global.baseConstant.busContsCode,
                cmsWebCode: "promote3"
            };
            global.toastLoading();
            Cms.getUsrCmsInfoV2(data).then(res => {
                res.cmsModulepageHdList.forEach((item, itemIndex) => {
                    if (
                        !!item.cmsBackpageDtDtoList &&
                        item.cmsBackpageDtDtoList.length > 0
                    ) {
                        item.cmsBackpageDtDtoList.forEach((itm, itmIndex) => {
                            // 菜单栏
                            if (
                                itm.cmsBackpageDtCode === this.tabCode &&
                                !!itm.cmsBackpageDttList
                            ) {
                                itm.cmsBackpageDttList.forEach((it, index) => {
                                    this.tabList.push(it);
                                });
                            }
                            //  轮播图
                            if (
                                itm.cmsBackpageDtCode === bannerCode &&
                                !!itm.cmsBackpageDttList
                            ) {
                                itm.cmsBackpageDttList.forEach((it, index) => {
                                    this.imageList.push(it);
                                    global.toastLoading(false);
                                });
                            }
                            // 商品详细信息
                            if (
                                itm.cmsBackpageDtCode === detailCode &&
                                !!itm.cmsBackpageDttList
                            ) {
                                itm.cmsBackpageDttList.forEach((it, index) => {
                                    this.detailList.push(it);
                                });
                            }
                            // 优惠信息
                            if (
                                itm.cmsBackpageDtCode ===
                                    global.pageCode.index.children.yhxx &&
                                !!itm.cmsBackpageDttList
                            ) {
                                itm.cmsBackpageDttList.forEach((it, index) => {
                                    this.voucherList.push(it);
                                });
                            }
                        });
                    }
                });
            });
        },
        goUrl(url) {
            if (!url) {
                Toast("敬请期待~");
                return;
            }
            if (url.indexOf("http") != -1) {
                location.href = url;
                return;
            }
            this.$router.push(url);
        }
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss" scoped>
.good-collocation {
    width: 100%;
    .tabs-box {
        width: 100%;
        height: computed(90);
        line-height: computed(90);
        text-align: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: $color-white;
        > div {
            width: 33.33%;
            height: computed(90);
            display: inline-block;
            color: $text-regular;
            font-size: computed(28);
            &.active {
                color: $domaincolor;
                > span {
                    padding-bottom: computed(20);
                    border-bottom: 2px solid $domaincolor;
                }
            }
        }
    }
    .swipe-box {
        height: computed(750);
        img {
            width: 100%;
            height: 100%;
        }
    }
    .goods-describe {
        width: 100%;
        img {
            width: 100%;
        }
    }
    .goods-vouchers {
        width: 100%;
        img {
            width: 100%;
        }
    }
}
</style>






