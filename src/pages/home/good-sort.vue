/*
* createTime：2018/11/1
* author：lan.chen
* description:分类
*/
<template>
    <div class="container sort" v-show="isshow">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>
        <div class="sort-search" @click="goSearch()">
            <span class="iconfont iconsousuoxiao"></span>
            <input
                v-model="keyWord"
                type="text"
                placeholder="搜索商品"
                @keyup.enter="search()"
                disabled="true"
            />
        </div>
        <div class="main">
            <!--分类左侧导航-->
            <div class="main-left">
                <scroll-view
                    class="menu-wrapper"
                    :scroll-into-view="navId"
                    scroll-with-animation="true"
                    scroll-y
                    :style="{height:scrollHeight-20+'px'}"
                    :scroll-top="scrollTops"
                >
                    <ul class="tab-list">
                        <li @click="goAll()" class="all">全部</li>
                        <li
                            class="tab-list-item"
                            v-for="(item,index) in classList"
                            :id="'nav_'+index"
                            :class="index===currentIndex ? 'item-selected' : ''"
                            :key="index"
                            @tap="selectMenu(index)"
                        >{{item.cmsBusconclaHdName}}</li>
                    </ul>
                </scroll-view>
            </div>
            <!--右侧内容-->

            <!-- 分类子内容 -->
            <div class="main-right">
                <!-- 轮播图 -->
                <swiper
                    autoplay="true"
                    interval="3000"
                    :class="imageList.length===0?'swipe-boxs':'swipe-box'"
                >
                    <block v-for="(image, index) in imageList" :key="index">
                        <swiper-item>
                            <img
                                class="banner"
                                lazy-load="true"
                                :src="filter.imgFilter(image.coverFileUrl,company_id)"
                                :key="image.coverFileUrl"
                                @click="goUrl(image.url)"
                                @onerror="global.errImg(event)"
                            />
                        </swiper-item>
                    </block>
                </swiper>
                <div :class="imageList.length===0?'rightConts':'rightCont'">
                    <scroll-view
                        scroll-y="true"
                        @scroll="onScroll"
                        :scroll-into-view="contentId"
                        scroll-with-animation="true"
                        class="foods-wrapper"
                        :style="{height:scrollHeight+150+'px'}"
                    >
                        <div
                            class="material-parent"
                            v-for="(classItem,i) in classList"
                            :id="'con_'+i"
                            :key="i"
                        >
                            <div class="material2">
                                <div class="material2-title" @click="goListPage(classItem,url)">
                                    <p>{{classItem.cmsBusconclaHdName}}</p>
                                    <p class="material2-title-more">
                                        查看更多
                                        <span class="iconfont iconxuanzexiao"></span>
                                    </p>
                                </div>
                                <ul class="material2-list">
                                    <li
                                        class="material2-list-item"
                                        :key="item.cmsBusconclaHdCode"
                                        @click="goListPage(item)"
                                        v-for="(item,index) in classItem.childs"
                                    >
                                        <img
                                            class="item_img_border"
                                            :src="filter.imgFilter(item.picUrl,company_id)"
                                            :key="item.picUrl"
                                            lazy-load="true"
                                        />
                                        <div class="item-describe">{{item.cmsBusconclaHdName}}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="bottoms" :style="{height: needAddHeight+'px'}"></div>
                    </scroll-view>
                </div>
            </div>
        </div>
        <van-toast id="van-toast" />
    </div>

    <!--底部导航-->
</template>

<script>
import { Goods, Cms } from "../../api/service";
import Toast from "vant-weapp/dist/toast/toast";

