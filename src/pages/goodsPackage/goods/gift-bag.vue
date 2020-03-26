/*
* createTime：2019/7/25
* author：fujie.wen
* description: 新人礼包
*/
<template>
    <div class="page-cont">
        <wxs module="filter" src="../../../filter/filterCommon.wxs"></wxs>

        <div class="header">
            <!-- 顶部图片 begin -->
            <img v-for="(item, index) in xrlb_ad01List"
                 v-if="item.fileType == 1"
                 :key="item.coverFileUrl"
                 :src="filter.imgFilter(item.coverFileUrl,company_id, '710*262')"
                 class="header-img"
                 @click="goPath(item.url)"

                 lazy-load="true">
            <!-- 顶部图片 end -->

            <!-- 点击领取 begin -->
            <div class="coupon">
                <div class="coupon-item coupon-cash" @click="clickCoupon('new')">
                    <div class="coupon-item__cash">
                        <span class="coupon-item__logo">￥</span>
                        <span class="coupon-item__gold">20</span>
                        <p class="coupon-item__describe cash_red">现金红包</p>
                    </div>
                    <div class="coupon-item__click">
                        <p>点击</p>
                        <p>领取</p>
                    </div>
                    <button class="authorization-btn"
                            @click.stop=""
                            open-type="getUserInfo"
                            v-if="!vipInfoId"
                            @getuserinfo="getuserinfo('new')">授权按钮</button>
                </div>
                <div class="coupon-item coupon-new" @click="clickCoupon('cash')">
                    <div class="coupon-item__cash">
                        <span class="coupon-item__logo">￥</span>
                        <span class="coupon-item__gold">10</span>
                        <p class="coupon-item__describe">新人专享券</p>
                    </div>
                    <div class="coupon-item__click">
                        <p>点击</p>
                        <p>领取</p>
                    </div>
                    <button class="authorization-btn"
                            @click.stop=""
                            open-type="getUserInfo"
                            v-if="!vipInfoId"
                            @getuserinfo="getuserinfo('cash')">授权按钮</button>
                </div>
            </div>
            <!-- 点击领取 end -->

        </div>

        <!--特惠商品列表1-->
        <div class="promotion-model" v-if="xrlb_thspList.length || xrlb_thspObj.goodsList">
            <img v-for="(item, index) in xrlb_thspList"
                 v-if="item.fileType == 1"
                 :key="item.coverFileUrl"
                 :src="filter.imgFilter(item.coverFileUrl,company_id, '710*200')"
                 class="header-img promotion"
                 @click="goPath(item.url)"

                 lazy-load="true">

            <good-list :goodsList="xrlb_thspObj.goodsList"></good-list>
        </div>

        <!--特惠商品列表2-->
        <div class="promotion-model" v-if="xrlb_gwphList.length || xrlb_gwphObj.goodsList">
            <img v-for="(item, index) in xrlb_gwphList"
                 v-if="item.fileType == 1"
                 :key="item.coverFileUrl"
                 :src="filter.imgFilter(item.coverFileUrl,company_id, '710*200')"
                 class="header-img promotion"
                 @click="goPath(item.url)"

                 lazy-load="true">

            <good-list :goodsList="xrlb_gwphObj.goodsList"></good-list>
        </div>

        <!--猜你喜欢-->
        <guess-love></guess-love>

        <van-toast id="van-toast" />
    </div>
</template>

