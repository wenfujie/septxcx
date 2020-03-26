<!--
 * @Author: lan.chen
 * @Date: 2019-07-05 17:59:39
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-08-13 10:37:17
 * @Description:
 -->
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
        <div class="sku-dialog">
            <span @click="close()" class="iconfont iconguanbi sku-dialog-close"></span>
            <!-- 商品详情选择sku begin -->
            <div class="sku-dialog-detail">
                <!-- 商品信息 -->
                <div class="sku-dialog-info">
                    <div class="info-left">
                        <img :src="filter.imgFilter(goodsImg,company_id, '186*186')"
                             @click="enlarge()"
                             lazy-load="true"/>
                    </div>
                    <div class="info-right">
                        <div>
                            <p class="price">￥{{filter.Fix2(goodsInfo.salePrice)}}</p>
                            <p class="info">
                                <span v-if="colorItem.colorName || sizeItem.sizeName">已选择:</span>
                                <span v-else-if="!colorItem.colorName || !sizeItem.sizeName">请选择</span>
                                <span v-if="colorItem.colorName !== null">{{colorItem.colorName}}</span>
                                <span v-if="sizeItem.sizeName !== null">{{sizeItem.sizeName}}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <scroll-view id="chose" class="chose" :class="{'chose-min-height' : choseFlag}" scroll-y="true">
                    <div class="chose-color-size">
                        <div class="color">
                            <!-- {{maxNumber}} -->
                            <div class="left">颜色</div>
                            <div class="right">
                                <span v-for="(item, index) in goodsInfo.colorList"
                                      @click="colorActive(item, index)"
                                      :class="[{'active': item.active},{'none': item.none === false},'btn']"
                                      :key="index">
                                    {{item.colorName}}
                                </span>
                            </div>
                        </div>
                        <div class="size">
                            <!-- {{maxNum}} -->
                            <div class="left">尺码</div>
                            <div class="right">
                                <span v-for="(item, index) in goodsInfo.sizeList"
                                      @click="sizeActive(item, index)"
                                      :class="[{'active': item.active},{'none': item.none === false},'btn']"
                                      :key="index">
                                    {{item.sizeName}}
                                </span>
                            </div>
                        </div>
                        <div v-if="flag === 1 ||flag===4" class="num">
                            <div class="left">数量</div>
                            <div class="right">
                                <div class="stepper">
                                    <van-stepper @blur="numBlur"
                                                 @change="onChange"
                                                 @overlimit="overlimit"
                                                 v-model="num"
                                                 integer
                                                 :max="maxNum"/>
                                </div>
                                <!-- 需求确认在双选的情况下才显示库存提示 -->
                                <span v-if="showStockTip && !showFlag && num >= maxNum &&( (colorActiveIndex !== null && colorActiveIndex !== -1) &&(sizeActiveIndex !== null && sizeActiveIndex !== -1) )"
                                      class="stock">
                                    库存剩余{{maxNum}}件
                                </span>
                                <!-- 秒杀提示 -->
                                 <span v-if="showStockTip && fissionType && showFlag ==1&& num >= maxNum &&( (colorActiveIndex !== null && colorActiveIndex !== -1) &&(sizeActiveIndex !== null && sizeActiveIndex !== -1) )"
                                      class="stock">
                                    每个用户限购{{maxNum}}件
                                </span>

                            </div>
                        </div>
                    </div>
                </scroll-view>
                <!-- 1商品详情sku选择  2购物车sku选择 -->
                <!-- 商品详情 -->
                <div v-if="flag === 1" class="btn-operate">
                    <button
                        :open-type=" (!isLogin) ? 'getUserInfo' : ''"
                        @getuserinfo="getLoginInfo('detailSure',1)"
                        class="btn-cart"
                        @click="detailSure(1)"
                        v-if="!fissionType">
                        <div>加入购物车</div>
                    </button>
                     <!-- :class="index===currentIndex ? 'item-selected' : ''" -->
                    <button
                        :open-type=" (!isLogin) ? 'getUserInfo' : ''"
                        @getuserinfo="getLoginInfo('detailSure',0)"
                        :class="!fissionType?'btn-buy':'fission-btn-buy'"
                        @click="detailSure(0)">
                        <div>
                            <p>立即购买</p>
                            <p class="saveMoney" v-if="goodsInfo.rebateAmount > 0">立省￥{{filter.Fix2(goodsInfo.rebateAmount)}}</p>
                        </div>
                    </button>
                </div>

                <!-- 购物车 -->
                <button
                    :open-type=" (!isLogin) ? 'getUserInfo' : ''"
                    @getuserinfo="getLoginInfo('cartSure')"
                    v-if="flag === 2" @click="cartSure()" class="btn-sure">
                    <span>确定</span>
                </button>

                <!-- 每日搭配加入购物车-->
                <button
                    :open-type=" (!isLogin) ? 'getUserInfo' : ''"
                    @getuserinfo="getLoginInfo('shopCartSure')"
                    v-if="!btnStatus && flag === 4"
                    @click="shopCartSure()"
                    class="btn-sure"
                >
                    <span>确定</span>
                </button>
            </div>
            <!-- 商品详情选择sku end -->
        </div>
    </div>
