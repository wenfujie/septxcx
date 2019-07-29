/*
 * @Author: yongtian.hong
 * @Date: 2018-08-09 15:18:01
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-14 16:13:59
 * @Description: 售后申请页面
 */
<style lang='scss' scoped>
.wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .main {
        flex: 1;
        padding: computed(30) computed(30) 0 computed(30);
        .goods {
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
            display: flex;
            box-sizing: border-box;
            padding: computed(20);
            .img-box {
                width: computed(150);
                height: computed(150);
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .info {
                flex: 1;
                color: #0d0e09;
                padding-left: computed(20);
                font-size: computed(32);
                font-weight: bold;
                font-family: "PingFang-SC-Bold";
                .name {
                    font-size: computed(30);
                    font-family: PingFang-SC-Medium;
                    font-weight: 500;
                    color: rgba(51, 51, 51, 1);
                    margin-bottom: computed(40);
                }
                .price-and-num {
                    display: flex;
                    justify-content: space-between;
                    .num {
                        font-size: computed(32);
                        font-family: PingFang-SC-Medium;
                        font-weight: 500;
                        color: rgba(153, 153, 153, 1);
                    }
                }
            }
        }
        .content {
            padding-bottom: 100rpx;
            box-sizing: border-box;
            .group {
                display: flex;
                flex-direction: column;
                color: #333333;
                font-family: " PingFang-SC-Medium";
                margin: computed(20) 0 computed(20) 0;
                .title {
                    padding: computed(16) 0;
                    font-size: computed(28);
                    font-weight: bold;
                    .required {
                        color: $domaincolor;
                        margin-left: computed(20);
                    }
                }
                .action {
                    display: flex;
                    justify-content: space-between;
                    width: computed(690);
                    height: computed(85);
                    line-height: computed(85);
                    letter-spacing: 2px;
                    background: rgba(245, 245, 245, 1);
                    border-radius: computed(8);
                    font-size: computed(24);
                    padding: 0 computed(20);
                    margin: computed(10) 0;
                    box-sizing: border-box;
                    border-bottom: solid 1px #e6e6e6;
                }
                .steper-wrap {
                    width: 40%;
                    height: computed(66);
                    padding: 10px 0;
                    color: #000;
                    background: #fff;
                }
                .description {
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: computed(5) 0;
                    color: #c6c6c6 !important;
                    font-size: computed(24);
                    font-family: "PingFang-SC-Medium";
                    background: whitesmoke;
                    textarea {
                        padding: 5px;
                        min-height: 100rpx;
                        background: whitesmoke;
                    }
                    .textcount {
                        position: absolute;
                        right: 0;
                        bottom: computed(10);
                        right: computed(20);
                    }
                }
                .upload {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #999999;
                    font-size: computed(32);
                    font-family: "PingFang-SC-Medium";
                    padding: computed(30);
                    .limit {
                        font-size: computed(28);
                    }
                }
                .num-select {
                    display: flex;
                    align-items: center;
                    width: 22vw;
                    padding: computed(15) computed(20);
                    border-top: solid 1px #cccccc;
                    border-bottom: solid 1px #cccccc;
                    .iconfont {
                        font-size: computed(36);
                    }
                    .number {
                        margin: 0 computed(20);
                        padding: 0 computed(15);
                        min-width: 5vw;
                        line-height: 100%;
                        border-radius: 3px;
                        border: 0;
                        text-align: center;
                    }
                }
                .bg-grey {
                    background: whitesmoke;
                }
                .return-money {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: computed(24);
                    height: computed(60);
                    padding: computed(10);
                }
            }
            .img-group {
                display: flex;
                flex-wrap: wrap;
                box-sizing: border-box;
                padding: computed(10) 0 computed(10) computed(30);
                .img-box {
                    position: relative;
                    width: computed(150);
                    height: computed(150);
                    margin: 0 computed(18) computed(30) 0;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                    .icon-box {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: absolute;
                        top: computed(-20);
                        right: computed(-20);
                        width: computed(40);
                        height: computed(40);
                        color: #fff;
                        margin: 0;
                        padding: 0;
                        font-size: computed(20);
                        border-radius: 50%;
                        background: rgba(0, 0, 0, 0.3);
                    }
                }
            }
        }
    }

    .bottom {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        padding: computed(16) 0;
        button {
            width: computed(690);
            height: computed(80);
            margin: 0 auto;
            color: #fff;
            text-align: center;
            outline: 0;
            background: $bggradientcolor;
            border-radius: $btn-radius40;
        }
    }
}
.border-bottom-gray {
    border-bottom: solid computed(1) #e6e6e6;
}
.padding-tb30 {
    padding-top: computed(30) !important;
    padding-bottom: computed(30) !important;
}
.padding-lr30 {
    padding-left: computed(30);
    padding-right: computed(30);
}
.noscroll {
    height: 100%;
    overflow: hidden;
}
input::placeholder,
textarea::placeholder {
    color: #c6c6c6;
}
</style>

