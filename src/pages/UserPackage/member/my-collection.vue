
/*
* createTime：2018/11/5
* author：en.chen
* description:  我的收藏
*/
<template>
    <div class="my-collection">
        <wxs module="filter" src="../../../filter/filterCommon.wxs"></wxs>
        <div class="collection_title fixed-content flex-between" @click="toogleState()">
            <span>收藏的商品</span>
            <p v-if="goodsList.length>0">
                <span v-if="flag==true" class="toggle">编辑</span>
                <span v-else class="toggle">完成</span>
            </p>
        </div>
        <!--商品列表 begin-->
        <!-- <div > -->
        <ul class="good-list" v-if="!showEmpty" ref="list">
            <li
                class="good-list-item flex-vbox flex-vcenter"
                v-for="(item,index) in goodsList"
                :key="index"
            >
                <div class="good-item-img">
                    <van-checkbox
                        :value="item.checked"
                        v-if="showChecked==true"
                        class="checkbox"
                        @change="singleCheckedBtn(item)"
                        checked-color="#FF3636"
                    ></van-checkbox>
                    <div :class="flag===false?'img-shadow':'img-box'"></div>
                    <img
                        :src="filter.imgFilter(item.thumb,company_id, '345*345')"
                        @click="goDetail(item)"
                        lazy-load="true"
                    />
                </div>

                <!-- <div class="diy-flag" v-if="item.orderFlag === 1">定制</div> -->
                <p class="good-item-describe fs28">{{item.goodsName}}</p>
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
        <div class="empty-box">
            <empty-content v-if="showEmpty"></empty-content>
        </div>
        <!-- <empty emptyText="暂无收藏商品信息~" v-show="showEmpty" style="position:fixed;top:0"></empty> -->
        <!-- 点击编辑弹出移除框 -->
        <div class="removeTip fixed-content flex-between" v-if="remove==false">
            <van-checkbox :value="checkedAll" class="checkbox" @change="allChecked">全选</van-checkbox>
            <button class="good-remove" @click="deleteCollected()">移除</button>
        </div>
        <van-dialog id="van-dialog" />
        <van-toast id="van-toast" />
        <!--没有商品 end-->
    </div>
