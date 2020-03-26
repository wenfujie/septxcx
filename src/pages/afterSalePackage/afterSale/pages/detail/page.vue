<!--
 * @Author: yongtian.hong
 * @Date: 2019-08-05 13:18:56
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-08-12 13:08:36
 * @Description: 售后详情
 -->


<style lang='scss' scoped>
.wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    .content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: computed(30);
        box-sizing: border-box;
    }
}
.goods-detail-wrap {
    height: 100%;
    width: 100%;
    background: whitesmoke;
    box-sizing: border-box;
}
.padding-bottom-100 {
    padding-bottom: computed(100);
}

.action-btn-wrap {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: computed(12) 0;
    background: #fff;
    .btn-group {
        display: flex;
        width: computed(690);
        margin: 0 auto;
        overflow: hidden;
        background: $bggradientcolor;
        border-radius: $btn-radius40;
        box-sizing: border-box;
        .button {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            outline: 0;
            height: computed(80);
            color: #fff;
            background: rgba(255, 255, 255, $alpha: 0);
        }
        .btn-left {
            width: 50%;
            background: linear-gradient(
                90deg,
                rgba(255, 181, 76, 1),
                rgba(255, 133, 51, 1)
            );
        }
        .btn-right {
            width: 50%;
            background: linear-gradient(
                90deg,
                rgba(255, 99, 42, 1),
                rgba(255, 54, 54, 1)
            );
        }
    }
}
</style>

<template>
    <div :class="['goods-detail-wrap', { 'padding-bottom-100': !btnNoExsit }]">
        <div class="flex-vbox w100 h100">
            <div class="flex-auto overflow-scroll pd30">
                <good-info :data="data" />
                <!-- 售后状态 -->
                <apply-state :data="data" />
                <!-- 物流填写 -->
                <logis :data="data" :logis="logis" />
                <!-- 商品 -->
                <apply-info :data="data" />
            </div>
            <div class="action-btn-wrap van-tabbar" v-if="!btnNoExsit && isKeyBoardHide">
                <div class="btn-group">
                    <div
                        v-if="btnName"
                        class="button"
                        :class="{ 'btn-left': unique }"
                        @click="btnEvent(btnName)"
                    >
                        <span>{{ btnName }}</span>
                    </div>

                    <div
                        v-if="btnModify"
                        class="button"
                        :class="{ 'btn-right': unique }"
                        @click="btnEvent(btnModify)"
                    >
                        <span>{{ btnModify }}</span>
                    </div>
                </div>
            </div>
            <van-dialog id="van-dialog" />
            <van-toast id="van-toast" />
        </div>
        <!-- 快递选择弹窗 -->
        <wheel-picker :data="logisList" @confirm="selectLogis" v-model="showLogisList" />
    </div>
</template>

<script>
import {
    initState,
    selectArea,
    selectStore,
    selectLogis,
    switchBackMode,
    btnClickEvent
} from "../../common/service";

import applyInfo from "./components/applyInfo/index";
import applyState from "./components/applyState/index";
import goodInfo from "./components/goodInfo/index";
import logis from "./components/logis/index";
import wheelPicker from "./components/wheelPicker/index";
import ordStateMap from "../../common/stateCodeMap";
import debounce from "@/utils/debounce";

export default {
    config: {
        navigationBarTitleText: "售后详情",
        enablePullDownRefresh: false,
        backgroundTextStyle: "dark"
    },
    components: {
        applyInfo,
        applyState,
        goodInfo,
        logis,
        wheelPicker
    },
    data() {
        return {
            data: {},
            store: {},
            area: [],
            tips: {
                reApplyCode: "申请单号不能为空",
                returnWayCode: "退货方式不能为空",
                shippingId: "快递公司不能为空",
                addressId: "收货地址不能为空",
                expressCode: "快递单号不能为空",
                shopId: "请选择退回的门店"
            },
            btnName: null,
            btnModify: null,
            params: {},
            cityList: [],
            areaList: [],
            storeList: [],
            logisList: [],
            showAreaList: false,
            showStoreList: false,
            showLogisList: false,
            showLogisInfo: false,
            showPayBtn: false,
            returnWayCode: "kdth",
            ordStateMap: ordStateMap,
            isKeyBoardHide: true,
            submitLocked: true
        };
    },
    methods: {
        initState() {
            initState(this);
        },
        //选择省市区
        selectArea(list) {
            selectArea(this, list);
        },
        //关地区选择弹窗
        cancelAreaPopup() {
            this.showAreaList = false;
        },
        // 选择门店
        selectStore(store) {
            selectStore(this, store);
        },
        // 选择物流
        selectLogis(logis) {
            this.$store.commit("afterSale/detail/updateLogisInfo", logis);
        },

        // 退回方式切换回调
        switchBackMode(code) {
            switchBackMode(this, code);
        },
        btnEvent(btnName) {
            btnClickEvent(this, btnName);
        }
    },

    onShow() {
        this.initState();
    },

    computed: {
        logis: function() {
            return this.$store.state.afterSale.detail.logisInfo;
        },
        unique: function() {
            return this.btnName && this.btnModify;
        },
        btnNoExsit: function() {
            return !this.btnName && !this.btnModify;
        }
    },
    onHide(e) {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    }
};
</script>