
/*
* createTime：2019/3/11
* author：junyong.hong
* description: 购物车
*/
<template>
    <div :class="['shopping-cart', { 'shop-card-pb': isKeyBoardHide }]" v-show="isshow">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>
        <!-- 购物车列表 begin -->
        <div v-if="shopCartList.length > 0"
             v-for="(item, index) in shopCartList"
             class="goods-items"
             :key="item.id">
            <!--选择框 begin-->
            <div class="select-box" v-if="item.inventory !== 0&&item.obtained" @click="danxuan(item)">
                <i :class="{'iconfont':true,'iconweixuanzhong':true,'iconxuanzhong': item.checked}" :for="item.id"></i>
            </div>
            <div class="select-box bukexuan" v-else></div>

            <!--选择框 end-->

            <!--商品封面 begin-->
            <div class="goods-cover" @click="item.obtained?goDetail(item):''">
                <img :src="filter.imgFilter(item.url,company_id, '186*186')" :key="item.url"
                     lazy-load="true"/>
            </div>
            <!--商品封面 end-->

            <!--商品详情 begin-->
            <div class="goods-info">
                <div :class="[{ 'z-index5': !item.obtained }]" class="delete-btn" @click="cartDelete(item.id)">
                    <i class="iconfont iconguanbi"></i>
                </div>
                <p :class="{'goods-name':true,'gray':!item.obtained}">{{ item.goodsName }}</p>
                <div class="goods-price">
                    <div class="price-box">
                        <div v-if="item.orderFlag === 0">
                            <div @click="item.inventory > 0&&item.obtained?skuDialog(item, index):''"
                                 class="goods-sku-content"
                                 :class="[item.inventory > 0&&item.obtained ?'': 'gray'  ]">
                                {{ item.colorName }} {{ item.sizeName }}
                                <span class="iconfont iconicondown-copy"></span>
                            </div>
                        </div>
                        <span class="goods-stock-tip" style="color:#CCCCCC" v-if="!item.obtained">商品已下架</span>
                        <span class="goods-stock-tip" v-if="item.obtained && item.inventory === 0">库存不足</span>
                        <span class="goods-stock-tip"
                              v-if="item.obtained && item.inventory > 0 && item.amount >= item.inventory">库存剩余{{ item.inventory }}</span>
                    </div>
                </div>
                <!-- 有库存 -->
                <div v-if=" item.inventory > 0" class="count-box">
                    <div class="count-btn reduce-btn" @click="item.obtained?reduceCount(item):''"
                         :class="{ 'gray': item.amount === 1||!item.obtained }">-
                    </div>
                    <input @focus="isKeyBoardHide = false"
                           @blur="isKeyBoardHide = true"
                           :class="{'count_input':true,'gray':!item.obtained}"
                           v-model="item.amount"
                           type="tel"
                           @keyup.13="changeCount(item)"
                           @change="changeCount(item)"
                           pattern="[0-9]*"
                           :disabled="!item.obtained"/>
                    <div class="count-btn add-btn" @click="item.obtained?addCount(item):''"
                         :class="{ 'gray': item.amount >= item.inventory||!item.obtained }">+
                    </div>
                </div>
                <!-- 没有库存 -->
                <div v-if="item.obtained && item.inventory === 0" class="count-box">
                    <div @click="skuDialog(item, index)" class="re-select">重新选择</div>
                </div>
                <div class="goods-sku-box">
                    <span v-if="!item.dealPrice" class="sale-price">￥{{filter.Fix2(item.salePrice)}}</span>
                    <span v-else class="sale-price">￥{{filter.Fix2(item.dealPrice)}}</span>
                </div>
            </div>
            <!-- 商品详情 end -->
        </div>
        <!-- 购物车列表 end -->


        <!-- 去逛逛 begin -->
        <div v-if="shopCartList.length <= 0 && showEmpty" class="shopping-cart-empty">
            <div>
                <span class="iconfont icongouwuche_weixuanzhong"></span>
                <span class="info">购物车饿瘪了 ╥﹏╥</span>
            </div>
            <div @click="goHome" class="goHome">去逛逛</div>
        </div>
        <!-- 去逛逛 end -->

        <!-- 底部按钮 begin -->
        <div v-if="shopCartList.length > 0" class="goods-actions" v-show="isKeyBoardHide">
            <div class="carts-info">
                <div class="van-checkbox" @click="checkedAll()">
                    <i class="iconfont iconweixuanzhong" :class="{ iconxuanzhong: checkAll === true }"></i>
                    <span class="checkbox-label">全选</span>
                </div>
                <div class="total">
                    <!-- <p class="total-fare">不含运费</p> -->
                    <p class="total-price">
                        <span>合计</span>
                        <span v-if="price -salesTotal>0">￥{{filter.Fix2(price-salesTotal)}}</span>
                        <span v-else>￥{{filter.Fix2(price)}}</span>
                    </p>
                    <p class="total-reduce" v-if="salesTotal !== 0 && checkedList.length > 0">
                        优惠减￥{{ filter.Fix2(salesTotal) }}<span class="reduce-help iconfont iconzhuanzishuoming"
                                                               @click="shareExplain=true"></span>
                    </p>
                </div>
            </div>
            <div class="buy-button" @click="buyNow">
                <div >
                    <p>立即结算({{ rowCartAll }})</p>
                    <p v-if="!!rebate&&rebate>0&&checkedList.length > 0">省￥{{ filter.Fix2(rebate) }}</p>
                </div>
            </div>
        </div>
        <!-- 底部按钮 end -->

        <!-- 猜你喜欢 -->
        <guess-love v-if="showRcmdFlag"></guess-love>

        <!-- sku选择 begin -->
        <van-popup :show="isShowSku" position="right" :overlay="true" class="sku-popup largen_close">
            <sku-dialog-comp
                ref="sku"
                :goodsInfo="goodSkuList"
                :colorActiveIndex.sync="colorActiveIndex"
                :sizeActiveIndex.sync="sizeActiveIndex"
                :isShowSku.sync="isShowSku"
                :father_onhide.sync="isPassHide"
                :flag="2"
                @onSelectColor="onSelectColorComp"
            ></sku-dialog-comp>
        </van-popup>
        <!-- sku选择 end -->

        <!-- 优惠详情说明 -->
        <van-popup :show="shareExplain" class="explainWrap largen_close" catch:touchmove="noop()">
            <div class="explain">
                <div class="explain-title">优惠明细</div>
                <div class="explain-line" v-for="(item,index) in discountsDetail" :key="index">
                    <div class="explain-line-left">{{item.onlineName}}</div>
                    <div class="explain-line-right">-￥{{filter.Fix2(item.discAmt)}}</div>
                </div>
                <div class="explain-line explain-lineBottom">
                    <div class="explain-line-left">共优惠</div>
                    <div class="explain-line-right">-￥{{filter.Fix2(salesTotal)}}</div>
                </div>
                <div class="explain-sure" @click="shareExplain=false">确定</div>
            </div>
        </van-popup>

        <van-dialog id="van-dialog"/>
        <van-dialog
            use-slot
            title="以下商品已下架："
            @close="showDialog = ''"
            :show="showDialog == 'unSell'"
        >
            <div class="toast-html">
                <p v-for="(item,index) in unSellList"
                   :key="item.goodsCode"
                   :style="{'text-align': 'center'}"
                >【{{item.goodsName}}】；</p>
            </div>
        </van-dialog>
        <van-dialog
            use-slot
            title="以下商品库存不足："
            @close="showDialog = ''"
            :show="showDialog == 'unStock'"
        >
            <div class="toast-html">
                <p v-for="(item,index) in unStockList"
                   :key="index"
                   :style="{'text-align': 'center'}"
                >【{{item.ptiPartHdName}}】颜色：{{item.colorName}}，尺码：{{item.sizeName}}；</p>
            </div>
        </van-dialog>
    </div>
