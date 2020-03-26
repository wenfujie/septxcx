/*
* createTime：2019/3/12
* author：junyong.hong
* description: 赠品sku选择
*/
<template>
    <div class="container">
        <wxs module="filter" src="../../../../../filter/filterCommon.wxs"></wxs>
        <div class="sku-dialog" v-if="showBigPic===false">
            <text @click="close()" class="iconfont iconguanbi sku-dialog-close"></text>
            <!-- 商品详情选择sku begin -->
            <div class="sku-dialog-detail">
                <!-- 商品信息 -->
                <div class="sku-dialog-info">
                    <div class="info-left">
                        <img
                            :src="filter.imgFilter(goodsImg,company_id, '186*186')"
                            @click="enlarge()"
                        >
                    </div>
                    <div class="info-right">
                        <div>
                            <p class="info overflow-two">
                                <span
                                    v-if="colorItem.colorName || sizeItem.sizeName || (currentSend && currentSend.goodsName)"
                                >已选择:</span>
                                <span v-else-if="!colorItem.colorName || !sizeItem.sizeName">请选择</span>
                                <span
                                    v-if="currentSend && currentSend.goodsName !== null"
                                >{{currentSend.goodsName}}&nbsp;</span>
                                <span
                                    v-if="colorItem.colorName !== null"
                                >{{colorItem.colorName}}&nbsp;</span>
                                <span v-if="sizeItem.sizeName !== null">{{sizeItem.sizeName}}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="chose">
                    <div class="chose-color-size">
                        <div class="color">
                            <div class="left">赠品</div>
                            <ul class="right goodImg">
                                <li v-for="(item, index) in goodsInfo" :key="index">
                                    <img
                                        :src="filter.imgFilter(item.url,company_id)"
                                        @click="sendClick(item, index, true)"
                                        :class="{'active' : currentSendIndex === index}"
                                    >
                                </li>
                            </ul>
                        </div>

                        <div v-if="currentSend && currentSend.colorList.length > 0" class="color">
                            <div class="left">颜色</div>
                            <div class="right">
                                <span
                                    v-for="(item, index) in currentSend.colorList"
                                    @click="colorActive(item, index)"
                                    :class="['btn', {'active': item.active},
                                           {'none': item.none === false}]"
                                    :key="index"
                                >{{item.colorName}}</span>
                            </div>
                        </div>
                        <div v-if="currentSend && currentSend.sizeList.length > 0" class="size">
                            <div class="left">尺码</div>
                            <div class="right">
                                <span
                                    v-for="(item, index) in currentSend.sizeList"
                                    @click="sizeActive(item, index)"
                                    :class="[{'active': item.active},
                                           {'none': item.none === false}]"
                                    class="btn"
                                    :key="index"
                                >{{item.sizeName}}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 订单结算页-赠品 -->
                <p @click="orderSure()" class="btn-sure">
                    <span>确定</span>
                </p>
            </div>
            <!-- 商品详情选择sku end -->
        </div>

        <!-- todo  用showBigPic就显示不了图片 -->
        <div
            class="enlarge-boxs"
            v-if="showBigPic==true"
            @click="ishowPic"
            :style="{height:screenHeights+'px'}"
        >
            <van-popup :show="true" :overlay="true" class="enlarge-detail">
                <img :src="filter.imgFilter(goodsImg,company_id)" mode="widthFix">
            </van-popup>
        </div>
    </div>
</template>
<script>
import Toast from 'vant-weapp/dist/toast/toast';