<template>
    <div :class="['wrap',{'noscroll':hideTextarea}]">
        <wxs module="filter" src="../../../../../filter/filterCommon.wxs"></wxs>
        <div class="main">
            <div class="goods">
                <div class="img-box">
                    <img
                        :src="filter.imgFilter(good.thumb, companyId)"
                        lazy-load="true"
                        @onerror="global.errImg(event)"
                    />
                </div>
                <div class="info">
                    <div class="name">{{ good.goodsName }}</div>
                    <div class="price-and-num">
                        <div class="price">￥{{ good.averagePrice }}</div>
                        <div class="num">×{{ good.applyNum || 0 }}</div>
                    </div>
                </div>
            </div>
            <div class="content">
                <!-- 售后方式 -->
                <div class="group">
                    <div class="title">
                        <span>售后类型</span>
                        <span class="required">*</span>
                    </div>
                    <div class="action" @click="onSelectWayStart()">
                        {{ way.returnTypeName || "请选择售后类型" }}
                        <i class="iconfont icon-gengduo"></i>
                    </div>
                </div>
                <!-- 售后原因 -->
                <div class="group">
                    <div class="title">
                        <span>售后原因</span>
                        <span class="required">*</span>
                    </div>
                    <div class="action" @click="onSelectReasonStart()">
                        {{ reason.reasonName || "请选择售后原因" }}
                        <i class="iconfont icon-gengduo"></i>
                    </div>
                </div>
                <!-- 换货商品 -->
                <div class="group" v-if="selectedGoods.length === 0 && isChange">
                    <div class="title flex-vcenter pdB20">
                        换货商品
                        <span class="required">*</span>
                        <span v-if="good.orderFlag" class="fs24 grey66 pdL10">该商品为定制商品,不支持换货</span>
                    </div>
                    <div class="action" @click="changeGood()" v-if="!good.orderFlag">
                        请选择需要换货的商品
                        <i class="iconfont icon-youfan"></i>
                    </div>
                </div>
                <!-- 换货数量 -->
                <div class="group" v-if="isChange">
                    <div class="title">
                        <span>换货数量</span>
                        <span class="required">*</span>
                    </div>
                    <div class="steper-wrap">
                        <stepper
                            v-model="skuInfo.partAmount"
                            :max="remainQty"
                            @focus="isKeyBoardHide = false"
                            @blur="isKeyBoardHide = true"
                        />
                    </div>
                </div>
                <!-- 继续换货商品 -->
                <div class="group" v-if="selectedGoods.length > 0 && isChange">
                    <div class="title flex-between">
                        <div>
                            <span>换货商品</span>
                            <span class="required">*</span>
                        </div>
                        <a class="fs28 mgR30" @click="changeGood()" v-if="remainQty > 0">继续添加</a>
                    </div>
                    <div class="pdTb10 borderB1c" v-if="!good.orderFlag">
                        <div
                            class="flex-between"
                            v-for="(sku, index) in selectedGoods"
                            :key="index"
                        >
                            <div class="flex-box fs32B Wrap">
                                <div class="flex-vcenter pdL30 pdTb10">
                                    <span class="color">
                                        {{
                                        sku.colorName
                                        }}
                                    </span>
                                    <span class="size mgL30">
                                        {{
                                        sku.sizeName
                                        }}
                                    </span>
                                    <span class="size mgL30">x{{ sku.partAmount }}</span>
                                </div>
                            </div>
                            <div
                                class="del flex-vcenter mgR30 grey99"
                                @click="delGoodFromSelectedGoods(index)"
                            >x</div>
                        </div>
                    </div>
                </div>
                <!-- 返修数量 -->
                <div class="group" v-if="isRepair">
                    <div class="title">
                        <span>返修数量</span>
                        <span class="required">*</span>
                    </div>
                    <div class="steper-wrap">
                        <stepper v-model="params.amount" :max="remainQty" />
                    </div>
                </div>
                <!-- 退货数量 -->
                <div class="group" v-if="isReturn">
                    <div class="title">
                        <span>退货数量</span>
                        <span class="required">*</span>
                    </div>
                    <div class="steper-wrap">
                        <stepper
                            v-model="params.amount"
                            :max="remainQty"
                            @focus="isKeyBoardHide = false"
                            @blur="isKeyBoardHide = true"
                        />
                    </div>
                </div>
                <!-- 退款金额 -->
                <div class="group" v-if="isRefund">
                    <div class="title">
                        <span>退款金额</span>
                        <!-- <span class="required">*</span> -->
                    </div>
                    <div class="return-money bg-grey">
                        {{returnsAmount}}
                        <!-- <input
                            v-model="returnsAmount"
                            readonly
                            @focus="isKeyBoardHide = false"
                            @blur="isKeyBoardHide = true"
                            class="flex-auto h100 pd10 no-border bg-grey"
                            placeholder="请输入退款金额"
                        />-->
                        <!-- <div class="grey66">(最多可退款退 {{ placeholder}} 元 )</div> -->
                    </div>
                </div>
                <!-- 售后说明 -->
                <div class="group">
                    <div class="title">售后说明</div>
                    <custom-textarea
                        v-if="!hideTextarea"
                        v-model="params.reasonMemo"
                        :placeholder="'请输入售后说明'"
                    />
                </div>
                <upload max="5" :images.sync="images" />
            </div>
            <div class="bottom" v-show="isKeyBoardHide">
                <button @click="submit()">提 交</button>
            </div>
        </div>

        <!-- 售后类型选择 -->
        <action-cell
            v-model="showWays"
            :title="'请选择售后类型'"
            :list="ways"
            :checked-obj="way"
            :codeField="'returnTypeCode'"
            :label="'returnTypeName'"
            @onChange="selectWay"
        />
        <!-- 售后原因 -->
        <action-cell
            v-model="showReason"
            :title="'请选择售后原因'"
            :list="reasons"
            :checked-obj="reason"
            :codeField="'reasonCode'"
            :label="'reasonName'"
            @onChange="selectReason"
        />
        <van-toast id="van-toast" />
    </div>
