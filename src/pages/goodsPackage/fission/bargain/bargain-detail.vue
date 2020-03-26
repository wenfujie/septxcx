/*
* createTime：2019/9/24
* author：fujie.wen
* description: 砍价-商品详情
*/
<template>
    <div class="main">
        <wxs module="filter" src="../../../../filter/filterCommon.wxs"></wxs>

        <div class="bargain-cont">
            <!--商品信息 begin-->
            <div class="bargain-cont--good">
                <!--库存不足时 targetTime 为0-->
                <list-item :item="goodInfo"
                           priceDescribe="已砍至："
                           :bargainPrice="progressLeftTitle"
                           hideBtn
                           :showSlot="!isLoadDetail"
                           :isUnstock="isUnstock"
                           :targetTime="(+this.progressLeftTitle<=+this.progressRightTitle)?0:goodInfo._countdownModel"
                           @timeOver="timeOver">
                </list-item>
                <img :src="serverUrl + 'images/goods/fission/' + billStateImg"
                     v-if="billStateImg"
                     class="good-state-img"
                     lazy-load="true">
            </div>
            <!--商品信息 end-->

            <div class="bargain-cont--cut">
                <!--进度条 begin-->
                <div class="step">
                    <progress :rightTitle="'可砍至￥'+filter.Fix2(progressRightTitle)"
                              :percent="progressPercent"
                              :leftTitle="'已砍至￥'+filter.Fix2(progressLeftTitle)"></progress>
                </div>
                <!--进度条 end-->

                <button class="share-btn" open-type="share"
                     v-if="isInitiator && bargainState === 'doing' && !isOrder && !isUnstock && goodInfo.sellFlag === 1">
                    邀请好友砍价
                </button>
                <!--按钮 end-->


                <!--排行榜 begin-->
                <div :class="['rank',{'pdB30': bargainRankList.length <= 5}]">
                    <p class="rank-title">砍价排行榜</p>
                    <rank-list :rankList="bargainRankList" :maxVisibleLength="5"></rank-list>
                    <div class="rank-more"
                         v-if="bargainRankList.length > 5"
                         @click="showRankListDialog = true">查看更多</div>
                </div>
                <!--排行榜 end-->
            </div>

        </div>

        <!--富文本和评价sku选择ui组件 begin-->
        <template v-if="isInitiator">
            <div class="good-describe mgB12">

                <!-- 商品sku选择 begin -->
                <div class="discount-item">
                    <span class="discount-item-title">规格</span>
                    <div class="discount-item-right" @click="handleShowSku">
                        <div class="discount-item-info overflow">
                            <span class="color-black-33"
                                  v-if="colorActiveItem.colorId && sizeActiveItem.sizeId">{{colorActiveItem.colorName}} - {{sizeActiveItem.sizeName}}</span>
                            <span v-else class="color-black-33">查看商品规格（库存有限,请尽快下单支付）</span>
                        </div>
                        <span v-if="true" class="discount-item-vouchers short">
                        <span class="iconfont iconxuanzexiao"></span>
                    </span>
                    </div>
                </div>
                <!-- 商品sku选择 end -->

                <!-- 评价 begin -->
                <div class="discount-item">
                    <span class="discount-item-title">评价</span>
                    <div class="discount-item-right" @click="navigate('/pages/goodsPackage/goods/good-comment?goodsCode=' + goodsCode)" style="border-bottom:none;">
                        <div class="discount-item-info overflow limit-width">
                            <span class="text-regular">({{commentTotal}})</span>
                        </div>
                        <span class="discount-item-vouchers">
                            查看全部<span class="iconfont iconxuanzexiao"></span>
                    </span>
                    </div>
                </div>
                <!-- 评价 end -->
            </div>

            <div>
                <good-rich-text v-if="goodInfo" :richInfo="goodInfo"></good-rich-text>
            </div>
        </template>

        <!--富文本和评价sku选择ui组件 end-->

        <!--商品推荐 begin-->
        <div class="recommend-list" v-else>
            <p class="rank-title">商品推荐</p>
            <!--最多显示两个-->
            <list-item v-for="(item,index) in filterRecommendList"
                       :key="index"
                       :index="index+'doing'"
                       :item="item"
                       priceDescribe="可砍至"
                       :bargainPrice="item.oldPrice - item.brLimit"
                       :imgBorderLength="140"
                       @clickItem="clickItem"
                       hideStock
                       hideBtn></list-item>
            <div class="rank-more" v-if="recommendList.length > 2" @click="moreRecommend">查看更多</div>
        </div>
        <!--商品推荐 end-->

        <div :class="['strut-bottom',{'add-tip-height': isInitiator && footBtnInfo.id === 3 && !footBtnInfo.disabled}]"></div>

        <!--底部 begin-->
        <div class="foot-bar flex-box">
            <div class="foot-bar-left flex-box" v-if="!footBtnInfo.maxWidth">
                <div class="flex-auto navigate flex-center">
                    <div @click="backIndex">
                        <text class="iconfont iconshouye_weixuanzhong"></text>
                        <p>首页</p>
                    </div>
                </div>
                <div class="tip flex-vcenter">
                    <div v-if="bargainState === 'end' && goodInfo.onlineDttBgpartDto && goodInfo.onlineDttBgpartDto.payNo !== 1">
                        <p>未在{{countPayHour}}小时内完成</p>
                        <p>砍价已失效</p>
                    </div>
                    <!--&& !footBtnInfo.disabled-->
                    <div v-if="bargainState === 'discounting' ">
                        <p>距优惠结束</p>
                        <p>{{timeBalanceObj.hour}}：{{timeBalanceObj.minute}}：{{timeBalanceObj.second}}</p>
                    </div>
                </div>
            </div>
            <div :class="['foot-bar-right','flex-auto',
            {'disabled': footBtnInfo.disabled,'mgL30': footBtnInfo.maxWidth}]"
                 @click="footBtnInfo.function">
                {{footBtnInfo.title}}
            </div>
            <p class="buy-tip" v-if="isInitiator && footBtnInfo.id === 3 && !footBtnInfo.disabled">可砍至最低价格，也可以中途价格购买</p>
        </div>
        <!--底部 end-->

        <!--custom-style="height: 50%"-->
        <van-popup :show="showRankListDialog"
                   position="bottom"
                   close-icon-position="top-right">
            <p class="rank-dialog-title">
                砍价排行榜
                <text class="iconfont iconguanbi" @click="showRankListDialog = false"></text>
            </p>
            <div class="rank-dialog-list">
                <rank-list :rankList="bargainRankList"></rank-list>
            </div>
        </van-popup>

        <!-- sku选择 begin -->
        <div v-show="isShowSku" class="ticket-model" catch:touchmove="noop"></div>
        <div v-show="isShowSku" class="ticket-content" catch:touchmove="noop">
            <sku-dialog-comp
                :goodsInfo.sync="goodSkuList"
                :colorActiveIndex.sync="colorActiveIndex"
                :sizeActiveIndex.sync="sizeActiveIndex"
                :num.sync="num"
                :maxNumber.sync="maxNumber"
                :isShowSku.sync="isShowSku"
                :flag="1"
                :fissionType="3"
                :showStockTip="false"
                @onAddCartOrBuy="onAddCartOrBuy"
                @overlimit="overlimit"
                @numBlur="numBlurComp">
            </sku-dialog-comp>
        </div>
        <!-- sku选择 end -->

        <van-toast id="van-toast"/>
    </div>
