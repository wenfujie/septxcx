/*
* createTime：2018/11/2
* author：fujie.wen
* description: 商品列表
*/
<template>
    <div class="good-box">
        <wxs module="filter" src="../../../filter/filterCommon.wxs"></wxs>
        <!-- 筛选弹出层 -->
        <van-popup
            :show="showfifter"
            position="right"
            custom-style="height:1150px;"
            @close="onClose"
        >
            <div class="good-fifter">
                <div class="fifter-content">
                    <div
                        v-for="(item,index) in CrumbsName"
                        :key="index"
                        class="content-box"
                        v-if="item.list && item.list.length!=0"
                    >
                        <div class="title" @click="showDetails(item)">
                            <p>{{item.escrumbsName}}</p>
                            <p class="more">
                                <span>更多</span>
                                <i v-if="item.ishow===true" class="iconfont iconiconup-copy"></i>
                                <i v-else class="iconfont iconicondown-copy"></i>
                                <!-- <i
                                    :class="[{'iconfont iconiconup-copy':item.ishow===true,'iconfont iconicondown-copy':item.ishow===false}]"
                                ></i>-->
                            </p>
                        </div>
                        <div class="contents" v-if="item.ishow">
                            <p
                                v-for="(it,indexs) in  item.list"
                                :key="indexs"
                                :class="{checked:indexs==item.n }"
                                @click="choice(it,indexs,item)"
                            >{{it.name}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fifter-bottom">
                <span @click="reset()">重置</span>
                <span class="bg-domaincolor white" @click="sure">确定</span>
            </div>
        </van-popup>
        <!--头部-->
        <div class="header-box">
            <!-- 搜索栏 -->
            <div class="search-box">
                <i class="iconfont iconsousuoxiao"></i>

                <input
                    class="van-search"
                    placeholder="搜索商品"
                    @click="goSearch"
                    :value="value"
                    disabled
                />
            </div>
            <ul class="header">
                <li
                    :class="['header-item','fs28',{'selected':activeIndex === index}]"
                    :key="item.id"
                    @click="switchNav(item,index)"
                    v-for="(item,index) in filterList"
                >
                    <span>{{item.text}}</span>

                    <img
                        v-if="item.id === 2"
                        class="header-item-sort"
                        :src="priceSortImgName"
                        alt="价格"
                    />
                    <img
                        v-if="item.id === 4"
                        class="shaixuan"
                        :src="serverUrl+'images/goods/shaixuan.png'"
                    />
                </li>
            </ul>
        </div>

        <!--商品列表-->

        <ul class="good-list">
            <li
                class="good-list-item flex-vbox flex-vcenter"
                v-for="(item,index) in goodList"
                @click="goDetail(item,url)"
                :key="index"
            >
                    <!-- 促销标识 -->
                    <img
                        :src="filter.imgFilter(item.spmFileUrl,company_id)"
                        lazy-load="true"
                        class="cuxiao"
                         v-if="!!item.spmFileUrl"
                    />
                <div class="good-item-img">
                    <img
                        alt="商品logo"
                        @onerror="global.errImg(event)"
                        :src="filter.imgFilter(item.glbFileUrl,company_id)"
                        lazy-load="true"
                    />
                </div>
                <div class="good-item-describe fs28">{{item.goodsName}}</div>
                <div class="good-price-box">
                    <div class="good-item-price">
                        <span class="sale-single">￥</span>
                        <span>{{filter.Fix2(item.salePrice)}}</span>
                    </div>
                    <del
                        class="del_line"
                        v-if="item.tagPrice && item.tagPrice != 0 && (item.salePrice !== item.tagPrice)"
                    >￥{{filter.Fix2(item.tagPrice)}}</del>
                </div>
            </li>
        </ul>
        <empty-content v-if="showEmpty"></empty-content>
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import { Goods, Cms } from "../../../api/service";
import EmptyContent from "@/components/EmptyContent";
import Toast from "vant-weapp/dist/toast/toast";
export default {
    config: {
        enablePullDownRefresh: true,
        backgroundTextStyle: "dark",
        navigationBarTitleText: "商品列表",
        onReachBottomDistance: 80
    },
    components: {
        "empty-content": EmptyContent
    },
    data() {
        return {
            showfifter: false, //显示面包屑弹出层
            value: "", //关键词
            activeIndex: -1, //所选过滤项下标
            filterList: [], //过滤列表
            priceSortState: 0, // 0未选中价格 1降序 2升序
            salesSortState: 0, //0未选中销量 1降序 2升序
            goodList: [], //商品列表
            showEmpty: false, //判断商品是否为空
            finished: false,
            pageNum: 1, //页数
            CrumbsName: [], //面包屑标题
            flags: [], //存放面包屑过滤id
            crumbs: [], //过滤面包屑
            couponId: "", //优惠券id
            ptiPartHdId: "", //  获取面包屑详情的id字符串
            company_id: "",
            serverUrl: "",
            classId: "" //分类id
        };
    },

    computed: {
        priceSortImgName() {
            let imgName = "";
            switch (this.priceSortState) {
                case 1:
                    imgName = "Price_down.png";
                    break;
                case 2:
                    imgName = "Price_up.png";
                    break;
                default:
                    imgName = "Price_ash.png";
                    break;
            }
            return this.serverUrl + "images/goods/" + imgName;
        }
    },
    onLoad() {
        Object.assign(this.$data, this.$options.data());
        this.serverUrl = global.baseConstant.serverUrl;
        this.company_id = global.Storage.get("COMPANYID").company_id;
        this.value = this.$route.query.keywords
            ? this.$route.query.keywords
            : "";
        this.classId = this.$route.query.classId
            ? this.$route.query.classId
            : ""; // 分类页跳转时存在类别id
        this.couponId = this.$route.query.couponId
            ? this.$route.query.couponId
            : ""; //优惠券id
        this.userInfo = global.Storage.get("USER_INFO");
        this.filterList = [
            {
                id: 1,
                text: "综合",
                sortParam: [{ field: "sort", order: "ASC" }]
            },
            {
                id: 2,
                text: "价格",
                sortParam: [{ field: "price", order: "ASC" }]
            },
            {
                id: 3,
                text: "销量",
                sortParam: [{ field: "sales", order: "DESC" }]
            },
            {
                id: 4,
                text: "筛选"
            }
        ];
        // 初始化选中'新品'
        this.switchNav(this.filterList[0], 0);
        this.getCrumbsIds();
    },
    // 下拉刷新事件
    onPullDownRefresh() {
        // 初始化页码
        this.pageNum = 1;
        this.goodList = [];
        this.getGoodList();
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1500);
    },
    //  加载更多商品
    onReachBottom: function() {
        if (this.finished === true) {
            Toast("没有更多了~");
            return;
        } else {
            this.pageNum += 1;
            this.getGoodList();
        }
    },
    methods: {
        onClose() {
            this.showfifter = false;
        },
        // 当在输入框聚焦的时候切换到搜索页面
        goSearch() {
            this.$router.replace({
                path: "/pages/goodsPackage/goods/good-search",
                query: {
                    type: 1,
                    classId: this.classId,
                    value: this.value
                }
            });
        },
        //  商品详情跳转 orderFlag 1详情 2定制
        goDetail(item, url) {
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
            console.log(routerSrc,'routerSrc')
            this.$router.push(routerSrc);
        },

        /**
         * 获取商品列表
         * @param sortParam 排序方式
         */
        getGoodList(callback) {
            this.showEmpty = false;
            let data = {
                busContsCode: global.baseConstant.busContsCode, // 业务触点
                shopId: global.Storage.get("properties").shopId, // Storage获取
                pageNum: this.pageNum,
                pageSize: 8,
                origin: "",
                filters: JSON.stringify(this.crumbs), // 面包屑
                keyword: this.value,
                sortParam: JSON.stringify(
                    this.filterList[this.activeIndex].sortParam
                ),
                queryNullBusFlag: 1,
                platformCode: this.classId,
                orderFlags: JSON.stringify([0]),
                couponId: this.couponId,
                onilneFlag:1,
            };
            global.toastLoading();
            Goods.getGoodsList(data).then(res => {
                this.ptiPartHdId = res.ptiPartHdIds;
                res.hits.forEach(item => {
                    this.goodList.push(item);
                });
                global.toastLoading(false);
                if (!this.goodList.length) {
                    this.showEmpty = true;
                }
                if (
                    parseInt(res.pagination.pageNo) >=
                    parseInt(res.pagination.totalPage)
                ) {
                    this.finished = true;
                } else {
                    this.finished = false;
                }
                this.getDetails();
                typeof callback === "function" && callback();
            });
        },
        // 切换导航
        switchNav(item, index) {
            if (item.id === 2) {
                console.log(this.priceSortState, "this.priceSortState");
                if (this.priceSortState === 1) {
                    this.priceSortState = 2; //降序
                    this.filterList[1].sortParam[0].order = "DESC";
                } else {
                    this.priceSortState = 1; //升序
                    this.filterList[1].sortParam[0].order = "ASC";
                }
            }
            if (item.id === 3) {
                this.filterList[2].sortParam[0].order = "DESC";
                this.priceSortState = 0;
            }
            if (item.id === 4) {
                this.showfifter = true;
                return;
            }
            if (this.activeIndex === index && item.id === 3) return;
            this.activeIndex = index;
            this.pageNum = 1;
            this.goodList = [];
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 300
            });
            this.$nextTick(() => {
                this.getGoodList(() => {
                    this.$nextTick(() => {
                        wx.pageScrollTo({
                            scrollTop: 0,
                            duration: 300
                        });
                    });
                });
            });
        },
        //  查询面包屑接口所需ids
        getCrumbsIds() {
            if (this.value || this.classId) {
                let data = {
                    busContsCode: global.baseConstant.busContsCode, // 业务触点
                    shopId: global.Storage.get("properties").shopId, // Storage获取
                    pageNum: this.pageNum,
                    pageSize: 8,
                    origin: "",
                    filters: JSON.stringify(this.crumbs), // 面包屑
                    keyword: this.value,
                    sortParam: JSON.stringify(
                        this.filterList[this.activeIndex].sortParam
                    ),
                    queryNullBusFlag: 1,
                    platformCode: this.classId,
                    orderFlags: JSON.stringify([0]),
                    couponId: this.couponId
                };
                Goods.getCrumbsGoodsIds(data).then(
                    res => {
                        this.GetCrumbs(res.join(","));
                    },
                    () => {
                        this.GetCrumbs();
                    }
                );
            } else {
                this.GetCrumbs();
            }
        },
        // 获取筛选一级分类
        GetCrumbs(ids, callBack) {
            let data = {
                usrId: global.Storage.get("USER_INFO").usrId,
                companyId: global.Storage.get("COMPANYID").company_id,
                busContsCode: global.baseConstant.busContsCode,
                pageSize: 0,
                pageNum: 0,
                platformCode: this.classId,
                goodsClassIds: !!ids ? ids : null
            };
            Cms.getCrumbs(data).then(res => {
                res.list.forEach((item, index) => {
                    item.list = []; //  二级面包屑数组
                    item.ishow = false; // 控制展示更多按钮
                });
                this.CrumbsName = res.list;
            });
            callBack && callBack();
        },
        // 获取筛选二级分类
        getDetails() {
            if (!this.ptiPartHdId) return;
            let data = {
                usrId: global.Storage.get("USER_INFO").usrId,
                companyId: global.Storage.get("COMPANYID").company_id,
                ptiPartHdIds: this.ptiPartHdId
            };
            this.CrumbsName.forEach(item => {
                if (!item.list || item.list.length <= 0) item.list = [];
            });
            if (this.CrumbsName.length > 0) {
                Cms.getCrumbsDetail(data).then(res => {
                    if (!!res.length && !!res.length > 0) {
                        this.CrumbsName.forEach(item => {
                            res.forEach(sort => {
                                if (
                                    item.list.length <= 0 &&
                                    item.escrumbsCode === sort.crumbsCode
                                ) {
                                    item.list = sort.crumbsList;
                                }
                            });
                        });
                    }
                });
            } else {
                let length = 0;
                let interval = setInterval(() => {
                    if (this.CrumbsName.length > 0 || ++length >= 100) {
                        clearInterval(interval);
                        Cms.getCrumbsDetail(data).then(res => {
                            if (!!res.length && !!res.length > 0) {
                                this.CrumbsName.forEach(item => {
                                    res.forEach(sort => {
                                        if (
                                            item.list.length <= 0 &&
                                            item.escrumbsCode ===
                                                sort.crumbsCode
                                        ) {
                                            item.list = sort.crumbsList;
                                        }
                                    });
                                });
                            }
                        });
                    }
                }, 100);
            }
        },
        // 点击展示更多
        showDetails(items) {
            items.ishow = !items.ishow;
            this.$set(items, "ishow", items.ishow);
        },
        // 二级分类目下的选择
        choice(it, index, item) {
            var that = this;
            item.n = index;
            this.CrumbsName = JSON.parse(JSON.stringify(this.CrumbsName));
            this.$set(it, "escrumbsCode", item.escrumbsCode);
            that.flags.push(it);
            var arr = [];
            var map = {};
            that.flags.forEach(item => {
                if (item.id !== "") {
                    map.queryField = item.escrumbsCode;
                    map.value = item.id.toString();
                    map.filterMode = true;
                    map.operate = "AND";
                    arr.push(map);
                    map = {};
                }
            });
            let filters = [
                {
                    operate: "AND",
                    filterList: arr
                }
            ];
            this.crumbs = filters;
        },
        // 筛选重置
        reset() {
            this.CrumbsName.forEach(item => {
                item.n = null;
            });
            this.flags = [];
            this.crumbs = [];
            this.goodList = [];
            this.getGoodList();
        },
        // 筛选确定
        sure() {
            this.showfifter = false;
            this.pageNum = 1;
            this.goodList = [];
            this.getGoodList();
        }
    }
};
</script>
<style scoped lang="scss">
@import "@/assets/scss/common/goods.scss";
</style>
