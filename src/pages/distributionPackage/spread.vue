/*
* createTime：2019/3/22
* author：en.chen
* description:  分销商推广
*/
<template>
    <div class="spread-page-wrapper">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>
        <!-- <div :class="showPopup===true?'spread-pages':'spread-page'"> -->
        <div class="spread-page">
            <!-- 返回按钮 begin -->
            <div @click="returnIndex" class="return-btn">
                <text class="iconfont iconguanbi1"></text>
            </div>
            <!-- 返回按钮 end -->

            <!-- 模块富文本 begin -->
            <div class="image-list" v-show="showBg">
                <img :src="filter.imgFilter(item,company_id)" v-for="item in imgList"  mode="widthFix" :key="item" @load="onLoadImg">
            </div>
            <!-- 模块富文本 end -->

            <!-- 接口指定按钮 begin -->
            <div
                v-if="!!btnText"
                class="diy-btn"
                @click="goApply"
                ref="diyBtn"
                :style="{ background : (!!btnImg ? 'url('+ filter.imgFilter(btnImg,company_id) +') no-repeat 100% center' : '#333') }"
            >{{btnText}}</div>
            <!-- 接口指定按钮 end -->

            <!-- 底部按钮 begin showBg是为了一开始不显示该按钮-->
            <div v-if="!btnText && showBg" class="bottom-btn" @click="goApply">申请成为分销商</div>
            <!-- 底部按钮 end -->

            <!-- 注册协议弹窗 begin -->
            <van-dialog
                use-slot
                class="agreement-popup"
                :show="showAgreement"
                v-if="showAgreement"
                confirmButtonText="同意协议"
                confirm-button-color="#333"
                @confirm="apply"
            >
                <img class="agreement-title" :src="serverUrl+'images/distribution/popup-title.png'" mode="widthFix">
                <div class="agreement-txt">
                    <div class="" v-html="agreement"></div>
                </div>
                <div @click="returnIndex" class="close-btn">
                    <text class="iconfont iconguanbi"></text>
                </div>
            </van-dialog>
            <!-- 注册协议弹窗 end -->

            <!-- 注册成功的红包提示 begin -->
            <van-popup
                v-if="showReward"
                :show="showReward"
                class="reward-popup"
                :overlay="true"
                @click-overlay="routerLink('/pages/distributionPackage/center')"
            >
                <img :src="serverUrl+'images/distribution/reward.png'" mode="widthFix">
                <div @click="routerLink('/pages/distributionPackage/center')" class="close-btn"></div>
                <p class="reward-value">{{reward}}</p>
                <p class="reward-tip">获得{{reward}}元现金红包！</p>
                <div @click="routerLink('/pages/distributionPackage/wallet')" class="confirm-btn"></div>
            </van-popup>
            <!-- 注册成功的红包提示 end -->


            <!-- 绑定手机号弹窗 end -->
        </div>
        <div class="showPhone">
            <van-popup :show="showPopup">
                <phone-popup :showPopup.sync="showPopup"></phone-popup>
            </van-popup>
        </div>

        <van-toast id="van-toast" />
    </div>