</template>
<script type="text/ecmascript-6">
    import debounce from '@/utils/debounce'
    import Toast from 'vant-weapp/dist/toast/toast';
    import Dialog from 'vant-weapp/dist/dialog/dialog';
    import {ShoppingCart, Order, Goods,Fission} from '../../api/service';
    import skuDialogComp from '../../components/wares/sku-dialog.vue';
    import guessLove from '@/components/GuessLove.vue'

    export default {
        config: {
            navigationBarTitleText: '购物车',
            enablePullDownRefresh: true,
            backgroundTextStyle: "dark"
        },
        components: {
            skuDialogComp,
            guessLove
        },
        props: ["isshow", "query"],
        data() {
            return {
                shopCartList: [],
                checkedList: [],        // 存放选中的商品id
                checkAll: false,        // 全选状态
                checked: false,
                ids: [],
                vipInfo: {},
                canSave: [],            // 购物车选中商品库存检验状态数组
                btnLock: false,         // 按钮锁
                isShowSku: false,       // sku弹窗
                skuItem: [],
                skuIndex: null,
                showEmpty: false,
                goodSkuList: '',       // 弹窗sku数据
                colorActiveIndex: null,
                sizeActiveIndex: null,
                vourcherList: [],//存放勾选的商品
                salesTotal: 0,//促销价格
                isKeyBoardHide: true,
                btnNumLock: false,//控制增加减少
                btnSkuLock: false,// 控制购物车更改数量是否可点击
                rowCartAll: 0,      // 立即结算数量
                company_id: "",
                unSellList: [],// 未上架列表
                unStockList: [],// 库存不足列表
                showDialog: false,// 库存上下架提示
                discountsDetail: [], //优惠详情
                shareExplain: false,  //是否显示优惠详情
                rebate: 0, //下单可省多少钱
                showRcmdFlag: false,
                submit_lock:false,//结算按钮的锁
                isPassHide:true,//sku打开图片预览时触发,true为触发onshow
                goDetail_lock:false,////跳转商品详情锁
            }
        },
        created() {
            this.company_id = global.Storage.get('COMPANYID').company_id;
            this.getCartInfo();
            this.getUser();
            this.$store.dispatch('user/getShoppingCart')
        },
        onShow(){
            if(!this.isPassHide){
                this.isPassHide=true;
                return
            }
            if(this.isshow){
                this.onRefresh()
            }
        },
        //  监听是否全选
        watch: {
            'checkedList': function () {
                let num = 0;
                this.rowCartAll = 0
                this.shopCartList.forEach((item, index) => {
                    // 上架 && 库存不足
                    if (item.obtained && item.inventory !== 0) {
                        num += 1
                    }
                    // 立即结算数量
                    this.checkedList.forEach((itm) => {
                        if (item.id === itm) {
                            this.rowCartAll += item.amount
                        }
                    })
                })
                if (num === this.checkedList.length && num != 0) {
                    this.checkAll = true;
                } else {
                    this.checkAll = false;
                }
                if (this.checkedList.length) {
                    this.vourcherList = []
                    this.checkedList.forEach(item => {
                        this.shopCartList.forEach(shopItem => {
                            if (item === shopItem.id) {
                                let obj = {}
                                obj.ids = shopItem.id
                                obj.id = shopItem.newPtiPartDtSkuId;
                                obj.ptiPartHdId = shopItem.ptiPartHdId;
                                obj.colorId = shopItem.colorId;
                                obj.sizeId = shopItem.sizeId;
                                obj.salePrice = shopItem.dealPrice;
                                obj.qty = shopItem.amount;
                                this.vourcherList.push(obj)
                            }
                        })
                    })
                } else {
                    this.vourcherList = []
                }
                this.getVouchersInfo();
            },
            checkAll(yes) {
                this.checkAll = yes;
            },
        },
        //  计算总价
        computed: {
            'price': function () {
                let price = 0;
                let vals = [];
                if (this.checkedList.length === 0) {
                    this.salesTotal = 0
                    return price.toFixed(2);
                } else if (this.checkedList.length > 0) {
                    for (let i = 0; i < this.checkedList.length; i++) {
                        for (let j = 0; j < this.shopCartList.length; j++) {
                            if (this.checkedList[i] === this.shopCartList[j].id) {
                                if (this.shopCartList[j].dealPrice) {
                                    price += (this.shopCartList[j].dealPrice * 1.0) * (this.shopCartList[j].amount * 1.0)
                                } else if (this.shopCartList[j].salePrice) {
                                    price += (this.shopCartList[j].salePrice * 1.0) * (this.shopCartList[j].amount * 1.0)
                                } else {
                                    //  netty接口过滤价格为0d额字段
                                    price += 0
                                }
                                vals.push(this.shopCartList[j]);
                            }
                        }
                    }
                    price = !!price ? price : 0
                    return price.toFixed(2);
                }
            }
        },
        onPullDownRefresh() {
            if(!this.isshow){
                return
            }
            this.btnLock = true
            global.showLoading({'mask':true})
            this.getCartInfo();
            this.$store.dispatch('user/updateShoppingCart')
            this.checkedList = [];
            this.btnLock = false
        },
        methods: {
            //空方法用于阻止穿透
            noop(){},
            onRefresh() {
                this.showEmpty=false;
                this.shareExplain=false;//让手机屏幕切换时，优惠详情弹窗消失
                this.shopCartList = [];
                this.checkedList = [];
                this.company_id = global.Storage.get('COMPANYID').company_id;
                this.getCartInfo();
            },

            goHome() {
                global.switchTab('/index')
            },

            danxuan(item) {
                item.checked = !item.checked;
                if (item.checked === true) {
                    this.checkedList.push(item.id);
                } else {
                    this.checkedList.forEach((it, index) => {
                        if (it === item.id) {
                            this.checkedList.splice(index, 1)
                        }
                    })
                }
            },

            choose(item) {
                this.vourcherList.forEach((itm, itmIndex) => {
                    if (item.id === itm.ids) {
                        this.vourcherList[itmIndex].qty = item.amount;
                        this.vourcherList[itmIndex].colorId = item.colorId;
                        this.vourcherList[itmIndex].sizeId = item.sizeId;
                        this.vourcherList[itmIndex].id = item.newPtiPartDtSkuId;
                    }
                })
                this.getVouchersInfo();
            },

            // 获取优惠券信息
            getVouchersInfo() {
                let data = {
                    dptId: global.Storage.get("properties").shopId,
                    goodsList: this.vourcherList
                }
                // global.showLoading({'mask':true})
                ShoppingCart.getshopDiscountsDetail(data).then((res) => {
                    // global.hideLoading();
                    this.discountsDetail = res ? res : [];
                    if (!res || res.length == 0) {
                        this.salesTotal = 0;
                        this.rebate = 0;
                    } else {
                        let salesTotal = 0;
                        let rebate = 0
                        for (let i = 0; i < res.length; i++) {
                            salesTotal += res[i].discAmt;
                            if (res[i].isRebate == 1) {
                                rebate = res[i].discAmt;
                            }
                        }
                        this.rebate = rebate;
                        this.salesTotal = salesTotal;
                    }
                },(res)=>{})
            },

            //  获取购物车列表
            getCartInfo() {
                this.showRcmdFlag = false
                let data = {
                    usrKey: global.Storage.get('USER_INFO').usrId,
                    shopDptId: global.Storage.get('properties').shopId,
                    buscontsCode: global.baseConstant.busContsCode,
                    pageSize: 9999,
                    pageNo: 1
                }
                global.showLoading({'mask':true})
                // global.toastLoading();
                ShoppingCart.getCartList(data).then((res) => {
                    let map = {}
                    let shelvesList = []
                    res.list.forEach((item) => {
                        // 解析fastJson
                        if (!!item.simpleSkuInfoList && item.simpleSkuInfoList.length > 0) {
                            let str = JSON.stringify(item.simpleSkuInfoList[0])
                            if (str.indexOf('$ref') != -1) {
                                let listObj = str.split('.')[1]
                                listObj = listObj.split('[')[1]
                                let ref = listObj.split(']')[0]
                                item.simpleSkuInfoList = res.list[ref].simpleSkuInfoList
                            }
                        }
                        let shelvesMap = {}
                        shelvesMap.goodsCode = item.goodsCode
                        shelvesMap.busContsCode = !!global.baseConstant.busContsCode ? global.baseConstant.busContsCode : global.Storage.get('properties').busContsCode
                        shelvesMap.companyId = global.Storage.get('COMPANYID').company_id
                        shelvesMap.ownCompanyId = global.Storage.get('COMPANYID').company_id
                        shelvesList.push(shelvesMap)
                        item.active = false
                        item.colorArr = []
                        item.sizeArr = []
                        item.newPtiPartDtSkuId = item.ptiPartDtSkuId  //  保存购物车所需参数，默认与原skuId一致
                        item.checked = false;
                        this.checkedList.forEach((it) => {
                            if (it === item.id) {
                                item.checked = true;
                            }
                        })
                        //拆解sku
                        for (let i = 0; i < item.simpleSkuInfoList.length; i++) {
                            //  遍历所有sku组合，选取颜色数组
                            if (item.colorArr.length === 0) {
                                map.colorCode = item.simpleSkuInfoList[i].colorCode
                                map.colorId = item.simpleSkuInfoList[i].colorId
                                map.colorName = item.simpleSkuInfoList[i].colorName
                                item.colorArr.push(map)
                                map = {}
                            }
                            for (let j = 0; j < item.colorArr.length; j++) {
                                let arrList = []
                                item.colorArr.forEach((colorItem) => {
                                    arrList.push(colorItem.colorId)
                                })
                                if (arrList.indexOf(item.simpleSkuInfoList[i].colorId) === -1) {
                                    map.colorCode = item.simpleSkuInfoList[i].colorCode
                                    map.colorId = item.simpleSkuInfoList[i].colorId
                                    map.colorName = item.simpleSkuInfoList[i].colorName
                                    item.colorArr.push(map)
                                    map = {}
                                }
                            }
                            //  遍历所有sku组合，选取尺码数组
                            if (item.sizeArr.length === 0) {
                                map.sizeCode = item.simpleSkuInfoList[i].sizeCode
                                map.sizeId = item.simpleSkuInfoList[i].sizeId
                                map.sizeName = item.simpleSkuInfoList[i].sizeName
                                item.sizeArr.push(map)
                                map = {}
                            }
                            for (let j = 0; j < item.sizeArr.length; j++) {
                                let arrList = []
                                item.sizeArr.forEach((sizeItem) => {
                                    arrList.push(sizeItem.sizeId)
                                })
                                if (arrList.indexOf(item.simpleSkuInfoList[i].sizeId) === -1) {
                                    map.sizeCode = item.simpleSkuInfoList[i].sizeCode
                                    map.sizeId = item.simpleSkuInfoList[i].sizeId
                                    map.sizeName = item.simpleSkuInfoList[i].sizeName
                                    item.sizeArr.push(map)
                                    map = {}
                                }
                            }
                        }
                        item.showColorArr = false
                        item.showSizeArr = false
                    })

                    // 判断当前商品是否下架
                    let shelvesData = {
                        spPartGoodsSearchDtoList: global.objCombine(shelvesList, 'goodsCode')
                    }
                    Goods.getGoodsSellState(shelvesData).then((stateList) => {
                        for (let i = 0; i < stateList.length; i++) {
                            for (let j = 0; j < res.list.length; j++) {
                                // 整件商品下架了
                                if (stateList[i].sellFlag === 0) {
                                    if (stateList[i].goodsCode === res.list[j].goodsCode) {
                                        res.list[j].obtained = false
                                    }
                                } else {
                                    for (let k = 0; k < stateList[i].spPartGoodsSkuList.length; k++) {
                                        if (stateList[i].spPartGoodsSkuList[k].ptiPartDtSkuId === res.list[j].ptiPartDtSkuId) {
                                            if (stateList[i].spPartGoodsSkuList[k].effFlag === 1) { // 上架
                                                res.list[j].obtained = true
                                                break
                                            } else {                                                // 下架
                                                res.list[j].obtained = false
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        /* orderFlag字段用于区分定制商品和大货商品，0表示大货商品 */
                        // res.list[2].inventory=0;   //模拟数据
                        this.shopCartList = res.list;
                        wx.nextTick((res)=>{
                                global.hideLoading()
                        })
                        this.btnSkuLock = false
                    },()=>{})

                    if (!res.list.length || res.list.length < 1) {
                        this.showEmpty = true
                    }
                }, (err) => {}).then(() => {
                    this.showRcmdFlag = true
                })
            },

            //  全选与取消全选
            checkedAll() {
                if (this.btnLock) {
                    return
                }

                let goodsData = []
                if (this.checkAll === false) {  // 判断当前的全选状态
                    this.shopCartList.forEach((item) => {
                        if (item.obtained && item.inventory !== 0) {    // 该商品是上架的状态  && 库存不足
                            item.checked = true;
                            goodsData.push(item.id);
                        }
                    });
                }
                else {
                    this.shopCartList.forEach((item) => {
                        item.checked = false;
                    })
                }
                this.checkedList = goodsData;
            },

            //  增加购物车数量
            addCount(item) {
                if (this.btnNumLock) {
                    return
                }
                this.btnNumLock = true

                item.amount = item.amount * 1
                let amount = item.amount + 1
                let data = {
                    companyId: global.Storage.get('COMPANYID').company_id,
                    busContsCode: global.baseConstant.busContsCode,
                    shopCode: global.Storage.get('properties').shopCode,
                    goodsCode: item.goodsCode,
                    colorCode: item.colorCode,
                    sizeCode: item.sizeCode
                }
                Goods.getGoodsStock(data).then((res) => {
                    if ((res.goodsQty >= amount) && (res.skuList[0].skuQty >= amount)) {
                        item.amount += 1
                        this.cartSave(item, null, true);
                    }
                    else {
                        Toast('库存不足~')
                        this.cartSave(item, null, true)
                    }
                }, (err) => {
                    this.btnNumLock = false
                })
            },

            //  减少购物车数量
            async reduceCount(item) {
                if (this.btnNumLock) {
                    return
                }
                this.btnNumLock = true
                item.amount = item.amount * 1
                if (item.amount <= 1) {
                    item.amount === 1
                    this.btnNumLock = false
                    return
                } else {
                    item.amount -= 1
                }
                await this.cartSave(item, null, true)
            },

            //  手动输入商品数量
            changeCount(item) {
                item.amount = (item.amount.replace(/[^\d]/g, '')) * 1
                if (item.amount <= 1) {
                    item.amount = 1
                    this.cartSave(item)
                    this.btnNumLock = false
                    return
                }
                else {
                    item.amount = item.amount * 1
                    let data = {
                        companyId: global.Storage.get('COMPANYID').company_id,
                        busContsCode: global.baseConstant.busContsCode,
                        shopCode: global.Storage.get('properties').shopCode,
                        goodsCode: item.goodsCode,
                        colorCode: item.colorCode,
                        sizeCode: item.sizeCode
                    }
                    Goods.getGoodsStock(data).then((res) => {
                        if ((res.goodsQty >= item.amount) && (res.skuList[0].skuQty >= item.amount)) {
                            this.cartSave(item);
                            this.choose(item);
                        }
                        else {
                            item.amount = item.inventory
                            Toast('库存不足~')
                            this.cartSave(item)
                        }
                    })
                }
            },

            // 删除购物车
            cartDelete(id) {
                Dialog.confirm({
                    message: "确定删除该商品吗？"
                }).then(() => {
                    this.ids.push(id)
                    let data = {
                        cookieId: global.Storage.get('USER_INFO').usrId,
                        cartIds: this.ids.join(',')
                    }
                    ShoppingCart.deleteCart(data).then(() => {
                        this.getCartInfo();
                        this.ids = []
                        Toast('删除成功~')
                        this.checkedList.forEach((it, index) => {
                            if (it === id) {
                                this.checkedList.splice(index, 1);
                            }
                        })
                        this.shopCartList = this.shopCartList.filter(it => it.id !== id);
                        this.$store.dispatch('user/updateShoppingCart');

                    }, (err) => {
                        Toast(err.errorMsg)
                    })
                }, (err) => {
                })
            },

            // 保存购物车
            cartSave(item, newId, type) {
                let saveData = {
                    amount: item.amount,
                    busContsCode: global.baseConstant.busContsCode,
                    cookieId: global.Storage.get('USER_INFO').usrId,
                    ctmUsrId: global.Storage.get('USER_INFO').usrId,
                    dptId: global.Storage.get('properties').shopId,
                    goodsCode: item.goodsCode,
                    partDtSkuId: item.ptiPartDtSkuId,
                    newPartDtSkuId: item.newPtiPartDtSkuId,
                    flag: 1
                }
                ShoppingCart.saveCart(saveData).then((res) => {
                    if (newId) {
                        item.ptiPartDtSkuId = newId
                    }
                    // 立即结算数量
                    this.rowCartAll = 0
                    this.shopCartList.forEach((item, index) => {
                        this.checkedList.forEach((itm) => {
                            if (item.id === itm) {
                                this.rowCartAll += item.amount
                            }
                        })
                    })
                    this.btnNumLock = false
                }, (err) => {
                    this.btnNumLock = false
                }).then(async () => {
                    if (type) return
                    await this.getCartInfo()
                })
                this.choose(item);
            },
            buyNow() {
                if (this.checkedList.length <= 0) {
                    Toast('请选择需要结算的商品~')
                    return
                }
                if(this.submit_lock){
                    return
                }
                this.submit_lock=true;
                if (this.vipInfo.mobilePhone === null || !this.vipInfo.mobilePhone) {
                    this.$router.push("/pages/UserPackage/phone/bind-phone");
                    setTimeout(() => { this.submit_lock=false; }, 1500);
                } else {
                    // 检验商品库存、上下架
                    let goodListObj = {
                        shopId: global.Storage.get("properties").shopId,
                        usrId: global.Storage.get("USER_INFO").usrId,
                        goodList: []
                    }
                    for (let i = 0; i < this.checkedList.length; i++) {
                        this.shopCartList.map((item) => {
                            if (item.id === this.checkedList[i]) {
                                goodListObj.goodList.push({
                                    cartId: item.id,
                                    busContsCode: global.baseConstant.busContsCode,
                                    goodsCode: item.goodsCode,              // 商品编码
                                    ptiPartHdId: item.ptiPartHdId,          // 商品id
                                    ptiPartDtSkuId: item.ptiPartDtSkuId,    // 商品skuId
                                    amount: item.amount,                    // 数量
                                    orderFlag: item.orderFlag               // 0为大货 1为定制
                                })
                            }
                        })
                    }
                    Goods.getUseableGood(goodListObj).then((res) => {
                        if (res.sellAll !== 1) {    // 商品已下架
                            this.submit_lock=false;
                            this.unSellList = res.unSellList;
                            this.setDialogState('unSell');
                            return
                        }
                        if (res.stockAll !== 1) {   // 商品库存不足
                            this.submit_lock=false;
                            this.unStockList = res.unStockList;
                            this.setDialogState('unStock');
                            return
                        }
                        this.saveOrder()
                    }, err => {this.submit_lock=false;})
                }
            },

            // 保存更新结算
            saveOrder() {
                if (this.checkedList.length <= 0) {
                    Toast('请选择需要结算的商品~')
                    this.submit_lock=false;
                    return
                } else {
                    //  未绑定手机号的情况下跳转绑定手机号页面
                    if (this.vipInfo.mobilePhone === null || !this.vipInfo.mobilePhone) {
                        this.$router.push("/pages/UserPackage/phone/bind-phone");
                        setTimeout(() => { this.submit_lock=false; }, 1500);
                    } else {
                        let skuList = []
                        let map = {}
                        for (let i = 0; i < this.checkedList.length; i++) {
                            this.shopCartList.forEach((item) => {
                                if (item.id === this.checkedList[i]) {
                                    map = item
                                    map.cartId = map.id
                                    map.pictFileId = map.fileHdId
                                    skuList.push(map);
                                }
                            })
                            map = {};
                        }
                        let data = {
                            interfaceCode: "SP_SALE_SAVECARTTEMP",
                            ctmUsrId: global.Storage.get('USER_INFO').usrId,
                            cookieId: global.Storage.get('USER_INFO').usrId,
                            shopCode: global.Storage.get('properties').shopCode,
                            usrKey: global.Storage.get('USER_INFO').usrId,
                            sourceCode: 'D_ORDWEIN',
                            skuList: skuList,
                            amountOrd: 1 * this.price
                        }
                        Order.saveCartTemp(data).then((res) => {
                            Order.orderPreferCal({ordId: res}).then(() => {
                                this.$router.push("/pages/orderPackage/order/order/order-settlement?orderHdId=" + res);
                                setTimeout(() => { this.submit_lock=false; }, 1500);
                            }, err => {this.submit_lock=false;})
                        },()=>{this.submit_lock=false;})
                 }
                }
            },

            // 跳转商品详情
            goDetail(item) {
                if(this.goDetail_lock){
                    return
                }
                this.goDetail_lock=true;
                let params = {
                    ownCompanyId: global.Storage.get("COMPANYID").company_id,
                    goodsCode: item.goodsCode,
                    buscontsCode: global.baseConstant.busContsCode
                };
                Goods.isShelves(params).then(res => {
                    // 未导入微信平台和全平台跳转至商品未上架页面
                    if (!res) {
                        this.$router.push("/pages/goodsPackage/goods/off-shelves");
                        this.goDetail_lock=false;
                    }else{
                        this.$router.push("/pages/goodsPackage/wares/wares-detail?goodsCode=" + item.goodsCode+ '&goodsId=' + item.ptiPartHdId);
                        this.goDetail_lock=false;
                    }
                },()=>{this.goDetail_lock=false;});
            },

            /**
             * 商品颜色、尺码切换
             * @param item 当前shoppingList
             * @param colorItem 当前颜色item
             * @param sizeItem 当前尺码item
             *
             */
            async choseColorAndSize(item, colorItem, sizeItem) {
                let skuAmount = item.amount
                let data = {
                    companyId: global.Storage.get('COMPANYID').company_id,
                    busContsCode: global.baseConstant.busContsCode,
                    shopCode: global.Storage.get('properties').shopCode,
                }
                let skuInfo = {
                    ptiPartDtSkuId: '',
                    ptiPartHdId: ''
                }
                data.goodsCode = item.goodsCode
                //  遍历单件商品sku组合，选择对应的skuId
                item.simpleSkuInfoList.forEach((skuItem) => {
                    if ((skuItem.colorCode === colorItem.colorCode) && (skuItem.sizeCode === sizeItem.sizeCode)) {
                        data.colorCode = colorItem.colorCode
                        data.sizeCode = skuItem.sizeCode
                        skuInfo.ptiPartDtSkuId = skuItem.id
                        skuInfo.ptiPartHdId = skuItem.ptiPartHdId
                    }
                })
                //  校验库存
                await Goods.getGoodsStock(data).then(async (res) => {
                    // 判断库存
                    if ((res.goodsQty >= skuAmount) && (res.skuList[0].skuQty >= skuAmount)) {
                        item.colorCode = colorItem.colorCode
                        item.colorId = colorItem.colorId
                        item.colorName = colorItem.colorName
                        item.sizeCode = sizeItem.sizeCode
                        item.sizeId = sizeItem.sizeId
                        item.sizeName = sizeItem.sizeName
                        item.newPtiPartDtSkuId = skuInfo.ptiPartDtSkuId
                        item.showColorArr = false
                        item.amount = skuAmount
                        if (this.ids.length > 0) {
                            //  保存购物车列表
                            await this.cartSave(item, skuInfo.ptiPartDtSkuId)
                            this.$store.dispatch('user/updateShoppingCart')
                        } else {
                            //  保存购物车列表
                            await this.cartSave(item, skuInfo.ptiPartDtSkuId)
                            this.$store.dispatch('user/updateShoppingCart')
                        }
                    } else {
                        if (this.ids.length > 0) {
                            if (item.amount >= res.skuList[0].skuQty) {
                                Toast('库存不足')
                                this.btnSkuLock = false
                                return
                            } else {
                                item.amount = res.skuList[0].skuQty
                            }
                            await this.cartSave(item, skuInfo.ptiPartDtSkuId)
                            this.$store.dispatch('user/updateShoppingCart')
                        } else {
                            Toast('库存不足')
                            this.btnSkuLock = false

                        }
                    }
                })
            },

            //  用户信息
            getUser() {
                global.c_getUserInfo().then((res) => {
                    this.vipInfo = res
                })
            },

            //  提交订单查询库存（没用到，buyNow替代）
            checkStock() {
                if (this.checkedList.length <= 0) {
                    // 校验购物车选中商品的数量
                    Toast('请选择需要结算的商品~')
                    return
                } else {
                    //  获取购物车选中商品的sku属性，进行库存校验
                    let skuList = []  // 选中商品数组
                    this.canSave = []
                    let map = {}
                    for (let i = 0; i < this.checkedList.length; i++) {
                        this.shopCartList.forEach((item) => {
                            if (item.id === this.checkedList[i]) {
                                map = item
                                map.cartId = map.id
                            }
                        })
                        skuList.push(map)
                        map = {}
                    }
                }
            },

            // 设置库存校验弹窗显示状态
            setDialogState(state = '') {
                this.showDialog = state;
                setTimeout(() => {
                    // this.showDialog = '';
                    this.showDialog = false;
                }, 3000)
            },

            // 控制sku弹窗
            async skuDialog(item, index) {
                // sku未改成功，进行拦截
                if (this.btnSkuLock) {
                    return
                }
                this.skuItem = item
                this.skuIndex = index
                // 当前商品库存
                let goodsStucksList = await this.getGoodsStucks(item.goodsCode)

                let goodSkuList = {}
                goodSkuList.colorList = []
                goodSkuList.sizeList = []
                goodSkuList.colorAndSizeList = []
                goodSkuList.url = item.url||''
                goodSkuList.masterUrl = item.masterUrl||''
                goodSkuList.salePrice = item.dealPrice ? item.dealPrice : item.salePrice    // 有折扣价就取折扣价，没有取标准售价

                // 颜色
                let temporaryColorArr = []
                let forEachColorArr = []    // 临时存储，防止数据污染
                let forEachSizeArr = []
                item.simpleSkuInfoList.forEach((itm) => {
                    let obj = {}
                    obj.colorCode = itm.colorCode
                    obj.colorId = itm.colorId
                    obj.colorName = itm.colorName
                    obj.urls = itm.fileUrl
                    obj.none = true     // 默认按钮可以点击
                    obj.colorSortseq = itm.colorSortseq
                    temporaryColorArr.push(obj)
                })
                forEachColorArr = global.objCombine(temporaryColorArr, 'colorCode')
                goodSkuList.colorList = forEachColorArr.sort(global.compare('colorSortseq'))

                // 尺码
                let temporarySizeArr = []
                item.simpleSkuInfoList.forEach((itm) => {
                    let obj = {}
                    obj.sizeCode = itm.sizeCode
                    obj.sizeId = itm.sizeId
                    obj.sizeName = itm.sizeName
                    obj.none = true     // 默认按钮可以点击
                    obj.sizeSortseq = itm.sizeSortseq
                    temporarySizeArr.push(obj)
                })
                forEachSizeArr = global.objCombine(temporarySizeArr, 'sizeCode')
                goodSkuList.sizeList = forEachSizeArr.sort(global.compare('sizeSortseq'))

                // 颜色下存放对应尺码
                forEachColorArr.forEach((itm, itmIndex) => {
                    let obj = {}
                    obj.colorCode = itm.colorCode
                    obj.colorId = itm.colorId
                    obj.colorName = itm.colorName
                    goodSkuList.colorAndSizeList.push(obj)
                    goodSkuList.colorAndSizeList[itmIndex].sizeChildList = []
                })
                item.simpleSkuInfoList.forEach((skuItem, skuIndex) => {
                    goodSkuList.colorAndSizeList.forEach((itm, itmIndex) => {
                        if ((skuItem.colorCode === itm.colorCode)) {
                            let obj = {}
                            obj.sizeCode = skuItem.sizeCode
                            obj.sizeId = skuItem.sizeId
                            obj.sizeName = skuItem.sizeName
                            goodSkuList.colorAndSizeList[itmIndex].sizeChildList.push(obj)
                        }
                    })
                })

                // 添加库存数量
                goodSkuList.colorAndSizeList.forEach((colorItem, colorIndex) => {
                    colorItem.sizeChildList.forEach((sizeItem, sizeIndex) => {
                        goodsStucksList.forEach((stuckItem, stuckIndex) => {
                            if (stuckItem.colorCode === colorItem.colorCode && stuckItem.sizeCode === sizeItem.sizeCode) {
                                sizeItem.skuId = stuckItem.skuId
                                sizeItem.skuQty = stuckItem.skuQty
                            }
                        })
                    })
                })

                // 选中默认
                goodSkuList.colorList.forEach((colorItem, colorIndex) => {
                    if (colorItem.colorCode === item.colorCode) {
                        this.colorActiveIndex = colorIndex
                    }
                })
                if (item.inventory > 0) {   // 库存大于0
                    goodSkuList.sizeList.forEach((sizeItem, sizeIndex) => {
                        if (sizeItem.sizeCode === item.sizeCode) {
                            this.sizeActiveIndex = sizeIndex
                        }
                    })
                } else {
                    for (let i = 0; i < goodSkuList.sizeList.length; i++) {
                        if (item.sizeCode === goodSkuList.sizeList[i].sizeCode) {
                            goodSkuList.sizeList[i].none = false
                        }
                    }

                    this.sizeActiveIndex = null
                }

                // 如果库存为0，不能选择尺码
                goodSkuList.colorAndSizeList.forEach((colorItem, colorIndex) => {
                    if (this.colorActiveIndex === colorIndex) {
                        colorItem.sizeChildList.forEach((sizeItem, sizeIndex) => {
                            if (sizeItem.skuQty === 0) {
                                goodSkuList.sizeList.forEach((item, index) => {
                                    if (sizeItem.sizeCode === item.sizeCode) {
                                        item.none = false
                                    }
                                })
                            }
                        })
                    }
                })
                this.goodSkuList = goodSkuList
                this.isShowSku = !this.isShowSku
                if(this.isShowSku) this.$refs.sku.resetImg()
            },

            // 颜色、尺码选择回调
            async onSelectColorComp(colorItem, sizeItem) {
                this.btnSkuLock = true
                await this.choseColorAndSize(this.skuItem, colorItem, sizeItem)

                this.isShowSku = !this.isShowSku
            },

            // 查询商品库存
            async getGoodsStucks(goodsCode) {
                let data = {
                    busContsCode: global.baseConstant.busContsCode,
                    goodsCode: goodsCode,
                    shopCode: global.Storage.get("properties").shopCode
                };
                return await Goods.getGoodsStock(data).then((res) => {
                    return res.skuList;
                });
            },

            /**
             * 路由导航
             * @param url 路由连接
             */
            navigate(url) {
                if (!url) {
                    Toast('敬请期待~')
                    return
                }

                this.$router.push(url);
            }
        },
    }
</script>
<style lang="scss" type="text/scss" scoped>
    /**覆盖radio样式**/
    .iconweixuanzhong {
        color: $text-placeholder;
    }

    .iconxuanzhong {
        color: $domaincolor;
    }

    .shopping-cart {
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        background: $color-light-gray;
        min-height: 100vh;
    }

    .shop-card-pb {
        padding-bottom: computed(204);
    }

    .goods-actions {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        width: 100%;
        height: computed(108);
        position: fixed;
        left: 0;
        bottom: computed(88);
        z-index: 9;
        box-shadow: 0rpx -2rpx 0 0rpx rgba(41, 51, 50, 0.08);

    }

    .carts-info {
        position: relative;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: 100%;
        height: computed(108);
        background: #fff;
        z-index: 9;
        padding-left: computed(30);
    }

    .buy-button {
        min-width: computed(230);
        height: computed(108);
        font-size: $font-regular;
        text-align: center;
        background: $color-white;
        div {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            flex-direction: column;
            margin: computed(14) computed(20) 0 computed(10);
            width: computed(200);
            height: computed(80);
            color: $color-white;
            background: $bggradientcolor;
            border-radius: $btn-radius40;
            box-sizing: border-box;
            p {
                width: 100%;
                text-align: center;
            }
            > p:nth-child(2) {
                font-size: computed(20);
                line-height: computed(20);
            }
        }
    }

    .van-checkbox__icon {
        display: block;
        box-sizing: border-box;
        width: computed(30);
        height: computed(30);
        position: relative;
        border: 1px solid #2ba4f3;
        margin-left: computed(30);
        font-size: computed(30);
        line-height: computed(30);
    }

    .van-checkbox {
        display: flex;
        height: computed(100);
        align-items: center;
        i {
            font-size: computed(36);
        }
    }

    .checked::after {
        position: absolute;
        content: "";
        width: computed(16);
        height: computed(16);
        left: 50%;
        top: 50%;
        background: #2ba4f3;
        overflow: hidden;
        transform: translate(-50%, -50%);
    }

    .checkbox-label {
        margin-left: computed(10);
        margin-right: computed(30);
        font-size: $font-num;
        line-height: computed(100);
        color: $text-regular;
    }

    .total {
        .total-price {
            text-align: right;
            font-size: computed(30);
            line-height: computed(30);
            color: $domaincolor;
            font-weight: bold;
            > span:nth-of-type(1) {
                font-size: $font-title1;
                color: $text-primary;
                font-weight: 500;
                margin-right: computed(8);
            }
        }
        .goods-items {
            box-sizing: border-box;
            display: flex;
            width: 100%;
            padding: computed(30);
            margin-top: computed(18);
            background: #ffffff;
            justify-content: center;
            position: relative;
            min-height: computed(246);
        }
        .bg-gray {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: $text-regular;
            opacity: 0.3;
        }
        .select-box {
            position: relative;
            display: flex;
            margin: auto;
            i {
                font-size: computed(36);
            }
        }
        .goods-items .van-checkbox__icon {
            margin-left: 0;
        }
        .goods-info {
            width: 100%;
            margin-left: computed(30);
            position: relative;
        }
        .total-reduce {
            position: relative;
            font-size: $font-small;
            color: $domaincolor;
            margin-top: computed(4);
            width: auto;
            .reduce-help {
                position: relative;
                left: -4rpx;
                font-size: $font-small;
                color: $text-regular;
                padding: computed(10) computed(30) computed(10) computed(10);
            }
        }
    }

    .goods-items {
        box-sizing: border-box;
        display: flex;
        width: 100%;
        padding: computed(30);
        margin-top: computed(18);
        background: #ffffff;
        justify-content: center;
        position: relative;
        min-height: computed(246);
        .unselect {
            width: computed(56);
            height: computed(56);
            fill: currentColor;
            overflow: hidden;
            i {
                color: $color-background !important;
            }
        }
    }

    .bg-gray {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 1);
        opacity: 0.4;
    }

    .select-box {
        flex-shrink: 0;
        position: relative;
        display: flex;
        margin: auto;
        i {
            font-size: computed(36);
        }
        &.bukexuan {
            width: computed(32);
            height: computed(32);
            background: $color-border;
            border: 2 rpx solid $text-placeholder;
            border-radius: computed(18);

        }
    }

    .goods-items .van-checkbox__icon {
        margin-left: 0;
    }

    .goods-cover {
        margin-left: computed(16);
        box-shadow: 0 computed(2) computed(6) 0 rgba(0, 0, 0, 0.1);
        max-height: computed(186);
    }

    .goods-cover img {
        width: computed(186);
        height: computed(186);
        border-radius: computed(5);
        display: block;
    }

    .goods-info {
        width: 100%;
        margin-left: computed(30);
        position: relative;
    }

    .delete-btn {
        position: absolute;
        right: -10rpx;
        top: -10rpx;
        padding: computed(10);
        width: computed(30);
        height: computed(30);
        font-size: computed(30);
        line-height: computed(30);
        color: #999999;
        &.z-index5 {
            z-index: 5 !important;
            > i {
                color: $text-price !important;
            }
        }
    }

    .delete-btn .iconguanbi {
        font-size: computed(30);
        line-height: computed(30);
        color: $text-placeholder;
    }

    .goods-name {
        max-width: computed(380);
        min-height: computed(69);
        font-size: computed(28);
        color: $blackcolor;
        /* 显示1行 */
        /*word-break: keep-all;*/
        /*white-space: nowrap;*/
        /*overflow: hidden;*/
        /*text-overflow: ellipsis;*/

        /* 显示2行 */
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        &.gray {
            color: $text-placeholder !important;
        }
    }

    .goods-stock-tip {
        margin: computed(30) 0 0 computed(30);
        font-size: $font-common;
        line-height: computed(30);
        color: $text-secondary;
        text-align: right;
        &.font-red {
            color: $text-warn;
        }
        &.gray {
            color: #cccccc !important;
        }
    }

    .goods-price {
        display: flex;
        justify-content: space-between;
        margin-top: computed(10);
        .price-box {
            width: 100%;
        }
    }

    .checkInput {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        font-size: computed(36);
        /*z-index: 2;*/
    }

    .sale-price {
        font-size: computed(30);
        line-height: computed(34);
        color: $domaincolor;
        font-weight: bold;
    }

    .old-price {
        margin-top: computed(8);
        font-size: computed(28);
        line-height: computed(30);
        color: #cccccc;
        text-decoration: line-through;
    }

    .count-box {
        float: right;
        bottom: 0;
        right: 0;
    }

    .re-select {
        text-align: center;
        color: $text-regular;
        border: 1 rpx solid $text-regular;
        border-radius: computed(24);
        background-color: $color-white;
        line-height: computed(48);
        height: computed(48);
        width: computed(142);
        font-size: $font-common;
    }

    .count_input {
        position: relative;
        z-index: 1;
        border: 1px solid $text-secondary;
        width: computed(54);
        height: computed(48);
        min-height:computed(48);
        font-size: computed(24);
        line-height: computed(40);
        color: #0d0e09;
        text-align: center;
        float: left;
        /* 解决ios版微信浏览器的边框和阴影*/
        border-radius: 0;
        box-shadow: 0 0 0 rgba(0, 0, 0, 0);
        -webkit-appearance: none;
        &.gray {
            color: $text-placeholder !important;
            border: 1px solid $text-placeholder;
        }
    }

    .count-btn {
        position: relative;
        width: computed(64);
        height: computed(48);
        line-height: computed(43);
        font-size: computed(32);
        text-align: center;
        float: left;
        position: relative;
        margin-right: computed(-2);
        &.gray {
            color: $text-placeholder !important;
        }
    }

    .reduce-btn {
        border-radius: computed(5) 0 0 computed(5);
        border: 1px solid $text-secondary;
        &.gray {
            border: 1px solid $text-placeholder;
        }
    }

    .add-btn {
        border-radius: 0 computed(5) computed(5) 0;
        border: 1px solid $text-secondary;
        margin-left: computed(-2);
        &.gray {
            border: 1px solid $text-placeholder;
        }
    }

    .goods-sku-box {
        display: inline-block;
        margin-top: computed(10);
        color: $text-regular;
        font-size: $font-common;
        .gray {
            color: $text-placeholder;
            border: 1px solid $text-placeholder;
        }
    }

    .goods-type,
    .other-title {
        box-sizing: border-box;
        font-size: computed(32);
        line-height: computed(34);
        color: #0d0e09;
        padding: computed(29) 0;
        position: relative;
    }

    .goods-type.act,
    .other-title.act {
        border-bottom: solid computed(1) #cccccc;
    }

    .goods-type .show-arrow,
    .other-title .show-arrow {
        position: absolute;
        display: block;
        right: computed(0);
        top: computed(31);
        height: computed(28);
        font-size: computed(28);
        line-height: computed(28);
    }

    .goods-type.act .show-arrow,
    .other-title.act .show-arrow {
        transform: rotate(180deg);
    }

    .price-box {
        > div {
            display: inline-block;
        }
    }

    .goods-sku-content h5 {
        font-size: computed(28);
        line-height: computed(30);
        color: #0d0e09;
        font-weight: 600;
    }

    .goods-sku-content {
        font-size: $font-common;
        color: $text-regular;
        background-color: $color-background;
        border-radius: computed(5);
        padding: computed(8) computed(12);
        &.gray {
            color: $text-placeholder;
        }
    }

    .item-list li {
        display: flex;
        margin-top: computed(5);
        justify-content: space-between;
        font-size: computed(28);
        line-height: computed(32);
        color: #0d0e09;
    }

    .sku-item-list li {
        margin-top: computed(5);
        font-size: computed(28);
        line-height: computed(32);
        color: #0d0e09;
        .sku-name {
            padding-top: computed(15);
            padding-bottom: computed(15);
            padding-left: computed(10);
        }
        .sku-box {
            padding-top: computed(15);
            border-top: solid computed(1) #cccccc;
            p {
                line-height: computed(52);
                padding-left: computed(10);
            }
        }
        .show-sku {
            transform: rotate(180deg);
        }
        .sku-act {
            background: #f2f2f2;
        }
    }

    .shopping-cart-empty {
        width: 100%;
        height: computed(338);
        text-align: center;
        background: $color-white;
        div:nth-child(1) {
            padding-top: computed(104);
            line-height: computed(44);
            vertical-align: middle;
            .iconfont {
                vertical-align: top;
                display: inline-block;
                font-size: computed(44);
                color: $text-regular;
                margin-right: computed(16);
            }
            .info {
                vertical-align: top;
                display: inline-block;
                font-size: $font-common;
                color: $text-regular;
            }
        }
        .goHome {
            height: computed(50);
            line-height: computed(50);
            width: computed(132);
            color: $color-red;
            font-size: $font-common;
            border-radius: computed(25);
            border: 1px solid $color-red;
            margin: 0 auto;
            margin-top: computed(32);
        }
    }

    .explain {
        width: computed(500);
        padding: computed(35) computed(30);
        text-align: center;
        border-radius: computed(20);
        overflow: hidden;
        background: $color-white;
        .explain-title {
            color: $text-primary;
            font-size: $font-h2;
            line-height: $font-h2;
            margin-bottom: computed(22);
        }
        .explain-content {
            color: $text-regular;
            font-size: $font-common;
            line-height: computed(32);
            margin-bottom: computed(42);
            text-align: justify;
        }
        .explain-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: computed(18);
            font-size: $font-common;
            .explain-line-left {
                width: 100%;
                color: $text-regular;
                text-align: left;
            }
            .explain-line-right {
                width:computed(172);
                flex-shrink: 0;
                color: $text-primary;
                text-align: right;
            }
            &.explain-lineBottom {
                margin-top: computed(6);
                font-size: $font-regular;
                .explain-line-left {
                    color: $text-primary;
                }
                .explain-line-right {
                    color: $domaincolor;
                }
            }
        }
        .explain-sure {
            font-size: $font-common;
            margin: 0 auto;
            margin-top: computed(42);
            width: computed(180);
            height: computed(50);
            line-height: computed(50);
            border-radius: computed(25);
            background: $color-red;
            color: $color-white;
        }
    }
</style>
<style lang="scss" type="text/scss">
    .shopping-cart {

        .explainWrap {

            .van-popup {
                background: transparent;
            }

        }
    .sku-popup {

        .van-popup {
            top: auto;
            bottom: 0;
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }

        .van-right-enter, .van-right-leave-to {
            -webkit-transform: translate3d(100%, 0, 0);
            transform: translate3d(100%, 0, 0);
        }

    }
    }
</style>
