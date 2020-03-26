
<!--
 * @Author: lan.chen
 * @Date: 2019-06-29 14:02:08
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-08-14 15:16:23
 * @Description: 专题活动type=1，每日搭配页type=0
 -->

<template>
    <div class="goods-box">
        <wxs module="filter" src="../../../filter/filterCommon.wxs"></wxs>
        <div class="good-collocation" v-if="type==0">
            <!-- 标签页 -->
            <div class="tabs-box">
                <div
                    :data-id="'good-box'+index"
                    v-for="(item, index) in tabList"
                    :key="index"
                    :class="[tabActive === 'good-box'+index ? 'active': '']"
                    @click="tabClick($event)"
                >
                    <span>{{item.cmsBackpageDttName}}</span>
                </div>
            </div>

            <!-- 商品外层box -->
            <!--  scroll-with-animation="true" -->
            <scroll-view
                class="menu-wrapper"
                :scroll-into-view="toView"
                scroll-y
                :style="{height:scrollHeight+'px'}"
                @scroll="onScroll"
            >
                <!-- 品质穿搭begin -->
                <div id="good-box0" v-if="showBox0">
                    <div :class="imageList1.length!=0? 'banner' : 'nobanner'">
                        <swiper autoplay="true" interval="3000" class="swipe-box">
                            <block v-for="(image, index) in imageList1" :key="index">
                                <swiper-item>
                                    <img
                                        lazy-load="true"
                                        :src="filter.imgFilter(image.coverFileUrl,company_id, '750*750')"
                                        :key="image.coverFileUrl"
                                        @click="goUrl(image.url)"
                                    />
                                </swiper-item>
                            </block>
                        </swiper>
                    </div>
                    <div class="goods-detail">
                        <div v-for="(item, index) in goodsDetail1" :key="index" class="detail-box">
                            <img
                                lazy-load="true"
                                :src="filter.imgFilter(item.coverFileUrl,company_id)"
                                :key="index"
                                @click="goUrl(item.url)"
                                :class="['goods-img',{'goodsmall-img':index==1},{'goodBig-img':index==2}]"
                            />
                            <div
                                class="button"
                                :style="{marginTop:index==1?'165'+'rpx':'',marginLeft:index==2?'300'+'rpx':''}"
                            >
                                <img src="../images/buyNow.png" @click="goUrl(item.url)" />
                                <img src="../images/shopCart.png" @click="foreAddCart(item,index)" />
                            </div>
                        </div>
                    </div>
                    <div class="img-box1" v-for="(item, index) in btnImg1" :key="index">
                        <img
                            lazy-load="true"
                            :src="filter.imgFilter(item.coverFileUrl,company_id)"
                            mode="widthFix"
                        />
                    </div>
                </div>
                <!-- 单品搭配end -->

                <!-- 焕国货start -->
                <!-- :style="{display:tabActive=='good-box1' || scrollTops==true?'block':'none'}" -->
                <div id="good-box1" v-if="showBox1">
                    <div class="goods-details">
                        <div
                            :class="'goods-box'+index"
                            v-for="(item, index) in goodsDetail2"
                            :key="index"
                        >
                            <img
                                lazy-load="true"
                                :src="filter.imgFilter(item.coverFileUrl,company_id)"
                                :key="index"
                                @click="goUrl(item.url)"
                                :class="['goods-img',{'goodsmall-img':index==1},{'goodBig-img':index==2}]"
                            />
                            <div class="btn">
                                <span class="buy-nowBtn" @click="goUrl(item.url)"></span>
                                <span class="shop-cartBtn" @click="foreAddCart(item,index)"></span>
                            </div>
                        </div>
                    </div>
                    <div class="img-box2" v-for="(item, index) in btnImg2" :key="index">
                        <img
                            lazy-load="true"
                            :src="filter.imgFilter(item.coverFileUrl,company_id)"
                            mode="widthFix"
                        />
                    </div>
                </div>
                <!-- 焕国货end -->
                <!-- 七月穿搭start -->
                <div id="good-box2" v-if="showBox2">
                    <div class="goods-details">
                        <div
                            :class="'goods-box'+index"
                            v-for="(item, index) in goodsDetail3"
                            :key="index"
                        >
                            <img
                                lazy-load="true"
                                :src="filter.imgFilter(item.coverFileUrl,company_id)"
                                :key="index"
                                @click="goUrl(item.url)"
                                :class="['goods-img',{'goodsmall-img':index==1},{'goodBig-img':index==2}]"
                            />
                            <div class="btn">
                                <span class="buy-nowBtn" @click="goUrl(item.url)"></span>
                                <span class="shop-cartBtn" @click="foreAddCart(item,index)"></span>
                            </div>
                        </div>
                    </div>
                    <div class="img-box3" v-for="(item, index) in btnImg3" :key="index">
                        <img
                            lazy-load="true"
                            :src="filter.imgFilter(item.coverFileUrl,company_id)"
                            mode="widthFix"
                        />
                    </div>
                </div>
                <!-- 七月穿搭end -->
            </scroll-view>

            <!-- 商品描述end -->
        </div>
        <div class="good-collocation" v-else>
            <div class="menu-wrapper" style="margin-top:0;">
                <!-- 品质穿搭begin -->
                <div class="good-box1">
                    <div :class="saleBanner.length!=0? 'banner' : 'nobanner'">
                        <swiper autoplay="true" interval="3000" class="swipe-box">
                            <block v-for="(image, index) in saleBanner" :key="index">
                                <swiper-item>
                                    <img
                                        lazy-load="true"
                                        :src="filter.imgFilter(image.coverFileUrl,company_id)"
                                        :key="image.coverFileUrl"
                                        @click="goUrl(image.url)"
                                    />
                                </swiper-item>
                            </block>
                        </swiper>
                    </div>
                    <!-- 优惠信息 -->
                    <div
                        class="voucherMes"
                        v-for="(item, index) in voucherList"
                        :key="index"
                        v-show="type==1"
                    >
                        <img
                            lazy-load="true"
                            :src="filter.imgFilter(item.coverFileUrl,company_id)"
                            :key="index"
                            @click="goUrl(item.url)"
                            mode="widthFix"
                        />
                    </div>
                    <div class="goods-detail">
                        <div
                            v-for="(item, index) in saleGoodsDetail"
                            :key="index"
                            class="detail-box"
                        >
                            <img
                                lazy-load="true"
                                :src="filter.imgFilter(item.coverFileUrl,company_id)"
                                :key="index"
                                @click="goUrl(item.url)"
                                :class="['goods-img',{'goodsmall-img':index==1},{'goodBig-img':index==2}]"
                            />
                            <div
                                class="button"
                                :style="{marginTop:index==1?'165'+'rpx':'',marginLeft:index==2?'300'+'rpx':''}"
                            >
                                <img src="../images/buyNow.png" @click="goUrl(item.url)" />
                                <img src="../images/shopCart.png" @click="foreAddCart(item,index)" />
                            </div>
                        </div>
                    </div>
                    <div class="img-box1" v-for="(item, index) in saleBtnImg" :key="index">
                        <img
                            lazy-load="true"
                            :src="filter.imgFilter(item.coverFileUrl,company_id)"
                            mode="widthFix"
                        />
                    </div>
                </div>
            </div>
        </div>
        <!-- sku弹窗 -->
        <div v-show="isShowSku" class="ticket-model" catch:touchmove="noop"></div>
        <div v-show="isShowSku" class="ticket-content" @touchmove.prevent>
            <sku-dialog-comp
                :goodsInfo.sync="goodSkuList"
                :colorActiveIndex.sync="colorActiveIndex"
                :sizeActiveIndex.sync="sizeActiveIndex"
                :num.sync="num"
                :maxNumber.sync="maxNumber"
                :isShowSku.sync="isShowSku"
                :userInfo.sync="userInfo"
                :flag="4"
                :btnStatus.sync="btnStatus"
                @onAddCartOrBuy="onAddCartOrBuy"
                @numBlur="numBlurComp"
            ></sku-dialog-comp>
        </div>
        <div class="showPhone">
            <van-popup :show="showPopup">
                <phone-popup :showPopup.sync="showPopup" :showMessage.sync="showMessage"></phone-popup>
            </van-popup>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import { Cms, Goods, ShoppingCart } from "../../../api/service";
