<template>
    <div class="search-box">
        <form action="javascript:return true" class="forms">
            <input
                confirm-type="search"
                v-model="keyWord"
                @confirm="onSearch(keyWord)"
                class="inputs"
                :focus="true"
                :placeholder="holder"
            />
            <p @click="cancel" class="cancels">取消</p>
            <i class="iconfont iconguanbi" @click="delvalue" v-if="keyWord !=''"></i>
        </form>
        <div class="history">
            <div class="history-title flex-between" v-if="HistoryList.length !==0">
                <span>历史记录</span>
                <span @click="removeHistory">清空历史记录</span>
            </div>
            <div class="history-list">
                <span
                    @click="choiceHistory(index)"
                    v-show="item"
                    v-for="(item,index) in HistoryList"
                    :key="index"
                >{{item}}</span>
            </div>
        </div>
        <div class="hot-search" v-if="hotList.length!==0">
            <p>热门搜索</p>
            <div class="hot-list">
                <span
                    @click="choiceHot(index,item)"
                    v-show="item.searchWord"
                    v-for="(item,index) in hotList"
                    :key="index"
                >{{item.searchWord}}</span>
            </div>
        </div>
        <van-toast id="van-toast"/>
    </div>
</template>
<script>
    import {Goods} from "../../../api/service";
    import Toast from "vant-weapp/dist/toast/toast";

    export default {
        config: {
            navigationBarTitleText: "商品搜索"
        },
        data() {
            return {
                keyWord: "", //关键字
                hotList: [], //热门搜索
                HistoryList: [], //历史纪录,
                holder: "", //placeholder
                classId: "", //商品列表传过来的ID
                linkUrl: "" //跳转链接
            };
        },
        watch: {
            keyWord: function () {
                if (this.keyWord === "" && this.holder == "") {
                    this.holder = "搜索商品";
                    return;
                }
                if (this.holder == "") {
                    this.holder = this.holder;
                }
            }
        },
        onLoad() {
            this.keyWord = this.$route.query.keyWord;
            this.showHistory();
            this.getHotList();
        },
        onUnload() {
            Object.assign(this.$data, this.$options.data());
        },
        methods: {
            // 搜索
            onSearch(keyWord) {
                console.log(this.linkUrl, "this.linkUrl");
                // 判读是否有配置跳转链接
                if (this.linkUrl) {
                    if (
                        this.linkUrl.indexOf("http://") === -1 &&
                        this.linkUrl.indexOf("https://") === -1
                    ) {
                        // 自定义埋点
                        global.gio("track", "searchListClick", {});
                        this.$router.push(this.linkUrl);
                    } else {
                        window.location.href = this.linkUrl;
                    }
                } else if (this.keyWord || this.holder != "搜索商品") {
                    this.keyWord = this.keyWord ? this.keyWord : this.holder;
                    // 自定义埋点
                    global.gio("track", "searchListClick", {
                        searchKeywords: this.keyWord
                    });
                    this.$router.replace(
                        "/pages/goodsPackage/goods/good-list?keywords=" +
                        this.keyWord
                    );
                } else {
                    Toast("请输入搜索商品~");
                    return;
                }
                this.keyWord = this.keyWord ? this.keyWord : this.holder;
                if (this.HistoryList.length > 0) {
                    // 有数据的话 判断
                    console.log(this.keyWord, "valuesss");
                    if (this.HistoryList.indexOf(this.keyWord) != -1) {
                        // 有相同的，先删除 再添加
                        this.HistoryList.splice(
                            this.HistoryList.indexOf(this.keyWord),
                            1
                        );
                        this.HistoryList.unshift(this.keyWord);
                    } else {
                        // 没有相同的 添加
                        this.HistoryList.unshift(this.keyWord);
                    }
                } else {
                    // 没有数据 添加
                    this.HistoryList.unshift(this.keyWord);
                }
                if (this.HistoryList.length > 15) {
                    // 保留15个值
                    this.HistoryList.pop();
                }
                global.Storage.set("HistoryList", JSON.stringify(this.HistoryList));
            },
            // 展示历史纪录
            showHistory() {
                var HistoryList = JSON.parse(
                    global.Storage.get("HistoryList") || "[]"
                );
                this.HistoryList = HistoryList;
            },
            // 清空历史纪录
            removeHistory() {
                this.HistoryList = global.Storage.remove("HistoryList");
                this.HistoryList = [];
            },
            // 全部移除按钮
            delvalue() {
                this.keyWord = "";
                if (this.holder == "") {
                    this.holder = "搜索商品";
                } else {
                    this.holder = this.holder;
                }
            },
            // 取消
            cancel() {
                if (this.keyWord) {
                    this.$router.replace(
                        "/pages/goodsPackage/goods/good-list?keywords=" +
                        this.keyWord
                    );
                } else {
                    this.$router.go(-1);
                }
            },
            // 选择历史纪录
            choiceHistory(index) {
                this.keyWord = this.HistoryList[index];
                this.onSearch();
            },
            // 选择热门搜索
            choiceHot(index, item) {
                this.linkUrl = item.searchWordUrl;
                this.keyWord = this.hotList[index].searchWord;
                global.Storage.set("HistoryList", JSON.stringify(this.HistoryList));
                this.onSearch();
            },
            // 获取热门搜索列表
            getHotList(callback) {
                Goods.getHotGoods({
                    isShop: 1
                }).then(res => {
                    res.forEach(item => {
                        if (item.searchWordTypeCode === "D_SCPRESET") {
                            if (!!item.searchWord && !!item.invalidTime) {
                                let timeStart = new Date().getTime()
                                let timeEnd = new Date(Date.parse(item.invalidTime.replace(/-/g, "/"))).getTime()
                                if (timeStart <= timeEnd) {
                                    this.holder = item.searchWord;
                                    this.linkUrl = item.searchWordUrl;
                                }
                            } else if (!!item.searchWord && !item.invalidTime) {
                                this.holder = item.searchWord;
                                this.linkUrl = item.searchWordUrl;
                            }
                        } else {
                            if (item.searchWord) this.hotList.push(item);
                        }
                    });
                });
                if (this.keyWord == "") {
                    this.holder = "搜索商品";
                }
            }
        }
    };
