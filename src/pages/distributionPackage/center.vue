<!--
 * @Author: lan.chen
 * @Date: 2019-06-29 14:02:08
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-08-10 19:55:06
 * @Description:
 -->
/*
* createTime：2019/3/1
* author：en.chen
* description:  分销商中心
*/
<template>
    <div class="center">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>

        <!-- 会员整合-分销商账号列表 begin -->
        <div class="distribution-list" v-if="accountList.length > 1">
            <div class="select-content clearfix"  @click="showAccountList = true">
                <div class="account fl">{{selectAccountInfo.mobilePhone}}</div>
                <div class="iconfont iconicondown-copy fl"></div>
            </div>
        </div>
        <!-- 会员整合-分销商账号列表 end -->

        <!-- 金额模块 begin -->
        <div class="funds-box">
            <ul class="clearfix">
                <li class="funds-item">
                    <h2>{{filter.minAmount(!!vipInfo.currentTotalAmount && vipInfo.currentTotalAmount >= 0 ?
                        vipInfo.currentTotalAmount : 0 )}}</h2>
                    <p>当前账户总金额（元）</p>
                </li>
                <li class="funds-item">
                    <h2>{{filter.minAmount(vipInfo.totalAmount || 0)}}</h2>
                    <p>累计总收入（元）</p>
                </li>
                <li class="funds-item">
                    <h2>{{filter.minAmount(vipInfo.withdrawAmount || 0)}}</h2>
                    <p>已提现（元）</p>
                </li>
                <li class="funds-item">
                    <h2>{{filter.minAmount(vipInfo.nonWithdrawableAmount || 0)}}</h2>
                    <p>不可提现（元）</p>
                </li>
            </ul>
        </div>
        <!-- 金额模块 end -->

        <!-- 提示 begin -->
        <p class="tip clearfix" v-if="!!vipInfo.qty">

            <text class="iconfont iconjingshi icon-tip"></text>
            <span>不可提现金额说明：下单支付成功，确认收货后{{vipInfo.qty}}天，方可提现</span>
        </p>
        <!-- 提示 end -->

        <!-- 分销商模块 begin -->
        <div class="user-box clearfix">
            <a href="/pages/distributionPackage/wallet" class="user-item flex-box" tag="div">
                <text class="iconfont iconwodeqianbao"></text>
                <p class="mgT30">我的钱包</p>
            </a>
            <div class="user-item flex-box" @click="canWithdraw">
                <text class="iconfont icontixian"></text>
                <p class="mgT30">申请提现</p>
            </div>
            <div @click="routerLink('/pages/distributionPackage/qrcode')" class="user-item flex-box"
                 :class="{'disabled': !vipInfo.effFlag}">
                <text class="iconfont iconerweima"></text>
                <p class="mgT30">推广二维码</p>
            </div>
            <div @click="routerLink('/pages/distributionPackage/subordinate')" class="user-item flex-box"
                 :class="{'disabled': !vipInfo.effFlag}">
                <text class="iconfont iconwodexiaji"></text>
                <p class="mgT30">我的团队</p>
            </div>
            <div @click="routerLink('/pages/distributionPackage/task-list')" class="user-item flex-box"
                 :class="{'disabled': !vipInfo.effFlag}">
                <text class="iconfont iconrenwu"></text>
                <p class="mgT30">我的任务</p>
            </div>
            <a href="/pages/distributionPackage/bill-info" class="user-item flex-box" tag="div">
                <text class="iconfont iconduizhangdan"></text>
                <p class="mgT30">对账单</p>
            </a>
            <div class="user-item flex-box" :class="{'disabled': !vipInfo.effFlag}" @click="qrcodeHandle">
                <text class="iconfont iconerweima"></text>
                <p class="mgT30">培训交流群</p>
            </div>
        </div>
        <!-- 分销商模块 begin -->

        <!-- 分销商群二维码弹窗 begin -->
        <van-popup :show="showQrcode" class="qrcode-popup" v-if="showQrcode">
            <p class="popup-title">扫一扫</p>
            <div class="close-btn" @click="showQrcode = false">
                <text class="iconfont iconguanbi close-icon"></text>
            </div>
            <div class="qrcode-box">
                <p class="image-title">进群获得更多资讯</p>
                <img :src="serverUrl+'images/distribution/group-qrcode.png'" lazy-load="true">
            </div>
        </van-popup>
        <!-- 分销商群二维码弹窗 end -->

        <!-- 会员整合-分销商账号列表选择弹窗 begin -->
        <!--<van-action-sheet-->
            <!--:show="showAccountList"-->
            <!--:actions="accountList"-->
            <!--@select="selectAccount"-->
        <!--/>-->

        <van-popup :show="showAccountList" position="bottom">
            <van-picker
                :columns="accountList"
                show-toolbar
                @cancel="showAccountList = false"
                @confirm="selectAccount"
                class="picker-fixed"
            />
        </van-popup>

        <!-- 会员整合-分销商账号列表选择弹窗 end -->


        <scroll-view scroll-y="false" style="z-index:10" :class="isX">
            <footer-bar ref="footer_bar"></footer-bar>
        </scroll-view>

        <van-dialog id="van-dialog"/>
        <van-toast id="van-toast"/>
    </div>
