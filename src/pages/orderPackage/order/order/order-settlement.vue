<!--
 * @Author: yongtian.hong
 * @update：junyong.hong
 * @Date: 2018-12-12 11:00:27
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-04-19 14:26:56
 * @Description: 订单结算三期（七匹狼）
 -->
<style lang="scss" type="text/scss" scoped>
    .page{
        position: relative;
    }
    .shade-style {
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;

        .loading-style {
            position: fixed;
            top: 50%;
            left: 50%;
            margin-left: computed(-50);
            margin-top: computed(-50);
        }
    }
    .pay-foot {
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #fff;
        z-index: 100;
    }
    .pay-foot-text {
        flex: 1;
        padding-left: computed(30);
        display: flex;
        align-items: center;

        .pay-foot-describe {
            color: #333;
            margin-right: computed(10);
        }
    }
    .pay-foot-btn {
        background: $maincolor;
        color: #fff;
        text-align: center;
        line-height: computed(94);
        width: computed(320);
    }
    .tipBox {
        width: 100%;
        height: computed(470);
        border-radius: computed(10);
        position: relative;
        .content {
            width: computed(590);
            height: computed(346);
            margin: 0 auto;
            padding: computed(30);
            background-color: #fff;
            border-radius: computed(10);
            .title {
                text-align: center;
                font-size: computed(36);
                font-weight: bold;
            }
            .li_word {
                margin-top: computed(56);
                font-size: computed(30);
                line-height: computed(50);
            }
            button {
                width: 100%;
                height: computed(94);
                margin: computed(55) 0;
                background-color: #c41717;
                color: #fff;
            }
        }
        .closeIcon {
            z-index: 10000000;
            width: computed(64);
            height: computed(64);
            display: inline-block;
            position: absolute;
            bottom: computed(-30);
            left: 44%;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .price-info {
        box-shadow: 0 computed(4) computed(12) 0 rgba(0, 0, 0, 0.1);
    }
    .discount {
        background-color: $color-white;
        margin-bottom: computed(30);
        box-shadow: 0 computed(4) computed(12) 0 rgba(0, 0, 0, 0.1);
        .discount-title {
            padding: computed(36) 0 computed(30) 0;
            margin: 0 computed(30) 0 computed(30);
            font-size: $font-h2;
            font-weight: bold;
            border-bottom: 1px dashed $color-gray-dashed;
        }
        .discount-coupon {
            .title {
                display: flex;
                flex-direction: row;
                margin: 0 computed(30) 0 computed(30);
                padding: computed(24) 0;
                .title-left {
                    min-width: computed(140);
                    max-width: computed(140);
                    color: $text-regular;
                    font-size: $font-regular;
                    &.title-left__max{
                        max-width: computed(240);
                    }
                    &.remark-title {
                        color: $text-regular;
                    }
                }
                .title-right {
                    flex: 1;
                    text-align: right;
                    font-size: $font-common;
                    color: $text-primary;
                    .title-right-point{
                        line-height: computed(40);
                        margin-right: computed(10);
                    }
                    &.red {
                        color: $domaincolor !important;
                        text {
                            color: $text-primary;
                        }
                    }
                }
                .remark-input {
                    border: none;
                    font-size: $font-common;
                    width: computed(500);
                    &::-webkit-input-placeholder {
                        /*WebKit browsers*/
                        color: $text-placeholder;
                    }
                    &::-moz-input-placeholder {
                        /*Mozilla Firefox*/
                        color: $text-placeholder;
                    }
                    &::-ms-input-placeholder {
                        /*Internet Explorer*/
                        color: $text-placeholder;
                    }
                }
            }
            .choose {
                background-color: $color-light-gray;
                padding: 0 computed(30);
                li {
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    padding: computed(21) 0;
                    color: $text-regular;
                    font-size: $font-common;
                    > p {
                        width: computed(550);
                    }
                    .btn {
                        flex: 1;
                        position: absolute;
                        top: computed(17);
                        right: 0;
                        display: inline-block;
                    }
                }
            }
        }
    }

    .container-t {
        box-shadow: 0 computed(4) computed(12) 0 rgba(0, 0, 0, 0.1);
        .none {
            display: none;
        }
        .title {
            color: $text-primary;
            border-bottom: 1px dashed $color-gray-dashed;
            padding-bottom: computed(30);
            span:nth-child(1) {
                font-size: $font-h2;
            }
            span:nth-child(2) {
                margin-left: computed(10);
                font-size: $font-common;
            }
        }
        .goodsList {
            display: flex;
            flex-direction: row;
            width: computed(630);
            padding: computed(20) 0 computed(25) 0;
            border-bottom: 1px dashed $color-gray-dashed;
            .image {
                width: computed(140);
                height: computed(140);
            }
            .goodsList-middle {
                position: relative;
                margin-left: computed(19);
                width: computed(330);
                .name {
                    font-size: $font-common;
                    color: $text-primary;
                    text-align: left;
                }
                .size-color {
                    position: absolute;
                    bottom: 0;
                    font-size: $font-common;
                    color: $text-secondary;
                    max-width: computed(350);
                }
            }
            .goodsList-right {
                flex: 1;
                position: relative;
                text-align: right;
                .price {
                    font-size: $font-title1;
                    font-weight: bold;
                    color: $text-primary;
                }
                .num {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    font-size: $font-num;
                    font-weight: bold;
                    color: $text-regular;
                }
            }

            /* 赠品 */
            &.gift {
                .send{
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    .image {
                        width: computed(100);
                        height: computed(100);
                    }
                    .goodsList-middle {
                        .name {
                            > span {
                                font-size: $font-common;
                                color: $domaincolor;
                                margin-right: computed(8);
                            }
                        }
                    }
                    .goodsList-right {
                        .num {
                            top: 0 !important;
                        }
                        .chose {
                            position: absolute;
                            bottom: 0;
                            right: 0;
                            font-size: $font-common;
                            color: $text-regular;
                            border: 1px solid $text-placeholder;
                            padding: computed(9) computed(15);
                            border-radius: $btn-radius25;
                        }
                    }
                }
                .un-send{
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    .un-send-left{
                        flex: 1;
                        font-size: $font-common;
                        color: $color-red;
                    }
                    .un-send-right{
                        width: computed(150);
                        font-size: $font-common;
                        color: $text-secondary;
                        text-align: right;
                    }
                }
            }
        }
        $size: computed(180);
        .image {
            width: $size;
            height: $size;
            box-shadow: 0 computed(2) computed(6) 0 rgba(0, 0, 0, 0.1);
        }
    }
    .foot-right {
        width: computed(260);
        background: $color-white;
        .pay-btn {
            width: computed(230);
            line-height: computed(80);
            text-align: center;
            color: $color-white;
            margin: computed(15) 0;
            padding: 0;
            border-radius: $btn-radius40;
            font-size: $font-regular;
        }
    }
</style>
<template>
    <div class="page bg-gray flex-vbox">
        <wxs module="filter" src="../../../../filter/filterCommon.wxs"></wxs>
        <div ref="scrollBody" class="flex-auto pd30 overflow-scroll">
            <!-- 配送方式选择 -->
            <deliver-select
                :showAreaList.sync="showAreaList"
                :areaList.sync="areaList"
                :showStoreList.sync="showStoreList"
                :storeList.sync="storeList"
                :Address="address"
                :Store="store"
                :params.sync="shipParams"
                :isDeliveryOne="true"
                ref="deliverSelect"/>

            <!-- 订单商品图展示 -->
            <div class="container-t bg-white mgB30 pd30">
                <p class="fs28B title">
                    <span>商品清单</span>
                    <span>({{allAmount}})</span>
                </p>
                <div class="flex-between">
                    <div class="flex-box w100 flex-vbox">
                        <ul>
                            <!-- 商品 beign -->
                            <li class="goodsList"
                                :class="{'cusTag': good.orderFlag == 1}"
                                v-for="(good,index) in shopList"
                                :key="index">
                                <img :src="filter.imgFilter(good.url,company_id, '140*140')" lazy-load="true" :key="good.url" class="image">
                                <div class="goodsList-middle">
                                    <p class="name overflow-two">{{good.goodsName}}</p>
                                    <p class="size-color overflow">尺码：{{good.sizeName}} 颜色：{{good.colorName}}</p>
                                </div>
                                <div class="goodsList-right">
                                    <p class="price" v-if="fissionType">￥{{filter.Fix2(good.salePrice)}}</p>
                                    <p class="price" v-else>￥{{filter.Fix2(good.dealPrice?good.dealPrice:good.tagPrice)}}</p>
                                    <p class="num">x {{good.amount}}</p>
                                </div>
                            </li>
                            <!-- 商品 end -->
                        </ul>

                        <!-- 赠品 beign -->
                        <ul v-if="sendList && sendList.length > 0"
                            v-for="(item,index) in sendList"
                            :key="item.goodsCode">
                            <div v-for="(giftGroupItem, giftGroupIndex) in item.giftGroup" :key="giftGroupIndex">
                                <!-- 随机、固定 -->
                                <li :key="cIndex"
                                    class="goodsList gift"
                                    v-for="(goods,cIndex) in giftGroupItem.gifts"
                                    v-if="giftGroupItem.groupType !== '指定'">
                                    <div class="send">
                                        <img :src="filter.imgFilter(goods.url,company_id, '100*100')" lazy-load="true" :key="goods.url" class="image">
                                        <div class="goodsList-middle">
                                            <p class="name overflow">
                                                <span>{{item.salePmType}}</span>
                                                {{goods.goodsName}}
                                            </p>
                                            <p class="size-color">尺码：{{goods.sizeName}} 颜色：{{goods.colorName}}</p>
                                        </div>
                                        <div class="goodsList-right">
                                            <p class="num">x {{goods.amount}}</p>
                                        </div>
                                    </div>
                                </li>

                                <!-- 指定 -->
                                <li class="goodsList gift"
                                    v-if="giftGroupItem.gifts.length > 0 && giftGroupItem.groupType === '指定'">
                                    <div class="send" v-if="giftGroupItem.choseGoods.goodsName">
                                        <!-- 已选择赠品 -->
                                        <img :src="filter.imgFilter(giftGroupItem.choseGoods.url,company_id, '100*100')"
                                             lazy-load="true"
                                             :key="giftGroupItem.choseGoods.url"
                                             class="image">
                                        <div class="goodsList-middle">
                                            <p class="name overflow">
                                                <span>{{item.salePmType}}</span>
                                                {{giftGroupItem.choseGoods.goodsName ? giftGroupItem.choseGoods.goodsName : '请选择赠送商品的类型'}}
                                            </p>
                                            <p v-if="giftGroupItem.choseGoods.sizeName && giftGroupItem.choseGoods.colorName"
                                               class="size-color overflow">
                                                尺码：{{giftGroupItem.choseGoods.sizeName}} 颜色：{{giftGroupItem.choseGoods.colorName}}
                                            </p>
                                        </div>
                                        <div class="goodsList-right">
                                            <p v-if="giftGroupItem.choseGoods.amount"
                                               class="num">x {{giftGroupItem.choseGoods.amount}}</p>
                                            <p @click="skuChose(giftGroupItem, index)"
                                               class="chose">更换赠品</p>
                                        </div>
                                    </div>
                                    <!-- 未选择赠品 -->
                                    <div v-else class="un-send" @click="skuChose(giftGroupItem, index)">
                                        <div class="un-send-left">
                                            {{item.saleTheme}}
                                        </div>
                                        <div class="un-send-right">
                                            选择赠品<text class="iconfont iconxuanzexiao"></text>
                                        </div>
                                    </div>
                                </li>
                            </div>
                        </ul>
                        <!-- 赠品 end -->
                    </div>
                    <div class="flex-vcenter">
                        <text class="iconfont icon-gengduo"></text>
                    </div>
                </div>
            </div>

            <div class="discount">
                <div class="discount-title">其他</div>
                <!-- 折扣券 begin -->
                <div class="discount-coupon">
                    <div @click="discountCouponToggle()" class="title">
                        <span class="title-left overflow">折扣券</span>
                        <span v-if="disCouponList.length > 1" class="title-right">
                            {{isDiscountCouponPrice}}
                            <text :class="[isDiscountCouponShow ? 'iconiconup-copy' : 'iconicondown-copy']" class="iconfont"></text>
                        </span>
                        <span v-if="disCouponList.length === 1 && !fissionType" class="title-right red">
                            暂无可用
                            <text class="iconfont iconicondown-copy"></text>
                        </span>
                        <span v-else-if="fissionType" class="title-right red">
                            不可使用
                            <text class="iconfont iconicondown-copy"></text>
                        </span>
                    </div>
                    <ul v-if="isDiscountCouponShow" class="choose">
                        <li v-for="(item, index) in disCouponList"
                            :key="index"
                            @click="discountCouponItem(item, index)">
                            <p v-if="index === 0" class="overflow">{{item.couponName}}</p>
                            <p v-if="index !== 0" class="overflow">
                                {{item.couponName}}：{{filter.saveOneDecimals(item.discount * 10)}}折
                            </p>
                            <van-checkbox :value="item.active" class="btn"></van-checkbox>
                        </li>
                    </ul>
                </div>
                <!-- 折扣券 end -->

                <!-- 抵用券 begin -->
                <div class="discount-coupon">
                    <div @click="couponToggle()" class="title">
                        <span class="title-left overflow">抵用券</span>
                        <span v-if="price.cashCouponPrice <= 0 && cashCouponList.length > 1 && (isCouponIndex === 0 || isCouponIndex === null)" class="title-right">
                            不使用抵用券
                            <text :class="[isCouponShow ? 'iconiconup-copy' : 'iconicondown-copy']" class="iconfont"></text>
                        </span>
                        <span v-if="price.cashCouponPrice >= 0 && isCouponIndex > 0" class="title-right">
                            -￥{{ filter.Fix2(price.cashCouponPrice) }}
                            <text :class="[isCouponShow ? 'iconiconup-copy' : 'iconicondown-copy']" class="iconfont"></text>
                        </span>
                        <span v-if="cashCouponList.length === 1 && !fissionType" class="title-right red">
                            暂无可用
                            <text class="iconfont iconicondown-copy"></text>
                        </span>
                        <span v-if="fissionType" class="title-right red">
                            不可使用
                            <text class="iconfont iconicondown-copy"></text>
                        </span>
                    </div>
                    <ul class="choose">
                        <li v-if="isCouponShow"
                            v-for="(item, index) in cashCouponList"
                            :key="index"
                            @click="couponItem(item, index)">
                            <p v-if="index === 0" class="overflow">{{item.couponName}}</p>
                            <p v-if="index !== 0" class="overflow">
                                {{item.couponName}}：￥{{ filter.Fix2(item.initialValue) }}
                            </p>
                            <van-checkbox :value="item.active" :disabled="item.disabled" class="btn"></van-checkbox>
                        </li>
                    </ul>
                </div>
                <!-- 抵用券 end -->

                <!-- 促销优惠 begin -->
                <div class="discount-coupon">
                    <div class="title">
                        <span class="title-left overflow">促销优惠</span>
                        <span class="title-right">-￥{{ filter.goldDivide(filter.Fix2(promotions)) }}</span>
                    </div>
                </div>
                <!-- 促销优惠 end -->

                <div class="discount-coupon">
                    <div class="title">
                        <span class="title-left overflow">运费</span>
                        <span v-if="transFee > 0" class="title-right">
                            ￥{{ filter.goldDivide(filter.Fix2(transFee)) }}
                        </span>
                        <span v-else class="title-right">包邮</span>
                    </div>
                </div>

                <!--使用积分 v-if="visiblePoint"-->
                <div class="discount-coupon" v-if="visiblePoint">
                    <div class="title">
                        <span class="title-left title-left__max overflow flex-vcenter">使用{{pointInfo.point || 0}}积分</span>
                        <span class="title-right flex-end">
                            <span class="title-right-point">
                                ￥{{ filter.goldDivide(filter.Fix2(pointInfo.pointPirce)) }}
                            </span>
                            <van-switch
                                :checked="switchFlag"
                                active-color="#FF3736" @change="pointChange"
                                size="15px"
                            />
                        </span>
                    </div>
                </div>

                <!--发票选择 begin（先影藏入口）-->
                <div class="discount-coupon" v-if="invoiceStatus === true && actualPay > 0">
                    <div class="title">
                        <span class="title-left">{{invoiceData.type?invoiceData.type:'发票'}}</span>
                        <span class="title-right" @click="setInvoice" style="color:#999;">
                            {{invoiceData.title||'不开发票'}}<text class="iconfont iconxuanze" style="font-size:14px;"></text>
                        </span>
                    </div>
                </div>
                <!--发票选择 end-->

                <!-- 订单备注 begin -->
                <div class="discount-coupon">
                    <div class="title">
                        <span class="title-left overflow remark-title">订单备注</span>
                        <input v-model="memo" type="text" class="remark-input" placeholder="请输入订单备注信息" maxlength="150">
                    </div>
                </div>
                <!-- 订单备注 end -->
            </div>
        </div>
        <!--底部按钮-->
        <div class="flex-box mgT10">
            <div class="flex-auto bg-white flex-vcenter pdL30">
                <span class="pay-foot-describe fs30">实付合计：</span>
                <span class="pay-foot-money fs30B">
                    <span class="fs30B">¥</span>
                    {{filter.Fix2(actualPay)}}
                </span>
            </div>
            <div class="foot-right">
                <button class="pay-btn gradient-color overflow" @click="foreHandleEmitBill">立即结算({{allAmount}})</button>
            </div>
        </div>

        <!-- 加载动画效果 -->
        <div class="shade-style" v-show="showOnLoading">
            <div class="loading-style">
                <van-loading type="spinner"/>
            </div>
        </div>

        <!-- 赠品sku选择 begin -->
        <van-popup :show="isShowSku" position="bottom" :overlay="true" class="sku-popup">
            <order-sku-dialog-comp
                :goodsInfo.sync="skuPopupList"
                :colorActiveIndex.sync="colorActiveIndex"
                :sizeActiveIndex.sync="sizeActiveIndex"
                :isShowSku.sync="isShowSku"
                :flag="3"
                :sendActiveItem="sendActiveItem"
                @onSelectColor="onSelectColor"
            ></order-sku-dialog-comp>
        </van-popup>
        <!-- 赠品sku选择 end -->

        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />

        <van-dialog
            use-slot
            v-if="showDialog"
            :title="showDialog == 'unSell'?'以下商品已下架：':'以下商品库存不足：'"
            @close="showDialog = ''"
            :show="showDialog == 'unSell' || showDialog == 'unStock'">
            <div class="toast-html" v-show="showDialog == 'unSell'">
                <p v-for="(item,index) in unSellList" :key="item.goodsCode" :style="{'text-align': 'center'}">【{{item.goodsName}}】；</p>
            </div>
            <div class="toast-html" v-show="showDialog == 'unStock'">
                <p v-for="(item,index) in unStockList" :key="index" :style="{'text-align': 'center'}">【{{item.ptiPartHdName}}】颜色：{{item.colorName}}，尺码：{{item.sizeName}}；</p>
            </div>
        </van-dialog>
    </div>
</template>

<script>
    import {
        Base,
        Order,
        UserService,
        Vouchers,
        Payment,
        Fund,
        Goods,
        Invoice,
        Fission
    } from "@/api/service";

    import wxPay from "@/utils/wxPay";
    import check from "@/utils/check";
    import payment from "@/utils/payment";
    import deliverSelect from "./components/deliver-select";
    import orderSkuDialogComp from './components/order-sku-dialog.vue'

    import Dialog from 'vant-weapp/dist/dialog/dialog';
    import Toast from 'vant-weapp/dist/toast/toast';

    export default {
        config:{
            navigationBarTitleText: '订单结算'
        },
        components: {
            deliverSelect,
            orderSkuDialogComp,
        },
        data() {
            return {
                isShowSku: false,
                colorActiveIndex: null,
                sizeActiveIndex: null,
                skuPopupList: '',           // 赠品sku选择
                sendListIndex: null,        // 赠品当前选中索引
                price: {},                  //折扣价格
                vipDiscount: "",            //vip折扣
                memo: "",                   //订单备注
                showOnLoading: false,
                Actionlist: {
                    disCoupon: {
                        name: "折扣券",
                        value: "无可用",
                        action: this.onActionSheet,
                        renderType: "arrow",
                        type: "discTicket"
                    },
                    cashCoupon: {
                        name: "抵用券",
                        value: "无可用",
                        action: this.onActionSheet,
                        renderType: "arrow",
                        type: "cashTicket"
                    },
                    integral: {
                        value: '',
                        name: "积分",
                        action: this.onSwitch,
                        renderType: "swicth",
                        enable: true
                    },
                    balance: {
                        value: "-￥0",
                        name: "账户余额",
                        action: this.onSwitchBalance,
                        renderType: "swicth",
                        enable: true
                    },
                    memo: {
                        name: "订单备注",
                        value: "HAH",
                        action: this.onRecieveMemo,
                        renderType: "field"
                    }
                },
                transFee: 0,
                balance: 0,             // 账户余额
                areaList: {},           // 地址列表
                address: [],
                showAreaList: false,    // 显示省市区选择器
                storeList: [],          // 门店列表
                store: {},              // 门店对象
                shipParams: {
                    kdps: {},
                    mdzq: {}
                },
                showStoreList: false,       // 显示门店选择器
                canUsePoint: false,         // 用户是否可以使用积分
                isPointUsed: true,          // 是否使用积分抵扣
                isBalanceUsed: false,       // 是否使用余额
                shopCart: {},
                shopList: [],               // 商品清单
                customList: {},
                suitsList: [],              // 套装
                singleList: [],             // 单品
                disCouponList: [],          // 折扣券列表
                cashCouponList: [],         // 现金券列表
                cardIds: {
                    cashCouponId: null,
                    disCouponId: null
                },
                showGoodsList: false,       // 展示商品清单上拉列表
                showCusList: false,         // 显示定制清单
                showDiscTickets: false,     // 展示折扣券上拉列表
                showCashTickets: false,     // 展示抵用券上拉列表
                showDalog: true,            // 默认显示弹窗提示
                isDiscountCouponShow: false,// 默认折扣券不展开
                isDiscountCouponIndex: null,
                isDiscountCouponPrice: '不使用折扣券',
                isCouponShow: false,        // 默认抵用券不展开
                isCouponIndex: null,
                isCouponPrice: '不使用抵用券',
                sendList: [],               // 赠品列表
                sendActiveItem: {},         // 赠品当前选中
                company_id:'',              // 公司id
                showDialog: false,          // 库存上下架提示
                unSellList:[],              // 未上架列表
                unStockList:[],             // 库存不足列表
                btnDiscountLock: false,     // 折扣券、抵用券按钮锁

                disabledPoint: false,// 是否禁用积分checkbox
                showPointFlag: 0,// 判断是否可使用积分
                switchFlag: false,// 积分使用开关
                pointInfo: {},// 将有使用积分时的积分信息保存下来
                invoiceStatus: false, //  是否允许开发票
                invoiceData: {}, //发票信息
                fissionType:1, // 1秒杀 2拼团
                onlineHdId: '',// 促销id
            };
        },
        watch: {
            visiblePoint(boolean){
                // 如果积分行由不显示变成显示 把开关打开
                if(boolean){
                    this.switchFlag = true;
                }
            },
            transFee() {
                if (this.isBalanceUsed) {
                    // 获取用户余额信息
                    this.getUserGoldInfo();
                }
            },
            'isDiscountCouponIndex'() {
                if (this.isDiscountCouponIndex >= 0) {
                    if (this.isDiscountCouponIndex === 0) {
                        this.isDiscountCouponPrice = '不使用折扣券'
                        return
                    }
                    if(this.disCouponList && this.disCouponList[this.isDiscountCouponIndex]){
                        this.isDiscountCouponPrice = Number(Math.round(this.disCouponList[this.isDiscountCouponIndex].discount * 100) / 10) + '折'
                    }
                }
            },
            'isCouponIndex'() {
                if (this.isCouponIndex >= 0) {
                    if (this.isCouponIndex === 0) {
                        this.cashCouponList[0].active = true;
                        return
                    }
                }
            }
        },

        methods: {
            //  获取发票设置
            getInvoice() {
                let data = {};
                Invoice.canSetInvoice(data).then((res) => {
                    if (res.invoiceStateCode === "D_INV_ORDSAVE") {
                        this.invoiceStatus = true;
                    } else {
                        this.invoiceStatus = false;
                    }
                });
            },
            //  发票页面跳转
            setInvoice() {
                if (this.invoiceStatus === false) {
                    return;
                } else {
                    // this.setStore();
                    this.$router.push("/pages/orderPackage/invoice/invoiceApply?fromPage=settlement");
                }
            },

            /** 点击勾选使用积分 **/
            pointChange(e){
                if(this.disabledPoint) return;
                this.switchFlag = e.mp.detail;
                this.getDiscount();
            },
            // 组件回调：尺码、颜色选择
            onSelectColor(colorItem, sizeItem, currentSend) {
                let obj = {}
                let imgFlag = false
                currentSend.colorAndSizeList.forEach((item) => {
                    if (item.colorCode === colorItem.colorCode) {
                        item.sizeChildList.forEach((itm) => {
                            if (itm.sizeCode === sizeItem.sizeCode) {
                                obj.amount = itm.skuQty
                                obj.skuId = itm.skuId
                                obj.salePmHdId = itm.salePmHdId
                                obj.giftId = itm.giftId

                                // 优先取颜色图，没有颜色图取主图
                                if (itm.url) {
                                    obj.url = itm.url
                                } else {
                                    obj.url = currentSend.url
                                }
                            }
                        })
                    }
                })
                // 商品id
                obj.partHdId = currentSend.partHdId

                let searchFlag = true
                this.sendList.forEach((sendItem, sendIndex) => {
                    sendItem.giftGroup.forEach((giftGroupItem, giftGroupIndex) => {
                        if (searchFlag) {
                            for (let i = 0; i < giftGroupItem.gifts.length; i++) {
                                let current = giftGroupItem.gifts[i]
                                if (current.colorCode === colorItem.colorCode &&
                                    current.sizeCode === sizeItem.sizeCode &&
                                    sendIndex === this.sendListIndex) {

                                    giftGroupItem.choseCode = colorItem.classCode
                                    giftGroupItem.choseGoods.goodsCode = colorItem.goodsCode
                                    giftGroupItem.choseGoods.goodsName = colorItem.goodsName

                                    giftGroupItem.choseGoods.colorCode = colorItem.colorCode
                                    giftGroupItem.choseGoods.colorId = colorItem.colorId
                                    giftGroupItem.choseGoods.colorName = colorItem.colorName

                                    giftGroupItem.choseGoods.sizeCode = sizeItem.sizeCode
                                    giftGroupItem.choseGoods.sizeId = sizeItem.sizeId
                                    giftGroupItem.choseGoods.sizeName = sizeItem.sizeName

                                    giftGroupItem.choseGoods.amount = obj.amount
                                    giftGroupItem.choseGoods.skuId = obj.skuId
                                    giftGroupItem.choseGoods.salePmHdId = obj.salePmHdId
                                    giftGroupItem.choseGoods.url = obj.url
                                    giftGroupItem.choseGoods.partHdId = obj.partHdId
                                    giftGroupItem.choseGoods.giftId = obj.giftId

                                    searchFlag = false
                                }
                            }
                        }
                    })
                })

                this.$emit('update:sendList', this.sendList)
            },

            // sku弹窗
            async skuChose(item, index) {
                this.isShowSku = !this.isShowSku
                this.sendListIndex = index

                // 判断赠品当前是否有选中状态
                if (item.choseGoods.goodsCode) {
                    this.sendActiveItem = item.choseGoods
                } else {
                    this.sendActiveItem = {}
                }

                let goodSkuArr = []

                // 区分货号
                item.gifts.forEach((itm, itmIndex) => {
                    let goodSkuObj = {}
                    goodSkuObj.colorList = []
                    goodSkuObj.sizeList = []
                    goodSkuObj.colorAndSizeList = []
                    goodSkuObj.salePrice = 0

                    goodSkuObj.goodsCode = itm.goodsCode
                    goodSkuObj.partHdId = itm.partHdId
                    goodSkuObj.goodsName = itm.goodsName
                    goodSkuObj.url = itm.url

                    goodSkuArr.push(goodSkuObj)
                })

                // 去重相同的货号
                let newGoodSkuArr = global.objCombine(goodSkuArr, 'goodsCode')

                // 颜色、尺码放到指定的商品下
                newGoodSkuArr.forEach((newGoodItem) => {
                    let combineColor = []
                    let combineSize = []
                    item.gifts.forEach((itm) => {
                        if (newGoodItem.goodsCode === itm.goodsCode) {
                            // 颜色
                            let colorObj = {}
                            colorObj.colorCode = itm.colorCode
                            colorObj.colorId = itm.colorId
                            colorObj.colorName = itm.colorName
                            colorObj.colorSortSeq = itm.colorSortSeq

                            colorObj.classCode = itm.classCode
                            colorObj.goodsCode = itm.goodsCode
                            colorObj.goodsName = itm.goodsName

                            colorObj.urls = []
                            colorObj.none = true     // 默认按钮可以点击

                            combineColor.push(colorObj)

                            // 尺码
                            let sizeObj = {}
                            sizeObj.sizeCode = itm.sizeCode
                            sizeObj.sizeId = itm.sizeId
                            sizeObj.sizeName = itm.sizeName
                            sizeObj.none = true     // 默认按钮可以点击
                            sizeObj.sizeSortSeq = itm.sizeSortSeq
                            combineSize.push(sizeObj)
                        }
                    })

                    // 对象去重
                    let repeatColorList = global.objCombine(combineColor, 'colorCode')
                    let repeatSizeList = global.objCombine(combineSize, 'sizeCode')

                    // 赠品排序
                    newGoodItem.colorList = repeatColorList.sort(global.compare('colorSortSeq'))
                    newGoodItem.sizeList = repeatSizeList.sort(global.compare('sizeSortSeq'))
                })

                // 颜色放到colorAndSizeList
                newGoodSkuArr.forEach((arrItem) => {
                    arrItem.colorList.forEach((colorAndSizeItem, colorAndSizeIndex) => {
                        let obj = {}
                        obj.colorCode = colorAndSizeItem.colorCode
                        obj.colorId = colorAndSizeItem.colorId
                        obj.colorName = colorAndSizeItem.colorName
                        arrItem.colorAndSizeList.push(obj)
                        arrItem.colorAndSizeList[colorAndSizeIndex].sizeChildList = []
                    })
                })

                newGoodSkuArr.forEach((arrItem, arrIndex) => {
                    arrItem.colorAndSizeList.forEach((colorAndSizeItem) => {
                        item.gifts.forEach((itm, itmIndex) => {
                            if (itm.goodsCode === arrItem.goodsCode && itm.colorCode === colorAndSizeItem.colorCode) {
                                let obj = {}
                                obj.sizeCode = itm.sizeCode
                                obj.sizeName = itm.sizeName
                                obj.skuId = itm.skuId
                                obj.skuQty = itm.amount
                                obj.salePmHdId = itm.salePmHdId
                                obj.url = itm.url
                                obj.giftId = itm.giftId // 赠品来自哪个促销商品
                                colorAndSizeItem.sizeChildList.push(obj)
                            }
                        })
                    })
                })
                this.skuPopupList = newGoodSkuArr
            },

            // 积分使用开关
            onSwitch(item, state) {
                this.isPointUsed = state;
                this.getDiscount();
            },

            onSwitchBalance(item, state) {
                this.isBalanceUsed = state;
                if (!state) {
                    this.Actionlist.balance.value = "";
                } else {
                    this.getUserGoldInfo();
                }
            },

            // 抵用券/折扣券展示控制
            onActionSheet(item) {
                switch (item.type) {
                    case "cashTicket":
                        this.showCashTickets = true;
                        break;
                    case "discTicket":
                        this.showDiscTickets = true;
                        break;
                    default:
                        return false;
                }
            },

            //获取留言
            onRecieveMemo(memo) {
                this.memo = memo;
            },

            // 省市区选择
            onAreaChange(item) {
                this.showAreaList = false;
                this.address = item;
                this.storeList = [];
                this.$refs.deliverSelect.$data.storeForm.storeName = "";
            },

            //优惠券/抵用券互斥,选中优惠券同时要去获取与之不可用的抵用券，反之亦然
            getUsableTickets(cardIds) {
                let params = {
                    ownCompanyId: global.Storage.get("COMPANYID").company_id,
                    rtlOrdInterHdId: this.orderHdId,
                    cardIds: cardIds + "" || ""
                };
                return Vouchers.getCanUseCouponsList(params);
            },

            async filterCashCoupon(cardId) {
                let result = await this.getUsableTickets(cardId);
                if (!result.cashList) {
                    result.cashList = [];
                }
                if (!result.storeList) {
                    result.storeList = [];
                }

                result.cashList.push(...result.storeList);

                this.cashCouponList.forEach((json, index) => {
                    if (result.cashList.length) {
                        for (let i = 0; i < result.cashList.length; i++) {
                            if (json.cardId == result.cashList[i]) {
                                json.disabled = false;
                                break;
                            } else {
                                if (i == result.cashList.length - 1) {
                                    // 不使用抵用券始终可以选择
                                    if (index === 0) {
                                        json.disabled = false
                                        return
                                    }

                                    //该券不再返回可用券内 估禁用
                                    json.disabled = true;
                                    json.active = false
                                    if (this.cardIds.cashCouponId == json.cardId) {
                                        this.cardIds.cashCouponId = '';
                                        this.isCouponIndex = 0;
                                        return
                                    }
                                }
                            }
                        }
                    } else {
                        if (index === 0) {
                            this.cardIds.cashCouponId = '';
                            this.isCouponIndex = 0;
                            json.disabled = false
                            return
                        }
                        json.active = false
                        json.disabled = true;
                    }
                });
            },

            // 折扣券展开/收起
            discountCouponToggle() {
                if (this.fissionType) {
                    return
                }

                this.isDiscountCouponShow = !this.isDiscountCouponShow
            },

            // 折扣券选中当前
            async discountCouponItem(item, index) {
                if (item.disabled) {
                    return
                }

                this.showOnLoading = true
                // 按钮锁
                if (this.btnDiscountLock || this.isDiscountCouponIndex === index) {
                    this.disCouponList.forEach((itm, itmIndex) => {
                        itm.active = false
                    })
                    this.disCouponList[this.isDiscountCouponIndex].active = true
                    this.showOnLoading = false
                    return
                }
                this.btnDiscountLock = true

                this.isDiscountCouponIndex = index

                let orderCouponData = global.Storage.get('orderCoupon')
                orderCouponData.isDiscountCouponIndex = index
                orderCouponData.discountCouponCartId = item.cardId
                global.Storage.set('orderCoupon', orderCouponData)

                this.disCouponList.forEach((itm, itmIndex) => {
                    itm.active = false
                })
                item.active = true

                //保存选中的卡id
                this.cardIds.disCouponId = item.cardId;

                if (!item.cardId || item.cardId == -1) {
                    let discount = await this.getDiscount(); //不使用优惠券时价格需重新计算
                    this.allCouponUnDisabled(this.cashCouponList);
                    this.Actionlist.disCoupon.value = item.couponName;
                } else {
                    await this.filterCashCoupon(item.cardId);

                    await this.getDiscount();
                }
            },

            /**
             * 赠品数据组装
             * @param data 原始数据
             * @param isCoupon true为使用折扣券 false
             */
            _giftCommonData(data) {
                let newSendList = []

                data.forEach((giftItem) => {
                    giftItem.giftGroup.forEach((itm) => {
                        if (itm.groupType === "随机") {}
                        if (itm.groupType === "固定") {
                            //  固定全部赠送
                        }
                        if (itm.groupType === "指定") {
                            //  选择一件商品
                            itm.choseCode = "";
                            itm.choseGoods = {};
                            itm.showArr = false;
                        }

                        itm.gifts.forEach((giftsItm) => {
                            // 促销id
                            giftsItm.salePmHdId = data[0].salePmHdId

                            // 赠品数量累加
                            let obj = {}
                            if (newSendList.length === 0) {
                                obj.goodsCode = giftsItm.goodsCode
                                obj.skuId = giftsItm.skuId
                                obj.num = giftsItm.amount
                                newSendList.push(obj)
                            } else {
                                let isNumAddFlag = false
                                for (let i = 0; i < newSendList.length; i++) {
                                    if (newSendList[i].goodsCode === giftsItm.goodsCode &&
                                        newSendList[i].skuId === giftsItm.skuId) {
                                        newSendList[i].num += giftsItm.amount
                                        isNumAddFlag = true
                                        break
                                    }
                                }

                                if (!isNumAddFlag) {
                                    obj.goodsCode = giftsItm.goodsCode
                                    obj.skuId = giftsItm.skuId
                                    obj.num = giftsItm.amount
                                    newSendList.push(obj)
                                }
                            }
                        })
                    })
                });

                data.forEach((giftItem) => {
                    giftItem.giftGroup.forEach((itm) => {
                        itm.gifts.forEach((giftsItm) => {
                            newSendList.forEach((newItem, newIndex) => {
                                if (newItem.goodsCode === giftsItm.goodsCode &&
                                    newItem.skuId === giftsItm.skuId) {

                                    giftsItm.num = newItem.num
                                }
                            })
                        })
                    })
                });

                return data
            },

            // 抵用券展开/收起
            couponToggle() {
                if (this.fissionType) {
                    return
                }

                this.isCouponShow = !this.isCouponShow
            },

            // 抵用券选中当前
            couponItem(item, index) {
                if (item.disabled) {
                    return
                }

                this.showOnLoading = true
                // 按钮锁
                if (this.btnDiscountLock || this.isCouponIndex === index) {
                    this.cashCouponList.forEach((itm, itmIndex) => {
                        itm.active = false
                    })
                    this.cashCouponList[this.isCouponIndex].active = true
                    this.showOnLoading = false
                    return
                }
                this.btnDiscountLock = true

                if (item.disabled) return
                this.isCouponIndex = index

                let orderCouponData = global.Storage.get('orderCoupon')
                orderCouponData.isCouponIndex = index
                orderCouponData.couponCartId = item.cardId
                global.Storage.set('orderCoupon', orderCouponData)

                this.cashCouponList.forEach((itm, itmIndex) => {
                    itm.active = false
                })

                item.active = true

                this.cardIds.cashCouponId = item.cardId

                // 选择不使用抵用券，折扣券将状态置为可选
                if (!item.cardId || item.cardId == -1) {
                    this.allCouponUnDisabled(this.disCouponList);
                    this.Actionlist.cashCoupon.value = item.couponName;
                    this.getDiscount();
                } else {
                    this.getDiscount();
                }
            },

            // 所有权不禁用
            allCouponUnDisabled(arr) {
                arr.forEach((item, index) => {
                    item.disabled = false;
                });
            },

            // 用户输入卡券 失焦回调
            // msg存在表示输入券不可用
            onInputBlur(val, type) {
                let callback = () => {
                    let msg = "",
                        voucherTypeName = "",
                        gold = 0,
                        cardIdString = "";
                    if (type === "cashCoupon") {
                        if (this.$refs.cashCoupon.$data.selectedModel != -2) return;
                        voucherTypeName = "抵用券";
                    } else {
                        if (this.$refs.disCoupon.$data.selectedModel != -2) return;
                        voucherTypeName = "抵扣券";
                    }
                    if (val) {
                        // 根据卡编号 获取卡id
                        Vouchers.getCouponsId({ cardCode: val }).then(res => {
                            if (res) {
                                if (type == "cashCoupon") {
                                    cardIdString =
                                        res +
                                        (this.cardIds.disCouponId
                                            ? "," + this.cardIds.disCouponId
                                            : "");
                                } else {
                                    // 过滤现金券 优惠券
                                    this.filterCashCoupon(res);
                                    cardIdString =
                                        res +
                                        (this.cardIds.cashCouponId
                                            ? "," + this.cardIds.cashCouponId
                                            : "");
                                }
                                this.getDiscount(cardIdString).then(data => {
                                    if (type == "cashCoupon") {
                                        if (data.cashCouponPrice > 0) {
                                            gold = data.cashCouponPrice;
                                        } else if (data.storedValueCardPrice > 0) {
                                            gold = data.storedValueCardPrice;
                                        } else {
                                            gold = 0;
                                            msg = "该优惠券不可使用";
                                        }
                                    } else {
                                        if (data.disCouponPrice > 0) {
                                            gold = data.disCouponPrice;
                                        } else {
                                            gold = 0;
                                            msg = "该优惠券不可使用";
                                        }
                                    }
                                    if (gold && gold > 0) {
                                        gold =
                                            "-￥" + Number(gold).toFixed(2) * 1.0;
                                        this.setTipAndId(type, gold, res);
                                    } else {
                                        this.setTipAndId(type, msg, "");
                                    }
                                });
                            } else {
                                msg = "找不到该" + voucherTypeName;
                                this.setTipAndId(type, msg, "");
                                if (type === "cashCoupon") {
                                    this.allCouponUnDisabled(this.disCouponList);

                                } else {
                                    this.allCouponUnDisabled(this.cashCouponList);
                                }
                                this.getDiscount();
                            }
                        });
                    } else {
                        msg = "不使用" + voucherTypeName + "~";
                        this.setTipAndId(type, msg, "");
                        if (type === "cashCoupon") {
                            this.allCouponUnDisabled(this.disCouponList);
                        } else {
                            this.allCouponUnDisabled(this.cashCouponList);
                        }
                        this.getDiscount();
                    }
                };

                // 延时解决： 选其他券时的input失焦避免调用接口
                setTimeout(() => {
                    wx.pageScrollTo(0, 5);
                    callback();
                }, 100);
            },

            // 设置主页面券使用提示，和对应选中券id
            setTipAndId(type, msg, id) {
                if (type === "cashCoupon") {
                    this.cardIds.cashCouponId = id;
                    this.Actionlist.cashCoupon.value = msg;
                } else {
                    this.cardIds.disCouponId = id;
                    this.Actionlist.disCoupon.value = msg;
                }
            },

            // 过滤折扣券（折扣券优先）
            async filterDisCoupon(cardId) {
                let result = await this.getUsableTickets(cardId);
                this.disCouponList.forEach((json, index) => {
                    if (result.disList.length) {
                        for (let i = 0; i < result.disList.length; i++) {
                            if (json.cardId == result.disList[i]) {
                                json.disabled = false;
                                break;
                            } else {
                                if (i == result.disList.length - 1) {
                                    //最后一个
                                    json.disabled = true;
                                }
                            }
                        }
                    } else {
                        json.disabled = true;
                    }
                });
            },

            //查看商品清单
            toViewGoodList(state) {
                this.showGoodsList = true;
            },

            // 查看定制清单
            viewCusList(good) {
                this.customList = good;
                this.showCusList = true;
            },

            // 提取组合商品并合并
            combindShopList(shopCart) {
                let skuList = [];
                if (
                    !check.isEmpty(shopCart.combList) &&
                    check.isArray(shopCart.combList)
                ) {
                    shopCart.combList.forEach(item => {
                        skuList = skuList.concat(item.skuList);
                    });
                }

                if (this.fissionType) {
                    shopCart.skuList.forEach((item, index) => {
                        item.amount = item.ordQty
                    })
                }

                return shopCart.skuList.concat(skuList);
            },

            // 获取购物清单
            async getShopList() {
                let shopCart
                if(this.fissionType){
                    let fissionData = {
                        rtlCartTempHdId: this.orderHdId,
                        busContsCode: global.baseConstant.busContsCode,
                        shopId: global.Storage.get("properties").shopId
                    }
                    switch (this.fissionType) {
                        case 1:
                            fissionData.fpsCode = 'SECKILL';
                            break;
                        case 2:
                            fissionData.fpsCode = 'GROUP';
                            break;
                        case 3:
                            fissionData.fpsCode = 'BARGAIN';
                            fissionData.vipInfoDtFssId = this.vipInfoDtFssId;
                            break;
                    }
                    // 获取裂变促销结算页商品信息
                    shopCart = await Fission.getFissionOrderSettleInfo(fissionData);
                    this.onlineHdId = shopCart.onlineHdId
//                    this.getDiscount();
                }else{
                    let params = {
                        ctmUsrId: global.Storage.get("USER_INFO").usrId,
                        cookieId: global.Storage.get("USER_INFO").usrId,
                        rtlCartTempHdId: this.orderHdId || this.$route.query.orderHdId,
                        busContsCode: global.baseConstant.busContsCode,
                        shopCode: global.Storage.get("properties").shopCode
                    };
                    shopCart = await Order.getSettlementInfo(params);
                }
                this.shopList = this.combindShopList(shopCart);
                global.toastLoading(false);// 关闭
            },
            // 获取会员折扣
            async getVipDiscount() {
                let params = {
                    wxUnionid: global.baseConstant.signUpTypeCode,
                    usrId: global.Storage.get("USER_INFO").usrId,
                    companyId: global.Storage.get("COMPANYID").company_id
                };
                let cardInfo = await UserService.getMyCardInfo(params);
                this.vipDiscount = cardInfo.discount;
            },

            // 获取用户是否可使用积分
            async getUsePointFlag(resolve) {
                let res = await Point.getUsePointFlag();
                this.Actionlist.integral.enable = res;
            },

            // 获取优惠券列表
            async getCouponsList() {
                let couponsList
                if(!this.fissionType) {
                    let params = {
                        shopId: global.Storage.get("properties").shopId,
                        rtlOrdInterHdId: this.orderHdId,
                        scopeId: 0
                    };
                    couponsList = await Vouchers.getOrderCouponsList(params);
                }

                this.disCouponList = [{
                    disabled: false,
                    active: true,
                    cardId: -1,
                    couponName: '不使用折扣券'
                }]; //折扣券
                this.cashCouponList = [{
                    disabled: false,
                    active: true,
                    cardId: -1,
                    couponName: '不使用抵用券'
                }]; //现金券

                if(couponsList.length) {
                    couponsList.forEach((item, index) => {
                        item.disabled = false;
                        item.active = false;
                        if (item.discount) {
                            this.disCouponList.push(item);
                        } else {
                            this.cashCouponList.push(item);
                        }
                    })
                }


                if (this.disCouponList.length == 0) {
                    this.Actionlist.disCoupon.value = "无可用";
                } else {
                    this.Actionlist.disCoupon.value = "不使用优惠券";
                }
                if (this.cashCouponList.length == 0) {
                    this.Actionlist.cashCoupon.value = "无可用";
                } else {
                    this.Actionlist.cashCoupon.value = "不使用优惠券";
                }
            },

            // 选中原先选中的折扣券、抵用券
            async _isSelectCoupon() {
                let orderData = global.Storage.get("orderCoupon")
                if (orderData && orderData.orderId === this.orderHdId) {
                    // 折扣券
                    if (orderData.isDiscountCouponIndex !== null && orderData.isDiscountCouponIndex >= 0) {
                        this.isDiscountCouponIndex = orderData.isDiscountCouponIndex
                        this.cardIds.disCouponId = orderData.discountCouponCartId

                        this.disCouponList[0].active = false
                        this.disCouponList[this.isDiscountCouponIndex].active = true
                    }

                    // 抵用券
                    if (orderData.isCouponIndex !== null && orderData.isCouponIndex >= 0) {
                        this.isCouponIndex = orderData.isCouponIndex
                        this.cardIds.cashCouponId = orderData.couponCartId

                        this.cashCouponList[0].active = false
                        this.cashCouponList[this.isCouponIndex].active = true
                    }
                } else {     // 设置折扣券、抵用券之前选中状态
                    let orderCouponData = {
                        orderId: this.orderHdId,
                        isDiscountCouponIndex: null,
                        discountCouponCartId: '',
                        isCouponIndex: null,
                        couponCartId: '',
                        flag: 0
                    }
                    global.Storage.set("orderCoupon", orderCouponData)
                }


                // 使用了折扣券，从选配送地址跳转回来时触发
                if (orderData && orderData.orderId === this.orderHdId) {
                    if (orderData.flag === 1) {
                        this.sendList = []
                        await this.getDiscount();
                        if (this.price.gifts && this.price.gifts.length > 0) {
                            this.sendList = await this._giftCommonData(this.price.gifts)
                        }
                    } else {
                        await this.getDiscount();
                    }
                } else {
                    // 重新计算价格
                    await this.getDiscount();
                }
            },

            /**
             * 获取价格接口中 积分使用逻辑
             * @params
             * internalPointFlag: 在getDiscount函数中递归调用才传，其他地方不可传(以该字段结束递归)
             **/
            aboutPoint(internalPointFlag){
                // 将有使用积分时的积分信息保存下来
                if(this.price.point){
                    this.pointInfo = {
                        point: this.price.point,
                        pointPirce: this.price.pointPirce,
                    }
                }

                // 如果有显示积分 && 不是内部调用
                if(this.showPointFlag && typeof internalPointFlag !== 'number') {

                    // 积分逻辑
                    let checkPrice = this.price.salePrice + (this.price.pointPirce?this.price.pointPirce:0);

                    // 商品价格（扣除积分前所有应扣价格）  <  最低积分使用额度   ==》  不让使用积分
                    if( checkPrice < this.userPointInfo.prPointValue * this.userPointInfo.minPoint){
                        // 之前是勾选使用积分的情况
                        if(this.switchFlag) {
                            this.switchFlag = false;
                            this.disabledPoint = true;
                            this.getDiscount('', 0);
                        }else{
                            this.disabledPoint = true;
                            this.getDiscount('', 0);
                        }
                    }else{// 满足使用积分
                        // 之前是勾选使用积分的情况
                        if(this.switchFlag) {

                        }else{
                            this.disabledPoint = false;
                            this.$nextTick(()=>{
                                this.getDiscount('', this.switchFlag?1:0);
                            })
                        }
                    }
                }
            },

            /**
             * 获取价格
             * @params
             * internalPointFlag: 在getDiscount函数中递归调用才传，其他地方不可传(以该字段结束递归)
             **/
            async getDiscount(cardIds, internalPointFlag) {
                if (!cardIds) {
                    cardIds = this.cardIdsFormat().toString();
                }
                let usePointFlag = internalPointFlag;
                if(typeof usePointFlag !== 'number') {
                    usePointFlag = this.showPointFlag;
                }
                let params = {
                    companyId: global.Storage.get("COMPANYID").company_id,
                    usrId: global.Storage.get("USER_INFO").usrId,
                    rtlOrdInterHdId: this.orderHdId,
                    cardIds: cardIds || "",
                    pointFlag: this.usePointFlag, //是否使用积分
                    busContsCode: global.baseConstant.busContsCode,
                    shopId: global.Storage.get("properties").shopId,
                    vipInfoHdId: global.Storage.get("USER_INFO").vipInfoId
                };
                this.price = await Vouchers.getOrderDiscountPoint(params);
                // 如果存在积分可抵扣价格则取值,否则不显示
                // if (this.Actionlist.integral.enable && this.isPointUsed == 1) {
                //     this.Actionlist.integral.value = "-￥" + ((+this.price.pointPirce).toFixed(2));
                // } else {
                //     this.Actionlist.integral.value = '';
                // }

                // 积分使用逻辑
                this.aboutPoint(internalPointFlag);

                if (this.isBalanceUsed) {
                    // 获取用户余额信息
                    this.getUserGoldInfo();
                }
                // 设置折扣券、抵用券价格显示
                if (this.price.cashCouponPrice != 0) {
                    this.Actionlist.cashCoupon.value = "-￥" + Number(Math.round(this.price.cashCouponPrice * 100) / 100);
                }
                if (this.price.storedValueCardPrice != 0) {
                    this.Actionlist.cashCoupon.value = "-￥" + Number(Math.round(this.price.storedValueCardPrice * 100) / 100);
                }
                if (this.price.disCouponPrice != 0) {
                    this.Actionlist.disCoupon.value = "-￥" + Number(Math.round(this.price.disCouponPrice * 100) / 100);
                }

                this.btnDiscountLock = false
                this.showOnLoading = false

                // 获取赠品
                this.sendList = []
                if (this.price.gifts && this.price.gifts.length > 0) {
                    this.sendList = this._giftCommonData(this.price.gifts)
                }

                return this.price;
            },

            // 获取用户余额信息 设置显示值
            getUserGoldInfo() {
                let needPay = this.price.salePrice + this.transFee;
                Fund.getFundDetail({}).then(res => {
                    if (res) {
                        this.balance = +(res.userFund.toFixed(2));
                    } else {
                        this.balance = 0;
                    }
                    let showUseableGold = 0;

                    if (needPay > 0) {
                        if (needPay <= this.balance) {
                            showUseableGold = needPay;
                        } else {
                            showUseableGold = this.balance;
                        }
                    }

                    this.Actionlist.balance.value = "-￥" + ((+showUseableGold).toFixed(2));
                });
            },

            /** 判断是否可使用积分 **/
            async judgeUsePoint(){
                this.userPointInfo = await UserService.getMinIntegral({
                    shopId: global.Storage.get("properties").shopId,
                    busContsCode: global.baseConstant.busContsCode,
                });
                this.userPointInfo.minPoint = this.userPointInfo.minPoint?this.userPointInfo.minPoint:0;
                // 由于页面缓存问题导致不能用计算属性
                // "integralFlag":  启用积分抵现 1：启用， 0停用;  "effFlag": 状态 1：启用，0停用;  "moreThanMin": 是否超过最小可用积分； "prPointValue": 积分面值； "minPoint": 最小使用积分；
                if(this.userPointInfo.effFlag == 1 &&
                    this.userPointInfo.integralFlag == 1 &&
                    this.userPointInfo.moreThanMin &&
                    typeof this.userPointInfo.prPointValue === 'number'){

                    this.showPointFlag = 1;
                }else{
                    this.showPointFlag = 0;
                }
                this.switchFlag = this.showPointFlag == 1 ? true : false;
            },

            // 数据初始化
            async onInit() {
                // 获取订单中间表id
                this.orderHdId = parseInt(this.$route.query.orderHdId);
                if(!this.fissionType) {
                    // 判断使用是否可使用积分
                    await this.judgeUsePoint();
                }
                // 获取购物清单
                this.getShopList();
                // 获取优惠券列表
                await this.getCouponsList();
                // 选中原先选中的折扣券、抵用券
                this._isSelectCoupon()
            },

            // 订单支付支付
            toPay(billCode) {
                let successUrl = "/pages/orderPackage/order/orderDetail/order-detail" + "?billCode=" + billCode;
                successUrl += this.fissionType ? "&fissionType=" + this.fissionType : '';
                if (this.actualPay <= 0) {
                    this.saving = false;
                    this.$router.replace(successUrl + "&fromPage=payCode");
                    Order.packLevelUp({ billCode: billCode });

                    // 裂变不需要锁库存
                    if (this.fissionType) {
                        Order.lockStock({ billCode: billCode, operType: 'FRONT_PAY' });
                    }

                    return;
                }

                wxPay(billCode, this.actualPay).then(res => {
                        this.$router.replace(successUrl + "&fromPage=payCode");
                    },
                    err => {
                        this.$router.replace(successUrl);
                    }
                ).catch(()=>{
                    Toast("支付出错了~");
                    this.$router.replace(successUrl);
                }).then(()=>{
                    this.$store.dispatch('user/updateShoppingCart')
                    this.saving = false;
                });
            },

            //将选中的卡券格式化为参数,提交订单时用
            cardIdsFormat() {
                let keys = Object.keys(this.cardIds);
                let arr = [];
                keys.forEach(key => {
                    if (this.cardIds[key] && this.cardIds[key] != -1) {
                        arr.push(this.cardIds[key] + "");
                    }
                });
                return arr;
            },

            // 获取配送信息参数
            getDeliverParams() {
                let tips = {
                    buyUsrMobile: "电话不能为空",
                    cargoUsrName: "姓名不能为空",
                    cargoMobile: "电话不能为空",
                    cargoAddr: "地址不能为空",
                    cargoDestrictCode: "收货人地址编码不能为空",
                    recptDptId: "店铺id不能为空",
                    receiptWayCode: "取货方式不能为空",
                    receiptWayId: "取货方式Id不能为空"
                }
                let params = {};
                // 取出当前取货方式的参数
                // for (let key in this.shipParams) {
                //     if (!check.isEmpty(this.shipParams[key])) {
                //         params = this.shipParams[key];
                //     }
                // }
                params = this.shipParams['kdps'];
                // 参数是否填写完整
                let isParamsAllFill = true;
                // 参数判空提示
                for (let key in params) {
                    if (check.isEmpty(params[key])) {
                        Toast(tips[key]);

                        // 滚动到最顶部
                        this.$nextTick(() => {
                            this.$refs.scrollBody.scrollTop = 0
                        })

                        isParamsAllFill = false;
                        break;
                    }
                }
                if (!isParamsAllFill) return {};
                return params;
            },

            // 查询商品库存
            async getGoodsStucks(item, groupId, salePmHdId) {
                let flag = false    // 默认库存不足
                let data = {
                    busContsCode: global.baseConstant.busContsCode,
                    goodsCode: item.goodsCode,
                    colorCode: item.colorCode,
                    sizeCode: item.sizeCode,
                    shopCode: global.Storage.get("properties").shopCode,
                    onlineHdId: salePmHdId,
                    groupId: groupId
                };
                await Goods.getGoodsStock(data).then((res) => {
                    if (item.num) {
                        if (item.num <= res.skuList[0].skuQty) {
                            flag = true
                        }
                    } else {
                        if (item.amount <= res.skuList[0].skuQty) {
                            flag = true
                        }
                    }
                });
                return flag
            },

            // 设置库存校验弹窗显示状态
            setDialogState(state = ''){
                this.showDialog = state;
                setTimeout(()=>{
                    this.showDialog = '';
                },3000)
            },

            // 提交订单
            async foreHandleEmitBill() {
                // 按钮锁
                if (this.btnLock) {
                    return
                }
                this.btnLock = true

                if (this.fissionType) {
                    this.handleEmitBill(false)
                    return
                }

                let stockFlag = false

                // 检验商品库存、上下架
                let goodListObj = {
                    shopId: global.Storage.get("properties").shopId,
                    usrId: global.Storage.get("USER_INFO").usrId,
                    goodList: []
                }
                this.shopList.forEach((item, itemIndex) => {
                    goodListObj.goodList.push({
                        busContsCode: global.baseConstant.busContsCode,
                        goodsCode: item.goodsCode,              // 商品编码
                        ptiPartHdId: item.ptiPartHdId,          // 商品id
                        ptiPartDtSkuId: item.ptiPartDtSkuId,    // 商品skuId
                        amount: item.amount,                    // 数量
                        orderFlag: item.orderFlag               // 0为大货 1为定制
                    })
                })
                goodListObj.busContsCode = global.baseConstant.busContsCode
                await Goods.getUseableGood(goodListObj).then((res) => {
                    if (res.sellAll !== 1) {        // 商品已下架
                        this.btnLock = false
                        this.unSellList = res.unSellList;
                        this.setDialogState('unSell');

                        return false
                    }
                    if (res.stockAll !== 1) {       // 商品库存不足
                        this.btnLock = false
                        this.unStockList = res.unStockList;
                        this.setDialogState('unStock');
                        return false
                    }
                })

                if (this.btnLock === false) {
                    return
                }

                // 判断赠品库存
                if (this.sendList && this.sendList.length > 0) {

                    for (let i = 0; i < this.sendList.length; i++) {
                        for (let j = 0; j < this.sendList[i].giftGroup.length; j++) {
                            let current = this.sendList[i].giftGroup[j]

                            if (!stockFlag && current.groupType !== "指定") {
                                // 判断赠品库存
                                for (let k = 0; k < current.gifts.length; k++) {
                                    let flag = await this.getGoodsStucks(current.gifts[k], this.sendList[i].giftGroup[j].groupId, this.sendList[i].salePmHdId)
                                    if (flag === false) {
                                        stockFlag = true

                                        if (stockFlag) {
                                            Dialog.confirm({
                                                title: '提示',
                                                message: '赠品库存不足，是否继续购买？'
                                            }).then(async () => {
                                                // 需求调整，请勿删除
                                                // this.handleEmitBill(false)

                                                this.sendList = []
                                                await this.getDiscount();
                                                if (this.price.gifts && this.price.gifts.length > 0) {
                                                    this.sendList = await this._giftCommonData(this.price.gifts)
                                                }

                                                this.handleEmitBill()

                                            }).catch(async () => {
                                                this.sendList = []
                                                await this.getDiscount();
                                                if (this.price.gifts && this.price.gifts.length > 0) {
                                                    this.sendList = await this._giftCommonData(this.price.gifts)
                                                }
                                                this.btnLock = false
                                            });
                                            break
                                        }
                                    }
                                }
                            }

                            if (!stockFlag && current.groupType === "指定") {
                                // 未选择赠品
                                if (!current.choseGoods.goodsCode ||
                                    current.choseGoods.goodsCode === undefined) {
                                    Toast('请选择赠品')
                                    this.btnLock = false;
                                    return
                                }

                                // 判断赠品库存
                                let flag = await this.getGoodsStucks(current.choseGoods, this.sendList[i].giftGroup[j].groupId, this.sendList[i].salePmHdId)
                                if (flag === false) {
                                    stockFlag = true

                                    if (stockFlag) {
                                        Dialog.confirm({
                                            title: '提示',
                                            message: '赠品库存不足，是否继续购买？'
                                        }).then(async () => {
                                            // 需求调整，请勿删除
//                                            this.handleEmitBill(false)

                                            this.sendList = []
                                            await this.getDiscount();
                                            if (this.price.gifts && this.price.gifts.length > 0) {
                                                Toast('请重新选择赠品~')
                                                this.sendList = await this._giftCommonData(this.price.gifts)
                                            }
                                            this.btnLock = false
                                        }).catch(async () => {
                                            this.sendList = []
                                            await this.getDiscount();
                                            if (this.price.gifts && this.price.gifts.length > 0) {
                                                this.sendList = await this._giftCommonData(this.price.gifts)
                                            }
                                            this.btnLock = false
                                        });
                                        break
                                    }
                                }
                            }
                        }
                    }

                    if (!stockFlag) {
                        this.handleEmitBill()
                    }

                } else {
                    this.handleEmitBill()
                }
            },

            /**
             * 微信支付
             * @param unSend false不需要赠品 true需要赠品
             */
            handleEmitBill(unSend = true) {
                let promotionArr = [];

                if (unSend) {
                    //  添加赠品字段
                    if (this.sendList && this.sendList.length > 0) {
                        this.sendList.forEach((item) => {
                            item.giftGroup.forEach(async (giftGroupItem) => {
                                if (giftGroupItem.groupType !== "指定") {
                                    //  非指定商品全选
                                    giftGroupItem.gifts.forEach((goods) => {
                                        promotionArr.push(goods);
                                    });
                                }
                                if (giftGroupItem.groupType === "指定") {
                                    // 指定商品选择
                                    if (giftGroupItem.choseCode) {
                                        promotionArr.push(giftGroupItem.choseGoods);
                                    }
                                }
                            })
                        });
                    }
                }

                let deliverParams = this.getDeliverParams();
                if (check.isEmpty(deliverParams)) {
                    this.btnLock = false
                    return;
                }
                if (this.saving) {
                    this.btnLock = false
                    return;
                }

                this.saving = true;
                this.count++;
                let params = {
                    billId: this.orderHdId,
                    busContsCode: global.baseConstant.busContsCode,
                    shopCode: global.Storage.get("properties").shopCode,
                    shopId: global.Storage.get("properties").shopId,
                    ctmUsrId: global.Storage.get("USER_INFO").usrId,
                    sourceCode: "D_ORDWEIN",

                    companyId: global.Storage.get("COMPANYID").company_id,
                    usrId: global.Storage.get("USER_INFO").usrId,
                    balanceFlag: this.isBalanceUsed ? 1 : 0, // 是否使用余额
                    cartList: this.shopList, //商品列表
                    // ctmMessage: this.memo, //订单备注
                    promotionList: this.cardIdsFormat(), //券数组['123',456]
                    pointFlag: this.usePointFlag, //是否使用积分

                    receiptWayCode: 'kdps',                                         // 快递配送方式
                    receiptWayId: this.shipParams['kdps'].receiptWayId,             // 快递配送id
                    buyUsrMobile: this.shipParams['kdps'].cargoMobile,              // 电话
                    cargoAddr: this.shipParams['kdps'].cargoAddr,                   // 地址
                    cargoDestrictCode: this.shipParams['kdps'].cargoDestrictCode,   // 邮编
                    cargoMobile: this.shipParams['kdps'].cargoMobile,
                    cargoUsrName: this.shipParams['kdps'].cargoUsrName,             // 姓名
                };
                if (!!this.memo) params.ctmMessage = this.memo
                if (promotionArr.length <= 0) {
                    promotionArr = null;
                }
                if (promotionArr !== null) {
                    params.promotePartDto = promotionArr;
                }
                this.showOnLoading = true;

                if(this.fissionType) {
                    switch (this.fissionType) {
                        case 1:
                            params.fpsCode = 'SECKILL';
                            break;
                        case 2:
                            params.fpsCode = 'GROUP';
                            break;
                        case 3:
                            params.fpsCode = 'BARGAIN';
                            params.vipInfoDtFssId = this.vipInfoDtFssId;
                            break;
                    }
                    params.onlineHdId = this.onlineHdId        // 促销id

                    Fission.saveFissionOrder(Object.assign(params, deliverParams)).then(async(billCode) => {
                        this.showOnLoading = false;
                        this.toPay(billCode)
                        this.btnLock = false
                    }, err => {
                        Toast(err.errorMsg)
                        this.showOnLoading = false
                        this.saving = false
                        this.btnLock = false
                    })
                } else {
                    Order.saveOrder(Object.assign(params, deliverParams)).then(
                        billCode => {
                            //  开发票操作，当实际支付金额（不包含运费）大于0时开发票
                            if (this.actualPay > 0) {
                                if (this.invoiceData.data &&this.invoiceData.data !== undefined &&this.invoiceData.data !== null) {
                                    let invoiceData = this.invoiceData.data;
                                    invoiceData.billCode = billCode;
                                    Invoice.putInvoice(invoiceData).then(() => {
                                        global.Storage.remove("invoiceData");
                                        global.Storage.remove("orderDelivery");
                                    });
                                }
                            }
                            this.showOnLoading = false;
                            this.toPay(billCode);

                            // todo 调用预约接口
                            // this.appointMeas(billCode);
                            global.Storage.remove("reserveParams");
                            this.btnLock = false
                        },
                        async err => {
                            Toast(err.errorMsg)
                            this.showOnLoading = false;
//                        Toast('库存不足~')

                            // 重新获取赠品
                            if (this.price.gifts && this.price.gifts.length > 0) {
                                this.sendList = []
                                await this.getDiscount();
                                this.sendList = this._giftCommonData(this.price.gifts)
                            }

                            this.saving = false;
                            this.btnLock = false
                        }
                    );
                }
            },

        },
        computed: {
            /** 是否显示积分行 **/
            visiblePoint(){
                return this.showPointFlag == 1 && !this.disabledPoint
            },
            /** 积分开关布尔值转换成数字 **/
            usePointFlag(){
                return this.switchFlag ? 1 : 0;
            },
            // 统计所有商品数量
            allAmount() {
                let count = 0;
                this.shopList.forEach(item => {
                    count += item.amount;
                })
                return count;
            },

            //商品总额计算
            totalPrice: function () {
                let allAmount = 0;
                this.shopList.forEach(item => {
                    allAmount += item.dealPrice * item.amount;
                });
                return allAmount;
            },

            //促销优惠计算
            promotions: function () {
                let price = 0;
                if(this.fissionType) {
                    if(this.shopList.length && this.shopList[0].amountRebate) {
                        price = this.shopList[0].amountRebate;
                    }
                    return price;
                }else{
                    let keys = Object.keys(this.price);
                    // 要计算属性写死 防止后端之后多返回字段
                    let needComputedKey = ['cashCouponPrice', 'disCouponPrice', 'pointPirce', 'salePrice', 'storedValueCardPrice', 'vipPrice'];
                    if (keys.length > 0) {
                        keys.forEach(key => {
                            if (needComputedKey.indexOf(key) !== -1) {
                                price += this.price[key];
                            }

                        });
                    }
                    //  + this.price.rebatePrice
                    return this.totalPrice > 0 ? this.totalPrice - price  : price;
                }
            },

            // 实付金额
            actualPay: function () {
                let actualPay = 0;
                if(this.fissionType) {
                    if(this.shopList.length && this.shopList[0].amountDeal) {
                        actualPay = this.shopList[0].amountDeal + this.transFee;
                    }
                }else{
                    if (this.isBalanceUsed == 1) {// 使用余额
                        actualPay = (this.transFee + this.price.salePrice - this.balance);
                        actualPay = actualPay < 0 ? 0 : actualPay;
                    } else {
                        actualPay = this.transFee + this.price.salePrice
                    }
                }

                return +(actualPay.toFixed(2));
            },
            // 赠品数量
            complimentaryQuantity(){
                let amount = 0;
                if(this.sendList && this.sendList.length){
                    this.sendList.forEach(item=>{
                        item.giftGroup.forEach(groupItem=>{
                            groupItem.gifts.forEach(giftsItem=>{
                                amount += giftsItem.amount;
                            })
                        })
                    })
                }
                return amount;
            }
        },
        onLoad() {
            global.Storage.remove("invoiceData");//清除发票缓存信息
            global.toastLoading();// 开启
            this.company_id = global.Storage.get('COMPANYID').company_id;
            this.routeParams = this.$route.params;
            this.fissionType = parseInt(this.$route.query.fissionType)||''; // 1秒杀 2拼团 3砍价
            this.vipInfoDtFssId = +this.$route.query.vipInfoDtFssId;
            let keyArr = Object.keys(this.routeParams);
            if (keyArr.length) {
                global.Storage.set("reserveParams", this.routeParams);
            } else {
                // 路由没带参情况（仅选择地址页后返回）
                this.routeParams = global.Storage.get("reserveParams");
            }
            this.onInit();

        },
        onShow(){
            this.getInvoice()
            this.invoiceData = global.Storage.get("invoiceData") || {};//获取发票缓存信息
        },
        onUnload(){
            Object.assign(this.$data, this.$options.data());
            global.Storage.remove('settlementAddr');
        }
    };
</script>

