/*
* createTime：2019/03/01
* author：junyong.hong
* description: 首页
* 页面路由配置在：show.router.js
*/
<template>
    <div v-show="isshow" style="height:100%;width:100%;">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>


        <div class="header">
            <!-- 搜索框 begin -->
            <div class="index-search" @click="goSearch()">
                <span class="iconfont iconsousuoxiao"></span>
                <input v-model="keyWord" type="text" placeholder="搜索商品" @keyup.enter="search()"  disabled="true">
            </div>
            <!-- 搜索框 end -->

            <div class="tab-cont">
                <div class="tab-item selected">首页</div>
                <scroll-view scroll-x class="scroll-view">

                    <ul class="tab-list flex-box">
                        <li class="tab-item"
                            :key="index"
                            @click="navGoto(item.url)"
                            v-for="(item,index) in sy_dbcdList">{{item.cmsBackpageDttName}}</li>
                    </ul>
                </scroll-view>
            </div>

        </div>

        <!-- 页面内容 -->
        <div class="index" style="height:calc(100% - 275rpx);width:100%;overflow:scroll">
            <div class="index-main">
                <!-- 首屏背景图 begin -->
                <img
                    v-for="(item, index) in sy_ad01List"
                    v-if="item.fileType == 1"
                    :key="item.coverFileUrl"
                    :src="filter.imgFilter(item.coverFileUrl,company_id)"
                    class="index-bg-img"
                    @onerror="global.errImg(event)"
                    lazy-load="true"
                >
                <!-- 首屏背景图 end -->

                <!-- 商品轮播 begin -->
                <div class="goods-banner" v-if="sy_splbList.goodsList && sy_splbList.goodsList.length > 0">
                    <swiper autoplay="true"
                            interval="4000"
                            @change="onBannerChange"
                            class="swiper">
                            <swiper-item v-for="(item,index) in sy_splbList.goodsList" :key="item.id">
                                <div @click="goDetail(item)"
                                    class="goods-banner-item flex-box" >
                                    <div class="goods-banner-item__left">
                                        <img class="goods-banner-item__img"
                                             :src="filter.imgFilter(item.goodsFilePath,company_id)"
                                             @onerror="global.errImg(event)"
                                             lazy-load="true">
                                    </div>

                                    <div class="goods-banner-item__info">
                                        <h5 class="goods-banner-item__name">{{item.goodsName}}</h5>
                                        <p :class="['goods-banner-item__describe']" >{{item.describe || '&nbsp;'}}</p>
                                        <div class="goods-banner-item__pcont">
                                            <span class="goods-banner-item__price">￥{{filter.Fix2(item.salePrice)}}</span>
                                            <span class="goods-banner-item__price2"
                                                  v-if="item.orderFlag != 1 && item.tagPrice">
                                                ￥{{filter.Fix2(item.tagPrice)}}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </swiper-item>

                    </swiper>
                    <!--自定义指示器 li的for循环需修改-->
                    <div class="custom-indicator" slot="indicator" v-if="sy_splbList.goodsList && sy_splbList.goodsList.length > 1">
                        <ul class="custom-list">
                            <li :class="['custom-item',{'selected':bannerIndex===index}]"
                                :key="item.id"
                                v-for="(item,index) in sy_splbList.goodsList" ></li>
                        </ul>
                    </div>
                </div>
                <!-- 商品轮播 end -->
            </div>

            <!-- 点击图片跳转区 begin -->
            <div class="index-img">
                <!--立领20元红包-->
                <img
                    v-for="(item, index) in sy_hbList"
                    v-if="item.fileType == 1"
                    :key="item.coverFileUrl"
                    class="coupon common-img"
                    :src="filter.imgFilter(item.coverFileUrl,company_id)"
                    @onerror="global.errImg(event)"
                    @click="navGoto(item.url)"
                    lazy-load="true"
                >
                <div>
                    <!--大家都在买-->
                    <img
                        v-for="(item, index) in sy_buyList"
                        v-if="item.fileType == 1"
                        :key="index"
                        class="new common-img"
                        :src="filter.imgFilter(item.coverFileUrl,company_id)"
                        @onerror="global.errImg(event)"
                        @click="navGoto(item.url)"
                        lazy-load="true"
                    >
                    <!--高返佣-->
                    <img
                        v-for="item in sy_gfyList"
                        :key="item.coverFileUrl"
                        v-if="item.fileType == 1"
                        class="special common-img"
                        :src="filter.imgFilter(item.coverFileUrl,company_id)"
                        @onerror="global.errImg(event)"
                        @click="navGoto(item.url)"
                        lazy-load="true"
                    >
                </div>

                <!--每日搭配-->
                <img
                    v-for="item in sy_mrdpList"
                    :key="item.coverFileUrl"
                    v-if="item.fileType == 1"
                    class="match-img common-img"
                    :src="filter.imgFilter(item.coverFileUrl,company_id)"
                    @onerror="global.errImg(event)"
                    @click="navGoto(item.url)"
                    lazy-load="true"
                >

                <!--秋季上新 四块-->
                <ul class="sort-img-list">
                    <li class="sort-img-item common-img">
                        <img
                            v-for="item in sy_hd01List"
                            :key="item.coverFileUrl"
                            v-if="item.fileType == 1"
                            :src="filter.imgFilter(item.coverFileUrl,company_id)"
                            class="sort-img"
                            @onerror="global.errImg(event)"
                            @click="navGoto(item.url)"
                            lazy-load="true">
                    </li>
                    <li class="sort-img-item common-img">
                        <img
                            v-for="item in sy_hd02List"
                            :key="item.coverFileUrl"
                            v-if="item.fileType == 1"
                            :src="filter.imgFilter(item.coverFileUrl,company_id)"
                            class="sort-img"
                            @onerror="global.errImg(event)"
                            @click="navGoto(item.url)"
                            lazy-load="true">
                    </li>
                    <li class="sort-img-item common-img">
                        <img
                            v-for="item in sy_hd03List"
                            :key="item.coverFileUrl"
                            v-if="item.fileType == 1"
                            :src="filter.imgFilter(item.coverFileUrl,company_id)"
                            class="sort-img"
                            @onerror="global.errImg(event)"
                            @click="navGoto(item.url)"
                            lazy-load="true">
                    </li>
                    <li class="sort-img-item common-img">
                        <img
                            v-for="item in sy_hd04List"
                            :key="item.coverFileUrl"
                            v-if="item.fileType == 1"
                            :src="filter.imgFilter(item.coverFileUrl,company_id)"
                            class="sort-img"
                            @onerror="global.errImg(event)"
                            @click="navGoto(item.url)"
                            lazy-load="true">
                    </li>
                </ul>

            </div>
            <!-- 点击图片跳转区 end -->

            <!-- 瀑布流区 begin -->
            <div class="falls">
                <img :style="{'width': item.width + 'rpx','height': item.height + 'rpx'}"
                    v-for="(item,index) in sy_ctmkList"
                    :key="item.coverFileUrl"
                    v-if="item.fileType == 1"
                    :src="filter.imgFilter(item.coverFileUrl,company_id)"
                    class="falls-img"
                    @onerror="global.errImg(event)"
                    @click="navGoto(item.url)"
                    @load="loadImg(item,$event)">
            </div>
            <!-- 瀑布流区 end -->

            <!-- 专属推荐 begin -->
            <div v-if="sy_zstjList.length !== 0" class="index-hot-goods">
                <div class="goods-title">
                    {{sy_zstjList.name}}
                </div>
                <good-list :goodsList="sy_zstjList.goodsList"></good-list>
                <div class="index-hot-goods__more" @click="navGoto('', sy_zstj)">
                    查看更多
                </div>

                <!-- 底部logo begin -->
                <img class="footer-logo"
                     :src="serverUrl + 'images/common/footer-logo.png'"
                     @onerror="global.errImg(event)"
                     lazy-load="true">
                <!-- 底部logo end -->
            </div>
            <!-- 专属推荐 begin -->

        </div>
        <!-- 页面内容 -->
    </div>
