/*
* createTime：2019/3/5
* author：junyong.hong lan.chen
* description: 商品详情页
*/
<template>
    <div class="qs-wares" :style="{paddingBottom:fissionType ===1&&fissionBtnStatus==='goBuy'?'167rpx':''}" >
        <wxs module="filter" src="../../../filter/filterCommon.wxs"></wxs>
        <!-- 生成海报的画布 -->
        <!-- canvasWidth: 231,canvasHeight: 362, -->
        <canvas class="cavans" canvas-id="mycanvas" v-if="showCanvas"
                :style="'width:'+(231*2)+'px;height:'+(362*2)+'px;position:fixed;z-index:-100;left:100%;top:103%'"></canvas>

        <div class="qs-wares-main" ref="getTops">
            <!-- 商品详情气泡，已购买的用户列表 -->
             <!-- <div class="bubblingWrapper" v-if="showBubbling">
                <div class="bubblingWrap" :style="'top:-'+bubblingIndex*30+'px'">
                    <div v-for="(item,index) in bubbling" :key="index">
                        <div class="bubbling"
                        :style="index==(bubblingIndex+1)?'background: rgba(255, 255, 255, 0.8)':''">
                            <img :src="filter.imgFilter(item.photoFileUrl,company_id)" alt="" lazy-load="true">
                            <span class="overflow">{{item.vipName}}</span><span>已购买</span>
                        </div>
                    </div>
                </div>
            </div> -->

            <div class="wrapper_Bubbling">
                <swiper  autoplay="true" interval="6000" v-if="showBubbling" vertical display-multiple-items='3' class="bubblingWrapper" @animationfinish="changeSwiper" :current='bubbling_current' circular>
                    <block v-for="(item,index) in bubbling" :key="index">
                        <swiper-item class="bubblingWrap">
                            <div class="bubbling" :style="index==(bubblingIndex+1)?'background: rgba(255, 255, 255, 0.8)':''">
                                <img :src="filter.imgFilter(item.photoFileUrl,company_id, '36*36')" alt="" lazy-load="true">
                                <span class="overflow">{{item.vipName}}</span><span>已购买</span>
                            </div>
                        </swiper-item>
                    </block>
                </swiper>
                <div class="wrapper_Bubbling_bg"></div>
            </div>
            <!-- 商品详情气泡，已购买的用户列表 end -->

            <!-- banner begin -->
            <div class="banner">
                <swiper indicator-dots="true" autoplay="true" interval="8000" v-if="goodsImages.length > 1">
                    <block v-for="(item,index) in goodsImages" :key="index">
                        <swiper-item>
                            <img :src="filter.imgFilter(item,company_id, '750*750')" :key="item" lazy-load="true">
                        </swiper-item>
                    </block>
                </swiper>

                <img v-if="goodsImages.length == 1"
                     :src="filter.imgFilter(goodsImages[0],company_id)"
                     width="100%"
                     height="100%"
                     lazy-load="true">

                <img v-if="goodsImages.length == 0 && !!serverUrl"
                     :src="serverUrl+'images/septwolves.png'"
                     width="100%"
                     height="100%"
                     lazy-load="true"
                     mode="widthFix">
            </div>
            <!-- banner end-->

            <!-- 商品信息 begin -->
            <div class="wares-detail detailsTop" ref="detailsTop" v-if="!fissionType">
                <div class="detail-section detail-section-first">
                    <div class="title">{{goodsName}}</div>
                    <button
                        :open-type=" (!isLogin) ? 'getUserInfo' : ''"
                        @getuserinfo="getLoginInfo('collectToggle','')"
                        class="btn-collect"
                        @click="collectToggle()"
                    >
                        <p>
                            <span :class="['iconfont',goodsInfo.collectionFlag === 1 ? 'iconshoucang_dibu_xuanzhong btn-collected' : 'iconshoucang']"></span>
                        </p>
                        <p>
                            <span>{{goodsInfo.collectionFlag === 1 ? '已收藏' : '收藏'}}</span>
                        </p>
                    </button>
                </div>
                <div class="detail-section price">
                    <span class="price_now">￥{{filter.Fix2(goodsInfo.salePrice)}}</span>
                    <text v-if="goodsInfo.tagPrice > 0" class="price_pristine">￥{{filter.Fix2(goodsInfo.tagPrice)}}</text>
                    <span class="benefit-amount" v-if="!!goodsInfo.benefitAmount">
                        <span class="iconfont iconzhuanduoshao"></span> 赚<span>￥</span>{{goodsInfo.benefitAmount}}
                    </span>
                    <span class="benefit-help iconfont iconzhuanzishuoming" v-if="!!goodsInfo.benefitAmount" @click="shareExplain=true"></span>
                </div>
            </div>
            <!-- 商品信息 end -->
            <!-- 秒杀/拼团商品信息 begin -->
            <div class="wares-detail detailsTop" ref="detailsTop" v-else>
                <div class="isfisson-detail-section">
                    <div class="title">{{goodsInfo.goodsName}}</div>
                    <div class="price-box">
                        <div class="detail-top flex-between">
                            <div class="detail-price">
                                <div class="price-title" v-if="fissionType==1">秒杀价</div>
                                <div class="price-title" v-else>拼团价
                                    <span class="assble-account">{{goodsInfo.people}}人团</span>
                                </div>
                                <p class="price_now">
                                    <span>￥{{filter.Fix2(goodsInfo.salePrice)}}</span>
                                    <span v-if="goodsInfo.tagPrice > 0">￥{{filter.Fix2(goodsInfo.tagPrice)}}</span>
                                </p>
                            </div>
                            <div class="detail-countdown">
                                <!-- 已售罄不显示倒计时 -->
                                <count-down
                                    v-if="fissionType === 1 || (fissionType === 2 && fissionBtnStatus !== 'soldOut')"
                                    :targetTime="goodsInfo.time"
                                    :title="coutDownTitle"
                                    :titleColor="'#FFFFFF'"
                                    :minuteDateColor="'#FFFFFF'"
                                    :timeBgColor="'rgba(0,0,0,0.3)'"
                                    :titleAlign="'right'"
                                    @over="timeOver(item, index)">
                                    <div class="btn-status">
                                        <!-- 拼团：已结束 -->
                                        <p class="right" v-if="fissionBtnStatus === 'soldOut' || fissionBtnStatus === 'ungrouped'">
                                            已结束
                                        </p>
                                    </div>
                                </count-down>
                            </div>
                            <!-- 已参团图标 -->
                            <img v-if="fissionType === 2 && goodsInfo.onlineDttGrpartDto.payNo === 1" :src="serverUrl + 'images/fission/join.png'" class="img">
                        </div>
                        <!-- 进度条 -->
                        <div class="detail-progress" v-if="fissionType==2">
                            <Progress
                                :proContent="goodsInfo.progressTitle"
                                :officalColor="'#FF3636'"
                                :proBackColor="'rgba(255,255,255,0.48)'"
                                :proColor="'rgba(255,255,255,1)'"
                                :percent="(goodsInfo.joinPeople / goodsInfo.people) * 100">
                            </Progress>
                        </div>
                    </div>
                </div>

            </div>
            <!-- 秒杀/拼团商品信息 end -->

            <div class="label" v-if="!fissionType">
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
                <div  v-if="couponsFirstList.length > 0 && !fissionType"  class="discount-item">
                    <span class="discount-item-title">领券</span>
                    <div class="discount-item-right" @click="vourcherDailog()">
                        <div class="discount-item-info overflow long">
                            <span v-for="(item, index) in couponsFirstList"
                                  v-if="index < 2"
                                  :key="item.couponId"
                                  class="item-vourcher">
                                {{item.couponName}}
                            </span>
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
                <div v-if="goodPreferentialList.mzList && goodPreferentialList.mzList.length > 0"
                     class="discount-item">
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
                    <div class="discount-item-right" @click="skuDialog();">
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

                <!-- 评价 begin -->
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
                <!-- 评价 end -->
            </div>
            <!-- 促销 end -->

            <!-- 商品详情 begin -->
             <div class="detail">
                <rich-text v-if="goodsDetail" class="detail-main" :nodes="goodsDetail"></rich-text>
                <div v-else-if="goodsDetails.length !=0" class="other-detail-main">
                    <img v-for="(item,index) in goodsDetails" :src="filter.imgFilter(item,company_id)" :key="index" lazy-load="true"  mode="widthFix">
                </div>
                <div v-else class="detail-main no-detail">暂无商品详情</div>
            </div>
            <!-- 商品详情 end -->

            <!-- 猜你喜欢 -->
            <guess-love :state='true' :shopId="goodsId" ref="guesslove" ></guess-love>
        </div>

        <div :class="['z-index9','qs-wares-btn']" :style="{height:fissionType ===1&&fissionBtnStatus==='goBuy'?'167rpx':''}" >
            <div :class="['z-index9','fisson-tips']" v-if="fissionType ===1 &&fissionBtnStatus==='goBuy' ">
                为提高秒杀成功率，下单时可先选择商品信息再点击立即购买
            </div>
            <ul v-if="!fissionType">
                <li @click="switchTab('/index')" class="btn-home">
                    <span class="iconfont iconshouye_weixuanzhong"></span>
                    <span class="btn-home-name">首页</span>
                </li>
                <button :open-type=" (!isLogin) ? 'getUserInfo' : ''" @getuserinfo="getLoginInfo('switchTab','/shopping-cart')" @click="switchTab('/shopping-cart')" class="btn-shopping">
                    <span class="iconfont icongouwuche_weixuanzhong"></span>
                    <span class="btn-home-name">购物车</span>
                    <span v-if="shoppingCartNum > 0" class="btn-home-name num">{{shoppingCartNum}}</span>
                </button>
                <li class="btn-cart btn-bottom">
                    <div @click="skuDialog();">
                        <p class="btn-bottom-name">购买</p>
                        <p v-if="goodsInfo.rebateAmount > 0">省￥{{filter.Fix2(goodsInfo.rebateAmount)}}</p>
                    </div>
                </li>
                <li class="btn-share btn-bottom">
                    <div @click="share">
                        <p class="btn-bottom-name">分享</p>
                        <p v-if="!!goodsInfo.benefitAmount">赚￥{{goodsInfo.benefitAmount}}</p>
                    </div>
                </li>
            </ul>
            <ul v-else class="fission-bottom" >
             <!-- 拼团/秒杀底部栏显示 -->
                <li @click="switchTab('/index')" :class="[ 'btn-home', { 'width-180' : fissionBtnStatus === 'join'}]">
                    <span class="iconfont iconshouye_weixuanzhong"></span>
                    <span class="btn-home-name">首页</span>
                </li>
                <li @click="share" class="btn-shopping" v-if="fissionBtnStatus !== 'join'">
                    <span class="iconfont iconfenxiang"></span>
                    <span class="btn-home-name">分享</span>
                </li>
                <li class="btn-buy">
                    <!--四种状态，购买/待开始/已结束/已售窑 -->
                    <button :open-type=" (!isLogin) ? 'getUserInfo' : ''" @getuserinfo="getLoginInfo('skuDialog','')" @click="skuDialog()" class="btn-bottom-buy" v-if="fissionBtnStatus=='goBuy'" >立即购买</button>
                    <!-- <div @click="skuDialog();" class="btn-bottom-buy" v-if="fissionBtnStatus=='goBuy'">立即购买</div> -->
                    <div class="btn-bottom-ready" v-else-if="fissionBtnStatus=='waitStart'">待开始</div>

                    <!-- 拼团：已参团 -->
                    <div class="btn-bottom-buy" v-else-if="fissionBtnStatus === 'join'" @click="share">
                        邀请好友
                    </div>
                    <!-- 秒杀/拼团：已售罄 -->
                    <div class="btn-bottom-over bg-graycc" v-else-if="fissionBtnStatus === 'soldOut'" @click="soldOut()">
                        已售罄
                    </div>
                    <!--秒杀/拼团：已结束  -->
                    <div class="btn-bottom-over bg-graycc" v-else-if="fissionBtnStatus === 'ungrouped'" @click="ungrouped()">
                        已结束
                    </div>

                </li>
            </ul>
        </div>

        <!--右侧工具栏-->
        <div class="qs-wares-toolbar">
            <!--回到顶部-->
            <div @click="goUp()" class="top-btn" v-if="isShow">
                <i class="iconfont iconhuidaodingbu"></i>
                <p>顶部</p>
            </div>
            <!--申请分销商-->
            <div v-if="(!!vipId && !isVipMdt) || (!!vipId && isVipMdt === '0')"
                 @click="navigate('/pages/distributionPackage/spread?vipId=' + vipId + '&ascriptionId=' + ascriptionId + '&taskId=' + taskId)"
                 class="apply">
                <p>申请</br>分销商</p>
            </div>
            <!--去搭配-->
            <div v-if="isShowCollocate" @click="toCollocate()" class="collocate apply">
                <p>去搭配</p>
            </div>
        </div>

        <!-- 领券弹窗 begin -->
        <van-popup :show="isShowVourcher" position="bottom" :overlay="true" close-on-click-overlay="true">
            <div class="vourcher-dialog">
                <p class="title">
                    <span class="span_left">领券</span>
                    <span @click="isShowVourcher = false" class="span_right iconfont iconguanbi"></span>
                </p>
                <div class="body">
                    <voucherList :cardList="coupons"
                                 :source="1"
                                 @onSelectSuccessDeail="onSelectSuccessDeail" />
                </div>
            </div>
        </van-popup>
        <!-- 领券弹窗 end -->

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
                :father_onhide.sync="isPassHide"
                :flag="1"
                :fissionType="fissionType"
                :userInfo.sync="userInfo"
                @onAddCartOrBuy="onAddCartOrBuy"
                @numBlur="numBlurComp">
            </sku-dialog-comp>
        </div>
        <!-- sku选择 end -->

        <div class="showPhone">
            <van-popup :show="showPopup">
                <phone-popup :showPopup.sync="showPopup" :showMessage.sync="showMessage"></phone-popup>
            </van-popup>
        </div>

        <!-- 赚字说明 -->
        <van-popup :show="shareExplain" class="explainWrap">
            <div class="explain">
                <div class="explain-title">说明</div>
                <div class="explain-content">
                    成为合伙人分享后可得￥{{goodsInfo.benefitAmount}}，自购立省￥{{filter.Fix2(goodsInfo.rebateAmount)}}
                </div>
                <div class="explain-sure" @click="shareExplain=false">确定</div>
            </div>
        </van-popup>

        <!-- 点击分享的底部层选择 -->
        <div v-if="shareFlag" class="sharePopupWrap">
            <div class="sharePopup">
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
            </div>
        </div>

        <!-- 海报 -->
        <view v-if="showPoster" class="poster-box">
            <div class="poster-content">
                <div class="close-poster-btn" @click="showPoster = false;isClickCanvas=false"></div>
                <img class="poster-cover" :src="saveImgUrl" ref="saveImgUrl" mode="widthFix">
                <div class="save-box">
                    <button class="save-btn" @click="saveImg" v-if="isAuthorityDown"></button>
                    <button class="save-btn" open-type="openSetting" @opensetting="getOpensettingInfo" @click="clickOpensettingInfo" v-else></button>
                </div>
            </div>
        </view>

        <van-toast id="van-toast"/>
        <van-dialog id="van-dialog" />
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import {Goods, ShoppingCart, Order, Collection, UserService, Distribution, Base, Fission} from "../../../api/service";
    import skuDialogComp from '@/components/wares/sku-dialog.vue'
    import guessLove from '@/components/GuessLove.vue'
    import phonePopup from '@/components/popup-phone'
    import voucherList from '@/components/voucherList';
    import Toast from 'vant-weapp/dist/toast/toast';
    import Dialog from 'vant-weapp/dist/dialog/dialog';
    import debounce from '@/utils/debounce'
    import CountDown from "@/pages/goodsPackage/fission/components/CountDown.vue";
    import Progress from "@/pages/goodsPackage/fission/components/Progress.vue";

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
            CountDown,
            Progress,
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
                goodsImages: [],
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
                goodsInfo: {    // 商品详情
                    onlineDttGrpartDto: {},  // 裂变
                },
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
                btnReturn: false,
                vipId: '',                  // 上级会员id
                ascriptionId: '',           // 渠道id
                taskId: '',                 // 任务id
                isVipMdt: '',               // 是否是分销商，1为是
                goodSkuList: '',            // 弹窗sku数据
                sellFlag: 1,                // 商品上下价，默认上架
                isLoading: true,            // 请求状态（默认置为true，在库存请求完成之后置为false，防止在商品加载过程中用户进行商品sku选择时数据异步加载导致信息不全）
                shareFlag: false,           //点击分享后的底部弹框是否显示
                showPopup: false,//显示手机弹窗
                isShowCollocate: false,
                isShow: false,//判断是否显示回到顶部按钮
                entrance: false,//判断入口是否是通过点击选择商品详情，true为是
                maxNumber: 0,//最大数量
                fixFlag: false,
                companyCode: '', //公司编码
                showMessage: '',//显示绑定手机号是否成功信息
                touch: 0,//点击收藏 toucj为1  加入购物车touch 2 立即购买touch 3
                serverUrl: global.baseConstant.serverUrl,
                company_id: global.Storage.get('COMPANYID').company_id,
                qrcodeImg: '',  // 商品小程序二维码
                saveImgUrl: '',
                showPoster: false,
                btnUserInfoBtn: false,
                canvasWidth: 231,
                canvasHeight: 362,
                canvasMultiple: 2,//用来控制画布像素 ,注意界面上的canvas是写死的，改的时候需要一起改，由于在ios有时候生成的图片尺寸不对
                showCanvas:false,//是否显示画布
                isAuthorityDown: false,  //是否有下载文件的权限,false为拒绝
                isCanvasComplete: false,//海报是否生成
                isClickCanvas: false,//是否点击了生成海报
                // refresh_no: false,   //用于限制从有些页面回来不刷新页面，是的话不重新请求接口
                posterGoodsCover:'',//商品主图地址
                bubblingAll:[],  //所有气泡数据
                bubblingAllIndex:0,//当前气泡提取位置,第几组
                bubblingCount:8,  //每次显示气泡数量
                bubbling:[],   //显示的气泡数组
                bubblingIndex:0,     //当前显示气泡所在位置
                showBubbling:false,    //是否显示气泡区域
                bubbling_current:0,   //用于设置swiper的当前下标
                shareExplain:false,    //是否显示赚字说明
                goodsName:'',      //提取14个字的商品名称
                timeout:'',        //每隔一段时间判断海报是否已经生成完毕
                lockShare:false,    //分享锁
                lock_skuDialog:false,   //sku弹框锁
                pass_onload:false,   //是否经过onLoad
                refresh_part:false,  //是否刷新商品详情，如：从购买记录回来才刷新
                goodsDetails:[],
                isPassHide:true, //是否经过onhide,用于当跳到授权，查看图片时，不去触发onhide
                fissionType:1,//1秒杀 2拼团
                BtnContent:'',//动态修改已结束和已售罄
                fissionBtnStatus:'',//'goBuy'立即购买  'saleOver'已结束   'waitStart'待开始 'unBuy'已售窑
                targetTime:'',//目标时间
                coutDownTitle:'',//倒计时标题
                serverTime:'',//系统时间
                isLogin: false // 用户信息是否授权登陆
            }
        },
        onLoad(){
            Object.assign(this.$data, this.$options.data())
            let root=this;
            //从授权页面回来的话,不重新请求接口
            this.pass_onload=true;
            this.showCanvas=true;
            this._initData()
            if (!!this.$route.query.vipId) {
                this.bind()
            }
        },
        onShow() {
            //  判断用户登陆状态设置购物车、账户的按钮类型
            if (!!global.Storage.get('USER_INFO')) {
                this.isLogin = true
            } else {
                this.isLogin = false
            }

            //有经过onload的话不触发
            if(this.pass_onload&&this.refresh_part){
                if(!this.fissionType){
                    this.getBubbling();
                    this.getGoodsDetail_single();
                }else if(this.fissionType===1){
                    this.getFissionDetail();
                }else if(this.fissionType===2){
                    this.isShowSku = false
                    this._onlinedttbgpartInfo();
                }
                this.showCanvas=true;
                this.pass_onload=false;
                this.refresh_part=false;
            }
        },
        onHide(){
            if(!this.isPassHide){
                this.isPassHide=true;
                return
            }
            let data={};
            Object.assign(data, this.$data)
            global.detail_data.unshift(data)
            this.clearSaveFile();
        },
        onUnload() {
            if(global.detail_data.length==0){
                Object.assign(this.$data, this.$options.data())
            }else{
                let data=global.detail_data.shift()
                Object.assign(this.$data,data )
            }
            this.clearSaveFile();
        },
        onShareAppMessage: function (res) {
            let root=this;
            // root.filter.imgFilter(root.posterGoodsCover, root.company_id) || "";
            let imageurl = root.filter.imgFilter(root.posterGoodsCover, root.company_id) || "";
            let shareUrl=global.getShareUrl('pages/goodsPackage/wares/wares-detail',root.$route.query);
            // 分享埋点
            global.gio('track', 'onShareAppMessage', {
                title: root.goodsInfo.goodsName,
                path: shareUrl
            });
            return {
                title: root.goodsInfo.goodsName,
                path: shareUrl,
                imageUrl:imageurl
            }
        },
        onPageScroll: function (option) {
            let query = wx.createSelectorQuery()
            query.select('.detailsTop').boundingClientRect((rect) => {
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

            // 登陆
            getLoginInfo(method,params){
                if (!global.Storage.get('USER_INFO')) {
                    global.loginAuthor().then((res) => {
                        if(!!res) {
                            this.isLogin = true
                            UserService.getUserInfo({}).then((res) => {
                                this.userInfo = res
                                this[method](params || '')
                            })
                        }
                    })
                }
            },

            noop(){},
            // 回到顶部
            goUp() {
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 300
                })
                this.isShow = false;
            },
            // 结束
            timeOver(item, index) {
//                console.log("即将打印item,index=====》", item, index);
                this.fissionBtnStatus = 'ungrouped'
            },

            // 保存浏览记录
            saveHistory() {
                let data = {
                    usrId: global.Storage.get("USER_INFO").usrId,
                    busContsCode: global.baseConstant.busContsCode,
                    ctmUsrId: global.Storage.get("USER_INFO").usrId,
                    dptId: global.Storage.get("properties").shopId,
                    salePrice: this.goodsInfo.salePrice,
                    tagPrice: this.goodsInfo.tagPrice,
                    ptiPartHdId: this.goodsInfo.ptiPartHdId,
                }
                UserService.saveUserFootprint(data).then(
                    res => {
                    },
                    err => {
                    }
                );
            },
            //清除缓存、临时文件
            clearSaveFile(){
                const fsm=wx.getFileSystemManager();
                fsm.readdir({
                    dirPath:wx.env.USER_DATA_PATH,
                    success:(res)=>{
                        var filesArr=res.files;
                        filesArr.forEach((item)=>{
                            fsm.unlink({
                                filePath:`${wx.env.USER_DATA_PATH}/${item}`
                            })
                        })
                    }
                })
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
                this.fissionType = parseInt(query.fissionType) || '' //1秒杀 2拼团
                this.onlineHdId = query.onlineHdId || ''
                this.checkIsVipMt()             // 判断用户是否是分销商

                if (this.fissionType === 1) {           // 秒杀详情
                    this.getFissionDetail();
                } else if (this.fissionType === 2) {    // 拼团详情
                    this._onlinedttbgpartInfo()
                } else {
                    this._getGoodsDetailTogether()  // 获取商品详情（接口聚合）
                }

                this.getUserInfo()          // 获取用户信息（判断收藏状态）
                this.getCartCount()         // 获取购物车数量

            },
             /** 获取服务器时间 **/
             getServerDate(){
                 return Fission.getServerDate().then(res=>{
                    return global.c_getDateStamp(res)
                })
            },

            // 拼团详情
            _onlinedttbgpartInfo() {
                let data = {
                    busContsCode: !!global.baseConstant.busContsCode ? global.baseConstant.busContsCode : global.Storage.get('properties').busContsCode,
                    goodsCode: this.goodsCode || this.$route.query.goodsCode,
                    onlineHdId: this.onlineHdId, // 线上促销信息id
                    shopId: global.Storage.get('properties').shopId,
                    userId: global.Storage.get('USER_INFO') ? global.Storage.get('USER_INFO').usrId : 0,  // 用户未登录传0
                    pageNum: 1,
                    pageSize: 2,
                }
                Fission.onlinedttbgpartInfo(data).then(async (res) => {
                    let currentTime = await this.getServerDate()
                    let time = global.c_getDateStamp(res.infoData.onlineDttGrpartDto.beginTime) + (res.infoData.onlineDttGrpartDto.times * 60 * 1000 * 60)
                    let people = res.infoData.onlineDttGrpartDto.qty
                    let joinPeople = res.infoData.onlineDttGrpartDto.clustNum
                    let payNoStatus = res.infoData.onlineDttGrpartDto.payNo ? res.infoData.onlineDttGrpartDto.payNo : null
                    let progressTitle = `已有${joinPeople}人参团`     // 默认参团人数
                    this.coutDownTitle = '距结束'

                    if (people === joinPeople) {                    // 已售罄
                        progressTitle = '已售罄'
                        this.fissionBtnStatus = 'soldOut'
                    } else if ((joinPeople < people) && (currentTime > time)) { // 未成团
                        progressTitle = '未成团'
                        this.fissionBtnStatus = 'ungrouped'
                    } else if (payNoStatus === 1) {                             // 已参团
                        this.fissionBtnStatus = 'join'
                    } else if (global.c_getDateStamp(res.infoData.onlineDttGrpartDto.beginTime) > currentTime) { // 待开始
                        if (time - currentTime < 2 * 60 * 60 * 1000) {
                            this.coutDownTitle = '距开始'
                        } else {
                            this.coutDownTitle = '开始时间'
                        }
                        this.fissionBtnStatus = 'waitStart'
                    } else if (payNoStatus === null || payNoStatus === 0) {     // 未参团
                        this.coutDownTitle = '距结束'
                        this.fissionBtnStatus = 'goBuy'
                    }

                    res.infoData.progressTitle = progressTitle
                    res.infoData.people = people
                    res.infoData.joinPeople = joinPeople
                    res.infoData.time = time
                    this.goodsInfo = res.infoData
                    this.goodsInfo.tagPrice = res.infoData.salePrice;
                    this.goodsInfo.salePrice = res.infoData.onlineDttGrpartDto.price;
                    this.goodsId = this.goodsInfo.ptiPartHdId;
                    this._getUEditor(res.infoData);
                    this.getGoodsComments(res.commentsData);
                })
            },

            // 秒杀/拼团—已售罄
            soldOut () {
                Toast('已售罄')
            },
            // 秒杀/拼团—已结束
            ungrouped () {
                Toast('已结束')
            },

            // 获取秒杀详情
            getFissionDetail(){
                let flashData = {
                    busContsCode: !!global.baseConstant.busContsCode ? global.baseConstant.busContsCode : global.Storage.get('properties').busContsCode,
                    goodsCode: this.$route.query.goodsCode,
                    onlineHdId:this.onlineHdId,
                    shopId:global.Storage.get('properties').shopId,
                    pageNum: 1,
                    pageSize: 2,
                }
                Fission.getFlashDetail(flashData).then(async(res)=>{
                    this.fissionBtnStatus = 'goBuy'
                    var currentTime = await this.getServerDate();
                    var beginTime = global.c_getDateStamp(res.infoData.onlineDttSkpartDto.beginTime);//开始时间
                    if(beginTime>currentTime){
                         this.fissionBtnStatus = 'waitStart';//待开始
                    }
                    if(this.fissionBtnStatus === 'waitStart'){
                        var time = global.c_getDateStamp(res.infoData.onlineDttSkpartDto.beginTime)//结束时间
                    }else{
                        var time = global.c_getDateStamp(res.infoData.onlineDttSkpartDto.endTime)//结束时间  
                    }
                    this.goodsInfo = res.infoData;
                    this.goodsInfo.tagPrice = res.infoData.salePrice;
                    this.goodsInfo.salePrice = res.infoData.onlineDttSkpartDto.price;
                    this.goodsInfo.time = time;
                    this.goodsId = this.goodsInfo.ptiPartHdId;
                    if(this.goodsInfo.onlineDttSkpartDto.payNo&&this.goodsInfo.onlineDttSkpartDto.payNo===0){
                        Toast('您有该商品未结算，请先支付~')
                        this.$router.push( `/pages/orderPackage/order/order/order-settlement?orderHdId=${res}&fissionType=1`);
                    }
                    if(this.goodsInfo.onlineDttSkpartDto.qty - this.goodsInfo.onlineDttSkpartDto.clustNum===0){
                        this.fissionBtnStatus = 'soldOut';//已售窑
                        this.BtnContent = '已售罄';
                        this.goodsInfo.time = '';
                        Toast('商品已售罄~')
                    }else if(beginTime<=currentTime && this.goodsInfo.time>=currentTime){
                        this.fissionBtnStatus = 'goBuy';//立即购买
                        this.coutDownTitle = '距结束';
                    }else if (this.goodsInfo.time<currentTime){
                        this.fissionBtnStatus = 'ungrouped'//已结束
                        this.BtnContent = '已结束'
                        Toast('活动已结束~')
                    }else if(beginTime>currentTime) {
                        // this.fissionBtnStatus = 'waitStart';//待开始
                         if (time - currentTime < 2 * 60 * 60 * 1000) {
                            this.coutDownTitle = '距开始'
                        } else {
                            this.coutDownTitle = '开始时间'
                        }
                    }
                    this._getUEditor(res.infoData);
                    this.getGoodsComments(res.commentsData);
                })
            },
            // 商品详情（富文本编辑器）
            _getUEditor(res){
                let root = this
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
                    this.goodsDetail = newP;
                } else if (res.descFileUrl){
                    this.goodsDetails = res.descFileUrl;
                }
            },
            /**
             * 获取商品详情（接口聚合）
             */
            _getGoodsDetailTogether () {
                let data = {
                    usrId: global.Storage.get('USER_INFO') ? global.Storage.get('USER_INFO').usrId : 0,  // 用户未登录传0
                    busContsCode: !!global.baseConstant.busContsCode ? global.baseConstant.busContsCode : global.Storage.get('properties').busContsCode,
                    goodsCode: this.goodsCode || this.$route.query.goodsCode,
                    shopId: global.Storage.get('properties').shopId,
                    shopCode:global.Storage.get('properties').shopCode,
                    pageNum: 1,
                    pageSize: 2,
                }
                Goods.getGoodsDetailTogether(data).then((res) => {
                    // 判断商品上下架
                    this.getGoodSellState(res.sellFlagData)
                    // 获取商品详情信息
                    this.getGoodsDetail(res.infoData)
                    // 满减、满折、赠品
                    this.getGoodPreferential(res.preferentialData)
                    // 查询商品评价
                    this.getGoodsComments(res.commentsData)
                    this.getGoodsPromotion()    // 获取商品优惠促销(其他地方有单独调用)
                    this.getBubbling();         // 获取气泡信息，购买人列表
                })
            },

            //获取气泡信息，购买人列表
            getBubbling(){
                let data={
                    num:100
                }
                UserService.getGoodsClient(data).then((res)=>{
                    this.bubblingAll=res||[];
                    this.showBubbling=true; //显示气泡区域
                    let vipInfoId=global.Storage.get('USER_INFO').vipInfoId
                    //删除自己购买的记录
                    for(let i=0;i<this.bubblingAll.length;i++){
                        if(this.bubblingAll[i].id==vipInfoId){
                            this.bubblingAll.splice(i,1)
                            break;
                        }
                    }
                    this.bubbling_current=0;
                    this.bubblingIndex=0;
                    this.bubblingAllIndex=0;
                    let start=this.bubblingAllIndex*this.bubblingCount;
                    this.bubbling=this.bubblingAll.slice(start,start+this.bubblingCount);
                })
            },
            //当气泡滑动后触发
            changeSwiper(e){
                this.bubblingIndex=this.bubblingIndex+1;
                //当气泡到底时
                if(this.bubblingIndex>=this.bubbling.length){
                    this.showBubbling=false;  //隐藏气泡
                    this.bubblingAllIndex+=1;
                    if(this.bubblingAll.length>this.bubblingAllIndex*this.bubblingCount){
                        this.bubblingIndex=0;
                        let start=this.bubblingAllIndex*this.bubblingCount;
                        this.bubbling_current=0;
                        this.bubbling=this.bubblingAll.slice(start,start+this.bubblingCount);
                        //小于显示的三个，会报错，所以干脆不要掉
                        if(this.bubbling.length<3){
                            return
                        }
                        this.showBubbling=true;
                    }
                }
            },

            // 获取用户信息
            getUserInfo(e) {
                if (this.btnUserInfoBtn) {
                    return
                }
                this.btnUserInfoBtn = true
                global.showLoading({mask:true});
                let data = {};
                UserService.getUserInfo(data).then((res) => {
                    global.hideLoading()
                    this.userInfo = res;
                    this.btnUserInfoBtn = false
                    //绑定成功后继续执行点击时的操作
                    if(e=='operate'){
                        if(this.touch==1){
                            this.collectToggle();
                        }else if(this.touch==2){
                            this.addCart()
                        }else{
                            this.buyNow()
                        }
                    }
                }, (err) => {
                    global.hideLoading()
                    this.btnUserInfoBtn = false
                });
            },
            /**
             * 点击分享
             */
            share() {
                if(this.lockShare){
                    return
                }
                this.lockShare=true;
                //判断是否是分销商
                if(this.isVipMdt==1){
                    this.lockShare=false
                    this.shareFlag = true
                }else{
                    Dialog.confirm({
                        message: '成为合伙人可赚钱',
                        confirmButtonText:'成为合伙人',
                        cancelButtonText:'继续分享',
                    }).then(() => {
                        this.lockShare=false
                        let url = `/pages/distributionPackage/spread?vipId=${
                            !!this.vipId ? this.vipId : ""
                        }&taskId=${!!this.taskId ? this.taskId : ""}&ascriptionId=${
                            !!this.$route.ascriptionId ? this.$route.ascriptionId : ""
                        }`;
                        this.$router.push(url);
                    }).catch(() => {
                        this.lockShare=false
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
                if(url === '/shopping-cart') {
                    if(!global.Storage.get('USER_INFO')) {
                        return
                    }
                    if (this.userInfo.mobilePhone === null || !this.userInfo.mobilePhone) {
                        this.showPopup = true;
                        return
                    }
                }
                global.switchTab(url)
            },

            /**
             * 领券弹窗
             */
            vourcherDailog() {
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

                if(this.fissionType && !this.isLogin){
                    return;
                }
                if (this.isLoading) {
                    return
                }
                if (this.sellFlag !== 1) {
                    Toast('该商品已下架')
                    return
                }
                if(this.fissionBtnStatus === 'ungrouped'){
                    Toast('已结束~');
                    return;
                }
                if (this.fissionType === 1 ) {
                    if(this.fissionBtnStatus === 'soldOut'){
                      Toast('商品已售罄~');
                      return;
                    }
                    if(this.fissionBtnStatus !== 'goBuy'){
                       return;
                    }
                    if(this.goodsInfo.onlineDttSkpartDto.fssNum === 0 && (this.goodsInfo.onlineDttSkpartDto.qty - this.goodsInfo.onlineDttSkpartDto.clustNum ) > 0){
                       Toast('有用户下单还未支付，等等再来~');
                       return;
                    }
                    if(this.goodsInfo.onlineDttSkpartDto.purchaseQty>=this.goodsInfo.onlineDttSkpartDto.limitQty){
                        Toast(`每个用户限购${this.goodsInfo.onlineDttSkpartDto.limitQty}件~`);
                        return;
                    }

                }
                // 如果为裂变促销且按钮状态不为立即购买,则不显示弹窗
                if(this.fissionType && this.fissionType === 2){
                    if (this.fissionBtnStatus !== 'goBuy') {
                        Toast('每个用户限购1件');
                        return
                    }

                    if (this.goodsInfo.onlineDttGrpartDto.surpNum === 0 &&
                        this.goodsInfo.onlineDttGrpartDto.clustNum < this.goodsInfo.onlineDttGrpartDto.qty) {
                        Toast('有用户下单还未支付，等等再来~');
                        return
                    }
                }

                this.isShowSku = true
            },

            /**
             * 判断商品上下架
             */
            getGoodSellState(res) {
                this.sellFlag = res.partGoodsList[0].sellFlag
                if (this.sellFlag !== 1) {
                    // 赠品已下架
                    // if (this.$route.query.isGift==1) {
                    //     this.$router.replace({
                    //         path: '/pages/goodsPackage/goods/off-shelves',
                    //     })
                    //     return
                    // }
                    Toast('该商品已下架')
                }
            },

            // 获取商品详情信息
            getGoodsDetail(res) {
                let root = this;
                this.isLoading = true
                global.hideLoading();
                this._getUEditor(res);
                this.goodsInfo = res;
                this.goodsName=this.goodsInfo.goodsName;
                this.posterGoodsCover = res.url;
                this.goodsId = res.ptiPartHdId;
                let colorList = res.colorsVoList;
                let sizesList = res.sizesVoList;
                //  自定义埋点
                global.gio('track', 'goodsDetailPageView', {
                    goodsName: this.goodsInfo.goodsName,
                    goodsCode: this.goodsCode || this.$route.query.goodsCode
                });
                // 获取颜色列表（banner）
                let goodsImages = []
                if (colorList.length > 0) {
                    this.goodsImages = []
                    colorList.forEach((item) => {
                        item.urls=item.dtColorUrls;
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
                //显示猜你喜欢
                wx.nextTick((res)=>{
                    //由于有时候组件未加载完成
                    if(this.$refs.guesslove==undefined){
                        setTimeout((res)=>{
                            this.$refs.guesslove.getHighestSelling(this.goodsId);
                        },1500)
                    }else{
                        this.$refs.guesslove.getHighestSelling(this.goodsId);
                    }
                })
            },


            //获取商品详情，在onshow单独执行
            getGoodsDetail_single(){
                let root = this;
                let data = {
                    usrId: global.Storage.get('USER_INFO') ? global.Storage.get('USER_INFO').usrId : 0,  // 用户未登录传0
                    busContsCode: !!global.baseConstant.busContsCode ? global.baseConstant.busContsCode : global.Storage.get('properties').busContsCode,
                    goodsCode: this.goodsCode || this.$route.query.goodsCode,
                    shopId: global.Storage.get('properties').shopId,
                }
                global.showLoading({mask:true});
                Goods.getGoodsInfo(data).then((res) => {
                    global.hideLoading();
                    this.getGoodsDetail(res)
                },(res)=>{global.hideLoading();})
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
            getGoodPreferential(res) {
                this.goodPreferentialList = res
            },

            // 查询商品评价
            getGoodsComments(res) {
                this.total = res.total
            },

            // 推荐商品跳转详情
            goDetail(item) {
                if (item.orderFlag === 0) {
                    let queryData = {
                        goodsCode: item.goodsCode
                    }
                    this.$router.replace({path: '/pages/goodsPackage/wares/wares-detail', query: queryData})
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
            collectToggles: debounce(function () {
                this.collectToggle()
            }, 1000),
            // 收藏/取消收藏点击事件
            collectToggle() {
                if(!global.Storage.get('USER_INFO')) return
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
            async collectFunction() {
                let currentTime = await this.getServerDate()

                // 调用商品详情接口获取实时收藏状态
                let data = {
                    usrId: global.Storage.get('USER_INFO') ? global.Storage.get('USER_INFO').usrId : 0,  // 用户未登录传0
                    busContsCode: !!global.baseConstant.busContsCode ? global.baseConstant.busContsCode : global.Storage.get('properties').busContsCode,
                    goodsCode: this.goodsCode || this.$route.query.goodsCode,
                    shopId: global.Storage.get('properties').shopId,
                }
                Goods.getGoodsInfo(data).then((res) => {
                    this.goodsInfo.collectionFlag = res.collectionFlag
                    if (!!res.rtlCollectionDtId) this.goodsInfo.rtlCollectionDtId = res.rtlCollectionDtId
                }).then(() => {
                    if (this.goodsInfo.collectionFlag === 1) {
                        //  取消收藏
                        let data = {
                            goodCodeStr: this.goodsCode,
                            ids: this.goodsInfo.rtlCollectionDtId
                        };
                        Collection.deleteCollection(data).then((res) => {
                            // wx.nextTick(() => {
                            Toast("已取消收藏~");
                            this.goodsInfo.collectionFlag = 0
                            this._getSelfGoodsDetail(currentTime)
                            this.isLoading = false
                            // });
                        });
                    } else {
                        //  收藏
                        let data = {
                            busContsCode: global.baseConstant.busContsCode,
                            goodsCode: this.goodsCode,
                            shopId: global.Storage.get("properties").shopId,
                            salePrice: this.goodsInfo.salePrice,
                            tagPrice: this.goodsInfo.tagPrice,
                            goodName:this.goodsInfo.goodsName
                        };
                        Collection.addCollection(data).then((res) => {
                            if (res === 1) {
                                // wx.nextTick(() => {
                                Toast("收藏成功~");
                                this.goodsInfo.collectionFlag = 1
                                this._getSelfGoodsDetail(currentTime)
                                this.isLoading = false
                                // });
                            }
                        });
                    }
                })
            },

            /**
             * 收藏与取消收藏，获取商品详情
             */
            _getSelfGoodsDetail (currentTime) {
                let data = {
                    usrId: global.Storage.get('USER_INFO') ? global.Storage.get('USER_INFO').usrId : 0,  // 用户未登录传0
                    busContsCode: !!global.baseConstant.busContsCode ? global.baseConstant.busContsCode : global.Storage.get('properties').busContsCode,
                    goodsCode: this.goodsCode || this.$route.query.goodsCode,
                    shopId: global.Storage.get('properties').shopId,
                }
                Goods.getGoodsInfo(data).then((res) => {
                    this.goodsInfo = res
                }, (res) => {
                })
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
                    shopCode: global.Storage.get("properties").shopCode
                };
                Goods.getGoodsStock(data).then((res) => {
                    this.maxNumber = res.goodsQty
                    this.stuckList = res.skuList;
                    this.isLoading = false
                    this.getQrcode()
                    this.getCollocate();        // 获取搭配记录信息
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
                    shopId: global.Storage.get("properties").shopId,
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
                        dptId: global.Storage.get("properties").shopId,
                        goodsCode: this.goodsCode,
                        partDtSkuId: this.skuId,
                        newPartDtSkuId: this.skuId,
                        flag: 0, // 从商品添加进购物车
                        salePrice: this.goodsInfo.salePrice
                    };
                    ShoppingCart.saveCart(cartData).then(
                        (res) => {
                            this.isShowSku = false
                            setTimeout(()=>{
                                this.btnLock = false;
                            },500)

                            Toast("加入购物车成功~")

                            //  加入购物车埋点
                            global.gio('track', 'addToShopCart', {
                                goodsName: this.goodsInfo.goodsName,
                                goodsCode: this.goodsCode,
                                goodsColor: this.colorActiveItem.colorName,
                                goodsSize: this.sizeActiveItem.sizeName,
                                goodsNum: this.num
                            });

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
                if (!this.fissionType) {
                    //  获取sku的code值
                    for (let i = 0; i < this.stuckList.length; i++) {
                        if (
                            this.stuckList[i].sizeCode === this.sizeActiveItem.sizeCode &&
                            this.stuckList[i].colorCode === this.colorActiveItem.colorCode
                        ) {
                            this.skuId = this.stuckList[i].skuId;
                        }
                    }
                } else {
                    for (let i = 0; i < this.goodsInfo.sizeColorMessage.length; i++) {
                        let currentItem = this.goodsInfo.sizeColorMessage[i]
                        if ((currentItem.colorCode === this.colorActiveItem.colorCode) &&
                            (currentItem.sizeCode === this.sizeActiveItem.sizeCode)) {
                            this.skuId = currentItem.skuId
                            break
                        }
                    }
                }

                if (!this.fissionType) {    // 大货
                    // 检验商品库存、上下架
                    let goodListObj = {
                        shopId: global.Storage.get("properties").shopId,
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
                            shopCode: global.Storage.get("properties").shopCode,
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
                                    pictFileId: this.colorActiveItem.fileId || this.goodsInfo.fileId,
                                    ptiPartDtSkuId: this.skuId,         // 商品skuId
                                }
                            ],
                            amountOrd: this.num * this.goodsInfo.salePrice
                        };
                        Order.saveCartTemp(orderData).then((res) => {
                            Order.orderPreferCal({ordId: res}).then(() => {
                                this.btnLock = false
                                this.refresh_part = true; //从立即购买回来的话，要刷新商品详情（库存）
                                this.isShowSku = false;

                                this.$router.push("/pages/orderPackage/order/order/order-settlement?orderHdId=" + res);
                                // 立即购买埋点
                                global.gio('track', 'buyNowSuccess', {
                                    goodsName: this.goodsInfo.goodsName,
                                    goodsCode: this.goodsCode,
                                    goodsColor: this.colorActiveItem.colorName,
                                    goodsSize: this.sizeActiveItem.sizeName,
                                    goodsNum: this.num,
                                    colorId: this.colorActiveItem.colorId,
                                    sizeId: this.sizeActiveItem.sizeId,
                                });
                            }, () => {
                                this.btnLock = false
                            })
                        });
                    }, () => {
                        this.btnLock = false;
                    })
                } else {                    // 秒杀/拼团立即购买
                    let fissionOrderData = {
                        shopId: global.Storage.get("properties").shopId,
                        sourceCode: "D_ORDWEIN",//订单来源编码
                        onlineHdId:this.onlineHdId,//促销id(online_hd的id
                        fpsCode: this.fissionType === 1 ? 'SECKILL' : 'GROUP',
                        skuList: [
                            {
                                ordQty:this.num,//促销id(online_hd的id
                                ptiPartDtSkuId:this.skuId,//商品skuId （skuList对象属性）
                                ptiPartHdId:this.goodsId,//商品id （skuList对象属性）
                                colorId:this.colorActiveItem.colorId,//颜色id
                                sizeId:this.sizeActiveItem.sizeId,//尺码id
                                giftFlag:this.goodsInfo.giftFlag,//赠品标识       // 商品skuId
                            }
                        ]
                    };
                    Fission.saveFissionCartTemp(fissionOrderData).then((res) => {
                        this.btnLock = false
                        this.refresh_part = true; //从立即购买回来的话，要刷新商品详情（库存）
                        this.isShowSku = false;
                        this.$router.push(`/pages/orderPackage/order/order/order-settlement?orderHdId=${res}&fissionType=${this.fissionType}`);
                    },err=>{
                        Toast(err.errorMsg);
                        this.btnLock = false
                        this.refresh_part = true; //从立即购买回来的话，要刷新商品详情（库存）
                        this.isShowSku = false;
                    });
                }
            },

            /**
             * sku组件方法回调
             */
            onAddCartOrBuy(isCartOrBuy,colorItem, sizeItem) {//1加入购物车, 0立即购买
                if (this.fissionType) {
                    this.colorActiveItem = colorItem
                    this.sizeActiveItem = sizeItem
                }

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
            // 获取搭配记录信息
            getCollocate() {
                if (this.maxNumber > 0 && this.sellFlag === 1) {
                    // 搭配记录获取
                    let params = {
                        partCode: this.goodsCode,
                        dptId: global.Storage.get("properties").shopId,
                    };
                    Goods.getCollocate(params).then((res) => {
                        if (!!res) {
                            this.isShowCollocate = true;
                        } else {
                            this.isShowCollocate = false;
                        }
                    });
                }
            },
            // 去搭配
            toCollocate() {
                this.$router.push({
                    path: '/pages/goodsPackage/wares/collocate-design',
                    query: {
                        goodsName: this.goodsName,
                        partCode: this.goodsCode
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
                    wx.nextTick(() => {
                        this.createCanvas()
                    })

                })
            },
            //点击分享给朋友
            shareToFriend(){
                // this.refresh_no=true; //使分享回来时，不刷新页面
            },
            //点击生成海报按钮
            async beforeSharePoster() {
                let root = this;
                root.shareFlag=false; //关闭底部弹框
                root.isClickCanvas = true;
                global.showLoading({mask:true})
                await this.touchAuthDown(); //触发授权
                if (root.isCanvasComplete) {
                    root.sharePoster()
                } else {
                    root.isHasPoster();
                }
            },
            //循环判断海报数据是否已经请求完且绘画好
            isHasPoster(){
                this.timeout = setTimeout(() => {
                    if (this.isCanvasComplete) {
                        this.sharePoster()
                        clearTimeout(this.timeout)
                    }else{
                        this.isHasPoster()
                    }
                }, 1500)
            },

            // 显示分享海报
            sharePoster() {
                this.showPoster = true
                global.hideLoading();
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
                let goodsName = this.goodsName
                if (goodsName && goodsName.length > 14) {
                    goodsName = goodsName.slice(0, 14);
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
                     ctx.setStrokeStyle('#B3B3B3');
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
                //    console.log('canvasToTempFilePath_draw')
                    wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: realWidth,
                        height: realHeight,
                        canvasId: 'mycanvas',
                        success(res) {
                        //    console.log('res.tempFilePath')
                            root.saveImgUrl = res.tempFilePath;
                            root.showCanvas=false;
                            //延迟一会状态变为完成，否则马上显示，效果不好
                            setTimeout((res)=>{
                                root.isCanvasComplete = true;
                            },500)
                        },
                        fail() {
                        //    console.log('canvasToTempFilePath_false')
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
//                            console.log('getSetting_success')
                            // 如果没有则获取授权
                            if (!res.authSetting['scope.writePhotosAlbum']) {
//                                console.log('刚授权了')
                                wx.authorize({
                                    scope: 'scope.writePhotosAlbum',
                                    success() {
//                                        console.log('授权成功')
                                        root.isAuthorityDown = true
                                        resolve(true)
                                    },
                                    fail() {
//                                        console.log('拒绝保存之后，唤起权限授权')
                                        root.isAuthorityDown = false
                                        resolve(false)
                                    }
                                })
                            } else {
                                root.isAuthorityDown = true
//                                console.log('有授权直接保存')
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
                this.isPassHide=false;//回来时不去触发onHide
            },
            //获取opensetting回调结果
            async getOpensettingInfo(e) {
                global.showLoading({mask:true})
                await this.touchAuthDown();
                global.hideLoading();
            },
            //下载图片
            saveImg() {
                let self = this;
                wx.hideLoading()
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
            }
        },
        watch: {
            'colorActiveIndex': function () {
                if (this.fissionType) {
                    this._fissionColorAndSizeItem()
                    return
                }

                if (this.colorActiveIndex >= 0 && this.colorActiveIndex != null) {
                    this.colorActiveItem = this.goodsInfo.colorsVoList[this.colorActiveIndex]
                } else {
                    this.colorActiveItem = ''
                }
            },
            'sizeActiveIndex': function () {
                if (this.fissionType) {
                    this._fissionColorAndSizeItem()
                    return
                }

                if (this.sizeActiveIndex >= 0 && this.sizeActiveIndex != null) {
                    this.sizeActiveItem = this.goodsInfo.sizesVoList[this.sizeActiveIndex]
                } else {
                    this.sizeActiveItem = ''
                }
            },
            'showMessage':function(){
                if(this.showMessage==true){
                    this.getUserInfo('operate');
                }
            },
            'stuckList': function () {
                if (!this.goodsInfo || !this.goodsInfo.colorsVoList || this.goodsInfo.colorsVoList.length === 0) {
                    return
                }
                let goodSkuList = {}
                goodSkuList.colorList = []
                goodSkuList.sizeList = []
                goodSkuList.colorAndSizeList = []
                goodSkuList.url = this.goodsInfo.url
                goodSkuList.salePrice = this.goodsInfo.salePrice
                goodSkuList.rebateAmount = this.goodsInfo.rebateAmount

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
                }
            },
            'goodsInfo': function () {
                if (!this.fissionType || !this.goodsInfo || !this.goodsInfo.sizeColorMessage || this.goodsInfo.sizeColorMessage.length === 0) {
                    return
                }
                let goodSkuList = {}
                goodSkuList.colorList = []
                goodSkuList.sizeList = []
                goodSkuList.colorAndSizeList = []
                goodSkuList.url = this.goodsInfo.url
                goodSkuList.salePrice = this.goodsInfo.salePrice
                if (this.goodsInfo.sizeColorMessage.length) {

                    // 颜色
                    let temporaryColorArr = []
                    let forEachColorArr = []    // 临时存储，防止数据污染
                    let forEachSizeArr = []
                    this.goodsInfo.sizeColorMessage.forEach((item, index) => {
                        let obj = {}
                        obj.colorCode = item.colorCode
                        obj.colorId = item.colorId
                        obj.colorName = item.colorName
                        obj.urls = item.urls
                        obj.none = true     // 默认按钮可以点击
                        obj.colorSortseq = item.colorSortseq
                        temporaryColorArr.push(obj)
                    })
                    forEachColorArr = global.objCombine(temporaryColorArr, 'colorCode')
                    goodSkuList.colorList = forEachColorArr

                    // 尺码
                    let temporarySizeArr = []
                    this.goodsInfo.sizeColorMessage.forEach((item) => {
                        let obj = {}
                        obj.sizeCode = item.sizeCode
                        obj.sizeId = item.sizeId
                        obj.sizeName = item.sizeName
                        obj.none = true     // 默认按钮可以点击
                        obj.sizeSortseq = item.sizeSortseq
                        temporarySizeArr.push(obj)
                    })
                    forEachSizeArr = global.objCombine(temporarySizeArr, 'sizeCode')
                    goodSkuList.sizeList = forEachSizeArr

                    // 颜色下存放对应尺码
                    forEachColorArr.forEach((itm, itmIndex) => {
                        let obj = {}
                        obj.colorCode = itm.colorCode
                        obj.colorId = itm.colorId
                        obj.colorName = itm.colorName
                        goodSkuList.colorAndSizeList.push(obj)
                        goodSkuList.colorAndSizeList[itmIndex].sizeChildList = []
                    })

                    this.goodsInfo.sizeColorMessage.forEach((item, index) => {
                        goodSkuList.colorAndSizeList.forEach((colorAndSizeItem, colorAndSizeIndex) => {
                            let skuQty = 1;
                            let showFlag = 1;//1为显示限购数量信息，否则显示库存信息
                            if (this.fissionType === 1) {
                                // 如果剩余库存大于限购数量，取限购数量，否则取剩余库存
                                if((item.qty-item.clustNum)>item.seckQty){
                                     skuQty = item.seckQty; //秒杀限购数量
                                     showFlag = 1;
                                }else{
                                    skuQty = item.qty-item.clustNum; //秒杀剩余库存
                                    showFlag = null;
                                }
                            }
                            if (item.colorCode === colorAndSizeItem.colorCode) {
                                // 没有库存
                                if (item.qty === item.clustNum) {
                                    skuQty = 0
                                }

                                colorAndSizeItem.sizeChildList.push({
                                    sizeCode: item.sizeCode,
                                    sizeName: item.sizeName,
                                    skuId: item.skuId,
                                    skuQty: skuQty,
                                    showFlag:showFlag, //判断数量上限是显示库存不足还是显示限购数量
                                })
                            }

                            if (goodSkuList.colorAndSizeList.length === colorAndSizeIndex+1 &&
                                this.goodsInfo.sizeColorMessage.length === index+1) {
                                this.sellFlag = this.goodsInfo.sellFlag
                                this.isLoading = false
                                this.goodSkuList = goodSkuList
                            }
                        })
                    })
                }
            }
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
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
    .ticket-content {
        width: 100%;
        position: fixed;
        z-index: 102;
        bottom: 0;
        background: white;
    }
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
            .wrapper_Bubbling {
                position: absolute;
                top: computed(556);
                right: computed(30);
                overflow: hidden;
                height: 90px;
                width: 236px;
                z-index: 100;
                .wrapper_Bubbling_bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 99;
                    background: transparent;
                }
            }
            .bubblingWrapper {
                width: 100%;
                height: 100%;
                .bubblingWrap {
                    text-align: right;
                    height: 30px !important;
                    .bubbling {
                        position: relative;
                        display: inline-block;
                        height: 18px;
                        line-height: 18px;
                        margin-bottom: 3px;
                        margin-top: 3px;
                        border-radius: 12px;
                        color: $text-primary;
                        font-size: $font-little;
                        background: rgba(255, 255, 255, 0.6);
                        padding: 3px 10px 3px 4px;
                        transition: background 2s;
                        img {
                            width: 18px;
                            height: 18px;
                            border-radius: 50%;
                            display: inline-block;
                            margin-right: 3px;
                        }
                        .overflow {
                            max-width: 50px;
                        }
                        span {
                            display: inline-block;
                            line-height: 18px;
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
                img {
                    width: 100%;
                    height: 100%;
                }
                /*margin-bottom: computed(30);*/
                > swiper {
                    max-height: computed(750);
                    min-height: computed(60);
                    width: 100%;
                    height: 100%;
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
                .isfisson-detail-section {
                    display: block !important;
                }
                .detail-section, .isfisson-detail-section {
                    position: relative;
                    display: flex;
                    align-items: bottom;
                    padding: 28rpx 0 35rpx 0;
                    margin: 0 31rpx;
                    &.detail-section-first {
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 5rpx solid $color-background;
                        padding: 35rpx 0 32rpx;
                    }
                    .title {
                        font-size: $font-h0;
                        font-weight: bold;
                        width: 94%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .btn-collect {
                        position: absolute;
                        top: 50%;
                        right: computed(-33);
                        transform: translate(0, -50%);
                        width: computed(95);
                        text-align: center;
                        > p:first-child {
                            font-size: $font-title1;
                        }
                        > p:last-child {
                            font-size: $font-little;
                            color: $text-regular;
                        }
                        .btn-collected {
                            color: $color-red;
                        }
                    }
                    &.price {
                        display: flex;
                        align-items: flex-end;
                        position: relative;
                        .price_now {
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
                            margin: 0 0 0 computed(24);
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
                            > .iconfont {
                                color: $color-white;
                                font-size: $font-common;
                            }
                        }
                        .benefit-help {
                            padding: computed(8) computed(12) 0;
                            font-size: $font-num;
                            line-height: computed(34);
                            color: $text-price;
                        }
                    }
                    .price-box {
                        position: relative;
                        // height:computed(110);
                        background: linear-gradient(90deg, $domaincolor, $gradientcolor);
                        border-radius: computed(10);
                        margin-top: computed(24);
                        .detail-top {
                            margin: computed(0) computed(20);
                            padding-top: computed(25);
                            .detail-price {
                                color: $color-white;
                                font-size: $font-common;
                                width: computed(380);
                                padding-bottom: computed(8);
                                .price-title {
                                    padding-bottom: computed(5);
                                    .assble-account {
                                        height: computed(32);
                                        line-height: computed(32);
                                        display: inline-block;
                                        padding: 0 computed(20);
                                        margin-left: computed(15);
                                        background: $color-white;
                                        opacity: 0.84;
                                        border-radius: computed(16);
                                        color: $domaincolor;
                                    }
                                }
                                .price_now {
                                    margin-left: computed(-5);
                                    span:nth-of-type(1) {
                                        font-size: $font-h1;
                                        display: inline-block;
                                        padding-right: computed(8);
                                    }
                                    span:nth-of-type(2) {
                                        text-decoration: line-through;
                                    }
                                }
                            }
                            .detail-countdown {
                                position: relative;
                                .btn-status{
                                    padding-top: computed(40);
                                    font-size: computed(24);
                                    color: $color-white;
                                    .right{
                                        text-align: right;
                                    }
                                }
                            }
                        }
                        .detail-progress {
                            border-top: computed(1) solid $color-white;
                            width: computed(650);
                            margin: computed(8) 0 0 computed(25);
                        }
                        .img{
                            position: absolute;
                            top: computed(43);
                            right: computed(203);
                            width: computed(112);
                            height: computed(112);
                        }
                    }
                }
            }
            .label {
                display: flex;
                align-items: center;
                background: $color-white;
                margin-bottom: computed(12);
                padding: computed(20) 0;
                .label-left {
                    margin-left: 50rpx;
                    color: #FE3636;
                    font-size: $font-h1;
                }
                .label-view {
                    display: flex;
                    align-items: center;
                    color: $text-secondary;
                    font-size: $font-common;
                    margin-left: computed(40);
                    .iconfont {
                        color: #FE3636;
                        font-size: $font-h2;
                        margin-right: computed(4);
                    }
                }
            }
            .shopMerit {
                background: $color-white;
                padding: computed(28) computed(30) computed(24);
                margin-bottom: computed(12);
                .shopMerit-title {
                    color: $text-primary;
                    font-size: $font-h0;
                    margin-bottom: computed(20);
                    font-weight: 600;
                }
                .shopMerit-content {
                    color: $text-regular;
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
                    .discount-item-title {
                        flex-shrink: 0;
                        display: inline-block;
                        line-height: computed(90);
                        width: computed(116);
                        font-size: $font-regular;
                        color: $text-regular;
                        text-align: center;
                    }
                    .discount-item-right {
                        display: flex;
                        width: calc(100% - 116rpx);
                        justify-content: space-between;
                        border-bottom: 1rpx solid $text-placeholder;
                        .discount-item-info {
                            display: inline-block;
                            width: computed(450);
                            height: computed(90);
                            line-height: computed(90);
                            box-sizing: border-box;
                            color: $color-white !important;
                            font-size: $font-regular;
                            &.long {
                                width: computed(565);
                            }
                            .text-regular {
                                color: $text-regular;
                            }
                            .color-black-33 {
                                color: $color-black-33;
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
                                background-image: url("../images/vourcher.png");
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
                    padding: 10rpx 32rpx;
                    height:computed(50);
                }
                .other-detail-main {
                    width: 100%;
                    img {
                        width: 100%;
                        display: block;
                    }
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
             // 促销立即购买提示
           .fisson-tips {
               width: 100%;
               height: computed(60);
               line-height: computed(60);
               background: rgba(255, 236, 229, 1);
               color: $domaincolor;
               font-size: computed(22);
               text-align: center;
            }

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
                border-top: 1px solid $text-placeholder;
                button::after {
                    display: none;
                }
                li, button {
                    position: relative;
                    display: inline-block;
                    min-height: computed(107);
                    &.width-180{
                        width: computed(180) !important;
                    }
                    &.btn-home {
                        padding-left: computed(16);
                    }
                    &.btn-home,
                    &.btn-shopping,
                    &.btn-collect {
                        flex-shrink: 0;
                        width: computed(90);

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

                    &.btn-bottom {
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
                            background: linear-gradient(90deg, $color-red, $gradientcolor);
                            p {
                                width: 100%;
                                height: computed(20);
                                line-height: computed(20);
                                font-size: computed(20);
                            }
                            .btn-bottom-name {
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
                            background: linear-gradient(90deg, $yellow-start-color, $yellow-end-color);
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

                    &.btn-buy {
                        padding-top: computed(10);
                        font-size: $font-regular;
                        .btn-bottom-buy, .btn-bottom-ready, .btn-bottom-over {
                            color: $color-white;
                            text-align: center;
                            width: computed(516);
                            height: computed(80);
                            line-height: computed(80);
                            border-radius: computed(40);
                        }
                        .btn-bottom-buy {
                            font-size: $font-regular;
                            min-height:computed(20);
                            background: $bggradientcolor;
                        }
                        .btn-bottom-ready {
                            background: $color-white;
                            color: $domaincolor;
                            border: computed(1) solid $domaincolor;
                        }
                    }

                    &.btn-shopping{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding: 0;
                        background: #fff;
                        border: none;
                        border-radius: 0;
                        line-height: 1;
                        .iconfont{
                            height: $font-h0;
                            margin-top: 0;
                        }
                        .btn-home-name{
                            height: $font-mini;
                            margin-top: 0;
                        }
                        &::after{
                            content: '';
                            display: none !important;
                        }
                        &::before{
                            display: none !important;
                        }
                    }
                }
            }
            .fission-bottom{
                height:computed(107);
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
            .apply {
                box-sizing: border-box;
                width: computed(90);
                height: computed(90);
                margin-bottom: computed(13);
                background: $text-apply;
                border-radius: 50%;
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
                    color: #fff;
                    font-size: computed(20);
                    text-align: center;
                    margin-top: computed(-5);
                }
            }
            .top-btn {
                width: computed(88);
                height: computed(88);
                border-radius: 50%;
                overflow: hidden;
                font-size: computed(20);
                text-align: center;
                position: fixed;
                bottom: computed(200);
                right: computed(20);
                background: #ffffff;
                opacity: .84;
                i {
                    margin-top: computed(10);
                    font-size: computed(40);
                    color: #333333;
                }
                p {
                    margin-top: computed(-5);
                    text-align: center;
                    color: #333333;
                }
                .collocate {
                    bottom: computed(400);
                }
            }
        }
        .absolute {
            position: absolute !important;
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
            .explain-sure {
                font-size: $font-common;
                margin: 0 auto;
                width: computed(180);
                height: computed(50);
                line-height: computed(50);
                border-radius: computed(25);
                background: $color-red;
                color: $color-white;
            }
        }
        .sharePopupWrap {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .7);
            z-index: 10000;
            .sharePopup {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                text-align: center;
                background: $color-white;
                .sharePopup-title {
                    font-size: $font-title1;
                    line-height: $font-title1;
                    padding: computed(42) 0 computed(32);
                }
                .sharePopup-line {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding-bottom: computed(32);
                    height: computed(124);
                    button {
                        position: absolute;
                        top: 0;
                        left: 33.33%;
                        transform: translate(-66.66%, 0);
                        width: computed(120);
                        font-size: $font-common;
                        line-height: $font-common;
                        background: $color-white;
                        margin: 0;
                        padding: 0;
                        text-align: center;
                        &::after {
                            border: none;
                        }
                        &:nth-child(2) {
                            left: 66.66%;
                            transform: translate(-33.33%, 0);
                        }
                        .iconfont {
                            font-size: computed(80);
                            color: #46BB36;
                            line-height: computed(80);
                            margin-bottom: computed(20);
                        }
                        .share-poster-color {
                            color: #FFA321
                        }
                    }
                }
                .sharePopup-bottom {
                    font-size: $font-regular;
                    border-top: 1px solid $color-light-gray;
                    height: computed(88);
                    line-height: computed(88);
                }
            }
        }

        .poster-box {
            position: fixed;
            width: 100%;
            height: 100%;;
            background: transparent;
            overflow: hidden;
            background-color: rgba(0, 0, 0, .7);
            z-index: 100;
            top: 0;
            left: 0;
            .poster-content {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: computed(462);
                background: transparent;
                z-index: 10000;
                position: absolute;
                left: 50%;
                top: computed(75);
                transform: translate(-50%, 0);
            }
            .close-poster-btn {
                display: block;
                width: computed(83);
                height: computed(83);
                -webkit-border-radius: computed(83);
                -moz-border-radius: computed(83);
                border-radius: computed(83);
                background: url("../images/close-btn.png") no-repeat center;
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
                    background: url("../images/save-btn.png") no-repeat center;
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
            overflow: hidden;
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
<style lang="scss" type="text/scss">
    .qs-wares {
        .explainWrap{
            .van-popup{
                background: transparent;
            }
        }
    }
</style>