</script>
<style scoped lang="scss" type="text/scss">
    .search-box {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow-x: hidden;
        .forms {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9;
            height: computed(110);
            width: 100%;
            background: $domaincolor;
            .inputs::-webkit-input-placeholder {
                color: $text-placeholder;
            }
            .inputs {
                width: computed(550);
                height: computed(58);
                background: $color-background;
                margin: computed(30) computed(20);
                padding-right: computed(55);
                outline: none;
                border: 0;
                border-radius: computed(29) !important;
                font-size: $font-common;
                padding-left: computed(30);
                user-select: text;
                -webkit-user-select: text;
                z-index: 99999;
            }
            .inputs[type="search"]::-webkit-search-cancel-button {
                display: none;
            }
            .iconguanbi {
                float: right;
                width: computed(30);
                height: computed(30);
                margin: computed(-72) computed(120) 0 0;
                font-size: $font-common;
                color: $text-placeholder;
            }
            .cancels {
                float: right;
                margin: computed(-78) computed(18) 0 0;
                font-size: $font-regular;
                color: $color-white;
            }
        }
        .history {
            margin-top: computed(130);
            width: 100%;
            .history-title {
                span {
                    display: inline-block;
                    padding: computed(20) computed(25) computed(15) computed(25);
                    color: $text-secondary;
                    font-size: $font-regular;
                }
                span:nth-of-type(2) {
                    color: $text-primary;
                    text-decoration: underline;
                }
            }
            .history-list {
                width: 94%;
                padding: 1% 2%;
                span {
                    display: inline-block;
                    line-height: computed(45);
                    padding: 0 computed(20);
                    margin: computed(0) computed(10) computed(10) computed(10);
                    border: computed(2) solid $text-regular;
                    font-size: $font-common;
                    border-radius: computed(20);
                    text-align: justify;
                    text-justify: newspaper;
                    word-break: break-all;
                }
            }
        }
        .hot-search {
            width: 94%;
            color: $color-red;
            padding: computed(13) computed(25);
            font-size: $font-regular;
            span {
                display: inline-block;
                padding: computed(5) computed(20);
                margin: computed(20) computed(20) 0 0;
                border: computed(2) solid $color-red;
                font-size: $font-common;
                border-radius: computed(20);
            }
        }
    }
</style>