</template>
<script>
    import {UserService, Base, Login, Cms, Distribution} from "../../api/service";
    import Toast from 'vant-weapp/dist/toast/toast';
    import GoodList from '@/components/GoodList.vue'

    export default {
        config: {},
        props: ["isshow", "query",'indexScrollTop'],
        components:{'good-list': GoodList},
        data() {
            return {
                keyWord: "",

                // 模块编码
                modelCode:{
                    sy_dbcd: global.pageCode.index.children.sy_dbcd, // 顶部菜单
                    sy_ad01: global.pageCode.index.children.sy_ad01, // 首屏背景图
                    sy_hb: global.pageCode.index.children.sy_hb, // 立领20元红包
                    sy_buy: global.pageCode.index.children.sy_buy, // 大家都在买
                    sy_gfy: global.pageCode.index.children.sy_gfy, // 高返佣
                    sy_mrdp: global.pageCode.index.children.sy_mrdp, // 每日搭配

                    sy_hd01: global.pageCode.index.children.sy_hd01, // 秋季上新1
                    sy_hd02: global.pageCode.index.children.sy_hd02, // 秋季上新2
                    sy_hd03: global.pageCode.index.children.sy_hd03, // 秋季上新3
                    sy_hd04: global.pageCode.index.children.sy_hd04, // 秋季上新4
                    sy_ctmk: global.pageCode.index.children.sy_ctmk, // 瀑布流模块
                },
                // 获取商品列表
                sy_zstj: global.pageCode.index.children.sy_zstj, // 专属推荐 (商品列表)
                sy_zstjList: {},//专属推荐
                sy_splb: global.pageCode.index.children.sy_splb, // 商品轮播
                sy_splbList: {},//专属推荐

                sy_dbcdList: [],//顶部菜单
                sy_ad01List: [],//首屏背景图
                sy_hbList: [],//立领20元红包
                sy_buyList: [],//大家都在买
                sy_gfyList: [],//高返佣
                sy_mrdpList: [],//每日搭配
                sy_hd01List: [],//秋季上新1
                sy_hd02List: [],//秋季上新2
                sy_hd03List: [],//秋季上新3
                sy_hd04List: [],//秋季上新4
                sy_ctmkList: [],//瀑布流模块


                value: "",
                company_id: "",

                tabIndex:0,// 选中导航index
                bannerIndex: 0,// 商品轮播index
                bannerList: [],
                serverUrl: '',// 域名
            };
        },
        created() {
            this.serverUrl = global.baseConstant.serverUrl;
            this.company_id = global.Storage.get("COMPANYID").company_id;
            this._getBannerAndNav();
            this._getCommonGoodsList(this.sy_zstj, "sy_zstjList", 8);
            this._getCommonGoodsList(this.sy_splb, "sy_splbList");
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
            /** 瀑布流图片加载完事件 **/
            loadImg(item,e){
                let detail = e.mp.detail;
                item.width = detail.width;
                item.height = detail.height;
                console.log(detail,"---",item)
                wx.nextTick(()=>{
                    global.toastLoading(false);
                })
            },
            onBannerChange(val) {
                this.bannerIndex = val.mp.detail.current;
            },

            //相当于触发onshow
            onRefresh() {
                this._getBannerAndNav()
            },

            //  下拉刷新
            tabPullDownRefresh() {
                this.sy_ctmkList = [];
                this._getBannerAndNav();
                this._getCommonGoodsList(this.sy_zstj, "sy_zstjList", 8);
                this._getCommonGoodsList(this.sy_splb, "sy_splbList");
            },
            /**
             * 搜索
             */
            search() {
                this.$router.push("/pages/goodsPackage/goods/good-list?keyWord=" + this.keyWord);
            },
            /**
             * 获取banner、导航
             */
            _getBannerAndNav() {
                let data = {
                    cmsTemplateCode: global.Storage.get("TEMPLATE_INFO").cmsTemplateCode,
                    cmsWebCode: global.pageCode.index.name,
                    busContsCode: global.baseConstant.busContsCode
                };
                global.toastLoading();
                Cms.getUsrCmsInfoV2(data).then(res => {
                    res.cmsModulepageHdList.forEach((item, itemIndex) => {
                        if (!!item.cmsBackpageDtDtoList && item.cmsBackpageDtDtoList.length > 0) {
                            item.cmsBackpageDtDtoList.forEach((itm, itmIndex) => {

                                for(let key in this.modelCode){
                                    if (itm.cmsBackpageDtCode === key && !!itm.cmsBackpageDttList) {
                                        // 瀑布流模块初始化宽高
                                        if(key == 'sy_ctmk'){
                                            itm.cmsBackpageDttList.forEach(item=>{
                                                item.width = 100;
                                                item.height = 100;
                                            })
                                        }
                                        this[key+'List'] = itm.cmsBackpageDttList;
//                                        console.log(key+'List',"+++++++",this[key+'List'])

                                    }
                                }
                            });
                        }
                    });

                });
            },
            /**
             * 获取热卖商品、新品推荐
             * @param cmsWebItemCode 页面元素编号
             * @param listName 对象名称
             * @param sliceLength 对象名称
             *
             * cmsWebItemCode： 热卖商品 rmsp  新品推荐 xptj
             */
            _getCommonGoodsList(cmsWebItemCode, listName, sliceLength) {
                let data = {
                    // 模板编号
                    cmsTemplateCode: global.Storage.get("TEMPLATE_INFO").cmsTemplateCode,
                    // 页面编号
                    cmsWebCode: global.pageCode.index.name,
                    // 页面元素编号
                    cmsWebItemCode: cmsWebItemCode,
                    busContsCode: global.baseConstant.busContsCode,
                    shopId: global.Storage.get("properties").shopId,
                    onlineFlag: 1,// 是否获取促销图，不获取则不传
                };
                return Cms.getChoosebuyGoods(data).then(res => {
                    Toast.clear()
                    let obj = {};
                    if (!res || res.length === 0) {
                        return; // 判空
                    }
                    let currentList = [];
                    if (!!res[0].goodsList && res[0].goodsList.length) {
                        currentList = sliceLength ? res[0].goodsList.slice(0,sliceLength) : res[0].goodsList;
                    }

                    obj.name = res[0].cmsWebItemName;
                    obj.url = res[0].url;
                    obj.goodsList = currentList;
                    this[listName] = obj;
                    console.log(listName,this[listName],"====")
                });
            },
            /**
             * 导航跳转到对应路由
             * @param url 地址
             */
            navGoto(url, goodsMoreUrl = "") {
                if (!url) {
                    if (goodsMoreUrl) {
                        this.$router.push("/pages/goodsPackage/goods/good-otherlist?goodmoreId=" + goodsMoreUrl + '&type=' + 2);
                        return;
                    }

                    Toast("敬请期待~");
                    return;
                }
                this.$router.push(url);
            },
            //  跳转搜索页
            goSearch() {
                this.$router.push("/pages/goodsPackage/goods/good-search?value=" + this.value);
            },
        }
    };