export default {
    config: {
        navigationBarTitleText: '订单结算'
    },
    props: {
        // 商品信息
        goodsInfo: {
            type: '',// Object
            default: function () {
                return ''// {}
            }
        },
        // 当前选中颜色的索引值
        colorActiveIndex: {
            type: Number,
            default: null
        },
        // 当前选中的尺码索引值
        sizeActiveIndex: {
            type: Number,
            default: null
        },
        // 是否显示弹窗
        isShowSku: {
            type: Boolean,
            default: false
        },
        // 当前选中的赠品
        sendActiveItem: {
            type: Object
        },
        // 商品详情：true点击sku  false点击加入购物车
        btnStatus: {
            type: Boolean,
            default: true
        },
        // types: {
        //     type: Boolean,
        //     default: false
        // }
    },
    components: {
        // swiper,
        // swiperSlide,
    },
    data() {
        return {
            skuSwiperOption: {
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,    // 滑动不会失效
                },                                  // 自动播放
                pagination: {
                    el: '.swiper-pagination'
                },                                  // 轮播图下的圆点提示
            },
            colorItem: '',                  // 选中颜色
            sizeItem: '',                   // 选中尺码
            goodsImg: '',                   // 商品图
            num: 1,                         // 数量
            maxNum: 10,                     // 可购买的数量不能超过最大库存
            currentSend: '',                // 选中当前赠品
            currentSendIndex: null,
            showBigPic: false,// 显示大图
            company_id: '',//公司id,
            screenHeights: 0,
        }
    },
    onLoad() {
        this.company_id = global.Storage.get('COMPANYID').company_id;
         let root = this;
        // this._reData()
        wx.getSystemInfo({
            success(res) {
                root.screenHeights = res.screenHeight;
            }
        })
    },
    onUnload(){
        Object.assign(this.$data, this.$options.data());
    },
    mounted() {

    },
    methods: {
        // // 放大图片
        enlarge() {
            this.showBigPic = true;
        },
        // 点击图片弹窗消失
        ishowPic() {
            this.showBigPic = false;
        },
        /**
         * 关闭弹窗
         */
        close() {
            this.$emit('update:isShowSku', false)
        },
        /**
         * 颜色选择
         * @param item 当前对象
         * @param index 索引
         */
        colorActive(item, index) {
            if (!item.none) {
                Toast('该商品暂无库存~')
                return
            }

            let inverse = false             // 判断是否有选择尺码
            let currentSizeChildList = ''   // 选中颜色，存放当前选中颜色对应下的尺码

            // 选中与反选
            this.currentSend.colorList.forEach((colorItem, colorIndex) => {
                if (colorItem.colorCode === item.colorCode) {  // 当前选中
                    item.active = !item.active;

                    if (item.active) {
                        this.colorItem = item
                    } else {
                        inverse = true
                        this.colorItem = ''
                    }

                    this.$set(this.currentSend.colorList, index, item);
                } else {                                        // 其他未选中
                    colorItem.active = false
                }
            })

            // 颜色对应的尺码list
            for (let i = 0; i < this.currentSend.colorAndSizeList.length; i++) {
                if (this.currentSend.colorAndSizeList[i].colorId === item.colorId) {
                    currentSizeChildList = this.currentSend.colorAndSizeList[i].sizeChildList
                    break
                }
            }

            // 设置尺码按钮是否可以点击（显示与置灰）
            for (let i = 0; i < this.currentSend.sizeList.length; i++) {
                for (let j = 0; j < currentSizeChildList.length; j++) {
                    // 当前尺码可以点击
                    if ((this.currentSend.sizeList[i].sizeCode === currentSizeChildList[j].sizeCode) &&
                        currentSizeChildList[j].skuQty > 0) {
                        this.currentSend.sizeList[i].none = true
                        break
                    } else {    // 置灰
                        this.currentSend.sizeList[i].none = false
                    }
                }
            }

            if (!this.sizeItem) {

                // 未选中颜色，只选中尺码，所有的尺码都可以选择
                let noSelectColor = false
                for (let i = 0; i < this.currentSend.colorList.length; i++) {
                    if (this.currentSend.colorList[i].active) {
                        noSelectColor = true
                    }
                }
                if (noSelectColor) {
                    for (let i = 0; i < this.currentSend.sizeList.length; i++) {
                        if (this.currentSend.sizeList[i].active) {
                            this.currentSend.sizeList[i].active = true
                        }
                    }
                }
            }

            // 未选中颜色，对尺码进行反选（尺码跟颜色都未选择）
            this._setSizeItemAndColorItemNone()

            if (inverse) {
                this.$emit('update:colorActiveIndex', -1)
            } else {
                this.$emit('update:colorActiveIndex', index)
            }

            this.currentSend.colorList = this.currentSend.colorList.slice(0, this.currentSend.colorList.length);
        },
        /**
         * 尺码选择
         * @param item 当前对象
         * @param index 索引
         */
        sizeActive(item, index) {
            if (!item.none) {
                Toast('该商品暂无库存~')
                return
            }

            let inverse = false // 判断是否有选择尺码
            // 按钮反选
            this.currentSend.sizeList.forEach((sizeItem, sizeIndex) => {
                if (sizeItem.sizeCode === item.sizeCode) {  // 当前选中
                    item.active = !item.active;

                    if (item.active) {
                        this.sizeItem = item
                    } else {
                        inverse = true
                        this.sizeItem = ''
                    }

                    this.$set(this.currentSend.sizeList, index, item)
                } else {                                    // 其他未选中
                    sizeItem.active = false
                }
            })

            if (this.sizeItem) {
                // 逻辑：选择了尺码，找出对应可以勾选的颜色
                for (let i = 0; i < this.currentSend.colorAndSizeList.length; i++) {
                    for (let j = 0; j < this.currentSend.colorAndSizeList[i].sizeChildList.length; j++) {
                        if ((this.currentSend.colorAndSizeList[i].sizeChildList[j].sizeCode === item.sizeCode) &&
                            (this.currentSend.colorAndSizeList[i].sizeChildList[j].skuQty > 0)) {
                            this.currentSend.colorAndSizeList[i].none = true
                            this.maxNum = this.currentSend.colorAndSizeList[i].sizeChildList[j].skuQty
                            break
                        } else {
                            this.currentSend.colorAndSizeList[i].none = false
                        }
                    }
                }
                for (let j = 0; j < this.currentSend.colorList.length; j++) {
                    for (let i = 0; i < this.currentSend.colorAndSizeList.length; i++) {
                        if ((this.currentSend.colorAndSizeList[i].colorCode === this.currentSend.colorList[j].colorCode) &&
                            this.currentSend.colorAndSizeList[i].none) {
                            this.currentSend.colorList[j].none = true
                            break
                        } else {
                            this.currentSend.colorList[j].none = false
                        }
                    }
                }
            }

            // 未选中颜色，对尺码进行反选（尺码跟颜色都未选择）
            this._setSizeItemAndColorItemNone()

            // 可勾选的尺码
            let flag = false
            for (let i = 0; i < this.currentSend.colorList.length; i++) {
                if (this.currentSend.colorList[i].active) {
                    flag = true
                    break
                }
            }
            if (!flag) {
                let isColorArr = [] // 存放可选择的颜色
                for (let i = 0; i < this.currentSend.colorList.length; i++) {   // 可点击的颜色
                    if (this.currentSend.colorList[i].none) {
                        isColorArr.push(this.currentSend.colorList[i].colorCode)
                    }
                }
                let isSizeArr = []
                isColorArr.forEach((isColorItem) => {                       // 可点击的颜色下可选中的尺码
                    this.currentSend.colorAndSizeList.forEach((colorAndSizeItem) => {
                        if (colorAndSizeItem.colorCode === isColorItem) {
                            colorAndSizeItem.sizeChildList.forEach((sizeItem) => {
                                isSizeArr.push(sizeItem)
                            })
                        }
                    })
                })
                let newIsSizeArr = global.objCombine(isSizeArr, 'sizeCode')

                for (let j = 0; j < this.currentSend.sizeList.length; j++) {
                    for (let i = 0; i < newIsSizeArr.length; i++) {
                        if (newIsSizeArr[i].sizeCode === this.currentSend.sizeList[j].sizeCode) {
                            this.currentSend.sizeList[j].none = true
                            break
                        } else {
                            this.currentSend.sizeList[j].none = false
                        }
                    }
                }
            }

            if (inverse) {
                this.$emit('update:sizeActiveIndex', -1)
            } else {
                this.$emit('update:sizeActiveIndex', index)
            }

            this.currentSend.colorList = this.currentSend.colorList.slice(0, this.currentSend.colorList.length);
        },
        /**
         * 尺码未选中，对颜色进行反选
         */
        _setSizeItemAndColorItemNone() {
            // 尺码跟颜色都未选择
            if (!this.sizeItem && !this.colorItem) {
                // 尺码都可以选择
                this.currentSend.sizeList.forEach((itm) => {
                    itm.none = true
                })
                // 颜色都可以选择
                this.currentSend.colorList.forEach((itm) => {
                    itm.none = true
                })
            }

            // 尺码未选中，颜色选中
            if (!this.sizeItem && this.colorItem) {
                this.currentSend.colorList.forEach((itm) => {
                    itm.none = true
                })
            }

            // 尺码选中，颜色未选中
            if (this.sizeItem && !this.colorItem) {
                this.currentSend.sizeList.forEach((itm) => {
                    itm.none = true
                })
            }
        },
        /**
         * 订单结算页-确定按钮
         */
        orderSure() {
            if (this._isActive()) {
                Toast('请选择颜色和尺码~')
                return
            }

            let colorItem = this.currentSend.colorList[this.colorActiveIndex]
            let sizeItem = this.currentSend.sizeList[this.sizeActiveIndex]

            this.$emit('onSelectColor', colorItem, sizeItem, this.currentSend)
            this.close()
        },
        /**
         * 添加默认不选中状态、默认选中
         * @private
         */
        _reData() {
            if(!this.goodsInfo) return
            this.goodsInfo.forEach((infoItem) => {
                infoItem.colorList.forEach((item) => {
                    item.active = false
                })

                infoItem.sizeList.forEach((item) => {
                    item.active = false
                })
            })
        },
        /**
         * 判断颜色和尺码是否都选中了
         * @private
         */
        _isAllSelect() {
            let colorFlag = false
            let sizeFlag = false
            for (let i = 0; i < this.goodsInfo.colorList.length; i++) {
                if (this.goodsInfo.colorList[i].active) {
                    colorFlag = true
                    break
                }
            }
            for (let i = 0; i < this.goodsInfo.sizeList.length; i++) {
                if (this.goodsInfo.sizeList[i].active) {
                    sizeFlag = true
                    break
                }
            }
            if (colorFlag && sizeFlag) {            // 都选中
                // 保留
            } else if (!colorFlag && !sizeFlag) {   // 都没选中
                // 颜色
                for (let i = 0; i < this.goodsInfo.colorList.length; i++) {
                    this.goodsInfo.colorList[i].none = true
                }

                // 尺码
                for (let i = 0; i < this.goodsInfo.sizeList.length; i++) {
                    this.goodsInfo.sizeList[i].none = true
                }
            }
        },
        /**
         * 判断是否选择颜色跟尺码
         * @returns {boolean}
         * @private true颜色跟尺码都选中 false颜色跟尺码未选中
         */
        _isActive() {
            let sizeFlag = false
            let colorFlag = false

            if (this.currentSend) {
                for (let i = 0; i < this.currentSend.sizeList.length; i++) {
                    if (this.currentSend.sizeList[i].active) {
                        sizeFlag = true
                    }
                }
                for (let i = 0; i < this.currentSend.colorList.length; i++) {
                    if (this.currentSend.colorList[i].active) {
                        colorFlag = true
                    }
                }
            }

            return (!sizeFlag || !colorFlag)
        },
        /**
         * 选择赠品
         * @param item 当前对象
         * @param index 索引
         * @param isClick 是否要防止重复点击
         */
        sendClick(item, index, isClick = false) {
            if (index === this.currentSendIndex && isClick) {
                return
            }

            this.goodsImg = item.url
            this.currentSend = item
            this.currentSendIndex = index

            this.colorItem = ''
            this.sizeItem = ''
            this.currentSend.colorList.forEach((item) => {
                item.active = false
                item.none = true
            })
            this.currentSend.sizeList.forEach((item) => {
                item.active = false
                item.none = true
            })
        },
        /**
         * 赠品二次选择，回选之前转中状态
         * @private
         */
        _reSendSelect() {
            if (this.sendActiveItem && this.sendActiveItem.colorCode && this.sendActiveItem.sizeCode) {
                for (let i = 0; i < this.goodsInfo.length; i++) {
                    if (this.sendActiveItem.goodsCode === this.goodsInfo[i].goodsCode) {
                        // 选中赠品
                        this.sendClick(this.goodsInfo[i], i)

                        // 选中颜色
                        for (let j = 0; j < this.goodsInfo[i].colorList.length; j++) {
                            if (this.goodsInfo[i].colorList[j].colorCode === this.sendActiveItem.colorCode) {
                                this.colorActive(this.goodsInfo[i].colorList[j], j)

                                break
                            }
                        }

                        // 选中尺码
                        for (let j = 0; j < this.goodsInfo[i].sizeList.length; j++) {
                            if (this.goodsInfo[i].sizeList[j].sizeCode === this.sendActiveItem.sizeCode) {
                                this.sizeActive(this.goodsInfo[i].sizeList[j], j)

                                break
                            }
                        }

                        break
                    }
                }
            } else {
                this.currentSend = ''
                this.currentSendIndex = null
            }
        }
    },
    watch: {
        //            // 商品图片如果有变化，要重新设置轮播图
        //            'goodsInfo.url': function () {
        //                this.goodsImg = []
        //                this.goodsImg.push(this.goodsInfo[0].url)
        //            },
        // 添加默认不选中状态、默认选中
        'goodsInfo': function () {
            this._reData()

            this._reSendSelect()
        },
        'goodsInfo.colorList': function () {
            this._isAllSelect()
        },
        'goodsInfo.sizeList': function () {
            this._isAllSelect()
        },
        'sendActiveItem': function () {
            this._reSendSelect()
        }
    }
}
</script>
<style lang="scss" scoped>
.container {
    height: 100%;
    .enlarge-boxs {
        width: 100%;
        .enlarge-detail {
            width: 100%;
            position: absolute;
            img {
                width: 100%;
                display: block;
            }
        }
    }
    .sku-dialog {
        position: relative;
        width: 100%;
        height: computed(1028);
        .sku-dialog-close {
            position: absolute;
            right: computed(30);
            top: computed(30);
            color: $text-regular;
            z-index: 999;
        }
        .sku-dialog-detail {
            .sku-dialog-info {
                display: flex;
                flex-direction: row;
                padding: computed(40) computed(30) computed(40) computed(30);
                .info-left {
                    width: computed(186);
                    img {
                        height: computed(186);
                        width: computed(186);
                        box-shadow: 0 computed(2) computed(6) 0
                            rgba(0, 0, 0, 0.1);
                    }
                }
                .info-right {
                    flex: 1;
                    position: relative;
                    > div {
                        position: absolute;
                        bottom: 0;
                        padding-left: computed(23);
                        .price {
                            font-size: $font-title1;
                            color: $color-red;
                            margin-bottom: computed(10);
                        }
                        .info {
                            font-size: $font-regular;
                            color: $text-primary;
                            margin-bottom: computed(12);
                        }
                    }
                }
            }
            .chose {
                height: computed(640);
                padding: 0 computed(30) 0 computed(30);
                width: calc(100% - #{computed(60)});
                overflow-y: auto;
                .info {
                    font-size: $font-common;
                    color: $text-primary;
                    margin-bottom: computed(30);
                }
                .chose-color-size {
                    .color,
                    .size,
                    .num {
                        margin: computed(30) 0 computed(12) 0;
                        .left {
                            text-align: left;
                            padding: 0 0 computed(20) 0;
                            color: $text-primary;
                        }
                        .right {
                            height: auto;
                            text-align: left;
                            .btn {
                                display: inline-block;
                                padding: computed(21) computed(17);
                                border: 1px solid $text-regular;
                                border-radius: computed(5);
                                margin: 0 computed(18) computed(18) 0;
                                color: $text-primary;
                                font-size: $font-common;
                                &.active {
                                    color: $color-red;
                                    border: 1px solid $color-red;
                                }
                                &.none {
                                    border: 1px dashed $text-placeholder;
                                    border-radius: computed(5);
                                    background-color: $color-white;
                                    color: $text-secondary;
                                }
                            }
                        }
                        .goodImg {
                            height: computed(100);
                            overflow-x: scroll;
                            overflow-y: hidden;
                            white-space: nowrap;
                            text-align: left;
                            li {
                                display: inline-block;
                                margin: 0 computed(18) computed(18) 0;
                                img {
                                    width: computed(100);
                                    height: computed(100);
                                    box-sizing: border-box;
                                    border-radius: computed(5);
                                    &.active {
                                        border: 1px solid $color-red;
                                    }
                                }
                            }
                        }
                        .stock {
                            font-size: $font-small;
                            color: $text-warn;
                            line-height: computed(66);
                            margin-left: computed(20);
                        }
                    }
                    > div {
                        margin-top: computed(25);
                        &:first-child {
                            margin-top: 0 !important;
                        }
                    }
                }
            }
            .btn-sure {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                text-align: center;
                line-height: computed(98);
                > span {
                    display: inline-block;
                    width: calc(100% - #{computed(60)});
                    height: computed(80);
                    line-height: computed(80);
                    background: $bggradientcolor;
                    color: $color-white;
                    border-radius: $btn-radius40;
                }
            }
        }

        .sku-dialog-img {
            position: absolute;
            left: computed(148);
            bottom: computed(635);
            z-index: 9999;
            width: computed(454);
            height: computed(454);
            background-color: $color-white;
            box-shadow: 0 computed(2) computed(6) 0 rgba(0, 0, 0, 0.1);
            img {
                width: computed(454);
                height: computed(454);
            }
            /*animation-name: fadeIn;*/
            /*animation-duration: .3s;*/
            /*animation: downToUp .3s;*/
        }
        @-webkit-keyframes fadeIn {
            0% {
                opacity: 0;
            }
            50% {
                opacity: 0.5;
            }
            100% {
                opacity: 1;
            }
        }
        @keyframes downToUp {
            0% {
                transform: translate(0, 450px);
            }
            50% {
                transform: translate(0, 225px);
            }
            100% {
                transform: translate(0, 0);
            }
        }
    }
}
</style>
