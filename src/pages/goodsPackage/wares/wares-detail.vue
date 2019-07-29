/*
* createTime：2019/3/5
* author：junyong.hong
* description: 商品详情页
*/
<template>
    <div class="qs-wares">
        <wxs module="filter" src="../../../filter/filterCommon.wxs"></wxs>
        <div class="qs-wares-main" ref="getTops">
            <!-- 商品详情气泡，已购买的用户列表 -->
            <div class="bubblingWrapper" v-if="showBubbling">
                <div class="bubblingWrap" :style="'top:-'+bubblingIndex*60+'rpx'">
                    <div v-for="(item,index) in bubbling" :key="index">
                        <div class="bubbling" 
                        :style="index==(bubblingIndex+1)?'background: rgba(255, 255, 255, 0.8)':''">
                            <img :src="filter.imgFilter(item.photoFileUrl,company_id)" alt="" lazy-load="true">
                            <span class="overflow">{{item.vipName}}</span><span>已购买</span>
                        </div>
                    </div>
                </div>                
            </div>
            <!-- 商品详情气泡，已购买的用户列表 end -->

            <!-- banner begin -->
            <div class="banner">
                <swiper indicator-dots="true" autoplay="true" interval="3000" v-if="goodsImages.length > 0">
                    <block v-for="(item,index) in goodsImages" :key="index">
                        <swiper-item>
                            <img :src="filter.imgFilter(item,company_id)" :key="item" lazy-load="true">
                        </swiper-item>
                    </block>
                </swiper>

                <img
                    v-else
                    :src="serverUrl+'images/common/septwolves.png'"
                    width="100%"
                    height="100%"
                    lazy-load="true"
                    mode="widthFix"
                >
            </div>
            <!-- banner end-->

            <!-- 商品信息 begin -->
            <div class="wares-detail" ref="detailsTop" id="detailsTop">
                <div class="detail-section detail-section-first">
                    <div class="title">{{goodsInfo.goodsName}}</div>
                    <div class="btn-collect" @click="collectToggle()">
                        <p>
                            <span  :class="['iconfont',goodsInfo.collectionFlag === 1 ? 'iconshoucang_dibu_xuanzhong btn-collected' : 'iconshoucang']"></span>
                        </p>
                        <p>
                            <span>{{goodsInfo.collectionFlag === 1 ? '已收藏' : '收藏'}}</span>
                        </p>
                    </div>
                </div>
                <div class="detail-section price">
                    <span class="price_now">￥{{filter.Fix2(goodsInfo.salePrice)}}</span>
                    <text v-if="goodsInfo.tagPrice > 0" class="price_pristine">￥{{filter.Fix2(goodsInfo.tagPrice)}}</text>
                    <span class="benefit-amount" v-if="!!goodsInfo.benefitAmount">
                        <span class="iconfont iconzhuanduoshao"></span> 赚<span>￥</span>{{goodsInfo.benefitAmount}}
                    </span>
                    <span class="benefit-help iconfont iconzhuanzishuoming" v-if="!!goodsInfo.benefitAmount"></span>
                </div>
            </div>
            <!-- 商品信息 end -->

            <div class="label">
                <div class="label-left iconfont iconshengxingou"></div>
                <div class="label-view">
                    <span class="iconfont iconguanfangzhengpin"></span>官方正品
                </div>
                <div class="label-view">
                    <span class="iconfont iconquanchangbaoyou"></span>全场包邮
                </div>
                <div class="label-view">
                    <span class="iconfont iconshouhouwuyou"></span>售后无忧
                </div>
            </div>

            <!-- 推荐理由 -->
            <div class="shopMerit" v-if="!!goodsInfo.sellPointTitle||!!goodsInfo.sellPointContent">
                <div class="shopMerit-title">{{goodsInfo.sellPointTitle}}</div>
                <div class="shopMerit-content">{{goodsInfo.sellPointContent}}</div>
            </div>

            <!-- 促销 begin -->
            <div class="discount">
                <!-- 现金券、折扣券各一个 -->
                <div  v-if="couponsFirstList.length > 0"  class="discount-item">
                    <span class="discount-item-title">领券</span>
                    <div class="discount-item-right"  @click="vourcherDailog()">
                        <div class="discount-item-info overflow long">
                            <span
                                v-for="(item, index) in couponsFirstList"
                                v-if="index < 2"
                                :key="reIndex(item.couponId)"
                                class="item-vourcher"
                            >{{item.couponName}}</span>
                        </div>
                        <span class="discount-item-vouchers short">   
                            <span class="iconfont iconxuanzexiao"></span>
                        </span>
                    </div>
                </div>

                <!-- 满减 -->
                <div v-if="goodPreferentialList.mjList && goodPreferentialList.mjList.length > 0" class="discount-item">
                    <span class="discount-item-title">满减</span>
                    <div class="discount-item-right">
                        <div class="discount-item-info">
                            <span class="info-item overflow">{{goodPreferentialList.mjList[0].onlineName}}</span>
                        </div>
                    </div>
                </div>

                <!-- 满折 -->
                <div v-if="goodPreferentialList.mzhList && goodPreferentialList.mzhList.length > 0" class="discount-item">
                    <span class="discount-item-title">满折</span>
                    <div class="discount-item-right">
                        <div class="discount-item-info">
                            <span class="info-item overflow">{{goodPreferentialList.mzhList[0].onlineName}}</span>
                        </div>
                    </div>
                </div>

                <!-- 满赠 -->
                <div
                    v-if="goodPreferentialList.mzList && goodPreferentialList.mzList.length > 0"
                    class="discount-item"
                >
                    <span class="discount-item-title">满赠</span>
                    <div class="discount-item-right">
                        <div class="discount-item-info">
                            <span class="info-item overflow">{{goodPreferentialList.mzList[0].onlineName}}</span>
                        </div>
                        <span class="discount-item-vouchers" @click="navigate('/pages/goodsPackage/wares/wares-gift?goodsId=' + goodsId)">   
                            查看赠品<span class="iconfont iconxuanzexiao"></span>
                        </span>
                    </div>
                </div>

                <!-- 商品sku选择 begin -->
                <div class="discount-item">
                    <span class="discount-item-title">规格</span>
                    <div class="discount-item-right" @click="skuDialog();btnStatus = false">
                        <div class="discount-item-info overflow">
                            <span v-if="(colorActiveIndex === null) ||(sizeActiveIndex === null) ||(colorActiveIndex === -1) ||(sizeActiveIndex === -1)" class="color-black-33">请选择颜色尺码</span>
                            <span v-else-if="(colorActiveIndex >= 0) || (sizeActiveIndex >= 0)" class="color-black-33">{{colorActiveItem.colorName}} - {{sizeActiveItem.sizeName}}</span>
                        </div>
                        <span v-if="isSku" class="discount-item-vouchers short">   
                            <span class="iconfont iconxuanzexiao"></span>
                        </span>
                    </div>
                </div>
                <!-- 商品sku选择 end -->
                <div class="discount-item">
                    <span class="discount-item-title">评价</span>
                    <div class="discount-item-right" @click="navigate('/pages/goodsPackage/goods/good-comment?goodsCode=' + goodsCode)" style="border-bottom:none;">
                        <div class="discount-item-info overflow">
                            <span class="text-regular">({{total}})</span>
                        </div>
                        <span class="discount-item-vouchers">   
                            查看全部<span class="iconfont iconxuanzexiao"></span>
                        </span>
                    </div>
                </div>
            </div>
            <!-- 促销 end -->

            <!-- 商品详情 begin -->
            <div class="detail">
                <!-- <p>商品详情</p> -->
                <rich-text v-if="goodsDetail" class="detail-main" :nodes="goodsDetail"></rich-text>
                <div v-else class="detail-main no-detail">暂无商品详情</div>
            </div>
            <!-- 商品详情 end -->

            <!-- 猜你喜欢 -->
            <guess-love></guess-love>
            <!-- 猜你喜欢 end -->
        </div>

        <div :class="[btnStatus ? 'z-index9999' : 'z-index9','qs-wares-btn']">
            <ul>
                <li @click="switchTab('/index')" class="btn-home">
                    <span class="iconfont iconshouye_weixuanzhong"></span>
                    <span class="btn-home-name">首页</span>
                </li>
                <!-- <li @click="beforeSharePoster" class="btn-shopping" v-if="!isClickCanvas">
                    <i class="iconfont iconfenxiang"></i>
                    <span>分享</span>
                </li>
                <li class="btn-shopping" v-else>
                    <i class="iconfont iconfenxiang"></i>
                    <span>分享</span>
                </li> -->
                <li @click="switchTab('/shopping-cart')" class="btn-shopping">
                    <span class="iconfont icongouwuche_weixuanzhong"></span>
                    <span class="btn-home-name">购物车</span>
                    <span v-if="shoppingCartNum > 0" class="btn-home-name num">{{shoppingCartNum}}</span>
                </li>
                <li class="btn-cart btn-bottom">
                    <!-- <p @click="foreAddCart();">加入购物车</p> -->
                    <div @click="skuDialog();">
                        <p class="btn-bottom-name">购买</p>
                        <p v-if="goodsInfo.rebateAmount > 0">省￥{{filter.Fix2(goodsInfo.rebateAmount)}}</p>
                    </div>
                </li>
                <li class="btn-share btn-bottom">
                    <div @click="share">
                        <p class="btn-bottom-name">分享</p>
                        <p v-if="!!goodsInfo.benefitAmount">省￥{{goodsInfo.benefitAmount}}</p>
                    </div>
                </li>
            </ul>
        </div>

        <!--右侧工具栏-->
        <div class="qs-wares-toolbar">
            <!--回到顶部-->
            <div @click="goUp()" class="toTop" v-if="isShow">
                <span class="iconfont iconhuidaodingbu">
                    <p class="top-name">顶部</p>
                </span>
            </div>
            <!--申请分销商-->
            <div
                v-if="(!!vipId && !isVipMdt) || (!!vipId && isVipMdt === '0')"
                @click="navigate('/pages/distributionPackage/spread?vipId=' + vipId + '&ascriptionId=' + ascriptionId + '&taskId=' + taskId)"
                class="apply"
            >
                <p>申请</br>分销商</p>
            </div>
            <!--  v-if="isCollocationShow" -->
            <!--去搭配(暂时关闭，别删)-->
            <!-- <div v-if="isCollocationShow" @click="toCollocation" class="collocation">
                <p>去搭配</p>
            </div> -->
        </div>

        <!-- 领券弹窗 begin -->
        <van-popup :show="isShowVourcher" position="bottom" :overlay="true" close-on-click-overlay="true">
            <div class="vourcher-dialog">
                <p class="title">
                    <span class="span_left">领券</span>
                    <span @click="isShowVourcher = false" class="span_right iconfont iconguanbi"></span>
                </p>
                <div class="body">
                    <voucherList
                        :cardList="coupons"
                        :source="1"
                        @onSelectSuccessDeail="onSelectSuccessDeail"
                    />
                </div>
            </div>
        </van-popup>
        <!-- 领券弹窗 end -->

        <!-- sku选择 begin -->
        <!-- :class="{'absolute' : fixFlag}" -->
        <van-popup :show="isShowSku" position="bottom" :overlay="true" class="sku-popup">
            <sku-dialog-comp
                :goodsInfo.sync="goodSkuList"
                :colorActiveIndex.sync="colorActiveIndex"
                :sizeActiveIndex.sync="sizeActiveIndex"
                :num.sync="num"
                :maxNumber.sync="maxNumber"
                :isShowSku.sync="isShowSku"
                :types.sync="types"
                :flag="1"
                :btnStatus.sync="btnStatus"
                @onAddCartOrBuy="onAddCartOrBuy"
                @numBlur="numBlurComp"
            ></sku-dialog-comp>
        </van-popup>
        <!-- sku选择 end -->

        <div class="showPhone">
            <van-popup :show="showPopup">
                <!-- @collectFunction="collectFunction" -->
                <phone-popup :showPopup.sync="showPopup" :showMessage.sync="showMessage" ></phone-popup>
            </van-popup>
        </div>

        <!-- 赚字说明 -->
        <van-popup :show="shareFlag" class="explain">
            <div class="explain-title"></div>
            <div class="explain-content"></div>
            <div class="explain-sure"></div>
        </van-popup>

        <!-- 点击分享的底部层选择 -->
        <van-popup :show="shareFlag" position="bottom" :overlay="true" class="sharePopup">
            <div class="sharePopup-title">分享</div>
            <div class="sharePopup-line">
                <button open-type="share" @click="shareToFriend">
                    <div class="iconfont iconweixin"></div>
                    <div>发送给朋友</div>
                </button>
                <button  @click="beforeSharePoster">
                    <div class="iconfont iconshengchenghaibao share-poster-color"></div>
                    <div>生成海报</div>
                </button>
            </div>
            <div class="sharePopup-bottom" @click="shareFlag=false;">取消</div>
        </van-popup>

        <canvas class="cavans" canvas-id="mycanvas"
            :style="'width:'+(canvasWidth*canvasMultiple)+'px;height:'+(canvasHeight*canvasMultiple)+'px;position:fixed;z-index:-100;left:100%;top:200%'"></canvas>
        <!-- 海报 -->
        <van-popup :show="showPoster" class="poster-box">
            <div class="poster-content">
                <div class="close-poster-btn" @click="showPoster = false;isClickCanvas=false"></div>
                <img class="poster-cover" v-if="saveImgUrl" :src="saveImgUrl" ref="saveImgUrl" mode="widthFix">
                <div class="save-box">
                    <button class="save-btn" @click="saveImg" v-if="isAuthorityDown"></button>
                    <button class="save-btn" open-type="openSetting" @opensetting="getOpensettingInfo" @click="clickOpensettingInfo" v-else></button>
                    <!-- <p class="save-tip">长按图片保存到相册</p> -->
                </div>
            </div>
        </van-popup>

        <van-toast id="van-toast"/>
        <van-dialog id="van-dialog" />
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import {Goods, ShoppingCart, Order, Collection, UserService, Cms, Distribution, Base} from "../../../api/service";
    import skuDialogComp from '@/components/wares/sku-dialog.vue'
    import guessLove from '@/components/GuessLove.vue'
    // ./components/sku-dialog.vue
    import phonePopup from '@/components/popup-phone'
    import voucherList from '@/components/voucherList';
    // ../vouchers/components/voucherList
    import Toast from 'vant-weapp/dist/toast/toast';
    import Dialog from 'vant-weapp/dist/dialog/dialog';
    // import FooterBar from '@/components/FooterBar'

    export default {
        config: {
            navigationBarTitleText: '商品详情',
            enablePullDownRefresh: false,
        },
        components: {
            skuDialogComp,
            voucherList,
            phonePopup,
            guessLove,
            // 'footer-bar': FooterBar
        },
        data() {
            return {
                bannerSwiperOption: {                   // banner
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,    // 滑动不会失效
                    }, // 自动播放
                    pagination: {
                        el: '.swiper-pagination'
                    },                                  // 轮播图下的圆点提示
                    loop: true                          // 循环播放
                },
                goodsImages: [],                        // 商品轮播图
                marqueesSwiperOption: {                 // 跑马灯
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,    // 滑动不会失效
                    },                                  // 自动播放
                    loop: true                          // 循环播放
                },
                goodsMarquees: [],
                slidesSwiperOption: {
                    slidesPerView: 3,           // 每页显示3条数据
                    spaceBetween: 42,           // 每个tab之间的空隙
                    slidesOffsetAfter: 30,    // 设定slide与右边框的预设偏移量（单位px）
                    pagination: {
                        clickable: true,
                    },
                },  // slides
                isShowVourcher: false,      // 领券弹窗
                coupons: [],                // 优惠券列表
                couponsFirstList: [],       // 现金券、折扣券优惠力度最大
                promotion: {},              // 赠品信息
                promotionList: [],          // 赠品信息汇总(仅用于展示列表)
                goodPreferentialList: {},   // 满减、满折、赠品
                isShowSku: false,           // sku弹窗
                isSku: true,                // 商品尺码 跟 颜色只有一款（默认多款）
                colorActiveItem: '',
                colorActiveIndex: null,
                sizeActiveItem: '',
                sizeActiveIndex: null,
                num: 1,
                goodsInfo: {},              // 商品详情
                goodsDetail: '',
                goodsCode: '',
                goodsId: '',
                userInfo: {},
                comments: [],               // 评论列表
                total: 0,                   // 评论总数
                btnLock: false,             // 按钮锁
                shoppingCartCount: 0,       // 购物车总数量
                stuckList: [],              // 库存列表
                skuId: "",                  // 选中sku的值
                btnStatus: true,            // 默认显示有加入购物车、立即购买按钮
                // isCartOrBuy: true,          // true点击加入购物车 false点击立即购买
                btnReturn: false,
                vipId: '',                  // 上级会员id
                ascriptionId: '',           // 渠道id
                taskId: '',                 // 任务id
                isVipMdt: '',               // 是否是分销商，1为是
                goodSkuList: '',            // 弹窗sku数据
                sellFlag: 1,                // 商品上下价，默认上架
                isLoading: true,            // 请求状态（默认置为true，在库存请求完成之后置为false，防止在商品加载过程中用户进行商品sku选择时数据异步加载导致信息不全）
                shareFlag: false,           //点击分享后的底部弹框是否显示
                types: false, //判断是否从加入购物车进入
                showPopup: false,//显示手机弹窗
                isCollocationShow: false,
                // upshow: false,
                isShow: false,//判断是否显示回到顶部按钮
                entrance: false,//判断入口是否是选择商品详情，true为是
                maxNumber: 0,//最大数量
                fixFlag: false,
                companyCode: '', //公司编码
                showMessage: '',//显示绑定手机号是否成功信息
                touch: 0,//点击收藏 toucj为1  加入购物车touch 2 立即购买touch 3
                serverUrl: "",
                company_id: "",
                qrcodeImg: '',  // 商品小程序二维码
                saveImgUrl: '',
                showPoster: false,
                btnUserInfoBtn: false,
                canvasWidth: 231,
                canvasHeight: 362,
                canvasMultiple: 5,//用来控制画布像素
                isAuthorityDown: false,  //是否有下载文件的权限,false为拒绝
                isCanvasComplete: false,//海报是否生成
                isClickCanvas: false,//是否点击了生成海报
                refresh_no: false,   //用于限制从有些页面回来不刷新页面，是的话不重新请求接口
                posterGoodsCover:'',//商品主图地址
                bubbling:['泽','小米','小红','小hei','小m','小k','小红'],   //气泡数据
                bubblingIndex:0,     //当前气泡所在位置
                bubblingInterval:'',   //气泡定时器
                showBubbling:false,    //是否显示气泡区域
            }
        },
        onShow() {
            //从授权页面回来的话,不重新请求接口
            if (this.refresh_no) {
                this.refresh_no = false
                return
            }
            this.company_id = global.Storage.get('COMPANYID').company_id
            this.serverUrl = global.baseConstant.serverUrl;
            this._initData()
            if (!!this.$route.query.vipId) {
                this.bind()
            }
        },
        onHide(){
            if (this.refresh_no){
                return
            }
            clearInterval(this.interval)
            clearInterval(this.bubblingInterval)
            Object.assign(this.$data, this.$options.data())
        },
        onUnload() {
            clearInterval(this.interval)
            clearInterval(this.bubblingInterval)
            Object.assign(this.$data, this.$options.data())
        },
        onShareAppMessage: function (res) {
            let root=this;
            let imageurl = root.filter.imgFilter(root.posterGoodsCover, root.company_id) || "";
            let shareUrl=global.getShareUrl('pages/goodsPackage/wares/wares-detail',root.$route.query);
            return {
                title: root.goodsInfo.goodsName,
                path: shareUrl,
                imageUrl:imageurl
            }
        },
        onPageScroll: function (option) {
            let query = wx.createSelectorQuery()
            query.select('#detailsTop').boundingClientRect((rect) => {
                var top = rect.top
                if (option.scrollTop) {
                    option.scrollTop > top ? (this.isShow = true) : (this.isShow = false);
                }
            }).exec()
        },
        computed: {
            ...mapState('user', ['shoppingCartNum'])
        },
        methods: {

            // 回到顶部
            goUp() {
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                })
                this.isShow = false;
            },

            /**
             * 初始化获取参数
             */
            async _initData() {
                let query = this.$route.query
                this.goodsCode = query.goodsCode

                // 分销商
                this.vipId = query.vipId || ''                    // 上级会员id
                this.ascriptionId = query.ascriptionId || ''      // 渠道id
                this.taskId = query.taskId || ''                  // 任务id

                this.checkIsVipMt()
                this.getGoodSellState()
                await this.getGoodsDetail()

                this.getUserInfo()
                this.getGoodsPromotion()
                this.getGoodPreferential()
                this.getGoodsComments()
                this.getCartCount()
                this.getCompanyCode()
                this.getBubbling();
            },
            
            //获取气泡信息，购买人列表
            getBubbling(){
                let data={
                    num:100
                }
                // UserService.getGoodsClient(data).then((res)=>{
                //     this.bubbling=res;
                //     this.showBubbling=true; //显示气泡区域
                //     this.bubblingIndex=0;
                //     let vipInfoId=global.Storage.get('USER_INFO').vipInfoId
                //     //删除自己购买的记录
                //     for(let i=0;i<this.bubbling.length;i++){
                //         if(this.bubbling[i].id==vipInfoId){
                //             this.bubbling.splice(i,1)
                //             break;
                //         }
                //     }
                //     this.bubblingInterval=setInterval((res)=>{
                //         if(this.bubblingIndex<this.bubbling.length){
                //             this.bubblingIndex=this.bubblingIndex+1;  
                //         }else{
                //             this.showBubbling=false;  //隐藏气泡
                //             clearInterval(this.bubblingInterval)
                //         }
                //     },3000)
                // })
            },

            // 获取用户信息
            getUserInfo() {
                if (this.btnUserInfoBtn) {
                    return
                }
                this.btnUserInfoBtn = true
                global.toastLoading();
                let data = {};
                UserService.getUserInfo(data).then((res) => {
                    Toast.clear()
                    this.userInfo = res;
                    this.btnUserInfoBtn = false
                }, (err) => {
                    this.btnUserInfoBtn = false
                });
            },
            /**
             * 点击分享
             */
            share() {
                //判断是否是分销商
                if(this.isVipMdt==1){
                    this.shareFlag = true
                }else{
                    Dialog.confirm({
                        message: '成为合伙人可赚钱',
                        confirmButtonText:'成为合伙人',
                        cancelButtonText:'继续分享',
                    }).then(() => {
                        let url = `/pages/distributionPackage/spread?vipId=${
                            !!this.vipId ? this.vipId : ""
                        }&taskId=${!!this.taskId ? this.taskId : ""}&ascriptionId=${
                            !!this.$route.ascriptionId ? this.$route.ascriptionId : ""
                        }`;
                        this.$router.push(url);
                    }).catch(() => {
                        this.shareFlag = true
                    });
                }
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
            switchTab(url) {
                if (!url) {
                    Toast('敬请期待~')
                    return
                }
                global.switchTab(url)
            },

            /**
             * 领券弹窗
             */
            vourcherDailog() {
                this.btnStatus = false
                this.isShowVourcher = !this.isShowVourcher
            },
            //  绑定上下级
            bind() {
                let data = {
                    upVipId: this.$route.query.vipId,
                    unVipId: global.Storage.get('USER_INFO').vipInfoId,
                    ascriptionId: !!this.$route.query.ascriptionId ? this.$route.query.ascriptionId : null,
                    busconsCode: global.baseConstant.busContsCode
                }
                Distribution.bindLevel(data).then((res) => {
                }).then(() => {
                    // this.$router.push('/index')
                })
            },
            /**
             * 领券成功，回调
             */
            onSelectSuccessDeail() {
                this.getGoodsPromotion()
            },

            /**
             * sku选择弹窗
             */
            skuDialog() {
                // this.entrance = true;
                if (this.isLoading) {
                    return
                }
                if (this.sellFlag !== 1) {
                    Toast('该商品已下架')
                    return
                }
                // 颜色跟尺码只有一款
                // if (!this.isSku) {
                //     return
                // }
                // 如果已经存在sku，不再重新组装数据
                if (!this.goodSkuList) {
                    let goodSkuList = {}
                    goodSkuList.colorList = []
                    goodSkuList.sizeList = []
                    goodSkuList.colorAndSizeList = []
                    goodSkuList.url = this.goodsInfo.url
                    goodSkuList.salePrice = this.goodsInfo.salePrice

                    // 颜色
                    this.goodsInfo.colorsVoList.forEach((item, index) => {
                        let obj = {}
                        obj.colorCode = item.colorCode
                        obj.colorId = item.colorId
                        obj.colorName = item.colorName
                        obj.urls = item.urls
                        obj.none = true     // 默认按钮可以点击
                        goodSkuList.colorList.push(obj)
                    })

                    // 尺码
                    this.goodsInfo.sizesVoList.forEach((item, index) => {
                        let obj = {}
                        obj.sizeCode = item.sizeCode
                        obj.sizeId = item.sizeId
                        obj.sizeName = item.sizeName
                        obj.none = true     // 默认按钮可以点击
                        goodSkuList.sizeList.push(obj)
                    })

                    // 颜色下存放对应尺码（防止数据污染）
                    this.goodsInfo.colorsVoList.forEach((item, index) => {
                        let obj = {}
                        obj.colorCode = item.colorCode
                        obj.colorId = item.colorId
                        obj.colorName = item.colorName
                        goodSkuList.colorAndSizeList.push(obj)
                        goodSkuList.colorAndSizeList[index].sizeChildList = []
                    })
                    if (this.stuckList.length > 0) {
                        this.stuckList.forEach((item, index) => {
                            goodSkuList.colorAndSizeList.forEach((itm, itmIndex) => {
                                if (item.colorCode === itm.colorCode) {
                                    let obj = {}
                                    obj.sizeCode = item.sizeCode
                                    obj.sizeName = item.sizeName
                                    obj.skuId = item.skuId
                                    obj.skuQty = item.skuQty
                                    goodSkuList.colorAndSizeList[itmIndex].sizeChildList.push(obj)
                                }
                            })
                        })
                        this.goodSkuList = goodSkuList
                    } else {
                        Toast('出错了，请重试~')
                        return
                    }
                }

                this.isShowSku = !this.isShowSku
            },

            /**
             * 判断商品上下架
             */
            getGoodSellState() {
                let data = {
                    buscontsCode: global.baseConstant.busContsCode,
                    partGoodsCodeList: this.goodsCode
                }
                Goods.getGoodSellState(data).then((res) => {
                    this.sellFlag = res.partGoodsList[0].sellFlag
                    if (this.sellFlag !== 1) {

                        // 赠品已下架
                        if (this.$route.query.isGift) {
                            let queryParam = {
                                type: 3
                            }
                            this.$router.replace({
                                path: '/pages/goodsPackage/goods/defaults-four',
                                query: queryParam
                            })

                            return
                        }

                        Toast('该商品已下架')
                    }
                })
            },

            // 获取商品详情信息
            async getGoodsDetail() {
                let root = this;
                this.isLoading = true
                let data = {
                    usrId: global.Storage.get('USER_INFO') ? global.Storage.get('USER_INFO').usrId : 0,  // 用户未登录传0
                    busContsCode: !!global.baseConstant.busContsCode ? global.baseConstant.busContsCode : global.Storage.get('properties').busContsCode,
                    goodsCode: this.goodsCode || this.$route.query.goodsCode,
                    shopId: global.Storage.get('USER_INFO').shopId,
                }
                global.toastLoading();
                await Goods.getGoodsInfo(data).then((res) => {
                    Toast.clear()
                    if (res.descriptions) {
                        let newImg = res.descriptions.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (img, src) {
                            let index = src.indexOf('=') + 1
                            let imgData = root.filter.imgFilter(src.substring(index, img.length), root.company_id)
                            return '<img src="' + imgData + '" style="width: 100% !important; display: block; margin: 0;">'
                        })
                        let newPre = newImg.replace(/\<pre\>/gi, function () {
                            return '<div style="word-wrap: break-word;white-space:pre-wrap;">'
                        })

                        newPre = newPre.replace(/\<\/pre\>/gi, function () {
                            return '</div>'
                        })
                        newPre = newPre.replace(/\<blockquote\>/gi, function () {
                            return '<div>'
                        })
                        newPre = newPre.replace(/\<\/blockquote\>/gi, function () {
                            return '</div>'
                        })

                        let newP = newPre.replace(/\<p\>/gi, function () {
                            return '<p style="word-wrap: break-word;white-space:pre-wrap;">'
                        })
                        this.goodsDetail = newP

                    }
                    this.goodsInfo = res;
                    if (this.goodsInfo.goodsName && this.goodsInfo.goodsName.length > 14) {
                        this.goodsName = this.goodsInfo.goodsName.slice(0, 14);
                        this.goodsName = this.goodsName + '...'
                    }
                    this.posterGoodsCover = res.url;
                    this.goodsId = res.ptiPartHdId;
                    let colorList = res.colorsVoList;
                    let sizesList = res.sizesVoList;

                    // 获取颜色列表（banner）
                    let goodsImages = []
                    if (colorList.length > 0) {
                        this.goodsImages = []
                        colorList.forEach((item) => {
                            if (!!item.urls && !!item.urls.length && item.urls.length > 0) {
                                item.urls.forEach((image, imageIndex) => {
                                    goodsImages.push(image)
                                })
                            }
                        });
                    }

                    // 如果没有颜色图，取主图
                    if (goodsImages.length === 0 && res.url) {
                        goodsImages.push(res.url)
                    }

                    if (goodsImages.length >= 6) {
                        goodsImages.splice(6)
                    }

                    // 一张图片不轮播、不显示圆点
                    if (goodsImages.length === 1) {
                        this.bannerSwiperOption.loop = false
                        this.bannerSwiperOption.pagination.el = ''
                    }

                    this.goodsImages = goodsImages

                    // 尺码跟颜色只有一款，不需要选择
                    if (colorList.length === 1 && sizesList.length === 1) {
                        this.isSku = false;
                        this.colorActiveIndex = 0
                        this.sizeActiveIndex = 0
                        this.colorActiveItem = colorList[0];
                        this.sizeActiveItem = sizesList[0];
                    }
                    this.getGoodsStucks()
                })
            },

            // 获取商品优惠促销
            getGoodsPromotion() {
                this.coupons = []
                this.promotion = {}
                this.couponsFirstList = []

                let data = {
                    ptiPartHdId: this.goodsId,
                    busContsCode: !!global.baseConstant.busContsCode ? global.baseConstant.busContsCode : global.Storage.get('properties').busContsCode,
                    shopId: global.Storage.get('properties').shopId,
                }
                Goods.getGoodsPromotion(data).then((res) => {
                    if (res.couponsCards.length > 0) {
                        // 重组优惠券字段
                        res.couponsCards.forEach((item, index) => {
                            if (item.cardTypeCode === 'D_CASHVOLUME') {         // 现金券
                                item.valueCardHdId = ''
                                item.couponEndTime = item.effEndDate            // 失效时间
                                item.couponValue = item.initialValue            // 金额
                                item.couponMemo = item.projectRmk               // 说明
                                item.isBuy = 0
                                item.buyPrice = null
                            }
                            if (item.cardTypeCode === 'D_DISCOUNTCOUPONS') {    // 折扣券
                                item.valueCardHdId = ''
                                item.couponEndTime = item.effEndDate            // 失效时间
                                item.couponValue = item.discount * 10           // 优惠券名称
                                item.couponMemo = item.projectRmk               // 说明
                                item.isBuy = 0
                                item.buyPrice = null
                            }
                        })

                        // 现金券、折扣券优惠力度最大
                        for (let i = 0; i < res.couponsCards.length; i++) {
                            if (res.couponsCards[i].cardTypeCode === 'D_CASHVOLUME') {         // 现金券
                                this.couponsFirstList.push(res.couponsCards[i])
                                break
                            }
                        }
                        for (let i = 0; i < res.couponsCards.length; i++) {
                            if (res.couponsCards[i].cardTypeCode === 'D_DISCOUNTCOUPONS') {    // 折扣券
                                this.couponsFirstList.push(res.couponsCards[i])
                                break
                            }
                        }
                    }

                    this.coupons = res.couponsCards
                    this.promotion = res.giftVos
                    if (res.giftVos.length > 0) {
                        this.promotionList = []
                        res.giftVos.forEach((item) => {
                            if (!!item.giftGoodsDtos.length && item.giftGoodsDtos.length > 0) {
                                this.promotionList.push.apply(this.promotionList, item.giftGoodsDtos)
                            }
                        })
                    }
                })
            },

            // 满减、满折、赠品
            getGoodPreferential() {
                let data = {
                    partId: this.goodsId,
                    dptId: global.Storage.get('properties').shopId,
                }
                Goods.getGoodPreferential(data).then((res) => {
                    this.goodPreferentialList = res
                })
            },

            // 获取销售量、虚拟销售量、收藏量
            getGoodsCount() {
                this.goodsMarquees = []
                let data = {
                    ptiPartHdId: this.goodsId
                }
                Goods.getGoodsCount(data).then((res) => {
                    //                    saleNum: 真实销售量  ficNum: 虚拟销售量  collectNum: 收藏量
                    this.goodsMarquees.push({name: '该商品已成交' + (res.saleNum + res.ficNum) + '件'})
                    this.goodsMarquees.push({name: '该商品收藏过' + res.collectNum + '件'})
                })
            },

            // 查询商品评价
            getGoodsComments() {
                let commentData = {
                    goodsCode: this.goodsCode,
                    pageNum: 1,
                    pageSize: 2,
                    busContsCode: global.baseConstant.busContsCode
                };
                Goods.getGoodsComments(commentData).then((res) => {
                    this.total = res.total

                    if (res.list && res.list.length > 0) {
                        res.list.forEach((item) => {
                            this.comments.push(item)
                        })
                    }
                }).then(() => {
                });
            },

            // 推荐商品跳转详情
            goDetail(item) {
                if (item.orderFlag === 0) {
                    let queryData = {
                        goodsCode: item.goodsCode
                    }
                    this.$router.replace({path: '/pages/goodsPackage/wares/wares-detail', query: queryData})
                    // window.location.reload()
                    //                    this._initData()
                }
            },

            /**
             * 判断是否有选择商品sku
             */
            isSelectColorAndSize(isCloseDialog = true) {
                let flag = true

                if (!this.colorActiveItem || !this.sizeActiveItem) {
                    flag = false

                    if (isCloseDialog) {
                        this.skuDialog()
                    }
                }
                return flag
            },

            // 收藏/取消收藏点击事件
            collectToggle() {
                if (this.btnUserInfoBtn) {
                    return
                }
                // touch判断从哪里点击，1为收藏入口
                this.touch = 1;
                if (this.isLoading) {
                    return
                }
                if (this.userInfo.mobilePhone === null || !this.userInfo.mobilePhone) {
                    this.showPopup = true;
                    return
                }
                this.collectFunction();

            },
            // 收藏/取消收藏
            collectFunction() {
                if (this.goodsInfo.collectionFlag === 1) {
                    //  取消收藏
                    let data = {
                        goodCodeStr: this.goodsCode,
                        ids: this.goodsInfo.rtlCollectionDtId
                    };
                    Collection.deleteCollection(data).then((res) => {
                        wx.nextTick(() => {
                            Toast("已取消收藏~");
                            this.getGoodsDetail()
                            this.isLoading = false
                        });
                    });
                } else {
                    //  收藏
                    let data = {
                        busContsCode: global.baseConstant.busContsCode,
                        goodsCode: this.goodsCode,
                        shopId: global.Storage.get("properties").shopId
                    };
                    Collection.addCollection(data).then((res) => {
                        if (res === 1) {
                            wx.nextTick(() => {
                                Toast("收藏成功~");
                                this.getGoodsDetail()
                                this.isLoading = false
                            });
                        }
                    });
                }
            },

            // 获取购物车数量
            getCartCount() {
                this.$store.dispatch('user/getShoppingCart')
            },

            // 查询商品库存
            getGoodsStucks() {
                let data = {
                    busContsCode: global.baseConstant.busContsCode,
                    goodsCode: this.goodsCode,
                    shopCode: global.Storage.get("USER_INFO").shopCode
                };
                Goods.getGoodsStock(data).then((res) => {
                    this.maxNumber = res.goodsQty
                    this.stuckList = res.skuList;
                    this.isLoading = false
                    this.getQrcode()
                }, () => {
                    this.isLoading = false
                });
            },

            /**
             * 确定加入购物车
             */
            addCart() {
                // 判断入口，touch2为加入购物车入口
                this.touch = 2;
                // 按钮锁
                if (this.btnLock === true) {
                    return
                }
                this.btnLock = true

                // 判断是否有选择sku
                let selectFlag = this.isSelectColorAndSize()
                if (!selectFlag) {
                    this.btnLock = false;
                    return
                }
                if (this.userInfo.mobilePhone === null || !this.userInfo.mobilePhone) {
                    this.btnLock = false;
                    this.showPopup = true;
                    this.isShowSku = false;
                } else {
                    this.addCartFunction();
                }
            },
            // 加入购车接口
            addCartFunction() {

                //  获取sku的code值
                for (let i = 0; i < this.stuckList.length; i++) {
                    if (
                        this.stuckList[i].sizeCode === this.sizeActiveItem.sizeCode &&
                        this.stuckList[i].colorCode === this.colorActiveItem.colorCode
                    ) {
                        this.skuId = this.stuckList[i].skuId;
                    }
                }

                // 检验商品库存、上下架
                let goodListObj = {
                    shopId: global.Storage.get("USER_INFO").shopId,
                    usrId: global.Storage.get("USER_INFO").usrId,
                    goodList: [{
                        busContsCode: global.baseConstant.busContsCode,
                        goodsCode: this.goodsCode,
                        ptiPartHdId: this.goodsId,
                        ptiPartDtSkuId: this.skuId,
                        amount: this.num,
                        orderFlag: this.goodsInfo.ordFlag
                    }]
                }
                Goods.getUseableGood(goodListObj).then((res) => {
                    if (res.sellAll !== 1) {        // 商品已下架
                        let unSellList = ''
                        let len = res.unSellList.length
                        for (let i = 0; i < len; i++) {
                            unSellList += res.unSellList[i].goodsName + '、'
                        }
                        Toast(unSellList.substring(0, unSellList.lastIndexOf('、')) + ' 已下架！')

                        this.btnLock = false
                        return
                    }
                    if (res.stockAll !== 1) {       // 商品库存不足
                        let unStockList = ''
                        let len = res.unStockList.length
                        for (let i = 0; i < len; i++) {
                            unStockList += res.unStockList[i].ptiPartHdName + '、'
                        }
                        Toast(unStockList.substring(0, unStockList.lastIndexOf('、')) + ' 库存不足！')

                        this.btnLock = false
                        return
                    }

                    // 加入购物车
                    let cartData = {
                        amount: this.num,
                        busContsCode: global.baseConstant.busContsCode,
                        cookieId: global.Storage.get("USER_INFO").cookieId,
                        ctmUsrId: global.Storage.get("USER_INFO").ctmUsrId,
                        dptId: global.Storage.get("USER_INFO").shopId,
                        goodsCode: this.goodsCode,
                        partDtSkuId: this.skuId,
                        newPartDtSkuId: this.skuId,
                        flag: 0 // 从商品添加进购物车
                    };
                    ShoppingCart.saveCart(cartData).then(
                        (res) => {
                            this.isShowSku = false
                            setTimeout(()=>{
                                this.btnLock = false;
                            },500)

                            Toast("加入购物车成功~")
                            this.$store.dispatch('user/updateShoppingCart')
                        },
                        (err) => {
                            this.btnLock = false;
                        }
                    );

                },()=>{
                    this.btnLock = false;
                })

            },

            /**
             * 确定立即购买
             */
            buyNow() {
                // 判断入口，touch3为立即购买入口
                this.touch = 3;
                // 按钮锁
                if (this.btnLock === true) {
                    return
                }
                this.btnLock = true

                let selectFlag = this.isSelectColorAndSize(false)
                if (!selectFlag) {
                    this.btnLock = false;
                    Toast('请选择商品~')
                    return
                }
                if (this.userInfo.mobilePhone === null || !this.userInfo.mobilePhone) {
                    this.btnLock = false;
                    this.showPopup = true;
                    this.isShowSku = false;
                }
                else {
                    this.buyNowFunction();
                }
            },
            // 确定立即购买接口
            buyNowFunction() {
                //  获取sku的code值
                for (let i = 0; i < this.stuckList.length; i++) {
                    if (
                        this.stuckList[i].sizeCode === this.sizeActiveItem.sizeCode &&
                        this.stuckList[i].colorCode === this.colorActiveItem.colorCode
                    ) {
                        this.skuId = this.stuckList[i].skuId;
                    }
                }

                // 检验商品库存、上下架
                let goodListObj = {
                    shopId: global.Storage.get("USER_INFO").shopId,
                    usrId: global.Storage.get("USER_INFO").usrId,
                    goodList: [{
                        busContsCode: global.baseConstant.busContsCode,
                        goodsCode: this.goodsCode,          // 商品编码
                        ptiPartHdId: this.goodsId,          // 商品id
                        ptiPartDtSkuId: this.skuId,         // 商品skuId
                        amount: this.num,                   // 数量
                        orderFlag: this.goodsInfo.ordFlag   // 0为大货 1为定制
                    }]
                }
                Goods.getUseableGood(goodListObj).then((res) => {
                    if (res.sellAll !== 1) {        // 商品已下架
                        let unSellList = ''
                        let len = res.unSellList.length
                        for (let i = 0; i < len; i++) {
                            unSellList += res.unSellList[i].goodsName + '、'
                        }
                        Toast(unSellList.substring(0, unSellList.lastIndexOf('、')) + ' 已下架！')

                        this.btnLock = false
                        return
                    }
                    if (res.stockAll !== 1) {       // 商品库存不足
                        let unStockList = ''
                        let len = res.unStockList.length
                        for (let i = 0; i < len; i++) {
                            unStockList += res.unStockList[i].ptiPartHdName + '、'
                        }
                        Toast(unStockList.substring(0, unStockList.lastIndexOf('、')) + ' 库存不足！')

                        this.btnLock = false
                        return
                    }

                    // 立即购买
                    let orderData = {
                        interfaceCode: "SP_SALE_SAVECARTTEMP",
                        ctmUsrId: global.Storage.get("USER_INFO").usrId,
                        cookieId: global.Storage.get("USER_INFO").cookieId,
                        shopCode: global.Storage.get("USER_INFO").shopCode,
                        usrKey: global.Storage.get("USER_INFO").usrId,
                        sourceCode: "D_ORDWEIN",
                        skuList: [
                            {
                                amount: this.num,
                                colorCode: this.colorActiveItem.colorCode,
                                sizeCode: this.sizeActiveItem.sizeCode,
                                salePrice: this.goodsInfo.salePrice,
                                tagPrice: this.goodsInfo.tagPrice,
                                goodsCode: this.goodsCode,
                                thumb: this.goodsInfo.url,
                                pictFileId: this.colorActiveItem.fileId || this.goodsInfo.fileId
                            }
                        ],
                        amountOrd: this.num * this.goodsInfo.salePrice
                    };
                    Order.saveCartTemp(orderData).then((res) => {
                        Order.orderPreferCal({ordId: res}).then(() => {
                            this.btnLock = false
                            this.$router.push("/pages/orderPackage/order/order/order-settlement?orderHdId=" + res);
                        },()=>{
                            this.btnLock = false
                        })
                    });

                },()=>{
                    this.btnLock = false;
                })
            },

            /**
             * sku组件方法回调
             */
            onAddCartOrBuy(isCartOrBuy,colorItem, sizeItem) {//1加入购物车, 0立即购买
                if (isCartOrBuy) { // 点击加入购物车
                    this.addCart()
                } else {                // 点击立即购买
                    this.buyNow()
                }
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

            reIndex: function (index) {
                return 'index_' + global.mathSelect(0, 999) + index
            },

            //  判断用户是否是分销商（用于显示申请分销商按钮）
            checkIsVipMt() {
                if (!!this.$route.query.isVipMdt) {
                    this.isVipMdt = this.$route.query.isVipMdt
                } else {
                    let data = {
                        vipInfoHdId: global.Storage.get('USER_INFO').vipInfoId,
                        busconsCode: global.baseConstant.busContsCode,
                    }
                    Distribution.isDistribution(data).then((res) => {
                        this.isVipMdt = res.isVipMdt
                    })
                }
            },
            // 获取公司编码
            getCompanyCode() {
                Base.getCompanyById().then(res => {
                    this.companyCode = res.companyCode;
                })
            },
            // 获取是否有搭配按钮
            showCollocationBtn() {
                // 检验商品库存
                let data = {
                    busContsCode: global.baseConstant.busContsCode,
                    goodsCode: this.goodsCode,
                    shopCode: global.Storage.get("USER_INFO").shopCode,
                    companyId: global.Storage.get('COMPANYID').company_id,
                };

                Goods.getGoodsStock(data).then((res) => {
                    // 统计当前颜色总库存
                    let skuQty = 0;
                    for (let i = 0; i < res.skuList.length; i++) {
                        if (res.skuList[i].colorCode === this.colorActiveItem.colorCode) {
                            skuQty = skuQty + res.skuList[i].skuQty;
                        }
                    }

                    if (skuQty > 0) {
                        // 库存大于0获取是否有搭配记录
                        let collocationData = {
                            partCode: this.goodsCode,
                            colorCode: this.colorActiveItem.colorCode,
                            isThird: true,
                            companyCode: this.companyCode
                        };
                        // 获取是否有搭配记录
                        Goods.getCollocationRecord(collocationData).then((res) => {
                            // 隐藏、显示去搭配按钮
                            this.isCollocationShow = res;
                        });
                    }
                });
            },
            // 去搭配
            toCollocation() {
                if (this.colorActiveItem.colorCode === undefined || !this.colorActiveItem.colorCode) {
                    Toast("请先选择颜色");
                    return false;
                }
                // 读取用户id
                let usrId = global.Storage.get('USER_INFO').usrId;
                // 读取公司id
                let companyId = global.Storage.get('COMPANYID').company_id;
                // 读取路径
                let url = window.location.origin;
                // 读取店铺id
                let dptId = global.Storage.get('USER_INFO').shopId;
                // 读取店铺编码
                let dptCode = global.Storage.get('USER_INFO').shopCode;

                let params = 'companyId=' + companyId
                    + '&companyCode=' + this.companyCode
                    + '&usrId=' + usrId
                    + '&dptCode=' + dptCode
                    + '&dptId=' + dptId
                    + '&partCode=' + this.goodsCode
                    + '&colorCode=' + this.colorActiveItem.colorCode
                    + '&theme=septwolves';

                this.$router.push({
                    path: '/pages/wares/wares-design',
                    query: {
                        params: params
                    }
                });
            },
            //  生成小程序二维码
            getQrcode() {
                let data = {
                    vipId: global.Storage.get('USER_INFO').vipInfoId,
                    taskId: this.$route.query.id,
                    goodsCode: this.goodsCode
                }
                Distribution.getWechatQrcode(data).then((res) => {
                    this.qrcodeImg = res

                    this.createCanvas()
                })
            },
            //点击分享给朋友
            shareToFriend(){
                this.refresh_no=true; //使分享回来时，不刷新页面
            },
            //点击生成海报按钮
            async beforeSharePoster() {
                let root = this;
                root.shareFlag=false; //关闭底部弹框
                root.isClickCanvas = true;
                global.toastLoading()
                await this.touchAuthDown();

                if (root.isCanvasComplete) {
                    root.sharePoster()
                } else {
                    root.interval = setInterval(() => {
                        if (root.isCanvasComplete) {
                            root.sharePoster()
                            clearInterval(root.interval)

                        }
                    }, 1000)
                }
            },
            // 显示分享海报
            sharePoster() {
                let root = this;
                
                this.showPoster = true
                Toast.clear()

            },
            //创建画布
            async createCanvas() {
                let root = this;
                root.isCanvasComplete = false; //画布还未完成
                var goodsInfo = this.goodsInfo;
                var canvasMultiple = this.canvasMultiple;
                var ctx = wx.createCanvasContext('mycanvas');
                ctx.clearRect(0, 0, 231 * canvasMultiple, 362 * canvasMultiple)
                ctx.setFillStyle('#fff');
                ctx.fillRect(0, 0, 231 * canvasMultiple, 362 * canvasMultiple);

                //商品主图图片
                let imageurl = root.filter.imgFilter(root.posterGoodsCover, root.company_id) || "";
                imageurl = await global.getImgToLocalUrl(imageurl)
                ctx.drawImage(imageurl, 0, 0, 231 * canvasMultiple, 231 * canvasMultiple);

                //商品名称
                let goodsName = goodsInfo.goodsName;
                if (goodsInfo.goodsName && goodsInfo.goodsName.length > 14) {
                    goodsName = goodsInfo.goodsName.slice(0, 14);
                    goodsName = goodsName + '...'
                }
                ctx.setFontSize(14 * canvasMultiple);
                ctx.setFillStyle('#333');
                ctx.setTextAlign('center');
                ctx.fillText(goodsName, 115 * canvasMultiple, (231 + 12 + 14) * canvasMultiple);
                ctx.stroke();

                //商品价格，判断时候有减价
                if (goodsInfo.tagPrice > 0) {
                    ctx.setFontSize(16 * canvasMultiple);
                    ctx.setFillStyle('#FF3636');
                    ctx.setTextAlign('right');
                    let sprice = '￥' + root.filter.Fix2(goodsInfo.salePrice);
                    ctx.fillText(sprice, 115 * canvasMultiple, (231 + 36 + 16) * canvasMultiple);
                    ctx.stroke();

                    ctx.setFontSize(12 * canvasMultiple);
                    ctx.setFillStyle('#AEAEAE');
                    ctx.setTextAlign('left');
                    let spriceOld = '￥' + root.filter.Fix2(goodsInfo.tagPrice);
                    ctx.fillText(spriceOld, 115 * canvasMultiple, (231 + 36 + 16) * canvasMultiple);
                    ctx.stroke();

                    let textLength = (spriceOld.length - 2) * 7 + 14;//算出减价前金额的长度（大概的一个算法）
                    ctx.setFillStyle('#AEAEAE');
                    ctx.setLineWidth(2)
                    ctx.moveTo(115 * canvasMultiple, (231 + 36 + 16 - 4) * canvasMultiple)
                    ctx.lineTo((115 + textLength) * canvasMultiple, (231 + 36 + 16 - 4) * canvasMultiple)
                    ctx.stroke();
                } else {
                    ctx.setFontSize(16 * canvasMultiple);
                    ctx.setFillStyle('#FF3636');
                    ctx.setTextAlign('center');
                    let sprice = '￥' + root.filter.Fix2(goodsInfo.salePrice);
                    ctx.fillText(sprice, 115 * canvasMultiple, (231 + 36 + 16) * canvasMultiple);
                    ctx.stroke();
                }

                //中间虚线
                ctx.setFillStyle('#AEAEAE');
                ctx.setLineDash([5 * canvasMultiple, 2 * canvasMultiple], 0);
                ctx.moveTo(17 * canvasMultiple, (231 + 60) * canvasMultiple)
                ctx.lineTo((231 - 17) * canvasMultiple, (231 + 60) * canvasMultiple)
                ctx.stroke()

                //小程序二维码
                let qrcodeImg = root.qrcodeImg
                qrcodeImg = await global.getImgBase64ToLocalUrl(qrcodeImg)

                ctx.drawImage(qrcodeImg, 17 * canvasMultiple, (231 + 66) * canvasMultiple, 55 * canvasMultiple, 55 * canvasMultiple);

                ctx.setFontSize(11 * canvasMultiple);
                ctx.setFillStyle('#000');
                ctx.setTextAlign('left');
                ctx.fillText("长按识别小程序 立即购买", 88 * canvasMultiple, (231 + 90) * canvasMultiple);
                ctx.stroke();

                ctx.setFontSize(10 * canvasMultiple);//top:10
                ctx.setFillStyle('#AEAEAE');
                ctx.setTextAlign('left');
                ctx.fillText("分享自小七快赚", 88 * canvasMultiple, (231 + 110) * canvasMultiple);
                ctx.stroke();

                ctx.draw(false,function(){
                    var realWidth=root.canvasWidth * root.canvasMultiple;
                    var realHeight=root.canvasHeight * root.canvasMultiple
                    wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: realWidth,
                        height: realHeight,
                        canvasId: 'mycanvas',
                        success(res) {
                            root.saveImgUrl = res.tempFilePath;
                            root.isCanvasComplete = true;
                        },
                        fail() {
                            root.isCanvasComplete = true;
                        }
                    })
                });
            },
            //触发保存图片的授权
            touchAuthDown() {
                let root = this;
                // 获取用户是否开启用户授权相册
                return new Promise((resolve, reject) => {
                    wx.getSetting({
                        success(res) {
                            console.log('getSetting_success')
                            // 如果没有则获取授权
                            if (!res.authSetting['scope.writePhotosAlbum']) {
                                console.log('刚授权了')
                                wx.authorize({
                                    scope: 'scope.writePhotosAlbum',
                                    success() {
                                        console.log('授权成功')
                                        root.isAuthorityDown = true
                                        resolve(true)
                                    },
                                    fail() {
                                        console.log('拒绝保存之后，唤起权限授权')
                                        root.isAuthorityDown = false
                                        resolve(false)
                                    }
                                })
                            } else {
                                root.isAuthorityDown = true
                                console.log('有授权直接保存')
                                resolve(true)
                                // 有则直接保存
                                // root.saveImg()
                            }
                        },
                    })
                })

            },
            //点击opensetting状态的下载按钮
            clickOpensettingInfo(){
                this.refresh_no=true;//回来时不去触发onShow
            },
            //获取opensetting回调结果
            async getOpensettingInfo(e) {
                global.toastLoading()
                await this.touchAuthDown();
                Toast.clear();
            },
            //下载图片
            saveImg() {
                let self = this;
                wx.saveImageToPhotosAlbum({
                    filePath: self.saveImgUrl,
                    success() {
                        wx.showToast({
                            title: '保存成功'
                        })

                    },
                    fail() {
                        wx.showToast({
                            title: '保存失败',
                            icon: 'none'
                        })
                    }
                })
                this.showPoster = false
                this.isClickCanvas = false
            },

        },
        watch: {
            'colorActiveIndex': function () {
                if (this.colorActiveIndex >= 0 && this.colorActiveIndex != null) {
                    this.colorActiveItem = this.goodsInfo.colorsVoList[this.colorActiveIndex]
                    // 颜色切换判断是否显示去搭配按钮
                    // this.showCollocationBtn();
                } else {
                    this.colorActiveItem = ''
                    // this.isCollocationShow = false;
                }
            },
            'sizeActiveIndex': function () {
                if (this.sizeActiveIndex >= 0 && this.sizeActiveIndex != null) {
                    this.sizeActiveItem = this.goodsInfo.sizesVoList[this.sizeActiveIndex]
                } else {
                    this.sizeActiveItem = ''
                }
            },
            'showPopup': function () {
                if (this.showPopup === false) {
                    this.getUserInfo();
                }
            },
            showMessage:function(){
                console.log(this.showMessage,'shww')
                // if(this.showMessage==true){
                //     if(this.touch==1){
                //        this.collectToggle();
                //     }else if(this.touch==2){
                //         this.addCart()
                //     }else{
                //         this.buyNow()
                //     }
                // }
            }
        },

    }
