<!--
 * @Author: yongtian.hong
 * @Date: 2019-08-05 13:18:56
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-08-14 17:07:39
 * @Description: 
 -->
<style lang='scss' scoped >
.post-sale-list-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    // background-color: #f5f5f5;
    box-sizing: border-box;
    padding-top: 30px;
    .title {
        position: fixed;
        top: 0;
        z-index: 1000;
        width: 100%;
        font-size: computed(32);
        font-weight: bold;
        padding: computed(30) 0;
        text-align: center;
        background: #fff;
        margin-bottom: computed(30);
    }
    .content {
        flex: 1;
    }
    .phone-box {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .iconfont {
        font-size: 36px;
        margin-right: 20px;
    }
    .split-line {
        width: 1px;
        height: 80%;
        background-color: #cccccc;
    }
}
</style>

<template>
    <div class="post-sale-list-wrap">
        <empty-content v-if="isEmpty"></empty-content>
        <div v-for="item in list" :key="item.id">
            <list-item :ord="item" :reload="getListData" />
        </div>

        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />
    </div>
</template>
<script>
import postSaleApi from "@/api/service/postSale";
import Toast from "vant-weapp/dist/toast/toast";
import EmptyContent from "@/components/EmptyContent";
import listItem from "./components/list-item/index";
import { setTimeout } from "timers";
export default {
    config: {
        navigationBarTitleText: "售后单列表",
        enablePullDownRefresh: true,
        backgroundTextStyle: "dark"
    },
    components: {
        "empty-content": EmptyContent,
        listItem
    },
    data() {
        return {
            isUpLoading: false,
            isDownLoading: false,
            finished: true,
            pageSize: 10,
            pageNum: 1,
            isEmpty: false,
            result: {
                data: {
                    total: 0
                }
            },
            list: []
        };
    },
    methods: {
        // 合并请求参数
        getParams() {
            return {
                pageSize: this.pageSize,
                pageNum: this.pageNum
            };
        },
        //获取售后申请单列表
        async getListData() {
            // 重新置空
            // this.list = [];
            this.pageNum = 1;
            this.isDownLoading = true;

            try {
                this.list = [];
                wx.showLoading({
                    title: "加载中"
                });
                this.result = await postSaleApi.getList(this.getParams());
                wx.hideLoading();

                this.isDownLoading = false;
                if (!this.result.data) {
                    return false;
                } else {
                    this.list = this.result.data.list;
                }

                this.isEmpty = this.list.length === 0 ? true : false;
                this.finished = !this.result.data.hasNextPage;
            } catch (err) {
                this.isDownLoading = false;
            }
            return true;
        },
        //上拉加载更多
        async loadMoreData() {
            this.isUpLoading = true;
            if (this.result.data.hasNextPage) {
                this.finished = true;
                this.pageNum += 1;
                wx.showLoading({
                    title: "加载中"
                });
                this.result = await postSaleApi.getList(this.getParams());
                wx.hideLoading();
                if (this.result) {
                    this.isUpLoading = !this.isUpLoading;
                    this.finished = !this.result.data.hasNextPage;
                    this.list = this.list.concat(this.result.data.list);
                }
            } else {
                this.finished = true;
                this.isUpLoading = false;
            }
        }
    },

    onShow() {
        // 解决申请页面待寄回信息滞留
        this.$store.commit("afterSale/detail/clearAll", "applyList");
        this.getListData();
    },
    //下拉刷新
    onPullDownRefresh: function() {
        this.getListData().then(() => {
            wx.stopPullDownRefresh();
        });
    },
    // 上拉加载
    onReachBottom() {
        if (!this.finished) {
            this.loadMoreData();
        } else {
            Toast({
                duration: 800, // 持续展示 toast
                message: "没有更多了~"
            });
        }
    },
    onHide() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    }
};
</script>