export default {
    config: {
        enablePullDownRefresh: true,
        backgroundTextStyle: "dark",
        navigationBarTitleText: "分类"
    },
    props: ["isshow", "query"],
    data() {
        return {
            classList: [], //分类列表
            needAddHeight: 0, //设置底部需增加高度
            imageList: [], //头部轮播图
            fflb: global.pageCode.index.children.fflb, // 爆款全场
            company_id: "",
            contentId: "", // 每个food-list的id，scroll-into-view滚动到对应的id
            navId: "", // 导航模块对应的id，用来联动内容区域
            currentIndex: 0, //当前索引值
            navulHeight: 0, // 导航里ul高度
            navItemHeight: 0, // 每个导航高度
            listHeight: [], // foods内部块的高度
            contentHeight: [], //获取内部滚动区域高度
            lastHeight: 0, //最后一个内部块的高度
            scrollHeight: 0, //滚动高度
            scrollTops: 0, //左侧距离顶部距离\
            value: ""
        };
    },
    created() {
        this.company_id = global.Storage.get("COMPANYID").company_id;
        this.getNavList();
        this.getImage();
        let root = this;
        wx.getSystemInfo({
            success(res) {
                root.scrollHeight = res.windowHeight;
            }
        });
        this.scrollHeight = root.scrollHeight;
    },
    methods: {
        //  跳转搜索页
        goSearch() {
            this.$router.push(
                "/pages/goodsPackage/goods/good-search?value=" + this.value
            );
        },
        //  下拉刷新
        tabPullDownRefresh() {
            this.imageList = [];
            this.classList = [];
            this.getNavList(1);
            this.getImage(1);
            this.currentIndex = 0;
        },
        selectMenu(index) {
            this.contentId = `con_${index}`;
            this.navId = `nav_${index}`;
            this.currentIndex = index;
        },
        onScroll(e) {
            if (e.mp.detail.scrollTop > 1000) {
                this.scrollTops = 200;
            } else {
                this.scrollTops = 0;
            }
            var query = wx.createSelectorQuery();
            this.contentId = "";
            let scrollTop = e.target.scrollTop;
            let length = this.listHeight.length;
            if (scrollTop > 0 && scrollTop < this.listHeight[0]) {
                this.currentIndex = 0;
            }
            for (let i = 0; i < length; i++) {
                if (
                    scrollTop >= this.listHeight[i - 1] &&
                    scrollTop < this.listHeight[i]
                ) {
                    this.currentIndex = i;
                }
            }
        },
        getFoodHeight() {
            var root = this;
            var query = wx.createSelectorQuery();
            let h = 0;
            this.listHeight = [];
            query.selectAll(".material-parent").boundingClientRect(rects => {
                rects.forEach(rect => {
                    h += rect.height;
                    // 获取内部块高度
                    this.listHeight.push(h);
                });
            });
            // 获取内容区域滚动高度
            query.select(".foods-wrapper").boundingClientRect(rect => {
                this.contentHeight = rect.height;
            });
            // 获取导航栏ul高度
            query.select(".tab-list").boundingClientRect(rect => {
                this.navulHeight = rect.height;
            });
            // 获取最后一个分类的内部高度
            query
                .select("#con_" + (root.classList.length - 1))
                .boundingClientRect(rect => {
                    this.lastHeight = rect.height;
                    this.needAddHeight =
                        this.contentHeight - this.lastHeight - 70;
                });
            // 获取每个导航栏高度
            query
                .select(".tab-list-item")
                .boundingClientRect(rect => {
                    this.navItemHeight = rect.height;
                })
                .exec();
        },
        //跳转到全部 跳转全部
        goAll() {
            this.$router.push("/pages/goodsPackage/goods/good-list");
        },
        // 商品墙页跳转
        goListPage(item, url) {
            this.$router.push(
                "/pages/goodsPackage/goods/good-list?classId=" +
                    item.cmsBusconclaHdCode
            );
        },
        // 获取导航栏元素
        getNavList() {
            let data = {
                companyId: global.Storage.get("COMPANYID").company_id,
                busContsCode: global.baseConstant.busContsCode,
                ownCompanyId: global.Storage.get("COMPANYID").company_id,
                layer: "3"
            };
            global.toastLoading();
            Goods.getGoodsLayerClass(data).then(res => {
                this.classList = res[0].childs;
                global.toastLoading(false);
            });
        },
        // 获取轮播图片
        getImage() {
            let data = {
                cmsTemplateCode: global.Storage.get("TEMPLATE_INFO")
                    .cmsTemplateCode,
                cmsWebCode: global.pageCode.index.name,
                busContsCode: global.baseConstant.busContsCode
            };
            Cms.getUsrCmsInfoV2(data).then(res => {
                res.cmsModulepageHdList.forEach((item, itemIndex) => {
                    if (
                        !!item.cmsBackpageDtDtoList &&
                        item.cmsBackpageDtDtoList.length > 0
                    ) {
                        item.cmsBackpageDtDtoList.forEach((itm, itmIndex) => {
                            // banner
                            // balongshouye是由跟后台配置约定，需事先知道
                            if (
                                itm.cmsBackpageDtCode ===
                                    global.pageCode.index.children.fflb &&
                                !!itm.cmsBackpageDttList
                            ) {
                                itm.cmsBackpageDttList.forEach((it, index) => {
                                    this.imageList.push(it);
                                    global.toastLoading(false);
                                });
                            }
                        });
                    }
                });
            });
        },
        /*
         * 轮播图跳转
         */
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
    },
    watch: {
        classList() {
            // 获取模块高度，即food-list
            setTimeout(() => {
                this.getFoodHeight();
            }, 1000);
            this.listHeight = [];
        },
        currentIndex() {
            if (this.contentHeight < this.navulHeight) {
                let h = this.currentIndex * this.navItemHeight;
                if (h > this.contentHeight) {
                    // 导航滑动
                    this.navId = `nav_${this.currentIndex}`;
                } else {
                    this.navId = "nav_0";
                }
            }
        }
    }
};
</script>