</script>
<style lang="scss" type="text/scss" scoped>
    .qs-wares {
        // height: 100%;
        background-color: $color-background;
        padding-bottom: computed(107);
        /* 主内容区 */
        .qs-wares-main {
            position: relative;
            width: 100%;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
            .bubblingWrapper{
                position: absolute;
                top: computed(556);
                right:computed(30);
                overflow: hidden;
                height:computed(172);
                width: computed(472);
                z-index:100;
                .bubblingWrap{
                    position: absolute;
                    top: 0;
                    right: 0;
                    text-align: right;
                    transition: top 2s;
                    .bubbling{
                        position: relative;
                        display: inline-block;
                        height: computed(36);
                        line-height: computed(36);
                        margin-bottom:computed(12);
                        border-radius: computed(24);
                        color: $text-primary;
                        font-size: $font-little;
                        background: rgba(255, 255, 255, 0.6);
                        padding: computed(6) computed(20) computed(6) computed(8);
                        transition: background 2s;
                        img{
                            width: computed(36);
                            height:computed(36);
                            border-radius: 50%;
                            display: inline-block;
                            margin-right: computed(6);
                        }
                        .overflow{  
                            max-width: computed(100);
                        }
                        span{
                            display: inline-block;
                            line-height: computed(36);
                            vertical-align: top;
                        }
                    }
                }
                
            }
            .banner {
                position: relative;
                max-height: computed(750);
                min-height: computed(60);
                width: 100%;
                height: 750rpx;
                /*margin-bottom: computed(30);*/
                > swiper {
                    max-height: computed(750);
                    min-height: computed(60);
                    width: 100%;
                    height: 100%;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .swiper-pagination {
                    /*bottom: computed(72);*/
                }
                .banner-p {
                    position: absolute;
                    bottom: 0;
                    width: calc(100% - #{computed(20)});
                    padding-left: computed(20);
                    .name {
                        height: computed(60);
                        line-height: computed(60);
                        font-size: $font-common;
                        background: $color-black;
                        opacity: 0.64;
                        color: $color-white;
                        z-index: 999;
                    }
                }
            }
            .wares-detail {
                background-color: $color-white;
                margin-bottom: computed(12);
                .detail-section{
                    position: relative;
                    display: flex;
                    align-items: bottom;
                    padding: 28rpx 0 35rpx 0;
                    margin: 0 31rpx;
                    &.detail-section-first{
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 5rpx solid $color-background;
                        padding: 35rpx 0 32rpx;
                    }
                    .title {
                        line-height: $font-h0;
                        font-size: $font-h0;
                        font-weight: bold;
                    }
                    .btn-collect {
                        position: absolute;
                        top: 50%;
                        right: computed(-33);
                        transform: translate(0,-50%);
                        width: computed(95);
                        text-align: center;
                        > p:first-child {
                            font-size: $font-title1;
                        }
                        > p:last-child {
                            font-size: $font-little;
                            color: $text-regular;
                        }
                        .btn-collected{
                            color:$color-red;
                        }
                    }
                    &.price {
                        display: flex;
                        align-items: flex-end;
                        position: relative;
                        .price_now{
                            color: $color-red;  
                            font-weight: bold;
                            font-size: $font-h0;
                            line-height: $font-h0;
                            margin-right: computed(6);
                        }
                        .price_pristine {
                            margin-left: computed(4);
                            font-size: $font-regular;
                            line-height: $font-regular;
                            color: $text-price;
                            text-decoration: line-through;
                        }
                        .benefit-amount {
                            // position: absolute;
                            margin: 0 computed(12) 0 computed(24);
                            display: inline-block;
                            font-size: $font-common;
                            background: $bggradientcolor;
                            color: $color-white;
                            border-radius: computed(18);
                            padding: computed(2) computed(15);
                            // margin-top:computed(-15);
                            span {
                                font-size: $font-small;
                                color: $color-white;
                            }
                            >.iconfont{
                                color: $color-white;
                                font-size:$font-common;
                            }
                        }
                        .benefit-help{
                            font-size:$font-num;
                            line-height: computed(34);
                            color: $text-price;
                        }
                    }
                }
            }
            .label{
                display: flex;
                align-items: center;
                background: $color-white;
                margin-bottom: computed(12);
                padding: computed(20) 0;
                .label-left{
                    margin-left: 50rpx;
                    color:#FE3636;
                    font-size: $font-h1;
                }
                .label-view{
                    display: flex;
                    align-items: center;
                    color:$text-secondary;
                    font-size: $font-common;
                    margin-left: computed(40);
                    .iconfont{
                        color:#FE3636;
                        font-size: $font-h2;
                        margin-right: computed(4);
                    }
                }
            }
            .shopMerit{
                background: $color-white;
                padding: computed(28) computed(30) computed(24);
                margin-bottom: computed(12);
                .shopMerit-title{
                    color:$text-primary;
                    font-size: $font-h0;
                    margin-bottom: computed(20);
                    font-weight: 600;
                }
                .shopMerit-content{
                    color:$text-regular;
                    font-size: $font-regular;
                    line-height: computed(44);
                    width: computed(570);
                    text-align: justify;
                }

            }
            .discount {
                position: relative;
                background-color: $color-white;
                margin-bottom: computed(12);
                min-height: computed(50);
                vertical-align: top;
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
                        border-bottom: 1px solid $text-placeholder;
                        .discount-item-info {
                            display: inline-block;
                            width: computed(450);
                            height: computed(90);
                            line-height: computed(90);
                            box-sizing: border-box;
                            color: $color-white !important;
                            font-size: $font-regular;
                            &.long{
                                width: computed(565);
                            }
                            .text-regular{
                                color: $text-regular;
                            }
                            .color-black-33{
                                color:$color-black-33;
                            }
                            .item {
                                display: inline;
                                padding: computed(5) computed(14);
                                font-size: $font-common;
                                color: $gradientcolor;
                                border: 1px solid $gradientcolor;
                                border-radius: computed(5);
                            }
                            .info-item {
                                padding: computed(5) computed(14);
                                font-size: $font-common;
                                color: $gradientcolor;
                                border: 1px solid $gradientcolor;
                                border-radius: computed(8);
                                display: inline-block;
                                margin-top: computed(20);
                                max-width: computed(410) !important;
                                height: computed(36) !important;
                                line-height: computed(36);
                            }
                            .item-vourcher {
                                padding: computed(7) computed(14);
                                font-size: $font-common;
                                color: $color-white !important;
                                background-image: url($serverUrl+ "images/wares/vourcher.png");
                                background-size: 100% 100%;
                                margin-right: computed(18);
                                margin-left: computed(2);
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
                .discount-item-empty {
                    height: computed(18);
                    background-color: $color-background;
                }
            }
            .detail {
                width: 100%;
                background-color: $color-white;
                > p {
                    margin: 0 computed(30) computed(30) computed(30);
                    padding-top: computed(30);
                    font-size: $font-h1;
                    font-weight: bold;
                    color: $text-primary;
                }
                .detail-main {
                    width: 100%;
                    div {
                        white-space: normal;
                    }
                }
                .no-detail {
                    font-size: $font-regular;
                }

            }
        }
        
        /* 底部导航 */
        .qs-wares-btn {
            // display: none;
            position: fixed;
            bottom: 0;
            width: 100%;
            height: computed(107);
            background-color: $color-white;
            &.z-index9 {
                z-index: 9;
            }
            &.z-index9999 {
                z-index: 9999;
            }
            ul {
                display: flex;
                flex-direction: row;
                font-size: $font-mini;
                min-height: computed(107);
                text-align: center;
                li, button {
                    position: relative;
                    display: inline-block;
                    min-height: computed(107);
                    &.btn-home{
                        padding-left: computed(16);
                    }
                    &.btn-home,
                    &.btn-shopping,
                    &.btn-collect {
                        flex-shrink: 0;
                        width: computed(90);
                        border-top: 1px solid $text-placeholder;
                        > .iconfont {
                            display: block;
                            color: $text-primary;
                            margin-top: computed(18);
                            font-size: $font-h0;
                        }
                        > .btn-home-name {
                            font-size: $font-mini;
                            color: $text-regular;
                            margin-top: computed(16);
                        }
                        .num {
                            position: absolute;
                            top: computed(3);
                            right: computed(10);
                            min-width: computed(24);
                            min-height: computed(28);
                            line-height: computed(28);
                            background-color: $domaincolor;
                            color: $color-white;
                            border-radius: 50%;
                            padding: 0 computed(2);
                            text-align: center;
                            font-size: $font-small;
                        }
                    }
                   
                    &.btn-bottom{
                        width: 100%;
                         div {
                            display: flex;
                            align-items: center;
                            flex-wrap: wrap;
                            width: 100%;
                            height: computed(80);
                            padding: computed(13) 0;
                            box-sizing: border-box;
                            border-radius: 0 computed(40) computed(40) 0;
                            font-size: $font-regular;
                            background: linear-gradient(90deg,$color-red,$gradientcolor);
                            p{
                                width: 100%;
                                height: computed(20);
                                line-height: computed(20);
                                font-size: computed(20);
                            }
                            .btn-bottom-name{
                                height: computed(28);
                                line-height: computed(28);
                                font-size: $font-regular;
                            }
                        }
                    }
                     &.btn-cart {
                        border-top: 1px solid $text-placeholder;
                        background-color: $color-white;
                        color: $color-white;
                        padding: computed(14) 0 computed(14) computed(20);
                        box-sizing: border-box;
                        div {
                            height: computed(80);
                            line-height: computed(80);
                            border-radius: computed(40) 0 0 computed(40);
                            background: linear-gradient(90deg,$yellow-start-color,$yellow-end-color);
                        }
                    }
                    &.btn-share {
                        line-height: computed(98);
                        border-top: 1px solid $text-placeholder;
                        font-size: $font-regular;
                        color: $color-white;
                        padding: computed(14) computed(30) computed(14) 0;
                        box-sizing: border-box;
                    }
                }
            }
        }
        .vourcher-dialog {
            height: computed(800);
            overflow-y: hidden;
            .title {
                padding: 0 computed(30);
                height: computed(100);
                line-height: computed(100);
                border-bottom: 1px solid $text-placeholder;
                > .span_left {
                    font-size: computed(32);
                    color: $text-primary;
                    font-weight: bold;
                }
                > .span_right {
                    float: right;
                    color: $text-placeholder;
                    padding-left: 10px;
                }
            }
            .body {
                min-height: computed(700);
                max-height: computed(700);
                overflow-y: auto;
                overflow-x: hidden;
                background-color: $color-white;
                .page-coupon {
                    min-height: computed(700);
                    max-height: computed(700);
                    background-color: $color-white;
                }
            }
        }
        .share {
            position: fixed;
            top: 0;
            height: 100%;
            width: 100%;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.4);
            z-index: 99999;
        }
        /*侧边工具栏*/
        .qs-wares-toolbar {
            position: fixed;
            right: computed(20);
            bottom: computed(240);
            z-index: 10;
            div {
                box-sizing: border-box;
                width: computed(90);
                height: computed(90);
                margin-bottom: computed(13);
                background: $text-apply;
                border-radius: 50%;
                /*box-shadow: 0 3px 5px #ccc;*/
                box-shadow: 0 computed(4) computed(12) 0 rgba(255, 54, 54, 0.24);
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                    font-size: computed(50);
                    text-align: center;
                    color: #333;
                }
                p {
                    /*padding: 0 computed(10);*/
                    color: #fff;
                    font-size: computed(20);
                    text-align: center;
                    margin-top: computed(-5);
                }

                .top-name {
                    color: #333333;
                    margin-top: computed(-15);
                }
            }
            // 滚到顶部
            div.toTop {
                width: computed(90);
                height: computed(90);
                background: rgba(255, 255, 255, 1);
                opacity: 0.84;
                box-shadow: 0 computed(4) computed(12) 0 rgba(0, 0, 0, 0.1);
            }
        }
        .absolute {
            position: absolute !important;
        }
        .explain{
            width: computed(560);
            padding: computed(35) computed(30);
            text-align: center;
            .explain-title{
                color: $text-primary;
                font-size: $font-h2;
                line-height: $font-h2;
                margin-bottom:computed(22); 
            }
            .explain-content{
                color: $text-regular;
                font-size: $font-common;
                line-height: computed(30);
                margin-bottom: computed(42);
                text-align: justify;
            }
            .explain-sure{
                margin: 0 auto;
                width: computed(180);
                height:computed(50);
                line-height: computed(50);
                border-radius: computed(25);
                background: $color-red;
                color: $color-white;
            }
        }
        .sharePopup{
            position: relative;
            z-index: 10000;
            width:100%;
            text-align: center;
            .sharePopup-title{
                font-size: $font-title1;
                line-height: $font-title1;
                padding: computed(42) 0 computed(32);
            }
            .sharePopup-line{
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                padding-bottom:computed(32);
                height: computed(124);
                button{
                    position: absolute;
                    top: 0;
                    left: 33.33%;
                    transform: translate(-66.66%,0);
                    width: computed(120);
                    font-size: $font-common;
                    line-height: $font-common;
                    background: $color-white;
                    margin: 0;
                    padding: 0;
                    text-align: center;
                    &::after{
                        border:none;
                    }
                    &:nth-child(2){
                        left: 66.66%;
                        transform: translate(-33.33%,0);
                    }
                    .iconfont{
                        font-size: computed(80);
                        color:#46BB36;
                        line-height: computed(80);
                        margin-bottom:computed(20);
                    }
                    .share-poster-color{
                        color:#FFA321
                    }
                }  
            }
            .sharePopup-bottom{
                font-size: $font-regular;
                border-top:1px solid $color-light-gray;
                height: computed(88);
                line-height: computed(88);
                // padding-bottom: computed(107);
            }
        }
        .poster-box {
            background: transparent;
            overflow: hidden;

            .poster-content {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100%;
                background: transparent;
                z-index: 10000;
                position: relative;
                top: computed(75);
            }
            .close-poster-btn {
                display: block;
                width: computed(83);
                height: computed(83);
                -webkit-border-radius: computed(83);
                -moz-border-radius: computed(83);
                border-radius: computed(83);
                background: url($serverUrl+ "images/wares/close-btn.png") no-repeat center;
                -webkit-background-size: cover;
                background-size: cover;
            }
            .save-box {
                overflow: hidden;
                .save-btn {
                    width: computed(111);
                    height: computed(111);
                    margin: 0 auto;
                    overflow: hidden;
                    background: url($serverUrl+ "images/wares/save-btn.png") no-repeat center;
                    background-size: cover;
                }
                .save-btn::after {
                    border: none;
                }
                .save-tip {
                    margin-top: computed(14);
                    font-size: computed(24);
                    line-height: computed(26);
                    color: #FEFEFE;
                }
            }
            .poster-cover {
                display: block;
                width: computed(462);
                height: computed(724);
                margin: computed(24) 0;
                overflow: hidden;
            }

        }
        .cavans {
            position: fixed;
            top: 0;
            display: block;
            width: computed(462);
            // margin: computed(24) 0;
            overflow: hidden;
        }
    }
</style>
<style lang="scss">
    .qs-wares {

    .poster-box {

    .van-popup--center {
        background-color: transparent;
        overflow-y: hidden;
        height: 100%;
    }

    }
    }
</style>