</template>

<script>
import Toast from "vant-weapp/dist/toast/toast";
// import Dialog from "vant-weapp/dist/dialog/dialog";

// import wheelPicker from "@/components/WheelPicker";
import UpLoad from "@/components/UpLoad";
import actionCell from "./components/actionCell/index";
import stepper from "./components/stepper/index";
import customTextarea from "./components/textarea/index";
import postSaleApi from "@/api/service/postSale";
import types from "../../common/typesMap";
import check from "@/utils/check";
import debounce from "@/utils/debounce";
export default {
    config: {
        navigationBarTitleText: "售后申请",
        enablePullDownRefresh: false,
        backgroundTextStyle: "dark"
    },
    components: {
        upload: UpLoad,
        stepper,
        actionCell,
        customTextarea
    },
    data() {
        return {
            show: false,
            good: {},
            way: {},
            ways: [],
            showWays: false, //弹出选择类型下拉框
            reason: {},
            reasons: [],
            showReason: false, //弹出选择原因下拉框
            selectedGoods: [],
            colorList: [],
            colorSelectedIndex: 0,
            sizeList: [],
            sizeSelectedIndex: 0,
            returnsAmount: null, //退款总额
            isChange: false, //显示换货
            isRepair: false, //显示返修
            isReturn: false, //显示退货
            isRefund: false, //显示退款
            disableUploadfile: false,
            params: {
                amount: 1, //退回数量
                returnsAmount: null, //退款金额
                busCountsCode: global.baseConstant.busContsCode,
                changeReplayCode: null,
                ordDtId: 0,
                reaSonCode: "",
                reapplycode: "",
                reasonMemo: "",
                returnTypeCode: "",
                savePictInfo: [],
                skuInfo: [],
                skuId: ""
            },
            skuInfo: {
                sizeCode: "",
                sizeName: "",
                colorCode: "",
                colorName: "",
                partAmount: 0,
                ptiPartHdCode: 0
            },
            images: [],
            hideTextarea: true,
            isKeyBoardHide: true,
            companyId: global.Storage.get("COMPANYID").company_id
        };
    },
    methods: {
        // 初始化提交参数
        async initParams(params) {
            this.good = params;
            this.params.ordDtId = this.good.saleOrdDtId;
            // this.params.skuId = this.good.skuId;
            this.params.changeReplayCode = this.good.reApplyCode || null;
            this.skuInfo.ptiPartHdCode = this.good.goodsCode;
        },
        //回显售后类型与原因
        async initStatus() {
            setTimeout(() => {
                this.hideTextarea = false;
            }, 10);
            const params = this.$store.state.afterSale.apply.good;
            // console.log("good", params);
            this.initParams(params);
            // 参数没有退货类型,则非修改申请或者重新申请,直接返回
            if (!params.returnTypeCode) return;
            // 是否为退款类型
            this.isRefund =
                params.returnTypeCode == "D_ONLYDRAWBACK" ? true : false;
            // 退款金额回款
            this.returnsAmount =
                params.returnTypeCode == "D_ONLYDRAWBACK"
                    ? this.good.averagePrice * this.good.applyNum
                    : null;
            this.params.returnsAmount = this.returnsAmount;
            // 是否为退货
            this.isReturn =
                params.returnTypeCode == "D_RETURNSALES" ? true : false;
            // 退货数量
            this.params.amount =
                params.returnTypeCode == "D_RETURNSALES"
                    ? params.applyAmountQty
                    : 1;

            // 回显类型
            this.way = types[params.returnTypeCode] || {};
            this.params.returnTypeCode = this.way.returnTypeCode;
            const result = await this.getReasonsforCurType();
            this.reasons = result.data;
            // 回显原因
            const reason =
                result.data.filter(item => {
                    if (item.reasonCode == params.returnsReasonCode)
                        return item;
                })[0] || {};
            this.reason = reason;
            this.params.reaSonCode = reason.reasonCode;
            // 回显备注
            this.params.reasonMemo = params.reasonMemo;
        },
        // 获取售后类型
        async getPostSaleWay() {
            let params = {
                saleOrdDtId: this.params.ordDtId
            };
            let result = await postSaleApi.getWays(params);
            return result;
        },
        // 触发售后类型选择弹窗
        async onSelectWayStart() {
            const result = await this.getPostSaleWay();
            if (!result) return;
            this.hideTextarea = true;
            const { data } = result;
            this.ways = data.returnTypeList || [];
            if (this.ways.length > 0) {
                this.showWays = true;
            } else {
                this.showWays = false;
                Toast("该商品暂不支持售后");
            }
        },
        // 选择售后类型
        async selectWay(way) {
            this.isChange = false;
            this.isRepair = false;
            this.isReturn = false;
            this.isRefund = false;
            this.hideTextarea = false;
            this.way = way;

            if (way.returnTypeCode === "D_CHANGEPART") {
                this.getSkuInfo();
                this.isChange = true;
                this.returnsAmount = null;
            } else if (way.returnTypeCode === "D_REPAIR") {
                this.isRepair = true;
                this.params.amount = 1;
                this.returnsAmount = null;
            } else if (way.returnTypeCode === "D_RETURNSALES") {
                this.isReturn = true;
                this.params.amount = 1;
                this.returnsAmount = null;
            } else if (way.returnTypeCode === "D_ONLYDRAWBACK") {
                this.isRefund = true;
            }

            //更换售后类型时,清空选中原因
            if (this.params.returnTypeCode != way.returnTypeCode) {
                this.reason = {};
                this.params.reaSonCode = "";
            }
            //重置类型参数
            this.params.returnTypeCode = way.returnTypeCode;

            //选择完成售后类型,更新对应的售后原因
            const result = await this.getReasonsforCurType();
            if (result.data) {
                this.reasons = result.data;
            }
        },
        // 获取可选的售后原因
        async getReasons() {
            if (!check.isEmpty(this.reasons)) {
                this.showReason = true;
                return;
            }
            let params = {
                pageNum: 1,
                pageSize: 10,
                effFlag: 1
            };
            let result = await postSaleApi.getReason(params);
            return result;
        },

        //获取当前售后类型可用售后原因
        async getReasonsforCurType() {
            const params = this.good;
            const result = await postSaleApi.getReasonCodes({
                dictCode: this.params.returnTypeCode || params.returnTypeCode,
                companyId: global.Storage.get("USER_INFO").companyId
            });
            return result;
        },

        // 触发选择原因弹窗
        async onSelectReasonStart() {
            if (!this.params.returnTypeCode) {
                Toast("请先选择售后类型");
                return;
            } else {
                this.hideTextarea = true;
                this.showReason = true;
            }
        },
        // 选择原因
        selectReason(reason) {
            this.hideTextarea = false;
            this.reason = reason;
            this.params.reaSonCode = reason.reasonCode;
            this.showReason = false;
        },

        // 点击换货,弹出换货弹窗
        async changeGood() {
            // 判断可选数量是否大于0
            if (this.remainQty > 0) {
                this.skuInfo.partAmount = 1;
            } else {
                this.skuInfo.partAmount = 0;
            }
            this.show = true;
        },
        // 获取换货下拉弹窗中Sku信息
        async getSkuInfo() {
            if (!check.isEmpty(this.sizeList)) {
                return;
            }
            let params = {
                busContsCode: "D_BUSCONTS_WSC",
                goodsCode: this.$route.params.goodsCode,
                shopCode: global.Storage.get("shopCode").code
            };
            let goodsInfo = await postSaleApi.getSku(params);

            this.colorList = goodsInfo.colorsVoList;
            this.sizeList = goodsInfo.sizesVoList;
            // 初始化skuInfo
            this.skuInfo.sizeCode = this.sizeList[0].sizeCode;
            this.skuInfo.sizeName = this.sizeList[0].sizeName;
            this.skuInfo.colorCode = this.colorList[0].colorCode;
            this.skuInfo.colorName = this.colorList[0].colorName;
        },
        // 选择尺码
        selectSize(item, index) {
            this.sizeSelectedIndex = index;
            this.skuInfo.sizeName = item.sizeName;
            this.skuInfo.sizeCode = item.sizeCode;
            this.skuInfo.sizeId = item.sizeId;
        },
        // 选择颜色
        selectColor(item, index) {
            this.colorSelectedIndex = index;
            this.skuInfo.colorCode = item.colorCode;
            this.skuInfo.colorName = item.colorName;
            this.skuInfo.colorId = item.colorId;
        },
        // 拷贝sku信息
        copySku(skuObj) {
            let sku = {};
            let keys = Object.keys(skuObj);
            keys.forEach(key => {
                sku[key] = this.skuInfo[key];
            });
            return sku;
        },
        //确认换货
        confirm() {
            if (this.remainQty > 0) {
                let sku = this.copySku(this.skuInfo);
                this.selectedGoods.push(sku);
            }
            this.show = false;
        },
        // 删除已选中换货数据
        delGoodFromSelectedGoods(index) {
            this.selectedGoods.splice(index, 1);
        },
        // 关闭换货弹窗
        close() {
            this.show = false;
        },
        //判断是否可用的售后类原因
        async judgeIsEnableTypeBeforeSubmit() {
            let msg = null;
            const typeResult = await this.getPostSaleWay();

            const types = typeResult.data.returnTypeList || [];
            let typeCodes = [];
            types.forEach(type => {
                typeCodes.push(type.returnTypeCode);
            });
            // 判断当前选中售后类型是否在可用类型之内
            if (!typeCodes.includes(this.params.returnTypeCode)) {
                msg = "当前订单不可提交此售后类型!";
                return msg;
            }

            const reasonResult = await this.getReasonsforCurType();

            const reasons = reasonResult.data || [];

            let reasonCodes = [];
            reasons.forEach(reason => {
                reasonCodes.push(reason.reasonCode);
            });
            // 判断当前选中售后原因是否在可用原因之内
            if (!reasonCodes.includes(this.params.reaSonCode)) {
                msg = "请重新修改售后原因!";
                return msg;
            }
            return msg;
        },

        //计算换货商品数
        calNumOfChange() {
            let num = 0;
            this.selectedGoods.forEach(good => {
                num += good.partAmount;
            });
            return num;
        },

        // 提交售后申请
        async submitPostSale() {
            // 必填字段判空处理
            if (check.isEmpty(this.params.returnTypeCode)) {
                Toast("请选择售后类型");
                return;
            } else if (check.isEmpty(this.params.reaSonCode)) {
                Toast("请选择售后原因");
                return;
            }
            // 判断售后原因与类型是否可用
            const msg = await this.judgeIsEnableTypeBeforeSubmit();
            if (msg) {
                Toast(msg);
                return;
            }
            //根据特殊售后类型执行处理
            switch (this.way.returnTypeCode) {
                case "D_ONLYDRAWBACK": // 仅退款
                    //提交前赋值退款金额
                    this.params.returnsAmount = this.returnsAmount;
                    if (this.params.returnsAmount <= 0) {
                        Toast("退款金额必须大于0！");
                        return;
                    } else if (!+this.params.returnsAmount) {
                        Toast("请填写正确的退款金额！");
                        return;
                    } else this.params.amount = this.good.applyNum;

                    break;

                case "D_CHANGEPART": // 换货
                    this.params.skuInfo = this.selectedGoods;
                    this.params.amount = this.calNumOfChange();
                    // 判断是否定制商品
                    if (this.good.orderFlag == 1) {
                        Toast("定制商品不支持申请换货！");
                        return;
                    } else if (check.isEmpty(this.selectedGoods)) {
                        Toast("请至少选择一件商品!");
                        return;
                    }
                    break;
                case "D_RETURNSALES":
                    this.returnsAmount = null;
                    break;
            }

            // 提交图片
            this.params.savePictInfo = this.images;
            // 提交申请
            let result = await postSaleApi.submitApply(this.params);

            if (result.status === 200) {
                Toast(result.data);
                this.$router.go(-1);
            } else {
                Toast(result.data);
            }
        },

        submit: debounce(function() {
            this.submitPostSale();
        }, 5000),

        // 保留输入值为2位小数
        fixedValue(val) {
            let res = String(val).match(/^\d*(\.?\d{0,2}$)/g) || "";
            return res ? res[0] : "";
        }
    },

    onLoad() {
        this.initStatus();
        // 解决申请页面待寄回信息滞留
        this.$store.commit("afterSale/detail/clearAll");
    },
    computed: {
        //剩余可退换数量
        remainQty: function() {
            let num = 0;
            this.selectedGoods.forEach(good => {
                num += good.partAmount;
            });
            return this.good.applyNum - num;
        },
        // 退款金额
        placeholder: function() {
            return (
                (this.good.amountAverage / this.good.allQty) *
                this.good.applyNum
            );
        }
    },
    watch: {
        // returnsAmount: function(val) {
        //     const allowApplyPrice = this.placeholder || 0;
        //     if (val > allowApplyPrice) {
        //         this.returnsAmount = allowApplyPrice.toFixed(2);
        //         this.params.returnsAmount = this.returnsAmount;
        //     } else {
        //         let res = "";
        //         if (val) {
        //             res = this.fixedValue(val) || this.params.returnsAmount;
        //         } else {
        //             res = val;
        //         }
        //         this.returnsAmount = res;
        //         this.params.returnsAmount = this.returnsAmount;
        //     }
        // },
        "params.amount": function(val) {
            if (val <= 1) {
                this.params.amount = 1;
            } else if (val >= this.remainQty) {
                // if (this.params.returnTypeCode == "D_REPAIR") {
                //     Toast("返修数量不能大于购买数量！");
                // } else if (this.params.returnTypeCode == "D_RETURNSALES") {
                //     Toast("退货数量不能大于购买数量！");
                // }
                this.params.amount = this.remainQty;
            } else {
                this.params.amount = val;
            }
        },
        "skuInfo.partAmount": function() {
            if (this.skuInfo.partAmount < this.remainQty) {
                this.params.amount -= 1;
            } else if (this.skuInfo.partAmount > this.remainQty) {
                Toast("申请数量不能大于可换货件数");
            }
        }
    },
    onUnload() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    }
};
</script>