</template>
<script>
import { Collection, Goods } from "../../../api/service";
import EmptyContent from "../../../components/EmptyContent";
import Dialog from "vant-weapp/dist/dialog/dialog";
import Toast from "vant-weapp/dist/toast/toast";
export default {
    config: {
        enablePullDownRefresh: true,
        backgroundTextStyle: "dark",
        navigationBarTitleText: "我的收藏"
    },
    components: {
        "empty-content": EmptyContent
    },
    data() {
        return {
            flag: true, //切换编辑完成开关
            checkedAll: false, //全选
            remove: true,
            showChecked: false, //显示复选框
            goodsList: [], // 商品列表
            // loading: false, // 控制loading显示
            finished: false, // 控制是否加载更多商品
            pageNum: 1,
            pageSize: 8,
            // isLoading: false,
            showEmpty: false,
            company_id: "",
            goDetail_lock: false //跳转锁
        };
    },
    onLoad() {
        global.toastLoading();
        Object.assign(this.$data, this.$options.data());
        this.company_id = global.Storage.get("COMPANYID").company_id;
        this.getList();
    },
    // 下拉刷新事件
    onPullDownRefresh() {
        this.pageNum = 1;
        this.goodsList = [];
        this.getList();
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
            this.checkedAll = false;
            this.getList();
        }
    },

    methods: {
        //  加载收藏商品列表
        getList() {
            let data = {
                cltTypeCode: "",
                collocationCode: "",
                priceTypeCode: "",
                busContsCode: global.baseConstant.busContsCode,
                shopDptId: global.Storage.get("properties").shopId,
                pageSize: this.pageSize,
                pageNum: this.pageNum
            };
            Collection.getCollectionList(data).then(
                res => {
                    this.goodsList.push.apply(this.goodsList, res.pages.list);
                    var arr = [];
                    arr = this.goodsList.map(i => {
                        this.$set(i, "checked", false);
                        return i;
                    });
                    this.goodsList = arr;
                    global.toastLoading(false);
                    if (this.goodsList.length == 0) {
                        this.showEmpty = true;
                    }
                    if (
                        res.pages.pageNum >= res.pages.pages ||
                        this.goodsList.length >= res.pages.total
                    ) {
                        this.finished = true;
                    } else {
                        this.finished = false;
                    }
                    typeof callback === "function" && callback();
                },
                err => {}
            );
        },
        // 切换完成编辑状态
        toogleState() {
            this.flag = !this.flag;
            this.remove = !this.remove;
            this.showChecked = !this.showChecked;
        },
        // 单选
        singleCheckedBtn(item) {
            item.checked = !item.checked;
            var isExitCheckedNo = this.goodsList.every(item => {
                return item.checked === true;
            });
            if (isExitCheckedNo) {
                this.checkedAll = true;
            } else {
                this.checkedAll = false;
            }
        },
        // 全选
        allChecked(val) {
            if (val.mp.detail === false) {
                this.goodsList.forEach(item => {
                    item.checked = false;
                });
                this.checkedAll = false;
            } else {
                this.goodsList.forEach(item => {
                    item.checked = true;
                });
                this.checkedAll = true;
            }
        },
        //  取消收藏/移除愿望清单
        deleteCollected(item) {
            let goodsCodes = [];
            for (let i = 0; i < this.goodsList.length; i++) {
                if (this.goodsList[i].checked == true) {
                    goodsCodes.push(this.goodsList[i].id);
                }
            }
            if (goodsCodes.length > 0) {
                Dialog.confirm({
                    message: "确认要移除改收藏商品嘛？"
                }).then(() => {
                    let data = {
                        goodCodeStr: goodsCodes.join(","),
                        ids: goodsCodes.join(",")
                    };
                    Collection.deleteCollection(data).then(res => {
                        Toast("操作成功~");
                        this.flag = !this.flag;
                        this.remove = !this.remove;
                        this.showChecked = !this.showChecked;
                        this.$nextTick(() => {
                            this.pageNum = 1;
                            this.goodsList = [];
                            this.getList();
                        });
                    });
                });
            } else {
                Dialog.alert({
                    message: "请选择要移除的收藏商品~"
                });
            }
        },
        //  跳转商品详情
        goDetail(item) {
            if (this.goDetail_lock) {
                return;
            }
            this.goDetail_lock = true;
            if (item.orderFlag === 0) {
                //非定制商品
                let params = {
                    ownCompanyId: global.Storage.get("COMPANYID").company_id,
                    goodsCode: item.goodsCode,
                    buscontsCode: global.baseConstant.busContsCode
                };
                Goods.isShelves(params).then(
                    res => {
                        // 未导入微信平台和全平台跳转至商品未上架页面
                        if (!res) {
                            this.$router.push(
                                "/pages/goodsPackage/goods/off-shelves"
                            );
                            this.goDetail_lock = false;
                        } else {
                            this.$router.push(
                                "/pages/goodsPackage/wares/wares-detail?goodsCode=" +
                                    item.goodsCode +
                                    "&goodsType=singleGood"
                            );
                            this.goDetail_lock = false;
                        }
                    },
                    () => {
                        this.goDetail_lock = false;
                    }
                );
            } else {
                this.goDetail_lock = false;
            }
        }
    },
    mounted() {
        setTimeout(() => {
            this.$nextTick(() => {
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                });
            });
        }, 0);
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="">
page {
    height: 100%;
}
</style>
<style scoped lang="scss">
@import "@/assets/scss/common/goods.scss";
.my-collection {
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
    padding-bottom: computed(100);
    min-height: 100%;
    background: $color-light-gray;
    .fixed-content {
        width: 100%;
        position: fixed;
        left: 0;
        z-index: 99;
    }
    .collection_title {
        height: computed(40);
        top: 0;
        font-size: $font-h1;
        font-weight: bold;
        padding: computed(27) computed(25) computed(20) computed(30);
        color: $text-primary;
        background: $color-light-gray;
        .toggle {
            font-size: $font-common;
            color: $domaincolor;
            display: inline-block;
            box-sizing: border-box;
            width: computed(84);
            height: computed(40);
            border: computed(2) solid $domaincolor;
            text-align: center;
            margin-right: computed(61);
            border-radius: $btn-radius25;
        }
        p {
            margin-top: computed(-8);
        }
    }
    .removeTip {
        bottom: 0;
        background-color: $color-white;
        align-items: center;
        .good-remove {
            width: computed(200);
            line-height: computed(80);
            text-align: center;
            margin: computed(10) computed(30);
            background: $bggradientcolor;
            color: $color-white;
            border-radius: $btn-radius40;
        }
        .checkbox {
            padding-left: computed(30);
        }
    }
    .empty-box {
        padding-top: computed(100);
    }
}
</style>
