/*
* createTime：2019/9/19
* author：lan.chen
* description: 秒杀
*/
<template>
    <div class="flash-list">
        <!-- 头部标签 -->
        <tabs-comp
            :tabList="tabList"
            :tabActive.sync="tabActive"
            @tabClick="tabClick"
            :isFinish.sync="isLoading"
        ></tabs-comp>
        <!-- 内容 -->
        <div class="container">
            <!--fissionType 1:秒杀 2:拼团  -->
            <fission-list-comp v-if="isLoading" :goodsList="goodsList" :fissionType="1"></fission-list-comp>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import TabsComp from "@/pages/goodsPackage/fission/components/Tabs.vue";
import FissionListComp from "@/pages/goodsPackage/fission/components/FissionList.vue";
import { Fission } from "../../../../api/service";
import Toast from "vant-weapp/dist/toast/toast";

export default {
    config: {
        navigationBarTitleText: "秒杀"
    },
    components: {
        TabsComp,
        FissionListComp
    },
    data() {
        return {
            tabActive: 0,
            fissionType: 1,
            tabList: [
                {
                    tabType: 0,
                    nameEn: "PROCE",
                    nameCn: "进行中"
                },
                {
                    tabType: 1,
                    nameEn: "READY",
                    nameCn: "即将开始"
                }
            ],
            goodsList: [],
            isLoading: false,
            pass_onload: false
        };
    },
    onLoad() {
        this._initData();
    },
    //    onHide() {
    //        this.pass_onload = true;
    //    },
    //    onShow() {
    //        if (this.pass_onload) {
    //            this._initData();
    //        }
    //    },
    methods: {
        _initData() {
            this.getFissionSaleList();
        },
        // tab标签切换
        tabClick(item, index) {
            this.getFissionSaleList();
        },
        /**
         * 获取服务器时间
         */
        getServerDate() {
            return Fission.getServerDate().then(res => {
                return global.c_getDateStamp(res);
            });
        },
        // 获取秒杀列表
        getFissionSaleList() {
            this.isLoading = false;
            this.goodsList = [];
            let params = {
                shopId: global.Storage.get("properties").shopId,
                busContsCode: global.Storage.get("properties").busContsCode,
                companyId: global.Storage.get("properties").companyId,
                vipInfoHdId: global.Storage.get("USER_INFO").vipInfoId,
                statusCode: this.tabList[this.tabActive].nameEn // PROCE进行中 READY即将开始
            };
            Fission.getFlashSaleList(params).then(async res => {
                if (res.length) {
                    let currentTime = await this.getServerDate();
                    res.forEach((item, index) => {
                        let status = ""; //按钮状态
                        let FunStatus = this.goBuyFun; //点击事件状态
                        let proState = ""; //进度条文案
                        let time = ""; //倒计时时间
                        if (this.tabActive == 0) {
                            if (item.clustNum == 0) {
                                proState = "已售罄";
                                status = "unBuy";
                                FunStatus = this.unBuyFun;
                            } else {
                                let percent =
                                    ((item.qty - item.clustNum) / item.qty) *
                                    100;
                                var arr = percent.toString().split(".");
                                if (arr.length > 1) {
                                    percent = percent.toFixed(2); //保留两位小数
                                } else {
                                    percent = arr[0];
                                }
                                proState = `已抢${percent}%`;
                                status = "goBuy";
                                FunStatus = this.goBuyFun;
                                //  倒计时，距离结束时间
                                time = global.c_getDateStamp(item.endTime);
                            }
                        } else {
                            proState = "待开始";
                            status = "startReady";
                            FunStatus = this.readyStartFun;
                            time = global.c_getDateStamp(item.beginTime);
                        }
                        this.goodsList.push({
                            img: item.glbFileUrl || "",
                            title: item.ptiPartHdName,
                            people: item.qty,
                            joinPeople: item.qty - item.clustNum,
                            delPrice: item.oldPrice,
                            salePrice: item.price,
                            progressTitle: proState,
                            time: time,
                            goodsCode: item.ptiPartHdCode,
                            status: status,
                            func: FunStatus,
                            onlineHdId: item.onlineHdId,
                            id: item.id,
                            currentTime: currentTime,
                            surpNum: item.surpNum, //剩余库存
                            clustNum: item.clustNum //实际库存
                        });
                        if (index + 1 === res.length) {
                            this.isLoading = true;
                        }
                        console.log(this.goodsList, "this.goodsList");
                    });
                } else {
                    this.isLoading = true;
                }
            });
        },
        // 去抢购
        goBuyFun(item, index) {
            console.log(item, "iiiiii");
            if (item.surpNum === 0 && item.clustNum > 0) {
                Toast("有用户下单还未支付，等等再来~");
                return;
            }
            let url = `/pages/goodsPackage/wares/wares-detail?goodsCode=${
                item.goodsCode
            }&fissionType=${this.fissionType}&onlineHdId=${item.onlineHdId}`;
            this.$router.push(url);
        },
        // 售空
        unBuyFun(item, index) {
            Toast("已售罄~");
        },
        // 待开始
        readyStartFun(item, index) {
            let url = `/pages/goodsPackage/wares/wares-detail?goodsCode=${
                item.goodsCode
            }&fissionType=${this.fissionType}&onlineHdId=${item.onlineHdId}`;
            this.$router.push(url);
        }
    }
};
</script>
<style lang="scss" type="text/scss" scoped>
.flash-list {
    min-height: 100%;
    position: relative;
    .container {
        background: $color-white;
        position: absolute;
        top: computed(85);
        width: 100%;
    }
}
</style>