</template>
<script>
    import Toast from 'vant-weapp/dist/toast/toast';
    import {UserService} from '../../api/service'
    export default {
        props: {
            // 商品信息
            goodsInfo: {
                type: '',
                default: function () {
                    return ''
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
            // 最大库存
            maxNumber: {
                type: Number,
                default: 1
            },
            //父页面是否触发onhide
            father_onhide:{
                type:Boolean,
                default:false
            },
            // 判断是否为裂变促销   1：秒杀/2：拼团
            fissionType:{
                type: Number,
                default: 1
            },
            // 是否显示库存剩余提示
            showStockTip:{
                type:Boolean,
                default:true
            },
            userInfo: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                colorItem: '',                  // 选中颜色
                sizeItem: '',                   // 选中尺码
                goodsImg: '',                   // 商品图
                num: 1,                         // 数量
                maxNum: this.maxNumber,         // 可购买的数量不能超过最大库存
                showPopup: false,               // 显示手机弹窗
                choseFlag: false,               // 安卓手机小键盘遮罩问题
                company_id: '',
                btnLock: false,                 // 添加按钮锁
                btnLockSize:false,              //尺寸选择锁
                _isAllSelect_Lock:false,
                showFlag:0,                     //为1时秒杀和拼团提示限购信息，否则显示库存信息
                isLogin: false // 登陆状态
            }
        },
        onLoad() {
            this.company_id = global.Storage.get('COMPANYID').company_id;
            // 获取商品主图
            if (this.goodsInfo !== '') {
                this.goodsImg = this.goodsInfo.url || ""
            }

            if (this.fissionType) {
                this._reData()
            }
        },
        onShow(){

            //  判断用户登陆状态设置购物车、账户的按钮类型
            if (!!global.Storage.get('USER_INFO')) {
                this.isLogin = true
            } else {
                this.isLogin = false
            }

            this.company_id = global.Storage.get('COMPANYID').company_id;
        },
        onUnload(){
            Object.assign(this.$data, this.$options.data())
        },
        onHide(){
        },
        methods: {

            // 登陆
            getLoginInfo(method,params){
                if (!global.Storage.get('USER_INFO')) {
                    global.loginAuthor().then((res) => {
                        if(!!res) {
                            this.isLogin = true
                            UserService.getUserInfo({}).then((res) => {
                                try {
                                    this.$emit('update:userInfo', res);
                                }catch (e){}
                                this[method](params || '')
                            })
                        }
                    })
                }
            },

            /** 步进器点击禁用按钮事件 **/
            overlimit(){
                this.$emit("overlimit");
            },
            //  放大图片
            enlarge() {
                this.$emit('update:father_onhide', false);
                let imgUrl=this.filter.imgFilter(this.goodsImg,this.company_id)
                wx.previewImage({
                    current: imgUrl, // 当前显示图片的http链接
                    urls: [imgUrl] // 需要预览的图片http链接列表
                })
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
                this.goodsImg = ''              // 轮播图
                let currentSizeChildList = ''   // 选中颜色，存放当前选中颜色对应下的尺码

                if(item.active){
                    this.colorItem = ''
                }else {
                    if(!!this.colorItem){
                        this.goodsInfo.colorList[this.colorItem.index].active = false
                    }
                    this.colorItem = item
                }
                this.goodsInfo.colorList[item.index].active = !this.goodsInfo.colorList[item.index].active
                this.goodsInfo.colorList = JSON.parse(JSON.stringify(this.goodsInfo.colorList))

                // 选中颜色，存放当前选中颜色对应下的尺码
                if (!!this.colorItem) {
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
                    for (let i = 0; i < currentSizeChildList.length; i++) {
                        if ((currentSizeChildList[i].sizeCode === this.sizeItem.sizeCode) &&
                            (currentSizeChildList[i].skuQty > 0)) {
                            this.maxNum = currentSizeChildList[i].skuQty
                            break
                        }
                    }
                }
                // 如果输入的数量大于最大库存
                if (this.flag === 1 && this.sizeItem && this.colorItem) {
                    if (this.num > this.maxNum) {
                        this.num = this.maxNum
                        this.$emit('update:num', this.num)
                    }
                }

                // 设置轮播图
                if (this.goodsInfo.colorList[index].urls) {
                    if (item.active) {  // 选中取当前颜色图
                        // 1商品详情sku选择  2购物车sku选择
                        if (this.flag === 1) {
                            this.goodsImg = this.goodsInfo.colorList[index].urls[0] || ""
                        } else {
                            this.goodsImg = this.goodsInfo.colorList[index].urls || ""
                        }
                    } else {            // 反选取主图
                        if(this.goodsInfo.masterUrl != undefined)
                            this.goodsImg = this.goodsInfo.masterUrl || ""
                        else this.goodsImg = this.goodsInfo.url || ""
                    }

                } else {
                    if(this.goodsInfo.masterUrl != undefined)
                        this.goodsImg = this.goodsInfo.masterUrl || ""
                    else this.goodsImg = this.goodsInfo.url || ""
                }

                if (!this.colorItem) {
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
                // 按钮锁
                /* if (this.btnLockSize) {
                    return
                }
                this.btnLockSize = true */

                let newSizeList = this.goodsInfo.sizeList
                if(item.active){
                    this.sizeItem = ''
                }else {
                    if(!!this.sizeItem){
                        this.goodsInfo.sizeList[this.sizeItem.index].active = false
                    }
                    this.sizeItem = item
                }
                this.goodsInfo.sizeList[item.index].active = !this.goodsInfo.sizeList[item.index].active
                this.goodsInfo.sizeList = JSON.parse(JSON.stringify(this.goodsInfo.sizeList))

                if (!!this.sizeItem) {
                    // 逻辑：选择了尺码，找出对应可以勾选的颜色
                    for (let i = 0; i < this.goodsInfo.colorAndSizeList.length; i++) {
                        for (let j = 0; j < this.goodsInfo.colorAndSizeList[i].sizeChildList.length; j++) {
                            if ((this.goodsInfo.colorAndSizeList[i].sizeChildList[j].sizeCode === item.sizeCode) &&
                                (this.goodsInfo.colorAndSizeList[i].sizeChildList[j].skuQty > 0)) {
                                this.goodsInfo.colorAndSizeList[i].none = true
                                if(this.goodsInfo.colorAndSizeList[i].colorCode === this.colorItem.colorCode){
                                    this.maxNum = this.goodsInfo.colorAndSizeList[i].sizeChildList[j].skuQty;
                                    this.showFlag = this.goodsInfo.colorAndSizeList[i].sizeChildList[j].showFlag;
                                }
                                break
                            } else {
                                this.goodsInfo.colorAndSizeList[i].none = false
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
                        this.$emit('update:num', this.num)
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
                if (!this.sizeItem) {
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
                if(e.mp.detail.value==undefined){
                    this.num = Number(e.mp.detail)
                }else{
                    this.num = Number(e.mp.detail.value)
                }
                this.$emit('update:num', this.num)
            },
            resetImg(){
                this.goodsImg = this.goodsInfo.url||''
            },
            numBlur(e) {
                this.num = Number(e.mp.detail.value)
                this.$emit('update:num', this.num)
                this.$emit('numBlur', true)
            },
            /**
             * 商品详情-确定按钮
             */
            detailSure(sign) {
                if(!global.Storage.get('USER_INFO')) return

                if (this._isActive()) {
                    Toast('请先选择~')
                    return
                }
                this.$emit('onAddCartOrBuy', sign, this.colorItem, this.sizeItem)
            },
            /**
             * 购物车-确定按钮
             */
            cartSure() {

                if(!this.isLogin) return

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
            // 每日搭配-加入购物车确定按钮
            shopCartSure(){

                if(!this.isLogin) return

                  if (this._isActive()) {
                    Toast('请先选择~')
                    return
                }
                this.$emit('onAddCartOrBuy', this.colorItem, this.sizeItem)
            },
            /**
             * 添加默认不选中状态、默认选中
             * @private
             */
            _reData() {
                if (!this.goodsInfo.colorList) return

                this.goodsInfo.colorList.forEach((item, index) => {
                    item.active = false
                    item.index = index
                    item.none = true
                })

                this.goodsInfo.sizeList.forEach((item, index) => {
                    item.active = false
                    item.index = index
                    item.none = true
                })

                // 设置默认选中
                if (this.sizeActiveIndex === null || this.colorActiveIndex === null) {
                    this.colorItem = ''
                    this.sizeItem = ''
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

                    //若选中的无库存，取最大库存（从结算页返回会出现这种情况）
                    if((this.goodsInfo.sizeList[this.sizeActiveIndex].active == true&&this.goodsInfo.sizeList[this.sizeActiveIndex].none==false)||
                    (this.goodsInfo.colorList[this.colorActiveIndex].active == true&&this.goodsInfo.colorList[this.colorActiveIndex].none==false)){
                        this.maxNum=this.maxNumber
                        return
                    }
                    //用户结算页回来时，刷新库存
                    for (let i = 0; i < this.goodsInfo.colorAndSizeList.length; i++) {
                        if (this.goodsInfo.colorAndSizeList[i].colorCode === this.colorItem.colorCode) {
                            for (let j = 0; j < this.goodsInfo.colorAndSizeList[i].sizeChildList.length; j++) {
                                if ((this.goodsInfo.colorAndSizeList[i].sizeChildList[j].sizeCode === this.sizeItem.sizeCode) &&
                                    (this.goodsInfo.colorAndSizeList[i].sizeChildList[j].skuQty > 0)) {
                                    this.maxNum = this.goodsInfo.colorAndSizeList[i].sizeChildList[j].skuQty
                                    break
                                }
                            }
                        }
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
                    //当只有一种选择情况，且商品数量为0时，禁止选择
                    if(this.goodsInfo.sizeList.length==1&&this.goodsInfo.colorList.length==1){
                        this.maxNum = this.goodsInfo.colorAndSizeList[0].sizeChildList[0].skuQty;
                        if(this.goodsInfo.colorAndSizeList[0].sizeChildList[0].skuQty==0){
                            this.goodsInfo.sizeList[0].none = false
                            this.goodsInfo.colorList[0].none = false
                            return
                        }
                    }
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
                console.log('购买', this.goodsInfo)
                let sizeFlag = false
                let colorFlag = false
                for (let i = 0; i < this.goodsInfo.sizeList.length; i++) {
                    if (this.goodsInfo.sizeList[i].active && this.goodsInfo.sizeList[i].none != false) {
                        sizeFlag = true
                    }
                }
                for (let i = 0; i < this.goodsInfo.colorList.length; i++) {
                    if (this.goodsInfo.colorList[i].active && this.goodsInfo.colorList[i].none != false) {
                        colorFlag = true
                    }
                }

                return (!sizeFlag || !colorFlag)
            },
        },
        watch: {
            // 商品图片如果有变化，要重新设置轮播图
            'goodsInfo.url': function () {
                this.goodsImg = ''
                this.goodsImg = this.goodsInfo.url||''
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
            },

        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
.van-modal {
    z-index: 9999999;
}

.container {
    height: 100%;
    .sku-dialog {
        position: relative;
        height: computed(1028);
        .sku-dialog-close {
            position: absolute;
            padding:computed(10);
            top: computed(20);
            right: computed(20);
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
                    height: computed(186);
                    box-shadow: 0 computed(2) computed(6) 0 rgba(0, 0, 0, 0.1);
                    img{
                        width: 100%;
                        height: 100%;;
                    }
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
            height: computed(610);
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
        .btn-operate {
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
            > div,button {
                width: 50%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                color: $color-white;
                text-align: center;
                font-size: $font-regular;
            }
            .btn-cart {
                border-radius: computed(40) 0 0 computed(40);
                background: linear-gradient(
                    90deg,
                    $yellow-start-color,
                    $yellow-end-color
                );
            }
            .btn-buy {
                border-radius: 0 computed(40) computed(40) 0;
                background: linear-gradient(
                    90deg,
                    $color-red,
                    $gradientcolor
                );
                .saveMoney {
                    font-size: $font-small;
                    line-height: $font-small;
                }
            }
            .fission-btn-buy{
                width:100%;
                border-radius:computed(40);
                background: linear-gradient(
                    90deg,
                    $color-red,
                    $gradientcolor
                );
                .saveMoney {
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

button{
    padding: 0;
    line-height: 1;
    border: none;
    background: $color-white;
    &::after{
        display: none;
    }
}

</style>
<style lang="scss">
.container {
    .stepper {
        // 修改加减组件样式
        .van-stepper {
            view,
            .van-stepper__input {
                margin: 0;
                height: computed(66);
                width: computed(88);
                line-height: computed(66);
                text-align: center;
                padding: 0;
                background: $color-white;
                border: 1rpx solid $text-secondary;
                box-sizing: content-box;
            }
            view {
                font-weight: 600;
            }
            .van-stepper__input {
                border-right: none;
                border-left: none;
                font-size: $font-common;
            }
            .van-stepper__minus--disabled {
                border: 1rpx solid $text-placeholder;
                border-right: 1rpx solid $text-secondary;
                color: $text-placeholder;
            }
            .van-stepper__plus--disabled {
                border: 1rpx solid $text-placeholder;
                border-left: 1rpx solid $text-secondary;
                color: $text-placeholder;
            }
        }
    }
}
</style>