</template>
<script>
// import { Toast, Popup, Field } from 'vant';
import { Cms, Distribution, UserService } from '../../api/service'
import phonePopup from '../../components/popup-phone'
import Toast from 'vant-weapp/dist/toast/toast'
import Dialog from 'vant-weapp/dist/dialog/dialog'
export default {
    config:{
        navigationBarTitleText: '推广活动'
    },
    components: {
        // "van-field": Field,
        phonePopup
    },
    data() {
        return {
            vipId: null,  // 上级会员id
            taskId: null,  // 任务id
            imgList: [],  // 背景图列表
            btnImg: null,  // 接口定义按钮
            btnText: '', // 接口定义按钮文案
            backgroundImage: null,
            ascriptionId: null,  // 归属地信息
            agreement: null,  // 注册协议
            showAgreement: false,  // 显示注册协议弹窗
            reward: null,  // 成为分销商奖励金
            showReward: false,  // 显示注册成功弹窗
            btnLock: false,  // 按钮锁
            showPopup: false,//显示手机弹窗
            scrollBox: null,
            timer: null,
            phoneNum: '',  // 绑定手机号
            captcha: '',  //验证码
            captchaText: '点击获取验证码',  // 文字提示
            captchaLocked: false,  // 获取验证码按钮锁
            isSendCaptcha: false, // 是否获取过验证码
            time: 60,  // 倒计时时间
            checkStatus: false,  // 手机号是否允许绑定状态
            PhoneBtnLock: false,  //  绑定手机号按钮锁
            serverUrl: '',
            company_id:'',//公司id
            showBg: false,// 是否显示背景图
        }
    },
    methods: {

        // 背景图加载成功事件
        onLoadImg(e){
            global.toastLoading(false);// 关闭
            this.showBg = true;
        },
        inputFocus() {
            const ua = window.navigator.userAgent.toLocaleLowerCase();
            const isIOS = /iphone|ipad|ipod/.test(ua);
            //  处理fix的兼容性
            if (!!isIOS) document.querySelector('body').setAttribute('style', 'position:fixed')
        },

        inputBlur() {
            const ua = window.navigator.userAgent.toLocaleLowerCase();
            const isIOS = /iphone|ipad|ipod/.test(ua);
            //  处理fix的兼容性
            if (!!isIOS) document.querySelector('body').removeAttribute('style')
        },

        //  获取页面信息
        getPage() {
            let data = {
                cmsTemplateCode: global.Storage.get('TEMPLATE_INFO').cmsTemplateCode,
                cmsWebCode: global.pageCode.distribution.children.spread.name,
                busContsCode: global.baseConstant.busContsCode
            }
            Cms.getUsrCmsInfoV2(data).then((res) => {
                if (res.cmsModulepageHdList.length > 0 && !!res.cmsModulepageHdList[0] && !!res.cmsModulepageHdList[0].cmsBackpageDtDtoList && !!res.cmsModulepageHdList[0].cmsBackpageDtDtoList.length > 0) {
                    let list = res.cmsModulepageHdList[0].cmsBackpageDtDtoList
                    list.forEach((item) => {
                        if (item.cmsBackpageDtCode === global.pageCode.distribution.children.spread.code) {
                            if (!!item.cmsBackpageDttList && !!item.cmsBackpageDttList.length > 0) {
                                item.cmsBackpageDttList.forEach((image) => {
                                    //  实施确认推广按钮编码为tgbt
                                    if (image.cmsBackpageDttCode === 'tgbt') {
                                        this.btnImg = image.coverFileUrl
                                        this.btnText = image.cmsBackpageDttName
                                    } else {
                                        if (!!image.coverFileUrl) {
                                            this.imgList.push(image.coverFileUrl)
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            })
        },

        //  跳转申请
        async goApply() {
            let data = {
                vipInfoHdId: global.Storage.get('USER_INFO').vipInfoId,
                busconsCode: global.baseConstant.busContsCode,
            }
            Distribution.isDistribution(data).then((res) => {
                //                    let url = null
                //                    if(!!res.isVipMdt) {  // 会员已经是分销商的情况下跳转分销商中心
                //                        url = `/distribution/center?vipId=${!!this.vipId ? this.vipId : ''}&taskId=${!!this.taskId ? this.taskId : ''}&ascriptionId=${!!this.$route.ascriptionId ? this.$route.ascriptionId : '' }`
                //                    }else{
                //                        url = `/distribution/apply?vipId=${!!this.vipId ? this.vipId : ''}&taskId=${!!this.taskId ? this.taskId : ''}&ascriptionId=${!!this.$route.ascriptionId ? this.$route.ascriptionId : '' }`
                //                    }
                //                    this.$router.push(url)

                //  2期修改成业务逻辑都放在推广页完成
                if (!!res.isVipMdt) {  // 会员已经是分销商的情况下跳转分销商中心
                    this.$router.push(`/pages/distributionPackage/center?vipId=${!!this.vipId ? this.vipId : ''}&taskId=${!!this.taskId ? this.taskId : ''}&ascriptionId=${!!this.$route.ascriptionId ? this.$route.ascriptionId : ''}`)
                } else {
                    //  判断用户是否绑定手机号，以绑定的情况下显示注册协议，未绑定的情况下显示绑定手机号弹窗
                    UserService.getUserInfo().then((res) => {
                        if (!!res.mobilePhone) {
                            this.showAgreement = true
                        } else {
                            this.showPopup = true
                        }
                    }, (err) => {
                        Toast(err.errorMsg + ',请稍后再试~')
                    })
                }
            }, (err) => {
                Toast(err.errorMsg)
            })
        },

        //  绑定上下级关系
        bindLevel() {
            let data = {
                upVipId: this.$route.query.vipId,
                unVipId: global.Storage.get('USER_INFO').vipInfoId,
                ascriptionId: !!this.$route.query.ascriptionId ? this.$route.query.ascriptionId : null,
                busconsCode: global.baseConstant.busContsCode
            }
            Distribution.bindLevel(data).then((res) => {
            })
        },

        //  获取分销商归属地信息
        getAscriptionId() {
            if (!!this.$route.query.ascriptionId) {
                this.ascriptionId = Number(this.$route.query.ascriptionId)
                return
            }
            if (!!global.Storage.get('ascriptionId')) {
                this.ascriptionId = Number(global.Storage.get('ascriptionId').ascriptionId)
            } else {
                this.ascriptionId = null
            }
        },

        //  获取注册成为分销商的奖励金金额
        getAward() {
            let data = {}
            Distribution.getReward(data).then((res) => {
                this.reward = res.bonus
            })
        },

        //  获取注册协议
        getArticle() {
            let data = {
                catCode: 'fxsbm',
                buscontsCode: global.baseConstant.busContsCode
            }
            Distribution.getAgreement(data).then((res) => {
                if (!!res) {
                    let newStr = res.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (img, src) {
                        let index = src.indexOf('=') + 1
                        let imgData = global.getImg(src.substring(index, img.length))
                        return '<img src="' + imgData + '" style="width: 100%; display: block; margin: 0;">'
                    })
                    let newPre = newStr.replace(/\<pre\>/gi, function () {
                        return '<pre style="word-wrap: break-word;white-space:pre-wrap;">'
                    })
                    let newP = newPre.replace(/\<p\>/gi, function () {
                        return '<p style="word-wrap: break-word;white-space:pre-wrap;">'
                    })
                    this.agreement = newP
                }
            })
        },

        //  申请成为分销商
        apply() {
            if (this.btnLock) return
            this.btnLock = true
            let data = {
                vipInfoHdId: global.Storage.get('USER_INFO').vipInfoId,
                busconsCode: global.baseConstant.busContsCode,
            }
            if (!!this.ascriptionId) data.ascriptionId = this.ascriptionId  // 归属地
            Distribution.applyVip(data).then((res) => {
                this.btnLock = false
                this.successCallback()
                if (!!global.Storage.get('ascriptionId')) {
                    global.Storage.remove('ascriptionId')
                }
            }, (err) => {
                Toast(err.errorMsg)
                this.btnLock = false
            })
        },

        // 注册分销商成功
        successCallback() {
            if (!!this.reward && this.reward > 0) {
                this.showReward = true
            } else {
                Dialog.alert({
                    title: '成功提示',
                    message: this.successTip,
                    confirmButtonText: '我知道了',
                }).then(() => {
                    this.$router.replace('/pages/distributionPackage/center')
                })
            }
        },

        //  取消注册返回上一页
        returnIndex() {
            let pages = getCurrentPages()
            if(pages.length > 1) {
                this.$router.go(-1)
            }else{
                global.switchTab('/index')
            }
        },

        routerLink(path) {
            this.$router.replace(path)
        },

        watchScroll() {
            this.scrollBox = this.$refs.diyBtn
            window.addEventListener('scroll', () => {
                const scrollVal = document.documentElement.scrollTop || document.body.scrollTop
                const windowWidth = document.documentElement.clientWidth
                let mgTop = windowWidth / 375 * 500
                if (this.timer) clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.scrollBox.style.top = `${scrollVal + mgTop}px`
                }, 100)
            }, false)
        },

        watchResize() {
            window.addEventListener('resize', () => {
                console.log('屏幕高度发生改变')
                scrollTo(0, 0)
            }, false)
        },

        // 关闭绑定手机号弹框
        close() {
            this.showPopup = false
        },
        //  获取用户信息
        getUser() {
            let data = {}
            UserService.getUserInfo(data).then((res) => {
                this.userInfo = res
            })
        },
        //  保留正确手机号
        phoneRule() {
            this.phoneNum = this.phoneNum.replace(/\D/g, '')
        },
        //  校验手机号是否绑定
        checkPhone() {
            if (this.captchaLocked === true) {
                return
            }
            // 校验手机号正确性
            if (!global.isPhone(this.phoneNum)) {
                Toast('请填写正确的手机号')
                return
            } else {
                let data = {
                    id: global.Storage.get('USER_INFO').usrId,
                    mobile: this.phoneNum,
                    ownCompanyId: global.Storage.get("COMPANYID").company_id
                }
                UserService.checkPhone(data).then((res) => {
                    this.checkStatus = true
                    this.getCaptcha()
                }, (err) => {
                    this.checkStatus = false
                    Toast('该手机号已绑定')
                })
            }
        },
        // 获取验证码
        getCaptcha() {
            if (this.captchaLocked === true || this.checkStatus === false) { // 判断是否可以发送验证码
                return
            }
            this.captchaLocked = true
            let phone = this.phoneNum
            let data = {
                mobile: phone,
                id: global.Storage.get("USER_INFO").usrId,
                verifyClassCode: "VERIFY_BIND_MOBILE",
            }
            UserService.getCaptcha(data).then((res) => {
            }, (err) => {
            }).then(() => {
                this.isSendCaptcha = true
            })
            this.countDown()
        },
        // 倒计时
        countDown() {
            let that = this
            that.captchaLocked = true
            that.captchaText = '验证码已发送'
            let interval = window.setInterval(function () {
                that.captchaText = '重新获取' + that.time + 's'
                if ((that.time--) <= 0) {
                    that.time = 60
                    that.captchaLocked = false
                    that.captchaText = '点击获取验证码'
                    window.clearInterval(interval)
                }
            }, 1000)
        },
        // 绑定手机号
        bindPhone() {
            if (this.phoneBtnLock === true) return
            this.phoneBtnLock = true
            if (!global.isPhone(this.phoneNum)) {
                Toast('请填写正确的手机号')
                this.phoneBtnLock = false
                return false
            }
            if (!this.captcha) {
                Toast('请先填写验证码')
                this.phoneBtnLock = false
                return false
            }
            if (this.isSendCaptcha !== true) {
                Toast('请先获取验证码')
                this.phoneBtnLock = false
                return false
            }
            if (this.checkStatus === false) {
                Toast('该手机号已经被绑定了~')
                this.phoneBtnLock = false
                return false
            }
            let data = {
                mobilePhone: this.phoneNum,
                registCode: this.captcha,
                verifyType: "D_VERIFYLOG",
                sourceCode: global.baseConstant.busContsCode,
                cudDptId: global.Storage.get('USER_INFO').shopId,
                verifyClassCode: "VERIFY_BIND_MOBILE",
            }
            //  验证手机号和验证码
            UserService.checkCaptcha(data).then(() => {
                // 绑定手机号
                let bindData = {
                    mobile: this.phoneNum,
                    buscontsId: global.baseConstant.busContsCode
                }
                UserService.bindMobile(bindData).then(() => {
                    Toast('绑定手机号成功~')
                    this.showPopup = false
                    this.phoneBtnLock = false
                    let userInfo = global.Storage.get('USER_INFO');
                    userInfo.mobilePhone = this.phoneNum;
                    global.Storage.set('USER_INFO', userInfo);
                }, () => {
                    Toast('绑定手机出错~')
                })
            }, (err) => {
                Toast(err.errorMsg)
            }).then(() => {
                this.phoneBtnLock = false
            })
        },

    },
    onLoad() {
        global.toastLoading();// 开启

        this.company_id = global.Storage.get('COMPANYID').company_id;
        this.serverUrl = global.baseConstant.serverUrl;

        this.vipId = !!this.$route.query.vipId ? this.$route.query.vipId : null
        this.taskId = !!this.$route.query.taskId ? this.$route.query.taskId : null
        this.getAscriptionId()
        this.getAward()
        if (!!this.vipId) this.bindLevel()
        this.getPage()
        this.getArticle()
    },
    onUnload(){
        Object.assign(this.$data, this.$options.data());
    },
    mounted() {
        // setTimeout(() => {
        //     this.$nextTick(() => {
        //         this.watchResize()
        //     })
        // }, 100)
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
.spread-page-wrapper {
    height: 100%;
}
// .spread-pages {
//     position: fixed;
//     top: 0;
//     left: 0;
//     z-index: 22;
// }
.image-list {
    width: 100%;
    img {
        display: block;
        width: 100%;
    }
}
.return-btn {
    position: fixed;
    width: computed(64);
    height: computed(64);
    top: computed(30);
    left: computed(30);
    background: $color-white;
    border-radius: computed(64);
    text-align: center;
    .iconguanbi1 {
        font-weight: bold;
        font-size: computed(26);
        line-height: computed(64);
        color: $color-black-33;
    }
}
.spread-page {
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    min-height: 100%;
    /*padding-bottom: computed(98);*/
    background: $color-white;

    .diy-btn {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: computed(100);
        width: computed(492);
        height: computed(152);
        -webkit-border-radius: computed(152);
        -moz-border-radius: computed(152);
        border-radius: computed(152);
        font-size: computed(50);
        line-height: computed(152);
        color: $color-white;
        text-align: center;
        background-repeat: no-repeat;
        -webkit-background-size: 100%;
        background-size: 100%;
    }
    .agreement-popup {
        width: computed(560);
        height: computed(520);
        .agreement-title {
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }
        .close-btn {
            position: absolute;
            width: computed(30);
            height: computed(30);
            right: computed(10);
            top: computed(10);
            text-align: center;
            line-height: computed(30);
            .iconfont {
                font-size: computed(26);
                color: $color-white;
            }
        }
        .agreement-txt {
            box-sizing: border-box;
            // width: computed(480);
            height: computed(350);
            margin: computed(80) computed(30) 0;
            padding-top: computed(80);
            overflow: auto;
            font-size: $font-small;
            line-height: computed(36);
            color: $text-primary;
        }
    }
    .reward-popup {
        width: computed(664);
        height: computed(637);
        // background: url($serverUrl + "images/distribution/reward.png") no-repeat center;
        -webkit-background-size: cover;
        background-size: cover;
        .close-btn {
            width: computed(110);
            height: computed(90);
            z-index: 2;
            position: absolute;
            right: 0;
            top: 0;
            opacity: 0;
        }
        .reward-value {
            position: absolute;
            width: 100%;
            top: computed(218);
            left: computed(-30);
            font-size: computed(70);
            line-height: 1;
            text-align: center;
            color: $domaincolor;
        }
        .reward-tip {
            position: absolute;
            width: 100%;
            bottom: computed(175);
            left: computed(16);
            font-size: computed(40);
            line-height: 1;
            text-align: center;
            color: $color-white;
        }
        .confirm-btn {
            width: 100%;
            height: computed(90);
            z-index: 2;
            position: absolute;
            left: 0;
            bottom: computed(70);
            opacity: 0;
        }
    }
}
</style>
