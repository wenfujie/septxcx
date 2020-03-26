<!--
 * @Author: lan.chen
 * @Date: 2019-06-29 14:02:08
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-08-14 18:01:07
 * @Description: 满减/满折/更多商品页面
 -->

<template>
    <div class="goods-box">
        <wxs module="filter" src="../../../filter/filterCommon.wxs"></wxs>
        <!-- <div class="goods-list"> -->
        <ul class="goods-list">
            <li
                class="good-list-item flex-vbox flex-vcenter"
                v-for="(item,index) in goodsList"
                :key="index"
                @click="goDetail(item)"
            >
                <!-- 满减满折促销标识 -->
                <img
                    :src="filter.imgFilter(item.spmFileUrl,company_id, '60*60')"
                    lazy-load="true"
                    class="cuxiao"
                    v-if="type !=2 && !!item.spmFileUrl"
                />
                <img
                    :src="filter.imgFilter(item.spmFileUrl,company_id, '60*60')"
                    lazy-load="true"
                    class="cuxiao"
                    v-if="type ==2 && !!item.spmFileUrl"
                />
                <!-- 满减满折图片 -->
                <div class="good-item-img">
                    <img
                        v-if="type !=2"
                        :src="filter.imgFilter(item.fileUrl,company_id, '345*345')"
                        lazy-load="true"
                    />
                    <!-- 更多商品图片 -->
                    <img
                        v-else
                        :src="filter.imgFilter(item.goodsFilePath,company_id, '345*345')"
                        lazy-load="true"
                        alt="商品logo"
                    />
                </div>
                <p class="good-item-describe fs28" v-if="type !=2">{{item.partName}}</p>
                <p class="good-item-describe fs28" v-else>{{item.goodsName}}</p>
                <div class="good-price-box">
                    <div class="good-item-price">
                        <span class="sale-single">￥</span>
                        <span>{{filter.Fix2(item.salePrice)}}</span>
                    </div>
                    <del v-if="item.tagPrice && item.tagPrice != 0">￥{{filter.Fix2(item.tagPrice)}}</del>
                </div>
            </li>
        </ul>
        <!-- </div> -->

        <empty-content v-if="showEmpty"></empty-content>
        <van-toast id="van-toast" />
        <!--商品列表 end-->
    </div>
</template>
<script>
import { Cms, Goods } from "../../../api/service";
import EmptyContent from "@/components/EmptyContent";
import Toast from "vant-weapp/dist/toast/toast";
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
            goodsList: [], // 商品列表
            finished: false, // 控制是否加载更多商品
            pageNum: 1,
            pageSize: 8,
            showEmpty: false,
            company_id: "",
            type: 0, //0为满折活动，1为满减活动，2为更多商品
            typeCode: "", //后台传满减满折类型
            title: "" //头部标题
        };
    },
    onLoad() {
        this.company_id = global.Storage.get("COMPANYID").company_id;
        this.type = this.$route.query.type; //type为0 为满折活动 1 为满减 2为更多
        this.goodmoreId = this.$route.query.goodmoreId
            ? this.$route.query.goodmoreId
            : "";
        if (this.type == 0) {
            this.title = "满折活动";
        } else if (this.type == 1) {
            this.title = "满减活动";
        } else {
            this.title = "商品列表";
        }
        wx.setNavigationBarTitle({
            title: this.title //动态修改小程序头部标题
        });
        this.getList();
    },
    onUnload() {
        Object.assign(this.$data, this.$options.data());
    },

    // 下拉刷新事件
    onPullDownRefresh() {
        console.log("下拉刷新");
        // 初始化页码
        this.pageNum = 1;
        this.goodsList = [];
        this.getList();
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1500);
    },
    //  加载更多商品
    onReachBottom: function() {
        if (this.type != 2) {
            this.loadMore();
        }
    },
    methods: {
        //  加载商品列表
        getList() {
            // 加载满减满折数据
            if (this.type != 2) {
                if (this.type == 0) {
                    this.typeCode = "D_PMTYPE_REBATE";
                } else if (this.type == 1) {
                    this.typeCode = "D_PMTYPE_MJ";
                }
                let data = {
                    ownCompanyId: global.Storage.get("COMPANYID").company_id,
                    busContsCode: global.baseConstant.busContsCode, // 业务触点
                    shopId: global.Storage.get("properties").shopId, // Storage获取
                    pageNum: this.pageNum,
                    pageSize: 8,
                    companyId: global.Storage.get("COMPANYID").company_id,
                    typeCode: this.typeCode
                };
                global.toastLoading();
                Goods.getDiscountList(data).then(
                    res => {
                        res.list.forEach(item => {
                            this.goodsList.push(item);
                        });
                        global.toastLoading(false);
                        if (!this.goodsList || this.goodsList.length === 0) {
                            this.showEmpty = true;
                        }
                        if (res.pageNum >= res.pages) {
                            this.finished = true;
                        } else {
                            this.finished = false;
                        }
                    },
                    err => {}
                );
            } else {
                // 首页更多商品数据
                let data = {
                    // 模板编号
                    cmsTemplateCode: global.Storage.get("TEMPLATE_INFO")
                        .cmsTemplateCode,
                    // 页面编号
                    cmsWebCode: global.pageCode.index.name,
                    // 页面元素编号
                    cmsWebItemCode: this.goodmoreId,
                    busContsCode: global.baseConstant.busContsCode,
                    shopId: global.Storage.get("properties").shopId,
                    pageNum: 0,
                    pageSize: 0,
                    onlineFlag: 1 //促销标识
                };
                global.toastLoading();
                Cms.getChoosebuyGoods(data).then(res => {
                    res.forEach(item => {
                        if (!!item.goodsList)
                            this.goodsList.push.apply(
                                this.goodsList,
                                item.goodsList
                            );
                    });
                    global.toastLoading(false);
                    if (!this.goodsList || this.goodsList.length == 0) {
                        this.showEmpty = true;
                    }
                });
            }
        },

        //  上拉加载更多
        loadMore() {
            setTimeout(() => {
                if (this.finished === true) {
                    Toast("没有更多了~");
                    return;
                } else {
                    this.pageNum += 1;
                    this.getList();
                }
            }, 100);
        },

        //  跳转商品详情
        goDetail(item) {
            if (item.orderFlag === 0 && this.type != 2) {
                this.$router.push(
                    "/pages/goodsPackage/wares/wares-detail?goodsCode=" +
                        item.partCode +
                        "&goodsType=singleGood"
                );
            } else {
                let routerSrc = "";
                let goodsType = "";
                if (item.orderFlag == 0) {
                    goodsType = "singleGood";
                    routerSrc = "/pages/goodsPackage/wares/wares-detail";
                }
                routerSrc +=
                    (routerSrc.indexOf("?") == -1 ? "?" : "&") +
                    `goodsCode=${item.goodsCode}` +
                    (goodsType ? `&goodsType=${goodsType}` : "");
                this.$router.push(routerSrc);
            }
        }
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "@/assets/scss/common/goods.scss";
</style>






