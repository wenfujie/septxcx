/*
* createTime：2019/3/12
* author：junyong.hong
* description: 商品sku选择（适用于商品详情、购物车、订单结算页选赠品）

  goodsInfo需遵循如下数据格式：
    {
        "colorList":[{
            "colorCode":"颜色编码",
            "colorId":"颜色id",
            "colorName":"颜色名称",
            "classCode":"非必传",
            "goodsCode":"商品编码",
            "goodsName":"商品标题",
            "urls":["颜色图"],
            "none":"true商品默认可以点击"
        }],
        "sizeList":[{
            "sizeCode":"尺码编码",
            "sizeId":"尺码id",
            "sizeName":"尺码名称",
            "none":"true商品默认可以点击"
        }],
        "colorAndSizeList":[{
            "colorCode":"颜色编码",
            "colorId":"颜色id",
            "colorName":"颜色名称",
            "classCode":"非必传",
            "sizeChildList":[{
                "sizeCode":"尺码编码",
                "sizeName":"尺码名称",
                "skuId":"skuId",
                "skuQty":"数量",
                "salePmHdId":"非必传,赠品编码"
            }]
        }],
        "url":"商品主图",
        "salePrice":"售价"
    }
*/
<template>
    <div class="container">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>
        <div class="sku-dialog" v-if="showBigPic===false">
            <span @click="close()" class="iconfont iconguanbi sku-dialog-close"></span>
            <!-- 商品详情选择sku begin -->
            <div class="sku-dialog-detail">
                <!-- 商品信息 -->
                <div class="sku-dialog-info">
                    <div class="info-left">
                        <img
                            :src="filter.imgFilter(goodsImg,company_id)"
                            @click="enlarge()"
                            lazy-load="true"
                        >
                    </div>
                    <div class="info-right">
                        <div>
                            <p class="price">￥{{filter.Fix2(goodsInfo.salePrice)}}</p>
                            <p class="info">
                                <span v-if="colorItem.colorName || sizeItem.sizeName">已选择:</span>
                                <span v-else-if="!colorItem.colorName || !sizeItem.sizeName">请选择</span>
                                <span v-if="colorItem.colorName !== null"> {{colorItem.colorName}}</span>
                                <span v-if="sizeItem.sizeName !== null"> {{sizeItem.sizeName}}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div id="chose" class="chose" :class="{'chose-min-height' : choseFlag}">
                    <div class="chose-color-size">
                        <div class="color">
                            <div class="left">颜色</div>
                            <div class="right">
                                <span
                                    v-for="(item, index) in goodsInfo.colorList"
                                    @click="colorActive(item, index)"
                                    :class="[{'active': item.active},{'none': item.none === false},'btn']"
                                    :key="index"
                                >{{item.colorName}}</span>
                            </div>
                        </div>
                        <div class="size">
                            <div class="left">尺码</div>
                            <div class="right">
                                <span
                                    v-for="(item, index) in goodsInfo.sizeList"
                                    @click="sizeActive(item, index)"
                                    :class="[{'active': item.active},{'none': item.none === false},'btn']"
                                    :key="index"
                                >{{item.sizeName}}</span>
                            </div>
                        </div>
                        <div v-if="flag === 1" class="num">
                            <div class="left">数量</div>
                            <div class="right">
                                <div class="stepper">
                                    <van-stepper
                                        @blur="numBlur"
                                        @change="onChange"
                                        v-model="num"
                                        integer
                                        :max="maxNum"
                                    />
                                </div>
                                <!-- 需求确认在双选的情况下才显示库存提示 -->
                                <span
                                    v-if="num >= maxNum &&( (colorActiveIndex !== null && colorActiveIndex !== -1) &&(sizeActiveIndex !== null && sizeActiveIndex !== -1) )"
                                    class="stock"
                                >库存剩余{{maxNum}}件</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 1商品详情sku选择  2购物车sku选择  3订单结算页赠品sku选择 -->
                <!-- 商品详情 -->
                <div v-if="!btnStatus && flag === 1" class="btn-operate">
                    <div class="btn-cart" @click="detailSure(1)">
                        <div>加入购物车</div>
                    </div>
                    <div class="btn-buy" @click="detailSure(0)">
                        <div>
                            <p>立即购买</p>
                            <p class="saveMoney">省￥</p>
                        </div>
                    </div>
                </div>

                <!-- 购物车 -->
                <p v-if="flag === 2" @click="cartSure()" class="btn-sure">
                    <span>确定</span>
                </p>

                <!-- 订单结算页-赠品 -->
                <p v-if="flag === 3" @click="orderSure()" class="btn-sure">
                    <span>确定</span>
                </p>
            </div>
            <!-- 商品详情选择sku end -->
        </div>
        <!-- <div class="enlarge-boxs" v-show="showBigPic==true" @click="ishowPic">
            <van-popup :show="true" :overlay="true" class="enlarge-detail">
                <img :src="filter.imgFilter(goodsImg,company_id)">
            </van-popup>
        </div>-->
        <div
            class="enlarge-boxs"
            v-show="showBigPic==true"
            @click="ishowPic()"
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
            // 1商品详情sku选择  2购物车sku选择  3订单结算页赠品sku选择
            flag: {
                type: Number,
                default: 1
            },
            // 商品详情：true点击sku  false点击加入购物车
            btnStatus: {
                type: Boolean,
                default: true
            },
            // 判断是从加入购物车还是选择商品详情入口进入，false是商品详情进入，true是加入购物车加入
            types: {
                type: Boolean,
                default: false
            },
            // 最大库存
            maxNumber: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                colorItem: '',                  // 选中颜色
                sizeItem: '',                   // 选中尺码
                goodsImg: '',                   // 商品图
                num: 1,                         // 数量
                maxNum: this.maxNumber,         // 可购买的数量不能超过最大库存
                showBigPic: false,              // 显示大图
                showPopup: false,               // 显示手机弹窗
                choseFlag: false,               // 安卓手机小键盘遮罩问题
                company_id: '',
                screenHeights: 0,
                btnLock: false,                 // 添加按钮锁
            }
        },
        onLoad() {
            let root = this;
            this.company_id = global.Storage.get('COMPANYID').company_id;
            // 获取商品主图
            if (this.goodsInfo !== '') {
                this.goodsImg = this.goodsInfo.url
            }
            wx.getSystemInfo({
                success(res) {
                    root.screenHeights = res.screenHeight;

                }
            })
            // 获取导航栏ul高度

        },
        onHide(){
            Object.assign(this.$data, this.$options.data())
        },
        onUnload(){
            Object.assign(this.$data, this.$options.data())
        },
        methods: {
            /**
             * 处理安卓手机输入法遮挡输入框问题
             */
            _keyBoard() {
                if (!(/Android/gi).test(navigator.userAgent)) {
                    return
                }

                let _this = this

                // 获取原窗口的高度
                let originalHeight = document.documentElement.clientHeight || document.body.clientHeight
                window.onresize = function () {
                    // 键盘弹起与隐藏都会引起窗口的高度发生变化
                    let resizeHeight = document.documentElement.clientHeight || document.body.clientHeight
                    if (resizeHeight - 0 < originalHeight - 0) {        // 当软键盘弹起
                        if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                            setTimeout(() => {
                                _this.choseFlag = true
                                let div = document.getElementById('chose');
                                setTimeout(() => {
                                    div.scrollTop = div.scrollHeight
                                }, 50)
                            }, 0)
                        }
                    } else {                                            // 当软键盘收起
                        _this.choseFlag = false
                    }
                }
            },
            //  放大图片
            enlarge() {
                this.showBigPic = true;
                this.$emit('update:btnStatus', false);
                if (this.btnStatus == true) {
                    this.$emit('update:types', false);
                } else {
                    this.$emit('update:types', true);
                }
            },
            // 点击图片弹窗消失
            ishowPic() {
                this.showBigPic = false;
                if (this.types === true) {
                    this.$emit('update:btnStatus', false);
                } else {
                    this.$emit('update:btnStatus', true)
                }
            },
            /**
             * 关闭弹窗
             */
            close() {
                this.$emit('update:isShowSku', false);
                this.$emit('numBlur', false)
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

                // 按钮锁
                if (this.btnLock) {
                    this.btnLock = false
                    return
                }
                this.btnLock = true

                let inverse = false             // 判断是否有选择尺码
                this.goodsImg = ''              // 轮播图
                let currentSizeChildList = ''   // 选中颜色，存放当前选中颜色对应下的尺码

                var newColorList = this.goodsInfo.colorList;
                // 选中与反选
                if (this.goodsInfo.colorList != null) {
                    for (let i = 0; i < this.goodsInfo.colorList.length; i++) {
                        let colorItem = this.goodsInfo.colorList[i]

                        if (colorItem.colorCode === item.colorCode) {  // 当前选中
                            item.active = !item.active;

                            if (item.active) {
                                this.colorItem = item
                            } else {
                                inverse = true
                                this.colorItem = ''
                            }
                            newColorList[i] = item
                        } else {                                        // 其他未选中
                            newColorList[i].active = false
                        }
                    }
                    this.goodsInfo.colorList = newColorList.length == 0 ? [] : newColorList.slice(0, newColorList.length);
                }
                this.btnLock = false


                // 选中颜色，存放当前选中颜色对应下的尺码
                if (!inverse) {
                    for (let i = 0; i < this.goodsInfo.colorAndSizeList.length; i++) {
                        if (this.goodsInfo.colorAndSizeList[i].colorId === item.colorId) {
                            currentSizeChildList = this.goodsInfo.colorAndSizeList[i].sizeChildList
                            break
                        }
                    }
                }

                // 设置尺码按钮是否可以点击（显示与置灰）
                if (currentSizeChildList.length > 0) {
                    for (let i = 0; i < this.goodsInfo.sizeList.length; i++) {
                        for (let j = 0; j < currentSizeChildList.length; j++) {
                            if ((this.goodsInfo.sizeList[i].sizeCode === currentSizeChildList[j].sizeCode) &&
                                currentSizeChildList[j].skuQty > 0) {       // 当前尺码可以点击

                                this.goodsInfo.sizeList[i].none = true
                                break
                            } else {                                        // 置灰
                                this.goodsInfo.sizeList[i].none = false
                            }
                        }
                    }
                } else {    // 如果未选中颜色，所有的尺码都可以选择
                    for (let i = 0; i < this.goodsInfo.sizeList.length; i++) {
                        this.goodsInfo.sizeList[i].none = true
                    }
                }


                // 设置最大库存（只有先选中尺码，才会触发）
                if (this.sizeItem) {
                    for (let i = 0; i < this.goodsInfo.colorAndSizeList.length; i++) {
                        if (this.goodsInfo.colorAndSizeList[i].colorCode === item.colorCode) {
                            for (let j = 0; j < this.goodsInfo.colorAndSizeList[i].sizeChildList.length; j++) {
                                if ((this.goodsInfo.colorAndSizeList[i].sizeChildList[j].sizeCode === this.sizeItem.sizeCode) &&
                                    (this.goodsInfo.colorAndSizeList[i].sizeChildList[j].skuQty > 0)) {
                                    this.maxNum = this.goodsInfo.colorAndSizeList[i].sizeChildList[j].skuQty
                                    break
                                }
                            }
                        }
                    }
                } else {
                    // 设置颜色是否可点击
                    let isSizeArr = []                                      // 存放可选择的尺码
                    for (let i = 0; i < this.goodsInfo.sizeList.length; i++) {    // 可点击的尺码
                        if (this.goodsInfo.sizeList[i].none) {
                            isSizeArr.push(this.goodsInfo.sizeList[i].sizeCode)
                        }
                    }
                    let isColorArr = []                                     // 存放可选择的颜色
                    isSizeArr.forEach((isSizeItem) => {                     // 可点击的颜色
                        this.goodsInfo.colorAndSizeList.forEach((colorAndSizeItem) => {
                            colorAndSizeItem.sizeChildList.forEach((sizeItem) => {
                                if (sizeItem.sizeCode === isSizeItem) {
                                    isColorArr.push(colorAndSizeItem)
                                }
                            })
                        })
                    })
                    let newIsColorArr = global.objCombine(isColorArr, 'colorCode')
                    for (let j = 0; j < this.goodsInfo.colorList.length; j++) {
                        for (let i = 0; i < newIsColorArr.length; i++) {
                            if (newIsColorArr[i].colorCode === this.goodsInfo.colorList[j].colorCode) {
                                this.goodsInfo.colorList[j].none = true
                                break
                            } else {
                                this.goodsInfo.colorList[j].none = false
                            }
                        }
                    }


                    // 未选中颜色，只选中尺码，所有的尺码都可以选择
                    let noSelectColor = false
                    for (let i = 0; i < this.goodsInfo.colorList.length; i++) {
                        if (this.goodsInfo.colorList[i].active) {
                            noSelectColor = true
                        }
                    }
                    if (noSelectColor) {
                        for (let i = 0; i < this.goodsInfo.sizeList.length; i++) {
                            if (this.goodsInfo.sizeList[i].active) {
                                this.goodsInfo.sizeList[i].active = true
                            }
                        }
                    }
                }

                // 设置轮播图
                if (this.goodsInfo.colorList[index].urls) {
                    if (item.active) {  // 选中取当前颜色图
                        // 1商品详情sku选择  2购物车sku选择
                        if (this.flag === 1) {
                            this.goodsImg = this.goodsInfo.colorList[index].urls[0]
                        } else {
                            this.goodsImg = this.goodsInfo.colorList[index].urls
                        }
                    } else {            // 反选取主图
                        inverse = true
                        this.goodsImg = this.goodsInfo.url
                    }

                } else {
                    this.goodsImg = this.goodsInfo.url
                }

                if (inverse) {
                    this.$emit('update:colorActiveIndex', -1)
                } else {
                    this.$emit('update:colorActiveIndex', index)
                }

                if (this.flag === 1) {
                    this.$emit('update:goodsInfo', this.goodsInfo)
                }
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
                let newSizeList = this.goodsInfo.sizeList
                // 按钮反选
                this.goodsInfo.sizeList.forEach((sizeItem, sizeIndex) => {
                    if (sizeItem.sizeCode === item.sizeCode) {  // 当前选中
                        item.active = !item.active;
                        if (item.active) {
                            this.sizeItem = item
                        } else {
                            inverse = true
                            this.sizeItem = ''
                        }
                        newSizeList[sizeIndex] = item
                        // this.$set(this.goodsInfo.sizeList, index, item)
                    } else {                                    // 其他未选中
                        newSizeList[sizeIndex].active = false
                    }
                })

                this.goodsInfo.sizeList = newSizeList.length == 0 ? [] : newSizeList.slice(0, newSizeList.length);

                if (this.sizeItem) {
                    // 逻辑：选择了尺码，找出对应可以勾选的颜色
                    for (let i = 0; i < this.goodsInfo.colorAndSizeList.length; i++) {
                        for (let j = 0; j < this.goodsInfo.colorAndSizeList[i].sizeChildList.length; j++) {
                            if ((this.goodsInfo.colorAndSizeList[i].sizeChildList[j].sizeCode === item.sizeCode) &&
                                (this.goodsInfo.colorAndSizeList[i].sizeChildList[j].skuQty > 0)) {
                                this.goodsInfo.colorAndSizeList[i].none = true
                                break
                            } else {
                                this.goodsInfo.colorAndSizeList[i].none = false
                            }
                        }

                        // 设置最大库存
                        if (this.goodsInfo.colorAndSizeList[i].colorCode === this.colorItem.colorCode) {
                            for (let j = 0; j < this.goodsInfo.colorAndSizeList[i].sizeChildList.length; j++) {
                                if ((this.goodsInfo.colorAndSizeList[i].sizeChildList[j].sizeCode === item.sizeCode) &&
                                    (this.goodsInfo.colorAndSizeList[i].sizeChildList[j].skuQty > 0)) {
                                    this.maxNum = this.goodsInfo.colorAndSizeList[i].sizeChildList[j].skuQty
                                    break
                                }
                            }
                        }
                    }
                    for (let j = 0; j < this.goodsInfo.colorList.length; j++) {
                        for (let i = 0; i < this.goodsInfo.colorAndSizeList.length; i++) {
                            if ((this.goodsInfo.colorList[j].colorCode === this.goodsInfo.colorAndSizeList[i].colorCode) &&
                                this.goodsInfo.colorAndSizeList[i].none) {
                                this.goodsInfo.colorList[j].none = true
                                break
                            } else {
                                this.goodsInfo.colorList[j].none = false
                            }
                        }
                    }
                } else if (!this.sizeItem && this.colorItem) {  // 只选择颜色，对尺码进行反选
                    this.goodsInfo.colorList.forEach((itm) => {
                        itm.none = true
                    })
                }

                // 如果输入的数量大于最大库存
                if (this.flag === 1 && this.sizeItem && this.colorItem) {
                    if (this.num > this.maxNum) {
                        this.num = this.maxNum
                    }
                }

                // 可勾选的尺码
                let flag = false
                for (let i = 0; i < this.goodsInfo.colorList.length; i++) {
                    if (this.goodsInfo.colorList[i].active) {
                        flag = true
                        break
                    }
                }
                if (!flag) {
                    let isColorArr = []                                         // 存放可选择的颜色
                    for (let i = 0; i < this.goodsInfo.colorList.length; i++) {   // 可点击的颜色
                        if (this.goodsInfo.colorList[i].none) {
                            isColorArr.push(this.goodsInfo.colorList[i].colorCode)
                        }
                    }
                    let isSizeArr = []
                    isColorArr.forEach((isColorItem) => {                       // 可点击的颜色下可选中的尺码
                        this.goodsInfo.colorAndSizeList.forEach((colorAndSizeItem) => {
                            if (colorAndSizeItem.colorCode === isColorItem) {
                                colorAndSizeItem.sizeChildList.forEach((sizeItem) => {
                                    isSizeArr.push(sizeItem)
                                })
                            }
                        })
                    })
                    let newIsSizeArr = global.objCombine(isSizeArr, 'sizeCode')

                    for (let j = 0; j < this.goodsInfo.sizeList.length; j++) {
                        for (let i = 0; i < newIsSizeArr.length; i++) {
                            if (newIsSizeArr[i].sizeCode === this.goodsInfo.sizeList[j].sizeCode) {
                                this.goodsInfo.sizeList[j].none = true
                                break
                            } else {
                                this.goodsInfo.sizeList[j].none = false
                            }
                        }
                    }
                }

                if (inverse) {
                    this.$emit('update:sizeActiveIndex', -1)
                } else {
                    this.$emit('update:sizeActiveIndex', index)
                }

                if (this.flag === 1) {
                    this.$emit('update:goodsInfo', this.goodsInfo)
                }
            },
            /**
             * 商品详情-数量改变
             */
            onChange(e) {
                this.num = e.mp.detail
                this.$emit('update:num', this.num)
            },
            numBlur(e) {
                this.num = Number(e.mp.detail.value)
                this.$emit('numBlur', true)
            },
            /**
             * 商品详情-确定按钮
             */
            detailSure(sign) {
                if (this._isActive()) {
                    Toast('请先选择~')
                    return
                }

                this.$emit('onAddCartOrBuy', sign,this.colorItem, this.sizeItem)
            },
            /**
             * 购物车-确定按钮
             */
            cartSure() {
                console.log(2222)
                if (this._isActive()) {
                    Toast('请先选择~')
                    return
                } else {
                    // 参数回传
                    for (let i = 0; i < this.goodsInfo.colorList.length; i++) {
                        if (i === this.colorActiveIndex) {
                            this.colorItem = this.goodsInfo.colorList[i]
                            break
                        }
                    }
                    for (let i = 0; i < this.goodsInfo.sizeList.length; i++) {
                        if (i === this.sizeActiveIndex) {
                            this.sizeItem = this.goodsInfo.sizeList[i]
                            break
                        }
                    }
                }
                this.$emit('onSelectColor', this.colorItem, this.sizeItem);
            },
            /**
             * 订单结算页-确定按钮
             */
            orderSure() {
                if (this._isActive()) {
                    Toast('请选择颜色和尺码~')
                    return
                }

                let colorItem = this.goodsInfo.colorList[this.colorActiveIndex]
                let sizeItem = this.goodsInfo.sizeList[this.sizeActiveIndex]

                this.$emit('onSelectColor', colorItem, sizeItem)
                // this.close()
            },
            /**
             * 添加默认不选中状态、默认选中
             * @private
             */
            _reData() {
                if (!this.goodsInfo.colorList) return
                this.goodsInfo.colorList.forEach((item) => {
                    item.active = false
                })

                this.goodsInfo.sizeList.forEach((item) => {
                    item.active = false
                })

                // 设置默认选中
                if (this.sizeActiveIndex === null || this.colorActiveIndex === null) {
                    this.colorItem = ''
                    this.sizeItem = ''
                    this.goodsInfo.colorList.forEach((item) => {
                        item.none = true
                    })
                    this.goodsInfo.sizeList.forEach((item) => {
                        item.none = true
                    })

                    return
                } else if (this.sizeActiveIndex >= 0 || this.colorActiveIndex >= 0) {
                    this.goodsInfo.sizeList[this.sizeActiveIndex].active = true
                    this.goodsInfo.colorList[this.colorActiveIndex].active = true

                    // 回显选中信息
                    this.colorItem = this.goodsInfo.colorList[this.colorActiveIndex]
                    this.sizeItem = this.goodsInfo.sizeList[this.sizeActiveIndex]

                    // 设置颜色按钮不可点击
                    this.goodsInfo.colorList.forEach((item) => {        // 默认所有的颜色都不可点击
                        item.none = false
                    })
                    let isNone = [] // 存放可点击颜色数组
                    for (let i = 0; i < this.goodsInfo.colorAndSizeList.length; i++) {
                        for (let j = 0; j < this.goodsInfo.colorAndSizeList[i].sizeChildList.length; j++) {
                            if ((this.goodsInfo.colorAndSizeList[i].sizeChildList[j].sizeCode === this.sizeItem.sizeCode) &&
                                (this.goodsInfo.colorAndSizeList[i].sizeChildList[j].skuQty > 0)) {
                                isNone.push(this.goodsInfo.colorAndSizeList[i])
                                break
                            }
                        }
                    }
                    for (let i = 0; i < isNone.length; i++) {
                        for (let k = 0; k < this.goodsInfo.colorList.length; k++) {
                            if (isNone[i].colorCode === this.goodsInfo.colorList[k].colorCode) {    // 按钮可以点击
                                this.goodsInfo.colorList[k].none = true
                            }
                        }
                    }


                    if (this.goodsInfo.colorList[this.colorActiveIndex].urls) {
                        this.goodsImg = this.goodsInfo.colorList[this.colorActiveIndex].urls
                    } else {
                        this.goodsImg = this.goodsInfo.url
                    }
                }
            },
            /**
             * 判断颜色和尺码是否都选中了
             * @private
             */
            _isAllSelect() {
                let colorFlag = false
                let sizeFlag = false

                if (!!this.goodsInfo) {
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

                        // 库存
                        this.maxNum = this.maxNumber
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
                for (let i = 0; i < this.goodsInfo.sizeList.length; i++) {
                    if (this.goodsInfo.sizeList[i].active) {
                        sizeFlag = true
                    }
                }
                for (let i = 0; i < this.goodsInfo.colorList.length; i++) {
                    if (this.goodsInfo.colorList[i].active) {
                        colorFlag = true
                    }
                }

                return (!sizeFlag || !colorFlag)
            }
        },
        watch: {
            // 商品图片如果有变化，要重新设置轮播图
            'goodsInfo.url': function () {
                this.goodsImg = ''
                this.goodsImg = this.goodsInfo.url
            },
            // 添加默认不选中状态、默认选中
            'goodsInfo': function () {
                this._reData()
            },
            'goodsInfo.colorList': function () {
                this._isAllSelect()
            },
            'goodsInfo.sizeList': function () {
                this._isAllSelect()
            }
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    .van-modal {
        z-index: 9999999;
    }

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
                    padding: computed(30) computed(30) computed(36) computed(29);
                    .info-left {
                        width: computed(186);
                        img {
                            height: computed(186);
                            width: computed(186);
                            box-shadow: 0 computed(2) computed(6) 0 rgba(0, 0, 0, 0.1);
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
                    height: computed(615);
                    padding: 0 computed(30) 0 computed(30);
                    width: calc(100% - #{computed(60)});
                    overflow-y: auto;
                    .chose-color-size {
                        .color,
                        .size,
                        .num {
                            .left {
                                text-align: left;
                                padding: 0 0 computed(18) 0;
                                color: $text-primary;
                                font-size: $font-regular;
                            }
                            .right {
                                position: relative;
                                height: auto;
                                text-align: left;
                                .btn {
                                    display: inline-block;
                                    padding: computed(20) computed(15);
                                    border: 1px solid $text-regular;
                                    border-radius: computed(5);
                                    margin: 0 computed(18) computed(18) 0;
                                    color: $text-primary;
                                    font-size: $font-common;
                                    &.active {
                                        color: $domaincolor;
                                        border: 1px solid $domaincolor;
                                    }
                                    &.none {
                                        border: 1px dashed $text-placeholder;
                                        border-radius: computed(5);
                                        background-color: $color-white;
                                        color: $text-secondary;
                                    }
                                }
                                .stepper {
                                    display: inline-block;
                                    height: computed(66);
                                    width: computed(275);
                                    padding: computed(5) 0;
                                }
                                .stock {
                                    position: absolute;
                                    top: computed(5);
                                    font-size: $font-small;
                                    color: $color-red;
                                    line-height: computed(66);
                                    margin-left: computed(20);
                                }
                            }
                        }
                    }

                &.chose-min-height {
                    height: computed(200) !important;
                }
            }
            .btn-operate{
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                padding: computed(14) computed(29);
                background: $color-white;
                height: computed(80);
                color: $color-white;
                text-align: center;
                font-size: $font-regular;
                >div{
                    width: 50%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    
                }
                .btn-cart{
                    border-radius: computed(40) 0 0 computed(40);
                    background: linear-gradient(90deg,$yellow-start-color,$yellow-end-color);
                }
                .btn-buy{
                    border-radius: 0 computed(40) computed(40) 0;
                    background: linear-gradient(90deg,$color-red,$gradientcolor);
                    .saveMoney{
                        font-size: $font-small;
                        line-height: $font-small;
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
<style lang="scss">
.container{
    .stepper{
        // 修改加减组件样式
        .van-stepper{
            view,.van-stepper__input{
                margin: 0;
                height: computed(66);
                width:computed(88);
                line-height: computed(66);
                text-align: center;
                padding: 0;
                background: $color-white;
                border: 1rpx solid $text-secondary;
            }
            view{
                font-weight:600;
            }
            .van-stepper__input{
                border-right: none;
                border-left: none;
                line-height: computed(64);
                height: computed(64);
                font-size: $font-common;
            }
            .van-stepper__minus--disabled{
                border: 1rpx solid $text-placeholder;
                border-right: 1rpx solid $text-secondary;
                color: $text-placeholder;
            }
            .van-stepper__plus--disabled{
                border: 1rpx solid $text-placeholder;
                border-left: 1rpx solid $text-secondary;
                color: $text-placeholder;
            }
        }
    }
}
</style>