</script>
<style lang="scss" type="text/scss" scoped>

    .header{
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
        background: $color-white;
    }
    .index-search {
        display: table-cell;
        padding: 0 computed(30);
        height: computed(110);
        background-color: $color-red;
        vertical-align: middle;
        font-size: $font-h2;
        position: relative;
        > span {
            position: absolute;
            left: computed(290);
            top: computed(35);
            color: $text-secondary;
        }
        > input {
            width: computed(690);
            height: computed(58);
            border: 1px solid $color-gray;
            border-radius: computed(29);
            text-align: center;
            font-size: $font-common;
            &::-webkit-input-placeholder {
                /*WebKit browsers*/
                color: $text-secondary;
            }
            &::-moz-input-placeholder {
                /*Mozilla Firefox*/
                color: $text-secondary;
            }
            &::-ms-input-placeholder {
                /*Internet Explorer*/
                color: $text-secondary;
            }
        }
    }
    .tab-cont{
        display: flex;
    }
    .scroll-view{
        flex:1;
        overflow-x: auto;
        height:computed(80);
        width: 100%;
    }
    .tab-list{
        color: $text-primary;
        white-space: nowrap;
        height:computed(80);
    }
    .tab-item{
        font-size: computed(28);

        word-wrap: normal;
        white-space:nowrap;
        padding: 0 computed(12);
        margin: 0 computed(20);
        line-height:computed(74);
        border-bottom: computed(3) solid transparent;
        border-top: computed(3) solid transparent;
        &.tab-item-index{
            position: absolute;
            left:0;
            top:0;
            z-index: 100;
        }
        &.selected{
            border-bottom-color: $domaincolor;
            color: $domaincolor;
        }
    }

    .index {
        position: absolute;
        padding-bottom: computed(95);
        padding-top: computed(190);
        overflow-y: auto;
        overflow-x: hidden;
        width: 100%;
        background-color: $color-white;
        -webkit-overflow-scrolling: touch;
        color: $text-primary;
    }
    .index-main{
        width: 100%;
        position: relative;
        .index-bg-img{
            width: 100%;
            height: computed(1050);
        }
        .goods-banner{
            margin: 0 0 computed(155) computed(20);
            width: calc(100% - #{computed(40)});
            background: $color-white;
            border-radius: computed(20);
            position: absolute;
            bottom: 0;
            left: 0;
        }
    }
    // 轮播商品
    .goods-banner-item{
        padding: computed(0) computed(20) 0 computed(20);
        margin-top:computed(20);

        .goods-banner-item__left{
            width: computed(200);
            height: computed(200);
            .goods-banner-item__img{
                width: 100%;
                height: 100%;
            }
        }

        .goods-banner-item__info{
            flex: 1;
            margin: computed(25) 0 0 computed(25);
            width: calc(100% - #{computed(280)});
            .goods-banner-item__name,
            .goods-banner-item__describe{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .goods-banner-item__name{
                font-size: $font-title1;
            }
            .goods-banner-item__describe{
                color: $text-secondary;
                font-size: $font-regular;
                line-height: computed(60);
            }
            .goods-banner-item__pcont{
                .goods-banner-item__price{
                    font-size: $font-h2;
                    color: $domaincolor;
                }
                .goods-banner-item__price2{
                    font-size: $font-common;
                    color: $text-secondary;
                    margin-left: computed(10);
                    text-decoration: line-through;
                }
            }
        }
    }
    // 自定义轮播logo
    .custom-indicator{
        position: absolute;
        bottom: computed(18);
        left:0;
        width: 100%;
        .custom-list{
            justify-content: center;
            display: flex;
            width: 100%;

            .custom-item{
                width: computed(14);
                height:computed(14);
                background: $text-placeholder;
                border-radius: computed(10);
                margin: 0 computed(10);
                overflow: hidden;

                &.selected{
                    background: $domaincolor;
                    width: computed(36)
                }
            }
        }
    }

    .common-img{
        padding:computed(10);
        border-radius: computed(40);
        box-sizing: border-box;
        overflow: hidden;
    }
    .index-img {
        margin: 0 computed(10) computed(10) computed(10);
        > div {
            display: flex;
            border-radius: computed(20);
            overflow: hidden;

            > img {
                flex:1;
                padding:computed(10);
                box-sizing: border-box;
            }
        }
        .match-img{
            width:100%;
            height: computed(450);
        }
        .sort-img-list{
            display: flex;
            flex-wrap: wrap;
            .sort-img-item{
                width:50%;
                overflow: hidden;
                margin-bottom: computed(10);
                height: computed(200);
                .sort-img{
                    width:100%;
                    height:100%;
                }
            }
        }
    }
    .coupon{
        width: 100%;
        height: computed(140);
    }
    .new,
    .special{
        width: 50%;
        height: computed(200);
    }

    .index-hot-goods {
        padding: computed(20) computed(20) 0 computed(20);
        background-color: $color-background;
        .goods-title {
            line-height:computed(90);
            font-size: $font-h1;
        }
        .index-hot-goods__more{
            border-radius:computed(33);
            width:computed(200);
            line-height:computed(66);
            border:1px solid $text-secondary;
            color: $text-secondary;
            font-size: $font-common;
            text-align: center;
            margin: 0 auto;
            margin-top: computed(10);
        }
    }
    .footer-logo{
        width: computed(419);
        height:computed(183);
        display: block;
        margin: 0 auto;
        margin-top: computed(28);
    }
    .falls{
        display: flex;
        flex-wrap: wrap;
        .falls-img{
        }
    }

</style>