<script>
    import { Cms, Distribution } from "@/api/service";
    import Toast from 'vant-weapp/dist/toast/toast';
    import GoodList from '@/components/GoodList.vue'
    import GuessLove from '@/components/GuessLove.vue'

    export default {
        config:{
            navigationBarTitleText: '新人礼包'
        },
        components:{'good-list': GoodList,'guess-love': GuessLove},
        data() {
            return {
                company_id: "",
                vipInfoId: "",
                // 模块编码
                modelCode:{
                    xrlb_ad01: 'xrlb_ad01', // 首屏背景图
                    xrlb_thsp: 'xrlb_thsp', // 特惠商品
                    xrlb_gwph: 'xrlb_gwph', // 购物排行
                },
                xrlb_ad01List: [],//头部背景图
                xrlb_thspList: [],//特惠商品图
                xrlb_gwphList: [],//购物排行图
                xrlb_thspObj: {},// 特惠商品数据
                xrlb_gwphObj: {},// 购物排行数据
                pageCode: 'promote4',// 新人礼包页面编码

            }
        },
        methods: {
            /** 授权获取用户信息 **/
            async getuserinfo(type){
                let isSuccess = await global.loginAuthor();
                if(isSuccess) {
                    this.vipInfoId = global.Storage.get('USER_INFO').vipInfoId;
                    this.clickCoupon(type);
                }else{
//                    Toast('授权失败');
                }
            },
            /** 点击领取 跳转 **/
            clickCoupon(type){
                switch (type) {
                    case 'new':// 分销商中心的跳转
                        let data = {
                            vipInfoHdId: global.Storage.get('USER_INFO').vipInfoId,
                            busconsCode: global.baseConstant.busContsCode,
                        };
                        Distribution.isDistribution(data).then((res) => {
                            let url = '';
                            if (false) {  // 会员已经是分销商的情况下跳转分销商中心
                                url = '/pages/distributionPackage/center';
                            } else {
                                url = `/pages/distributionPackage/spread?vipId=${
                                    !!this.vipId ? this.vipId : ""
                                    }&taskId=${!!this.taskId ? this.taskId : ""}&ascriptionId=${
                                    !!this.$route.ascriptionId ? this.$route.ascriptionId : ""
                                    }`;
                            }
                            this.$router.push(url);
                        }, (err) => {
                            Toast(err.errorMsg)
                        })
                        break;
                    case 'cash':
                        //  判断用户是否绑定手机号
                        global.c_getUserInfo().then((res) => {
                            let url = '';
                            if (!!res.mobilePhone) {
                                url = '/pages/UserPackage/vouchers/my-vouchers';
                            }else{
                                url = '/pages/UserPackage/phone/bind-phone?successUrl=/pages/UserPackage/vouchers/my-vouchers';
                            }
                            this.$router.push(url);
                        }, (err) => {
                            Toast(err.errorMsg + ',请稍后再试~')
                        })

                        break;
                }
            },
            // 点击跳转
            goPath(url) {
                if (url) {
                    this.$router.push(url);
                }
            },
            /**
             * 获取热卖商品、新品推荐
             * @param cmsWebItemCode 页面元素编号
             * @param listName 对象名称
             * @param sliceLength 对象名称
             *
             * cmsWebItemCode： 热卖商品 rmsp  新品推荐 xptj
             */
            _getCommonGoodsList(cmsWebItemCode, listName, sliceLength) {
                let data = {
                    // 模板编号
                    cmsTemplateCode: global.Storage.get("TEMPLATE_INFO").cmsTemplateCode,
                    // 页面编号
                    cmsWebCode: this.pageCode,
                    // 页面元素编号
                    cmsWebItemCode: cmsWebItemCode,
                    busContsCode: global.baseConstant.busContsCode,
                    shopId: global.Storage.get("properties").shopId,
                    onlineFlag: 1,// 是否获取促销图，不获取则不传
                };
                return Cms.getChoosebuyGoods(data).then(res => {
                    Toast.clear()
                    let obj = {};
                    if (!res || res.length === 0) {
                        return; // 判空
                    }
                    let currentList = [];
                    if (!!res[0].goodsList && res[0].goodsList.length) {
                        currentList = sliceLength ? res[0].goodsList.slice(0,sliceLength) : res[0].goodsList;
                    }

                    obj.name = res[0].cmsWebItemName;
                    obj.url = res[0].url;
                    obj.goodsList = currentList;
                    this[listName] = obj;
                    console.log(listName,this[listName],"====")
                });
            },
            // 获取v2模板
            getV2Model() {
                let data = {
                    cmsTemplateCode: global.Storage.get("TEMPLATE_INFO").cmsTemplateCode,
                    cmsWebCode: this.pageCode,
                    busContsCode: global.baseConstant.busContsCode
                };
                global.toastLoading();
                Cms.getUsrCmsInfoV2(data).then(res => {
                    res.cmsModulepageHdList.forEach((item, itemIndex) => {
                        if (!!item.cmsBackpageDtDtoList && item.cmsBackpageDtDtoList.length > 0) {
                            item.cmsBackpageDtDtoList.forEach((itm, itmIndex) => {

                                for(let key in this.modelCode){
                                    if (itm.cmsBackpageDtCode === key && !!itm.cmsBackpageDttList) {
                                        this[key+'List'] = itm.cmsBackpageDttList;
                                        console.log(key+'List',"+++++++",this[key+'List'])

                                    }
                                }
                            });
                        }
                    });

                    wx.nextTick(()=>{
                        global.toastLoading(false);// 开启
                    })
                });
            },
        },
        onLoad() {
            this.vipInfoId = global.Storage.get('USER_INFO').vipInfoId;
            this.company_id = global.Storage.get("COMPANYID").company_id;
            this.getV2Model();
            this._getCommonGoodsList('xrlb_thsp', "xrlb_thspObj");
            this._getCommonGoodsList('xrlb_gwph', "xrlb_gwphObj");
        }
    }
</script>

<style scoped lang="scss">
    /*公共样式*/
    .c_pd10{
        box-sizing: border-box;
        padding:computed(10);
    }

    .page-cont{
        background: $color-background;
    }
    .header{
        box-sizing: border-box;
        padding:computed(20) computed(20) 0 computed(20);
    }
    .header-img{
        height:computed(262);
        width:100%;

        &.promotion{
            height: computed(200);
            border-radius: computed(20);
            overflow: hidden;
            margin-bottom: computed(20);
        }
    }
    .promotion-model{
        margin-top: computed(-10);
        box-sizing: border-box;
        padding: computed(20);
        padding-bottom: 0;
    }
    .coupon{
        display: flex;
        justify-content: space-between;
        .coupon-item{
            background-size: 100% 100%;
            flex:1;
            height:computed(190);
            position: relative;
            color: $color-white;
            .coupon-item__cash{
                font-size: $font-title1;
                margin-left: computed(60);
                margin-top: computed(20);
                .coupon-item__logo{
                    font-size: computed(40);
                    font-weight: bold;
                }
                .coupon-item__gold{
                    font-size: computed(80);
                    line-height: 1;
                    font-weight: bold;
                }
                .coupon-item__describe{
                    line-height: 1;
                    font-weight: bold;
                }
                .cash_red{
                    padding-left: computed(10)
                }
            }
            .coupon-item__click{
                font-size: computed(22);
                font-weight: bold;
                position: absolute;
                top:computed(55);
                line-height: 1;
                right:computed(38);
            }
        }
        .coupon-cash{
            margin-left: computed(-10);
            background-image: url("../images/coupon-cash.png");
        }
        .coupon-new{
            margin-right: computed(-10);
            background-image: url("../images/coupon-new.png");
        }
    }
</style>