<style lang="scss" type="text/scss"  scoped>
.sort,
.main {
    height: 100%;
}
swiper {
    height: 0;
}
.sort-search {
    width: 100%;
    position: fixed;
    display: table-cell;
    padding: 0 computed(30);
    height: computed(110);
    background: red;
    vertical-align: middle;
    font-size: $font-h2;
    z-index: 10000;
    > span {
        position: absolute;
        left: computed(55);
        top: computed(35);
        color: $text-secondary;
    }
    > input {
        width: computed(630);
        height: computed(58);
        margin-top: computed(20);
        padding-left: computed(60);
        border: 1px solid $color-gray;
        border-radius: computed(29);
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
.main {
    position: absolute;
    width: 100%;
    display: flex;
    overflow-y: hidden !important;
    box-sizing: border-box;
    margin-top: computed(110);
    .swipe-box {
        position: fixed;
        left: computed(182);
        background: white;
        z-index: 9999;
        width: 100%;
        height: computed(570);
        .banner {
            width: computed(570);
            height: 100%;
        }
    }
    .swipe-boxs {
        height: 0;
    }
}
.main-left {
    background: $color-border;
    border-right: computed(1) solid rgba(230, 230, 230, 1);
    width: computed(180);
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }
}
.tab-list {
    margin-bottom: computed(100);
    .all {
        margin: computed(30) computed(50);
        color: $text-primary;
        font-size: $font-regular;
        text-align: center;
    }
    .tab-list-item {
        width: 98%;
        text-align: center;
        color: $text-primary;
        font-size: computed(28);
        line-height: computed(70);
        position: relative;
        margin-top: computed(20);
        &.item-selected {
            background: #fff;
            color: $domaincolor;
            width: 100%;
            &::after {
                content: "";
                width: computed(8);
                height: 100%;
                background-color: $domaincolor;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }
}
.main-right {
    flex: 1;
    width: 80%;
    box-sizing: border-box;
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }
    .rightCont {
        position: absolute;
        -webkit-overflow-scrolling: touch;
        padding-top: computed(580);
        box-sizing: border-box;
    }
    .rightConts {
        position: absolute;
        -webkit-overflow-scrolling: touch;
        padding-top: computed(0);
        box-sizing: border-box;
    }
}
.material {
    text-align: center;
    padding: 0 computed(30);
}
.material-title {
    display: flex;
    justify-content: space-between;
    font-size: computed(28);
    font-weight: bold;
    padding: computed(60) 0;
}
.material2 {
    text-align: center;
    margin: computed(13) computed(30) computed(0) computed(30);
}
.material-parent {
    &:first-child {
        .material2 {
            border-top: none;
        }
    }
}
.material2-title {
    width: 100%;
    text-align: center;
    font-size: computed(30);
    line-height: computed(48);
    color: $text-primary;
    font-weight: bold;
    .material2-title-more {
        font-size: computed(24);
        font-weight: 500;
        .van-icon-arrow::before {
            font-size: $font-small;
        }
    }
}
.material2-list {
    display: flex;
    flex-wrap: wrap;
    margin: computed(20) 0 computed(23) 0;
    border-bottom: computed(1) solid #cccccc;
    .material2-list-item {
        width: 33.3%;
        padding-bottom: computed(16);
        .item_img_border {
            width: computed(150);
            height: computed(150);
            background: rgba(255, 255, 255, 1);
        }

        .item-describe {
            margin: computed(17) 0 computed(10) 0;
            font-size: computed(24);
            text-align: center;
            color: $text-primary;
        }
    }
}
</style>