</template>

<script>
    import ListItem from '@/pages/goodsPackage/fission/bargain/components/ListItem.vue';
    import RankList from '@/pages/goodsPackage/fission/bargain/components/RankList.vue';
    import Progress from '@/pages/goodsPackage/fission/components/Progress.vue';
    import GoodRichText from '@/components/wares/GoodRichText.vue';
    import skuDialogComp from '@/components/wares/sku-dialog.vue';
    import Toast from 'vant-weapp/dist/toast/toast';
    import {Goods, Fission} from "@/api/service";

    export default {
        config: {
            navigationBarTitleText: "商品详情"
        },
        components:{ ListItem, RankList, GoodRichText, Progress, skuDialogComp },
        data() {
            return {
                serverUrl: '',
                company_id: '',
                serverTime: '',// 服务器时间
                bargainState: '',// 砍价状态
                sendVipId: '',// 发起人id
                goodInfo:{},// 商品信息
                recommendList:[],// 推荐列表
                bargainRankList:[],// 排行榜列表
                footArr:[],// 底部按钮状态列表
                goodSkuList:'',// 弹窗sku数据
                showRankListDialog:false,// 是否显示排行榜弹窗
                isShowSku:false,// 是否显示sku弹窗
                isLoadDetail:false,// 详情接口是否加载中
                colorActiveItem: {},
                sizeActiveItem: {},
                colorActiveIndex: -1,
                commentTotal: 0,
                sizeActiveIndex: -1,
                num: 1,
                maxNumber: 1,
            }
        },
        computed:{
            /** 是否下单 **/
            isOrder(){
                if(this.goodInfo.onlineDttBgpartDto &&
                    (this.goodInfo.onlineDttBgpartDto.payNo === 1 || this.goodInfo.onlineDttBgpartDto.payNo === 0)){
                    return true;
                }
                return false;
            },
            /** 计算 未在xx小时内完成 **/
            countPayHour(){
                let hourBalance = 0;
                if(this.goodInfo._payEndTime && this.goodInfo._sendTime) {
                    let payBalance = this.goodInfo._payEndTime - this.goodInfo._sendTime;// 距优惠结束时间差
                    hourBalance = (payBalance/3600000).toFixed(2);
                }
                return hourBalance;
            },
            /** 优惠结束倒计时 时分秒 **/
            timeBalanceObj(){
                let timeBalanceObj = {};
                if(this.bargainState === 'discounting' && this.goodInfo._payEndTime){
                    let timeBalance = this.goodInfo._payEndTime - this.serverTime;// 距优惠结束时间差
                    timeBalanceObj.hour = Math.floor(timeBalance/3600000);
                    timeBalanceObj.minute = Math.floor((timeBalance%3600000)/60000);
                    timeBalanceObj.second = Math.floor((timeBalance%3600000)%60000/1000);

                    // 时分秒为个位数时 为其添加0  如01
                    for(let key in timeBalanceObj) {
                        if((timeBalanceObj[key] + '').length === 1) {
                            timeBalanceObj[key] = '0' + timeBalanceObj[key];
                        }
                    }
                }
                return timeBalanceObj;
            },
            /** 是否已砍 **/
            isBargain(){
                return this.bargainRankList.some(item=>{
                    return this.vipInfoId === item.vipInfoHdId;
                })
            },
            /** 订单状态图 **/
            billStateImg(){
                // 砍价成功图：bargain-success; 砍价失效图：bargain-overdue
                if((this.goodInfo.onlineDttBgpartDto && this.isOrder) || +this.progressLeftTitle <= +this.progressRightTitle) {
                    return 'bargain-success.png';
                }else{
                    if(this.bargainState === 'end') {
                        return 'bargain-overdue.png';
                    }
                }
                return '';
            },
            /** 是否库存不足 **/
            isUnstock(){
                return this.goodInfo.clustNum <= 0?true:false;
            },
            /** 已砍至金额 **/
            progressLeftTitle(){
                if(this.goodInfo.salePrice) {
                    return (this.goodInfo.salePrice - this.bargainedPrice).toFixed(2);
                }
                return '';
            },
            /** 可砍至金额 **/
            progressRightTitle(){
                if(this.goodInfo.salePrice && this.goodInfo.onlineDttBgpartDto){
                    let minPrice = this.goodInfo.salePrice - this.goodInfo.onlineDttBgpartDto.brLimit;
                    return minPrice < 0 ? 0 : minPrice.toFixed(2);
                }
                return '';
            },
            /** 进度条百分比 **/
            progressPercent(){
                if(this.goodInfo.onlineDttBgpartDto) {
                    // 砍价上限 》 商品金额 则用商品金额当做砍价上限
                    let maxBargainPrice = this.goodInfo.onlineDttBgpartDto.brLimit;
                    maxBargainPrice = maxBargainPrice > this.goodInfo.salePrice ? this.goodInfo.salePrice : maxBargainPrice;
                    return this.bargainedPrice / maxBargainPrice * 100;
                }
                return 0;
            },
            /** 已砍了多少钱统计 **/
            bargainedPrice(){
                let countPrice = 0;
                this.bargainRankList.forEach(item=>{
                    countPrice += item.price;
                })
                return countPrice;
            },
            // 底部按钮状态
            footBtnInfo() {
//                return this.footArr[2]
//                this.footArr = [
//                    {id: 1, maxWidth: true, title: '返回首页', function: this.backIndex, disabled: false,},
//                    {id: 2, maxWidth: false, title: '我也想要', function: this.backIndex, disabled: false,},
//                    {id: 3, maxWidth: false, title: '￥666 购买', function: this.backIndex, disabled: false,},
//                    {id: 4, maxWidth: false, title: '出手帮砍', function: this.backIndex, disabled: false,},
//                    {id: 5, maxWidth: false, title: '查看订单', function: this.backIndex, disabled: false,},
//                    {id: 6, maxWidth: false, title: '查看更多商品', function: this.backIndex, disabled: false,},
//                ];
                let btnObj = {};
                if(!this.goodInfo.onlineDttBgpartDto) {
                    return btnObj;
                }

                if(this.isInitiator) {
                    if(this.goodInfo.onlineDttBgpartDto.payNo !== 1 && this.goodInfo.onlineDttBgpartDto.payNo !== 0) {
                        if(this.serverTime < this.goodInfo._payEndTime) {
                            // 购买
                            btnObj = this.footArr[2];
                        }else{
                            // 查看更多商品
                            btnObj = this.footArr[5];
                        }
                    }else{
                        // 查看订单
                        btnObj = this.footArr[4];
                    }
                }else{
                    if(this.isBargain || this.isOrder) {
                        if(this.isUnstock) {
                            // 查看更多商品
                            btnObj = this.footArr[5];
                        }else{
                            // 我也想要
                            btnObj = this.footArr[1];
                        }
                    }else{
                        // 出手帮砍
                        btnObj = this.footArr[3];
                    }
                }

                if(this.isUnstock || this.goodInfo.sellFlag == 0) {
                    if(btnObj.id === 2 || btnObj.id === 3 || btnObj.id === 4) {
                        btnObj.disabled = true;
                    }
                }
                if(this.serverTime > this.goodInfo._endDate) {
                    if(btnObj.id === 2 || btnObj.id === 4) {
                        btnObj.disabled = true;
                    }
                }

                return btnObj;
            },
            // 推荐列表截取前两个
            filterRecommendList() {
                return this.recommendList.slice(0, 2);
            },
            // 是否是当前用户发起
            isInitiator() {
                if(this.sendVipId) {
                    if(this.sendVipId == this.vipInfoId) {
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return true;
                }
            },
        },
        methods: {
            /** 数量步进器 点击不可用的按钮时触发 **/
            overlimit(){
                Toast("每个用户限购1件")
            },
            /** 显示sku弹窗 **/
            handleShowSku(){
                if(this.footBtnInfo.id === 3 && !this.footBtnInfo.disabled) {
                    // 每次点击处理 为了更新价格
                    this.disposeSku();
                    this.isShowSku = true;
                }
            },
            // 设置当前选中颜色、尺码
            _fissionColorAndSizeItem() {
                if (this.sizeActiveIndex >= 0 && this.sizeActiveIndex != null) {
                    for (let i = 0; i < this.goodSkuList.sizeList.length; i++) {
                        let item = this.goodSkuList.sizeList[i]
                        if (i === this.sizeActiveIndex) {
                            this.sizeActiveItem = item
                            break
                        }
                    }
                }
                if (this.colorActiveIndex >= 0 && this.colorActiveIndex != null) {
                    for (let i = 0; i < this.goodSkuList.colorList.length; i++) {
                        let item = this.goodSkuList.colorList[i]
                        if (i === this.colorActiveIndex) {
                            this.colorActiveItem = item
                            break
                        }
                    }
                }
            },
            noop(){},
            /** sku组件方法回调 **/
            onAddCartOrBuy(isCartOrBuy,colorItem, sizeItem) {//1加入购物车, 0立即购买
                this.colorActiveItem = colorItem
                this.sizeActiveItem = sizeItem
                if(colorItem.colorId && sizeItem.sizeId) {
                    // 校验库存下架 不过关return
                    this.checkoutSellStock().then(checkPass=>{
                        if(checkPass) {
                            // 已选sku 下单（报错要提示）
                            this.setSkuid();
                            this.buyNow();
                        }
                    });

                }else{
                    // 组件内已提示
//                    Toast('请选择颜色或尺码')
                }

            },
            /** skuid赋值 **/
            setSkuid() {
                for (let i = 0; i < this.goodInfo.sizeColorMessage.length; i++) {
                    let currentItem = this.goodInfo.sizeColorMessage[i]
                    if ((currentItem.colorCode === this.colorActiveItem.colorCode) &&
                        (currentItem.sizeCode === this.sizeActiveItem.sizeCode)) {
                        this.skuId = currentItem.skuId
                        break
                    }
                }
            },
            /** 生成中间表id **/
            buyNow(){
                let fissionOrderData = {
                    shopId: global.Storage.get("properties").shopId,
                    sourceCode: "D_ORDWEIN",//订单来源编码
                    onlineHdId:this.onlineHdId,//促销id(online_hd的id
                    fpsCode: 'BARGAIN',
                    vipInfoDtFssId: this.goodInfo.onlineDttBgpartDto.vipInfoDtFssId,
                    skuList: [
                        {
                            ordQty:this.num,//促销id(online_hd的id
                            ptiPartDtSkuId:this.skuId,
                            ptiPartHdId:this.goodInfo.ptiPartHdId,//商品id （skuList对象属性）
                            colorId:this.colorActiveItem.colorId,//颜色id
                            sizeId:this.sizeActiveItem.sizeId,//尺码id
                            giftFlag:this.goodInfo.giftFlag,//赠品标识       // 商品skuId
                        }
                    ]
                };
                Fission.saveFissionCartTemp(fissionOrderData).then((res) => {
                    this.isShowSku = false;
                    this.$router.push(`/pages/orderPackage/order/order/order-settlement?orderHdId=${res}&fissionType=3&vipInfoDtFssId=${this.goodInfo.onlineDttBgpartDto.vipInfoDtFssId}`);
                },err=>{
                    if(err.errorMsg){
                        Toast(err.errorMsg)
                    }
                });
            },
            /**
             * 解决苹果手机触点问题
             * @param flag
             */
            numBlurComp(flag) {
                if (flag) {
                    this.fixFlag = true
                    setTimeout(() => {
                        wx.pageScrollTo({
                            scrollTop: 1,
                            duration: 300
                        })
                    }, 50)
                } else {
                    this.fixFlag = false
                }
            },
            /** 底部按钮功能集 **/
            btnFunction(){
                let tip = '';
                // 购买提示 禁用也要提示
                if(this.footBtnInfo.id === 3) {
                    if(this.goodInfo.onlineDttBgpartDto.surpNum <= 0 && this.goodInfo.onlineDttBgpartDto.clustNum > 0) {
                        tip = '有用户下单还未支付，等等再来';
                    }
                    if(this.goodInfo.sellFlag != 1) {
                        tip = '该商品已下架，暂时无法购买';
                    }
                    if(this.isUnstock) {
                        tip = '商品已售罄';
                    }
                    if(tip){
                        Toast(tip);
                        return;
                    }
                }
                let thenEndDate = [2, 3, 4];// 需判定是否在活动内的按钮
                if(thenEndDate.indexOf(this.footBtnInfo.id) !== -1) {
                    if(this.serverTime > this.goodInfo._endDate) {
                        Toast("活动已结束！");
                        return;
                    }
                }

                if(this.footBtnInfo.disabled)return;

                switch (this.footBtnInfo.id) {
                    case 2:// 我也想要
                        let queryUrl = `?goodsCode=${this.goodsCode}&onlineHdId=${this.onlineHdId}&id=${this.id}`;
                        this.$router.push('/pages/goodsPackage/fission/bargain/bargain-detail' + queryUrl);
                        break;
                    case 3:// 购买
                        this.handleShowSku();
                        break;
                    case 4:// 出手帮砍
                        this.helpBargain();
                        break;
                    case 5:// 查看订单
                        this.$router.push("/pages/orderPackage/order/orderDetail/order-detail?billCode=" +
                            this.goodInfo.onlineDttBgpartDto.billCode +
                            "&fissionType=3");
                        break;
                    case 6:// 查看更多商品
                        this.$router.push('/pages/goodsPackage/fission/bargain/bargain-list');
                        break;
                }
            },
            /** 商品推荐 更多 **/
            moreRecommend(){
                this.$router.push('/pages/goodsPackage/fission/bargain/bargain-list');
            },
            /** 帮砍 **/
            helpBargain(){
                let data = {
                    onlineHdId: this.onlineHdId,// 促销id
                    ptiPartHdId: this.goodInfo.ptiPartHdId,// 商品id
                    busContsCode: global.baseConstant.busContsCode,
                    helpedVipInfoHdId: this.sendVipId,// 发起砍价人会员id
                    shopId: global.Storage.get("properties").shopId,
                }
                Fission.helpBargain(data).then(res=>{
                    Toast(`已成功帮砍￥${res}`)
                    this.getBargainDetail();
                    this.getBargainRank();
                })
            },
            /** 返回首页 **/
            backIndex(){
                global.switchTab('/index')
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
            },
            /** 点击按钮 **/
            clickItem(item){
                let queryUrl = `?goodsCode=${item.ptiPartHdCode}&onlineHdId=${item.onlineHdId}&id=${item.id}`;
                this.$router.push('/pages/goodsPackage/fission/bargain/bargain-detail' + queryUrl);
            },
            /** 倒计时结束事件 **/
            timeOver(item,index){
                // 由砍价时限 切换成 优惠时限
                if(this.serverTime >= item._bargainEndTime && this.serverTime <= item._payEndTime) {
                    this.bargainState = 'discounting';
                }
            },
            /** 发起砍价 **/
            sendBargain(){
                let data = {
                    onlineHdId: this.onlineHdId,// 促销id
                    ptiPartHdId: this.goodInfo.ptiPartHdId,// 商品id
                    busContsCode: global.baseConstant.busContsCode,
                    shopId: global.Storage.get("properties").shopId,
                }
                Fission.startBargain(data).then(async res=>{
                    Toast(`哇，给自己砍了￥${res}`)
                    // 延迟解决 即刻获取数据不对问题
                    await this.getBargainDetail(false, true);
                    this.getBargainRank();
                })
            },
            /** 获取推荐列表 **/
            getRecommendList(){
                let data = {
                    shopId: global.Storage.get("properties").shopId,
                    busContsCode: global.baseConstant.busContsCode,
                }
                Fission.bargainRecommendList(data).then(res=> {
                    this.recommendList = res;
                })
            },
            /** 获取砍价排行榜 **/
            getBargainRank(){
                let data = {
                    onlineHdId: this.onlineHdId,// 促销id
                    vipInfoDtFssId: this.vipInfodtfssId,// 促销id
                    ptiPartHdId: this.goodInfo.ptiPartHdId,// 商品id
                }
                Fission.getBargainRank(data).then(res=> {
                    this.bargainRankList = res;
                })
            },
            /** 获取服务器时间 **/
            async getServerDate(){
                return await Fission.getServerDate().then(res=>{
                    this.serverTime = global.c_getDateStamp(res);
                    if(this.serverInterval){
                        clearInterval(this.serverInterval);
                    }
                    this.serverInterval = setInterval(()=>{
                        this.serverTime += 1000;
                    },1000)
                })
            },
            /** 获取评价信息 **/
            getCommentInfo(){
                let data = {
                    goodsCode: this.goodsCode,
                    busContsCode: global.baseConstant.busContsCode,
                    pageSize: 1,
                    pageNum: 1,
                }
                Goods.getGoodsComments(data).then(res=>{
                    this.commentTotal = res.total;
                })
            },
            disposeSku() {
                if (!this.goodInfo.sizeColorMessage || this.goodInfo.sizeColorMessage.length === 0) {
                    return
                }

                let goodSkuList = {}
                goodSkuList.colorList = []
                goodSkuList.sizeList = []
                goodSkuList.colorAndSizeList = []
                goodSkuList.url = this.goodInfo.url
                goodSkuList.salePrice = this.progressLeftTitle
                if (this.goodInfo.sizeColorMessage.length) {
                    this.goodInfo.sizeColorMessage.forEach((item, index) => {
                        let colorObj = {
                            colorCode: item.colorCode,
                            colorId: item.colorId,
                            colorName: item.colorName,
                            urls: item.urls,
                            none: true     // 默认按钮可以点击
                        }
                        goodSkuList.colorList.push(colorObj)

                        let sizeObj = {
                            sizeCode: item.sizeCode,
                            sizeId: item.sizeId,
                            sizeName: item.sizeName,
                            none: true     // 默认按钮可以点击
                        }
                        goodSkuList.sizeList.push(sizeObj)

                        let obj = {
                            colorCode: item.colorCode,
                            colorId: item.colorId,
                            colorName: item.colorName
                        }
                        goodSkuList.colorAndSizeList.push(obj)
                        goodSkuList.colorAndSizeList[index].sizeChildList = []
                    })

                    goodSkuList.colorAndSizeList.forEach((colorAndSizeItem, colorAndSizeIndex) => {

                        this.goodInfo.sizeColorMessage.forEach((item, index) => {
                            let skuQty = item.qty - item.fssNum;
                            if (item.colorCode === colorAndSizeItem.colorCode) {
                                colorAndSizeItem.sizeChildList.push({
                                    sizeCode: item.sizeCode,
                                    sizeName: item.sizeName,
                                    skuId: item.skuId,
                                    skuQty: skuQty > 0 ? 1 : 0,
                                })
                            }

                            if (goodSkuList.colorAndSizeList.length === colorAndSizeIndex+1 &&
                                this.goodInfo.sizeColorMessage.length === index+1) {
                                this.goodSkuList = goodSkuList
                            }
                        })
                    })
                }
            },
            /** 校验库存和上下架 **/
            async checkoutSellStock(){
                let data = {
                    shopId: global.Storage.get("properties").shopId,
                    busContsCode: global.baseConstant.busContsCode,
                    onlineHdId: this.onlineHdId,
                    ptiPartHdId: this.goodInfo.ptiPartHdId,
                }
                return await Fission.checkoutSellStock(data).then(res=>{
                    let tip = '';
                    if(res.sellFlag === 1){
                        // 不存在真实库存
                        if(!res.clustNum) {
                            tip = '已售罄';
                        }else {
                            // 存在真实库存 && 不存在下单库存
                            if(!res.surpNum){
                                tip = '有用户下单还未支付，等等再来';
                            }
                        }
                    }else{
                        tip = '商品已下架，无法购买';
                    }
                    if(tip) {
                        Toast(tip);
                        return false;
                    }
                    return true;
                },err=>{
                    Toast(err.errorMsg)
                    return false;
                })
            },
            /** 砍价详情
             * @paran
             * isInit:是否第一次调用
             * isSendBargain:是发起砍价后调用
             * **/
            async getBargainDetail(isInit, isSendBargain){
                let data = {
                    timeStamp: +new Date(),
                    busContsCode: global.baseConstant.busContsCode,
                    goodsCode: this.goodsCode,
                    dttBgpartId: this.id,// 砍价id
                    onlineHdId: this.onlineHdId,// 线上促销信息id
                    shopId: global.Storage.get("properties").shopId,
                    // 发起人id
                    sendVipInfoHdId: this.sendVipId ? this.sendVipId : this.vipInfoId
                }
                // 由于发起砍价后 最新记录id会变 此处需控制不传获取最新记录信息
                if(this.vipInfodtfssId && !isSendBargain) {
                    data.vipInfodtfssId = this.vipInfodtfssId;
                }
                this.isLoadDetail = true;
                return await Fission.getBargainDetail(data).then(async res=>{
                    let tip = '';
                    res.glbFileUrl = res.url// 图片
                    res.ptiPartHdName = res.goodsName
                    res.clustNum = res.onlineDttBgpartDto.clustNum//库存
                    res.oldPrice = res.salePrice// 原价

                    if(res.onlineDttBgpartDto && res.onlineDttBgpartDto.sendBgpart) {
                        res._sendTime = global.c_getDateStamp(res.onlineDttBgpartDto.sendTime);// 发起砍价时间
                        res._bargainEndTime = res._sendTime + res.onlineDttBgpartDto.times * 3600000;// 砍价截止时间
                        res._payEndTime = res._bargainEndTime + res.onlineDttBgpartDto.payTimes * 60000;// 优惠截止时间
                        res._endDate = global.c_getDateStamp(res.onlineDttBgpartDto.endDate);// 活动结束时间
                    }

                    await this.getServerDate();

                    // 砍价状态bargainState=>  doing:砍价中；discounting：优惠中；end:已结束
                    if(this.serverTime < res._bargainEndTime){
                        this.bargainState = 'doing';
                    }else if(this.serverTime >= res._bargainEndTime && this.serverTime <= res._payEndTime) {
                        this.bargainState = 'discounting';
                    }else if(this.serverTime > res._payEndTime) {
                        this.bargainState = 'end';
                    }

                    this.goodInfo = res;
                    this.vipInfodtfssId = res.onlineDttBgpartDto.vipInfoDtFssId;
                    if(!this.goodInfo.sellFlag) {
                        tip = '商品已下架~';
                    }

                    this.$nextTick(()=>{
                        if(isInit && !this.isInitiator && this.isBargain){// 帮砍过
                            tip = '已帮砍过~';
                        }
                        tip && Toast(tip);
                        // 倒计时组件绑定值
                        this.$set(this.goodInfo,'_countdownModel',
                            !this.goodInfo.sellFlag || this.isUnstock || this.isOrder ? 0 : res._bargainEndTime);
                        this.isLoadDetail = false;
                    })
                },err=>{
                    this.isLoadDetail = false;
                })
            },
            /** 初始化页面 **/
            async initDetail(){
                wx.showShareMenu({
                    withShareTicket: true
                })

                this.vipInfoId = global.Storage.get('USER_INFO').vipInfoId;
                // 底部按钮状态
                this.footArr = [
                    {id: 1, maxWidth: true, title: '返回首页', function: this.backIndex, disabled: false,},
                    {id: 2, maxWidth: false, title: '我也想要', function: this.btnFunction, disabled: false,},
                    {id: 3, maxWidth: false, title: '购买', function: this.btnFunction, disabled: false,},
                    {id: 4, maxWidth: false, title: '出手帮砍', function: this.btnFunction, disabled: false,},
                    {id: 5, maxWidth: false, title: '查看订单', function: this.btnFunction, disabled: false,},
                    {id: 6, maxWidth: false, title: '查看更多商品', function: this.btnFunction, disabled: false,},
                ];

                this.sendVipId = this.$route.query.sendVipId;// 发起人id（空：当前用户即发起人）
                if(!this.sendVipId) {
                    this.sendVipId = this.vipInfoId;// 路径不存在该字段 则默认登录人为发起人
                }
                this.vipInfodtfssId = this.$route.query.vipInfodtfssId;// 砍价记录id（分享时传）
                this.goodsCode = this.$route.query.goodsCode;
                this.onlineHdId = this.$route.query.onlineHdId;
                this.id = this.$route.query.id;
                this.serverUrl = global.baseConstant.serverUrl;
                this.company_id = global.Storage.get('COMPANYID').company_id;

                await this.getBargainDetail(true);
                /****
                 * 1.获取砍价详情接口，并判断是否是当前用户发起 是=> 2； 否 => 3;
                 * 2.是当前用户发起砍价，判断当前用户是否已砍 是 =>切换已砍状态  否=>调用发起砍价接口，在切换成已砍状态
                 * 3.页面切换成帮砍页，点击帮砍按钮调用帮砍接口
                 *
                 */
                // 判断当前用户是否已砍
                if(this.goodInfo.onlineDttBgpartDto && this.goodInfo.onlineDttBgpartDto.sendBgpart) {

                    if(this.isInitiator){
                        // 本人发起
                        this.getCommentInfo();
                    }else {
                        // 帮砍
                        this.getRecommendList();
                    }
                    this.getBargainRank();
                }else{
                    // 发起砍价
                    this.sendBargain();
                    this.getCommentInfo();
                }
            },
        },
        onShow() {
            Object.assign(this.$data, this.$options.data());
            this.initDetail();
        },
        onUnload() {
            Object.assign(this.$data, this.$options.data());
        },
        onShareAppMessage (res) {
            let query = this.$route.query,
                title = `快帮帮我！我想<￥${this.progressRightTitle}元>拿<${this.goodInfo.partName}>`
            if(!query.vipInfodtfssId) {
                query.vipInfodtfssId = this.goodInfo.onlineDttBgpartDto.vipInfoDtFssId;
            }
            if(!query.sendVipId) {
                query.sendVipId = this.sendVipId;
            }

            let shareUrl = global.getShareUrl('pages/goodsPackage/fission/bargain/bargain-detail',query);
            let imageUrl = this.filter.imgFilter(this.goodInfo.glbFileUrl, this.company_id);
            return {
                title: title,
                path: shareUrl,
                imageUrl: imageUrl,
            }
        },
        watch:{
            progressLeftTitle(num) {
                if(this.footArr.length) {
                    this.footArr[2].title = `￥${num} 购买`;
                }
            },
            'colorActiveIndex': function () {
                this._fissionColorAndSizeItem();
            },
            'sizeActiveIndex': function () {
                this._fissionColorAndSizeItem();
            },
        }
    }
</script>

<style scoped lang="scss">
    .mgB12{
        margin-bottom: computed(12);
    }

    .main{
        background: $bg-gray-fission;
        height: 100%;

        .bargain-cont{
            background: $color-white;
            margin-bottom: computed(12);
            .bargain-cont--good{
                box-sizing: border-box;
                position: relative;
                margin: 0 auto;
                width:calc(100% - #{computed(60)});
                border-bottom: computed(1) solid $color-gray-border;
                .good-state-img {
                    width: computed(112);
                    height: computed(112);
                    position: absolute;
                    bottom: computed(55);
                    right:0;
                }
            }
            .bargain-cont--cut{
                box-sizing: border-box;
                padding: computed(30) computed(60);
            }
        }
    }

    .step{
        margin-bottom: computed(30);
    }

    .share-btn {
        background: $bggradientcolor;
        text-align: center;
        color: $color-white;
        font-size: $font-title1;
        line-height: computed(80);
        border-radius: computed(40);
        margin-bottom: computed(30);
        font-weight: bold;
    }

    .rank{
        color: $text-primary;
        font-size: $font-common;
        background: $color-shallow-bg;
    }
    .rank-title {
        font-size: $font-regular;
        line-height: computed(80);
        text-align: center;
    }

    .rank-more{
        text-align: center;
        color: $domaincolor;
        text-decoration: underline;
        font-size: $font-small;
        line-height: computed(66);
    }

    .foot-bar {
        border-top: computed(1) solid $color-gray-border;
        padding: computed(14) 0;
        box-sizing: border-box;
        position: fixed;
        bottom: 0;
        left:0;
        width:100%;
        background: $color-white;
        .foot-bar-left {
            .navigate {
                min-width:computed(150);
                font-size: $font-mini;
            }
            .tip{
                font-size: $font-small;
                color: $domaincolor;
                margin-right: computed(30);
            }
        }
        .foot-bar-right {
            background: $bggradientcolor;
            text-align: center;
            color: $color-white;
            font-size: $font-regular;
            line-height: computed(80);
            border-radius: computed(40);
            font-weight: bold;
            margin-right: computed(30);
            &.disabled{
                background: $text-placeholder;
            }
        }

    }

    .rank-dialog-title {
        position: relative;
        padding: 0 computed(30);
        line-height: computed(88);
        font-size: $font-h2;
        background: $color-border;
        border-bottom: computed(1) solid $text-placeholder;
        text {
            position: absolute;
            right: computed(30);
            top: 0;
            color: $text-placeholder;
        }
    }
    .rank-dialog-list{
        max-height: computed(550);
        overflow: scroll;
    }
    .recommend-list{
        background: $color-white;
        box-sizing: border-box;
        padding: 0 computed(30);
    }
    .strut-bottom{
        width:100%;
        background: $bg-gray-fission;
        padding-bottom: computed(121);
        &.add-tip-height{
            padding-bottom: computed(175);
        }
    }

    /*copy商品详情的规格和评价样式*/
    .discount-item {
        vertical-align: top;
        height: computed(90);
        display: flex;
        .discount-item-title{
            flex-shrink: 0;
            display: inline-block;
            line-height: computed(90);
            width: computed(116);
            font-size: $font-regular;
            color: $text-regular;
            text-align: center;
        }
        .discount-item-right{
            display: flex;
            width: calc(100% - 116rpx);
            justify-content: space-between;

            border-bottom: computed(1) solid $color-gray-border;
            .discount-item-info {
                display: inline-block;
                width: 100%;
                height: computed(90);
                line-height: computed(90);
                box-sizing: border-box;
                color: $color-white !important;
                font-size: $font-regular;
                &.limit-width{
                    width: computed(450);
                }
                .text-regular{
                    color: $text-regular;
                }
                .color-black-33{
                    color:$text-secondary;
                }
            }
            .discount-item-vouchers {
                flex-shrink: 0;
                text-align: right;
                line-height: computed(90);
                width: computed(150);
                font-size: $font-common;
                color: $color-black-33;
                margin-right: computed(34);
                &.short {
                    width: computed(30) !important;
                }
                > span:before {
                    position: relative;
                    top: computed(3);
                }
            }
        }
    }

    .good-describe{
        background: $color-white;
    }
    .buy-tip {
        color: $domaincolor;
        background: $color-shallow-bg;
        line-height: computed(60);
        font-size: computed(22);
        width: 100%;
        text-align: center;
        position: absolute;
        left: 0;
        top:computed(-60);
    }
    .ticket-content {
        width: 100%;
        position: fixed;
        z-index: 102;
        bottom: 0;
        background: white;
    }
    .ticket-model {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.5;
        z-index: 101;
    }
</style>