import EmptyContent from "@/components/EmptyContent";
import skuDialogComp from "@/components/wares/sku-dialog.vue";
import phonePopup from "@/components/popup-phone";
import Toast from "vant-weapp/dist/toast/toast";
export default {
    components: {
        "empty-content": EmptyContent,
        skuDialogComp,
        phonePopup
    },
    data() {
        return {
            showBox2: true,
            showBox1: true,
            showBox0: true,
            tabList: [],
            tabActive: "good-box0",
            type: 0, //判断是专题活动页（为0） 还是每日搭配（为1），
            company_id: "",
            tabCode: "mrdp_cd",
            imageList1: [], //tab1轮播图
            imageList2: [], //tab2轮播图
            imageList3: [], //tab3轮播图
            saleBanner: [], //活动页轮播
            voucherList: [], //优惠信息
            navItemHeight1: 0, //模块1高度
            navItemHeight2: 0, //模块2高度
            navItemHeight3: 0, //模块3高度
            goodsDetail1: [], //tab1商品
            goodsDetail2: [], //tab2商品
            goodsDetail3: [], //tab3商品
            saleGoodsDetail: [], //活动页商品
            btnImg1: [], //tab1场景
            btnImg2: [], //tab2场景
            btnImg3: [], //tab3场景
            saleBtnImg: [], //活动页场景
            serverUrl: "",
            btnUserInfoBtn: false,
            isLoading: false,
            isShowSku: false,
            goodSkuList: "",
            colorActiveItem: "",
            colorActiveIndex: null,
            sizeActiveItem: "",
            sizeActiveIndex: null,
            num: 1,
            maxNumber: 0, //最大数量
            btnStatus: true, // 默认显示有加入购物车、立即购买按钮
            sellFlag: 1, // 商品上下价，默认上架
            isSku: true, // 商品尺码 跟 颜色只有一款（默认多款）
            goodsInfo: {},
            stuckList: [], // 库存列表
            types: false, //判断是否从加入购物车进入
            isCartOrBuy: true, // true点击加入购物车 false点击立即购买
            btnLock: false, // 按钮锁
            showPopup: false,
            showMessage: "", //显示绑定手机号是否成功信息
            skuId: "", // 选中sku的值
            goodsId: "",
            userInfo: {},
            scrollHeight: 0,
            toView: "",
            scrollTops: 0
        };
    },
    onShow() {
        this.tabList = [];
        this.getDetailImage();
    },
    onLoad() {
        this.scrollTops = 0;
        this.company_id = global.Storage.get("COMPANYID").company_id;
        this.type = this.$route.query.type; //type为0 专题活动页  1 为每日搭配
        this.serverUrl = global.baseConstant.serverUrl;
        this.getUserInfo();
        wx.setNavigationBarTitle({
            title: this.type == 0 ? "每日搭配" : "专题活动页" //动态修改小程序头部标题
        });
        let root = this;
        wx.getSystemInfo({
            success(res) {
                root.scrollHeight = res.windowHeight;
            }
        });
        this.scrollHeight = root.scrollHeight;
    },
    watch: {
        colorActiveIndex: function() {
            if (this.colorActiveIndex >= 0 && this.colorActiveIndex != null) {
                this.colorActiveItem = this.goodsInfo.colorsVoList[
                    this.colorActiveIndex
                ];
            } else {
                this.colorActiveItem = "";
            }
        },
        sizeActiveIndex: function() {
            if (this.sizeActiveIndex >= 0 && this.sizeActiveIndex != null) {
                this.sizeActiveItem = this.goodsInfo.sizesVoList[
                    this.sizeActiveIndex
                ];
            } else {
                this.sizeActiveItem = "";
            }
        },
        showPopup: function() {
            if (this.showPopup === false) {
                this.getUserInfo();
            }
        },
        tabList: function() {
            if (this.type == 0) {
                setTimeout(() => {
                    this.getHeight();
                }, 2000);
            }
        }
    },
    methods: {
        noop() {},
        // 获取用户信息
        getUserInfo() {
            if (this.btnUserInfoBtn) {
                return;
            }
            this.btnUserInfoBtn = true;
            global.toastLoading();
            let data = {};
            global.c_getUserInfo(data).then(
                res => {
                    global.toastLoading(false);
                    this.userInfo = res;
                    this.btnUserInfoBtn = false;
                },
                err => {
                    this.btnUserInfoBtn = false;
                }
            );
        },
        /**
         * 初始化获取参数
         */
        _initData() {
            // this.getGoodSellState();
            this.getGoodsDetail();
            // this.getGoodsStucks();
        },

        tabClick(e) {
            let id = e.currentTarget.dataset.id;
            if (id == "good-box0") {
                this.showBox1 = false;
                this.showBox2 = false;
            } else if (id == "good-box1") {
                this.showBox0 = false;
                this.showBox2 = false;
            } else {
                this.showBox0 = false;
                this.showBox1 = false;
            }
            this.toView = id;
            this.showBox0 = true;
            this.showBox1 = true;
            this.showBox2 = true;
            setTimeout(() => {
                this.tabActive = id;
            }, 600);
        },
        getHeight() {
            var query = wx.createSelectorQuery();
            query.select("#good-box0").boundingClientRect(rect => {
                this.navItemHeight1 = rect.height - 70;
            });
            query.select("#good-box1").boundingClientRect(rect => {
                this.navItemHeight2 = rect.height + 500;
            });
            query
                .select("#good-box2")
                .boundingClientRect(rect => {
                    this.navItemHeight3 = rect.height;
                })
                .exec();
        },
        onScroll(e) {
            if (
                this.navItemHeight1 == 0 ||
                e.target.scrollTop < this.navItemHeight1
            ) {
                this.tabActive = "good-box0";
            } else if (
                e.target.scrollTop >= this.navItemHeight1 &&
                e.target.scrollTop < this.navItemHeight1 + this.navItemHeight2
            ) {
                this.tabActive = "good-box1";
            } else {
                this.tabActive = "good-box2";
            }
        },
        getDetailImage() {
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
                                    global.toastLoading(false);
                                });
                            }
                            // 品质搭配
                            if (
                                itm.cmsBackpageDtCode === "mrdp01" &&
                                !!itm.cmsBackpageDttList
                            ) {
                                //  轮播图
                                this.imageList1 = itm.cmsBackpageDttList.filter(
                                    items => {
                                        return (
                                            items.cmsBackpageDttCode.indexOf(
                                                "mrdp01_baner"
                                            ) == 0
                                        );
                                    }
                                );

                                // 商品场景
                                this.btnImg1 = itm.cmsBackpageDttList.filter(
                                    items => {
                                        return (
                                            items.cmsBackpageDttCode.indexOf(
                                                "mrdp01_cjj"
                                            ) == 0
                                        );
                                    }
                                );
                                // 商品详情
                                this.goodsDetail1 = itm.cmsBackpageDttList.filter(
                                    items => {
                                        return (
                                            items.cmsBackpageDttCode.indexOf(
                                                "mrdp01_sp"
                                            ) == 0
                                        );
                                    }
                                );
                            }
                            // 焕国货
                            if (
                                itm.cmsBackpageDtCode === "mrdp02" &&
                                !!itm.cmsBackpageDttList
                            ) {
                                this.imageList2 = itm.cmsBackpageDttList.filter(
                                    items => {
                                        return (
                                            items.cmsBackpageDttCode.indexOf(
                                                "mrdp02_baner"
                                            ) == 0
                                        );
                                    }
                                );
                                // 商品场景
                                this.btnImg2 = itm.cmsBackpageDttList.filter(
                                    items => {
                                        return (
                                            items.cmsBackpageDttCode.indexOf(
                                                "mrdp02_cjj"
                                            ) == 0
                                        );
                                    }
                                );
                                // // 商品详情
                                this.goodsDetail2 = itm.cmsBackpageDttList.filter(
                                    items => {
                                        return (
                                            items.cmsBackpageDttCode.indexOf(
                                                "mrdp02_sp"
                                            ) == 0
                                        );
                                    }
                                );
                            }
                            // 七月穿搭
                            if (
                                itm.cmsBackpageDtCode === "mrdp03" &&
                                !!itm.cmsBackpageDttList
                            ) {
                                // 轮播
                                this.imageList3 = itm.cmsBackpageDttList.filter(
                                    items => {
                                        return (
                                            items.cmsBackpageDttCode.indexOf(
                                                "mrdp03_baner"
                                            ) == 0
                                        );
                                    }
                                );

                                // 商品场景
                                this.btnImg3 = itm.cmsBackpageDttList.filter(
                                    items => {
                                        return (
                                            items.cmsBackpageDttCode.indexOf(
                                                "mrdp03_cjj"
                                            ) == 0
                                        );
                                    }
                                );
                                //  商品详情
                                this.goodsDetail3 = itm.cmsBackpageDttList.filter(
                                    items => {
                                        return (
                                            items.cmsBackpageDttCode.indexOf(
                                                "mrdp03_sp"
                                            ) == 0
                                        );
                                    }
                                );
                            }
                            // 专属活动
                            if (
                                itm.cmsBackpageDtCode ===
                                    global.pageCode.index.children.zshd &&
                                !!itm.cmsBackpageDttList
                            ) {
                                itm.cmsBackpageDttList.forEach((it, index) => {
                                    // 轮播
                                    this.saleBanner = itm.cmsBackpageDttList.filter(
                                        items => {
                                            return (
                                                items.cmsBackpageDttCode.indexOf(
                                                    "zty_ad"
                                                ) == 0
                                            );
                                        }
                                    );
                                    // 商品场景
                                    this.saleBtnImg = itm.cmsBackpageDttList.filter(
                                        items => {
                                            return (
                                                items.cmsBackpageDttCode.indexOf(
                                                    "mrdp01_cjj"
                                                ) == 0
                                            );
                                        }
                                    );
                                    //  商品详情
                                    this.saleGoodsDetail = itm.cmsBackpageDttList.filter(
                                        items => {
                                            return (
                                                items.cmsBackpageDttCode.indexOf(
                                                    "mrdp01_sp"
                                                ) == 0
                                            );
                                        }
                                    );
                                    // 优惠信息
                                    this.voucherList = itm.cmsBackpageDttList.filter(
                                        items => {
                                            return (
                                                items.cmsBackpageDttCode.indexOf(
                                                    "zty_yh"
                                                ) == 0
                                            );
                                        }
                                    );
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
        },
        /**
         * sku选择弹窗
         */
        skuDialog() {
            if (this.isLoading) {
                return;
            }

            if (this.sellFlag !== 1) {
                Toast("该商品已下架");
                return;
            }
            // 如果已经存在sku，不再重新组装数据
            let goodSkuList = {};
            goodSkuList.colorList = [];
            goodSkuList.sizeList = [];
            goodSkuList.colorAndSizeList = [];
            goodSkuList.url = this.goodsInfo.url;
            goodSkuList.salePrice = this.goodsInfo.salePrice;

            // 颜色
            this.goodsInfo.colorsVoList.forEach((item, index) => {
                let obj = {};
                obj.colorCode = item.colorCode;
                obj.colorId = item.colorId;
                obj.colorName = item.colorName;
                obj.urls = item.urls;
                obj.none = true; // 默认按钮可以点击
                goodSkuList.colorList.push(obj);
            });
            // 尺码
            this.goodsInfo.sizesVoList.forEach((item, index) => {
                let obj = {};
                obj.sizeCode = item.sizeCode;
                obj.sizeId = item.sizeId;
                obj.sizeName = item.sizeName;
                obj.none = true; // 默认按钮可以点击
                goodSkuList.sizeList.push(obj);
            });
            // 颜色下存放对应尺码（防止数据污染）
            this.goodsInfo.colorsVoList.forEach((item, index) => {
                let obj = {};
                obj.colorCode = item.colorCode;
                obj.colorId = item.colorId;
                obj.colorName = item.colorName;
                goodSkuList.colorAndSizeList.push(obj);
                goodSkuList.colorAndSizeList[index].sizeChildList = [];
            });
            if (this.stuckList.length > 0) {
                this.stuckList.forEach((item, index) => {
                    goodSkuList.colorAndSizeList.forEach((itm, itmIndex) => {
                        if (item.colorCode === itm.colorCode) {
                            let obj = {};
                            obj.sizeCode = item.sizeCode;
                            obj.sizeName = item.sizeName;
                            obj.skuId = item.skuId;
                            obj.skuQty = item.skuQty;
                            goodSkuList.colorAndSizeList[
                                itmIndex
                            ].sizeChildList.push(obj);
                        }
                    });
                });
                this.goodSkuList = goodSkuList;
            } else {
                Toast("出错了，请重试~");
                return;
            }
            this.isShowSku = !this.isShowSku;
        },
        /**
         * 判断商品上下架
         */
        getGoodSellState() {
            let data = {
                buscontsCode: global.baseConstant.busContsCode,
                partGoodsCodeList: this.goodsCode
            };
            Goods.getGoodSellState(data).then(res => {
                this.sellFlag = res.partGoodsList[0].sellFlag;
                if (this.sellFlag !== 1) {
                    Toast("该商品已下架");
                }
            });
        },
        // 获取商品详情信息
        async getGoodsDetail() {
            let root = this;
            // this.isLoading = true;
            let data = {
                usrId: global.Storage.get("USER_INFO")
                    ? global.Storage.get("USER_INFO").usrId
                    : 0, // 用户未登录传0
                busContsCode: !!global.baseConstant.busContsCode
                    ? global.baseConstant.busContsCode
                    : global.Storage.get("properties").busContsCode,
                goodsCode: this.goodsCode,
                shopId: global.Storage.get("properties").shopId
            };
            global.toastLoading();
            await Goods.getGoodsInfo(data).then(res => {
                this.goodsInfo = res;
                this.posterGoodsCover = res.url;
                this.goodsId = res.ptiPartHdId;
                let colorList = res.colorsVoList;
                let sizesList = res.sizesVoList;
                global.toastLoading(false);
                // 获取颜色列表（banner）
                let goodsImages = [];
                if (colorList.length > 0) {
                    this.goodsImages = [];
                    colorList.forEach(item => {
                        if (
                            !!item.urls &&
                            !!item.urls.length &&
                            item.urls.length > 0
                        ) {
                            item.urls.forEach((image, imageIndex) => {
                                goodsImages.push(image);
                            });
                        }
                    });
                }
                // 如果没有颜色图，取主图
                if (goodsImages.length === 0 && res.url) {
                    goodsImages.push(res.url);
                }
                if (goodsImages.length >= 6) {
                    goodsImages.splice(6);
                }
                this.goodsImages = goodsImages;
                // 尺码跟颜色只有一款，不需要选择
                if (colorList.length === 1 && sizesList.length === 1) {
                    // this.isSku = false;
                    this.colorActiveIndex = 0;
                    this.sizeActiveIndex = 0;
                    this.colorActiveItem = colorList[0];
                    this.sizeActiveItem = sizesList[0];
                }
                this.getGoodsStucks();
            });
        },
        // 查询商品库存
        getGoodsStucks() {
            let data = {
                busContsCode: global.baseConstant.busContsCode,
                goodsCode: this.goodsCode,
                shopCode: global.Storage.get("properties").shopCode
            };
            Goods.getGoodsStock(data).then(
                res => {
                    this.maxNumber = res.goodsQty;
                    this.stuckList = res.skuList;
                    if (!this.isShowSku) {
                        // 颜色跟尺码只有一款，不打开弹窗
                        if (this.isSku) {
                            this.skuDialog();
                            return;
                        }
                    }
                    this.isLoading = false;
                },
                () => {
                    this.isLoading = false;
                }
            );
        },
        /**
         * 判断是否有选择商品sku
         */
        isSelectColorAndSize(isCloseDialog = true) {
            let flag = true;
            if (!this.colorActiveItem || !this.sizeActiveItem) {
                flag = false;
                if (isCloseDialog) {
                    this.skuDialog();
                }
            }
            return flag;
        },
        /**
         * 前置事件-加入购物车
         */
        async foreAddCart(item, index) {
            this.sizeActiveIndex = null;
            this.colorActiveIndex = null;
            this.btnStatus = false;
            this.goodsCode = item.url.match(/goodsCode=(\S*)&goodsType/)[1];
            if (!this.goodsCode) {
                Toast("敬请期待~");
                return;
            }
            this._initData();

            if (this.btnUserInfoBtn) {
                return;
            }
            let selectFlag = this.isSelectColorAndSize(false);
            if (this.isShowSku && !selectFlag) {
                this.btnLock = false;
                Toast("请选择商品~");
                return;
            }
            if (this.sellFlag !== 1) {
                Toast("该商品已下架");
                return;
            }
            this.isCartOrBuy = true;
            if (!this.isShowSku) {
                // 颜色跟尺码只有一款，不打开弹窗
                if (this.isSku) {
                    // this.skuDialog();
                    return;
                }
            }
            this.addCart();
        },
        /**
         * 确定加入购物车
         */
        addCart() {
            this.isShowSku = !this.isShowSku;
            // 按钮锁
            if (this.btnLock === true) {
                return;
            }
            this.btnLock = true;
            // 判断是否有选择sku
            let selectFlag = this.isSelectColorAndSize();

            if (!selectFlag) {
                this.btnLock = false;
                return;
            }
            if (
                this.userInfo.mobilePhone === null ||
                !this.userInfo.mobilePhone
            ) {
                this.btnLock = false;
                this.showPopup = true;
                this.isShowSku = false;
            } else {
                this.addCartFunction();
            }
        },
        // 加入购车接口
        addCartFunction() {
            //  获取sku的code值
            for (let i = 0; i < this.stuckList.length; i++) {
                if (
                    this.stuckList[i].sizeCode ===
                        this.sizeActiveItem.sizeCode &&
                    this.stuckList[i].colorCode ===
                        this.colorActiveItem.colorCode
                ) {
                    this.skuId = this.stuckList[i].skuId;
                }
            }
            // 检验商品库存、上下架
            let goodListObj = {
                shopId: global.Storage.get("properties").shopId,
                usrId: global.Storage.get("USER_INFO").usrId,
                goodList: [
                    {
                        busContsCode: global.baseConstant.busContsCode,
                        goodsCode: this.goodsCode,
                        ptiPartHdId: this.goodsId,
                        ptiPartDtSkuId: this.skuId,
                        amount: this.num,
                        orderFlag: this.goodsInfo.ordFlag
                    }
                ]
            };
            Goods.getUseableGood(goodListObj).then(
                res => {
                    if (res.sellAll !== 1) {
                        // 商品已下架
                        let unSellList = "";
                        let len = res.unSellList.length;
                        for (let i = 0; i < len; i++) {
                            unSellList += res.unSellList[i].goodsName + "、";
                        }
                        Toast(
                            unSellList.substring(
                                0,
                                unSellList.lastIndexOf("、")
                            ) + " 已下架！"
                        );

                        this.btnLock = false;
                        return;
                    }
                    if (res.stockAll !== 1) {
                        // 商品库存不足
                        let unStockList = "";
                        let len = res.unStockList.length;
                        for (let i = 0; i < len; i++) {
                            unStockList +=
                                res.unStockList[i].ptiPartHdName + "、";
                        }
                        Toast(
                            unStockList.substring(
                                0,
                                unStockList.lastIndexOf("、")
                            ) + " 库存不足！"
                        );

                        this.btnLock = false;
                        return;
                    }

                    // 加入购物车
                    let cartData = {
                        amount: this.num,
                        busContsCode: global.baseConstant.busContsCode,
                        cookieId: global.Storage.get("USER_INFO").cookieId,
                        ctmUsrId: global.Storage.get("USER_INFO").ctmUsrId,
                        dptId: global.Storage.get("properties").shopId,
                        goodsCode: this.goodsCode,
                        partDtSkuId: this.skuId,
                        newPartDtSkuId: this.skuId,
                        flag: 0 // 从商品添加进购物车
                    };
                    ShoppingCart.saveCart(cartData).then(
                        res => {
                            this.isShowSku = false;
                            setTimeout(() => {
                                this.btnLock = false;
                            }, 500);

                            Toast("加入购物车成功~");
                            this.$store.dispatch("user/updateShoppingCart");
                        },
                        err => {
                            this.btnLock = false;
                        }
                    );
                },
                () => {
                    this.btnLock = false;
                }
            );
        },
        /**
         * 方法回调
         */
        onAddCartOrBuy(colorItem, sizeItem) {
            if (this.isCartOrBuy) {
                // 点击加入购物车
                this.addCart();
            }
        },
        /**
         * 解决苹果手机触点问题
         * @param flag
         */
        numBlurComp(flag) {
            if (flag) {
                this.fixFlag = true;
                setTimeout(() => {
                    wx.pageScrollTo({
                        scrollTop: 1,
                        duration: 300
                    });
                }, 50);
            } else {
                this.fixFlag = false;
            }
        }
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss" scoped>
.ticket-model {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.5;
    z-index: 101;
}
.ticket-content {
    width: 100%;
    position: fixed;
    z-index: 102;
    bottom: 0;
    background: white;
}
.good-collocation {
    width: 100%;
    height: 100%;
    .tabs-box {
        width: 100%;
        height: computed(90);
        line-height: computed(90);
        text-align: center;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
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
    swipe-box {
        height: 0;
    }
    .swipe-box {
        height: computed(750);
        img {
            width: 100%;
            height: 100%;
        }
    }
    .nobanner {
        height: 0;
    }
    .menu-wrapper {
        width: 100%;
        margin-top: computed(90);
        .img-box1,
        .img-box2,
        .img-box3 {
            width: 100%;
            overflow-x: hidden;
            image {
                width: 100%;
                display: block;
            }
        }
        .goods-detail {
            position: absolute;
            margin-top: computed(4900);
            display: flex;
            flex-wrap: wrap;
            z-index: 99;
            width: 100%;
            .detail-box {
                width: 50%;
                height: computed(600);
                .goods-img {
                    padding-left: computed(20);
                    width: computed(334);
                    height: computed(362);
                }
                .goodsmall-img {
                    padding: computed(40) 0 0 computed(40);
                    width: computed(275);
                    height: computed(278);
                }
                .goodBig-img {
                    width: computed(703);
                }
                .button {
                    width: 70%;
                    height: computed(50);
                    margin: computed(120);
                    img:nth-of-type(1) {
                        width: computed(128);
                        height: computed(36);
                        margin-right: computed(20);
                    }
                    img:nth-of-type(2) {
                        width: computed(36);
                        height: computed(36);
                    }
                }
            }
        }
        .goods-box1,
        .goods-box2,
        .goods-box3 {
            position: relative;
        }
        .goods-box0,
        .goods-box1,
        .goods-box2 {
            width: computed(486);
            height: computed(253);
            position: absolute;
            z-index: 99;
            img {
                width: 100%;
                height: 100%;
            }
            .btn {
                width: computed(250);
                height: computed(70);
                margin: computed(50) 0 0 computed(180);
                span {
                    display: inline-block;
                }
                .buy-nowBtn {
                    width: computed(125);
                    height: computed(90);
                    margin-right: computed(8);
                }
                .shop-cartBtn {
                    width: computed(75);
                    height: computed(90);
                }
            }
        }
        .goods-box0 {
            margin: computed(1920) 0 0 computed(180);
        }
        .goods-box1 {
            margin: computed(3270) 0 0 computed(180);
        }
        .goods-box2 {
            margin: computed(4670) 0 0 computed(180);
        }
    }
    .voucherMes {
        width: 100%;
        img {
            width: 100%;
            display: block;
        }
    }
}
</style>