</template>
<script>
    import FooterBar from '@/components/FooterBar'
    import {Distribution} from '../../api/service'

    import Dialog from 'vant-weapp/dist/dialog/dialog';
    import Toast from 'vant-weapp/dist/toast/toast';

    export default {
        config: {
            navigationBarTitleText: '分销商中心'
        },
        components: {
            'footer-bar': FooterBar
        },
        data() {
            return {
                usrInfo: {},  // 用户信息
                vipInfo: {},  // 分销商信息
                upVipId: null,  // 上级会员id(出现于扫码登陆流程之后跳转)
                showQrcode: false,  // 控制是否显示分销商群二维码的弹窗
                serverUrl: '',
                accountList: [],  // 分销商账号列表
                selectAccountInfo: {},  // 选中的账号信息
                showAccountList: false  // 显示账号列表弹窗
            }
        },
        methods: {
            //  通过会员id获取用户信息
            async getUserInfo() {
                let data = {
                    vipId: global.Storage.get('USER_INFO').vipInfoId
                }
                Distribution.getUserInfo(data).then((res) => {
                    this.usrInfo = res
                    return res
                })
            },

            //  存在上级会员id时判断当前用户是否是上级会员的下级
            async checkLevel() {
                let usrInfo = await this.$store.dispatch('user/getUserInfo')
                let data = {
                    upVipId: this.upVipId,
                    unVipId: global.Storage.get('USER_INFO').vipInfoId
                }
                Distribution.canBindLevel(data).then(() => {
                    //  当前用户已经是上级会员的下级，不显示任何提示
//                    this.checkCashStatus() // 需求确认不需要失败提示
                }, () => {
                    let toastFlag = global.Storage.get('toastFlag')
                    if (!!toastFlag) {
                        // 需求确认不需要失败提示
//                        setTimeout(() =>{
//                            this.checkCashStatus()
//                        },3000)
                        return
                    } else {
                        //  当前用户不是上级会员的下级，提示已经是分销商
                        Toast({
                            message: `${usrInfo.vipName}已经是分销商了~`,
                            duration: 3000
                        })
                        global.Storage.set('toastFlag', {'isTip': 1})
                        // 需求确认不需要失败提示
//                        setTimeout(() =>{
//                            this.checkCashStatus()
//                        },3000)
                    }
                })
            },

            //  获取分销商账户信息
            getVipInfo() {

                let data = {
                    vipInfoHdId: global.Storage.get('USER_INFO').vipInfoId
                }

                //  会员整合新增选中分销商查询
                if(!!this.$store.state.distribution.accountInfo.id) {
                    data.vipInfoHdId = this.$store.state.distribution.accountInfo.vipInfoHdId
                }

                Distribution.getVipInfo(data).then((res) => {
                    this.vipInfo = res
                    if (res.isFirstFlag === 0) {  // isFirstFlag为0显示弹窗
                        this.showQrcode = true
                        this.setLoginFlag(res.id)
                    } else {
                        this.showQrcode = false
                    }
                    global.toastLoading(false);// 关闭
                })
            },

            //  检查是否存在提现失败
            async checkCashStatus() {
                let data = {
                    id: await this.$store.dispatch('distribution/getDistributionId')
                }
                Distribution.getFailReason(data).then((res) => {
                    // 存在失败的提现、转账
                    if (!!res && res.length > 0) {
                        this.failCallback(res.length)
                    }
                })
            },

            //  存在提现失败
            failCallback(result) {
                Dialog.confirm({
                    title: '提现拒绝通知',
                    message: `当前有${result}笔提现失败`,
                    confirmButtonText: '继续申请提现',
                    cancelButtonText: '我知道了'
                }).then(() => {
                    this.$router.push('/pages/distributionPackage/withdraw-apply')
                }).catch(() => {
                });
            },

            //  判断是否允许跳转提现页面
            canWithdraw() {
//                if(this.vipInfo.currentTotalAmount - this.vipInfo.nonWithdrawableAmount > 0) {
//                    this.$router.push('/distribution/withdraw-apply')
//                }else{
//                    Toast('可提现金额不足~')
//                }
                //  需求修改成直接跳转提现页面
                this.$router.push('/pages/distributionPackage/withdraw-apply')
            },

            //  设置登陆标识
            setLoginFlag(id) {
                let data = {
                    id: id
                }
                Distribution.setFlag(data).then(() => {
                })
            },

            //  路由跳转
            routerLink(path) {
                if (!this.vipInfo.effFlag || this.vipInfo.effFlag === 0) {
                    Toast('当前功能不可用~')
                    return
                } else {
                    this.$router.push(path)
                }
            },

            //  展示二维码弹窗
            qrcodeHandle() {
                if (!this.vipInfo.effFlag || this.vipInfo.effFlag === 0) {
                    return
                } else {
                    this.showQrcode = true
                }
            },

            //  获取会员整合的分销商
            getDistributionList() {
                Distribution.getDistributionList({}).then((res) => {
                    if(res && res.length) {
                        res.forEach((item) => {
                            item.text = item.mobilePhone
                        })
                        this.accountList = res

                        //  store中存放选中的用户账号
                        if(!!this.$store.state.distribution.accountInfo && !!this.$store.state.distribution.accountInfo.id) {
                            this.selectAccountInfo = this.$store.state.distribution.accountInfo
                        }else{
                            for(let i=0;i<res.length;i++) {
                                let item = res[i]
                                if(item.vipInfoHdId === global.Storage.get('USER_INFO').vipInfoId) {
                                    this.selectAccountInfo = item
                                }
                            }
                            this.$store.commit('distribution/setData', {storeKey: 'accountInfo', storeValue: this.selectAccountInfo})
                        }

                    }
                })
            },

            // 选择账号
            selectAccount(item){

                console.log(item.target.value)

                if(item.target.value.vipInfoHdId === this.selectAccountInfo.vipInfoHdId) {
                    this.showAccountList = false
                    return
                }else{
                    this.selectAccountInfo = item.target.value
                    this.$store.commit('distribution/setData', {storeKey: 'accountInfo', storeValue: item.target.value})
                    this.getVipInfo()
                    this.showAccountList = false
                }
            }
        },
        onLoad() {
//            global.toastLoading();// 开启
            this.serverUrl = global.baseConstant.serverUrl;
            this.upVipId = this.$route.query.vipId
            this.getDistributionList()
        },
        onUnload() {
            global.Storage.remove('toastFlag')
            Object.assign(this.$data, this.$options.data());
        },
        onShow() {
            this.getVipInfo()
        },
        mounted() {
            this.$refs.footer_bar.tabIndex = -1;
            this.$refs.footer_bar.getDistributionInfo()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
    .clearfix:after {
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden
    }

    .center {
        min-height: 100%;
        background: $color-background;
        overflow: hidden;
        .distribution-list{
            padding: 0 computed(30);
            height: computed(80);
            background: $color-white;
            overflow: hidden;
            position: relative;
            .select-content{
                margin: 0 auto;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }
            .account{
                font-size: $font-regular;
                line-height: $font-h2;
                text-align: center;
                color: $text-regular;
                height: $font-h2;
            }
            .iconicondown-copy{
                margin-left: computed(20);
                font-size: $font-h2;
                line-height: $font-h2;
                color: $text-placeholder;
                height: $font-small;
            }
        }
        .funds-box {
            margin: computed(30);
            padding: computed(30);
            box-sizing: border-box;
            color: $color-white;
            position: relative;
            background: linear-gradient(90deg, $domaincolor, $gradientcolor) !important;
            border-radius: computed(5);
            .funds-item {
                box-sizing: border-box;
                width: 50%;
                height: computed(120);
                float: left;
                overflow: hidden;
                h2 {
                    font-size: $font-h1;
                    line-height: 1;
                }
                p {
                    margin-top: computed(23);
                    font-size: $font-regular;
                    line-height: 1;
                    color: $color-white;
                }
                &:nth-of-type(2) {
                    padding-left: computed(40);
                }
                &:nth-of-type(3) {
                    padding-top: computed(23);
                }
                &:nth-of-type(4) {
                    padding-left: computed(40);
                    padding-top: computed(23);
                }
            }
            &::before {
                position: absolute;
                top: 50%;
                left: computed(30);
                transition: translateY(-50%);
                content: '';
                width: calc(100% - #{computed(60)});
                height: 0;
                border-bottom: dashed 1px $text-placeholder;
            }
            &::after {
                position: absolute;
                top: computed(30);
                left: 50%;
                transition: translateX(-50%);
                content: '';
                height: calc(100% - #{computed(60)});
                width: 0;
                border-left: dashed 1px $text-placeholder;
            }
        }
        .tip {
            margin: 0 computed(30);
            font-size: $font-small;
            line-height: computed(32);
            color: $domaincolor;
            .icon-tip {
                margin-right: computed(12);
                color: $domaincolor;
            }
        }
        .user-box {
            margin-top: computed(20);
            background: $color-white;
            .user-item {
                float: left;
                box-sizing: border-box;
                width: computed(250);
                height: computed(208);
                align-items: center;
                justify-content: center;
                border-bottom: solid 1px $color-background;
                border-right: solid 1px $color-background;
                font-size: $font-regular;
                line-height: 1;
                color: $text-primary;
                flex-direction: column;
                .iconfont {
                    font-size: computed(50);
                    line-height: computed(52);
                }
                &.disabled {
                    color: $text-placeholder;
                    .iconfont {
                        color: $text-placeholder;
                    }
                }
                &:nth-child(3n) {
                    border-right: none;
                }
            }
        }
        .qrcode-popup {
            box-sizing: border-box;
            background: $color-white;
            width: computed(630);
            overflow: hidden;
            .popup-title {
                box-sizing: border-box;
                font-size: $font-h2;
                line-height: computed(100);
                border-bottom: solid computed(1) $text-placeholder;
                text-align: center;
            }
            .close-btn {
                width: computed(100);
                height: computed(100);
                position: absolute;
                top: 0;
                right: 0;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                .close-icon {
                    width: computed(30);
                    height: computed(30);
                    color: #ccc;
                }
            }
            .qrcode-box {
                position: relative;
                padding: computed(75);
                width: computed(480);
                height: computed(480);
                .image-title {
                    font-size: $font-regular;
                    line-height: 1;
                    color: $text-primary;
                    width: 100%;
                    position: absolute;
                    top: computed(23);
                    left: 0;
                    text-align: center;
                }
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }

    scroll-view {
        position: fixed;
        bottom: 0;
        left: 0;
        height: computed(90);
        width: 100%;
    }
</style>
