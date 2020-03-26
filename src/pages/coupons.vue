<template>
    <div>
        <img class="coupbg" :src="src" lazy-load="true" @load="imgOnLoad">
        <button
            v-if="showGetUser && imgLoadStatus"
            :class="'coupons '+isX"
            type="warn"
            open-type="getUserInfo"
            @getuserinfo="bindGetUserInfo"
        >{{buttonName}}
        </button>
    </div>
</template>

<script>
    import { Cms, Distribution } from '../api/service'

    export default {
        config: {},
        onLoad(options) {
            wx.showLoading({title:'加载中…'})
            global.Storage.remove("shareUrl");
            if (options.shareUrl) {
                global.Storage.set("shareUrl", options.shareUrl);
                this.shareUrl = options.shareUrl;
            }
            let routerSrc = options.routerSrc; // 授权后需跳转h5路由
            let wxSrc = options.wxSrc; // 授权后需跳转微信页面

            if (routerSrc) {
                routerSrc = decodeURIComponent(routerSrc);
                global.Storage.set("shareUrl", encodeURIComponent(global.baseUrl + "#" + routerSrc));
                this.shareUrl = encodeURIComponent(global.baseUrl + "#" + routerSrc);
            } else if (wxSrc) {
                this.wxUrl = wxSrc;
            }
            if (!!options.vipId) {
                this.vipId = parseInt(options.vipId);
            }
            if (!!options.ascriptionId) {
                this.ascriptionId = parseInt(options.ascriptionId);
            }
            if (!!options.goodsCode) {
                this.goodsCode = options.goodsCode;
            }
            if (!!options.taskId) {
                this.taskId = parseInt(options.taskId);
            }
        },
        onShow: function () {
            let res = wx.getSystemInfoSync();
            let phoneModel = res.model.toString()
            if (phoneModel.indexOf("iPhone X") != -1) {
                this.isX = "marginBottom31";
            }
            let that = this;
            if (!wx.getStorageSync('USER_INFO')) {
                this.showGetUser = true
                return
            }

            this.showGetUser = false
            global.loginAuthor().then(res => {
                console.log('已授权，跳转Home页面')
                // 有授权过
                if (!!that.vipId) {
                    console.log("通过上级vipId绑定上下级！");
                    that.bindLevel(); //  存在上级分销商id，调用绑定上下级关系的接口
                    that.isDistribution()
                }else{
                    this.goToWeb();
                }
            });
        },
        onReady(options) {
            global.getBaseParams().then(()=>{
                this.getCoupons();
            })
        },
        data() {
            return {
                src: "",
                buttonName: "点击授权登录 >",
                tips: "授权成功！",
                show: false,
                showGetUser: false, // 是否显示用户授权按钮
                shareUrl: "", //授权后跳转h5的url
                wxUrl: "", //授权后跳转微信页面url
                vipId: null, // 会员id（用于分销商功能）
                ascriptionId: null, // 归属地id
                goodsCode: null, // 商品编码（用于分销商任务中扫二维码打开商品详情）
                taskId: null, //  任务id（分销商任务模块带参）
                isX: "marginBottom0", // 判断是否是iphoneX
                imgLoadStatus: false,  // 背景图加载状态
            };
        },
        methods: {
            // 跳转进入商城
            goToWeb(isBtnAuthor) {
                console.log("加载中")
                if (!isBtnAuthor) {
                    this.tips = "加载中...";
                }
                this.navToIndex();
            },

            getCoupons() {
                this.src = global.baseConstant.serverUrl + "images/septwolvesBg.jpg";
                global.getTemplate()
            },

            // 获取用户授权信息
            bindGetUserInfo(e) {
                let that = this;
                let vipId = that.vipId;
                console.log(e.target)
                if (!e.target.userInfo) {
                    console.log("拒绝授权");
                } else {
                    global.loginAuthor(() => {
                        console.log("------")
                    }).then(res => {
                        console.log("进入")
                        if (res) {
                            //  存在上级分销商id，调用绑定上下级关系的接口
                            if (!!vipId) {
                                console.log("vip")
                                that.bindLevel()
                                that.isDistribution()
                            }else{
                                that.goToWeb(true)
                            }
                        } else {
                            wx.showToast({
                                title: "授权失败",
                                icon: "none",
                                duration: 2000,
                                success: function () {
                                }
                            });
                        }
                    });
                }
            },

            // 获取手机号
            getPhoneNumber(e) {
                let that = this;
                if (e.detail.errMsg == "getPhoneNumber:ok") {
                    // 获取手机号成功
                    // console.log(e)
                    global.getPhoneNumber(e.detail).then(res => {
                        if (!!res) {
                            if (!!res.statusCode) {
                                wx.showToast({
                                    title: res.errorMsg,
                                    icon: "none",
                                    duration: 2000
                                });
                            } else {
                                this.tips = "获取手机号成功！";
                                this.navToIndex();
                            }
                        } else {
                            console.log("获取手机号失败！！");
                        }
                    });
                } else {
                    console.log("获取手机号失败！");
                }
            },

            // 页面跳转
            navToIndex() {
                console.log('跳转首页')
                let that = this;
                let shareUrl = global.Storage.get("shareUrl");
                let vipId = that.vipId || "";
                let ascriptionId = that.ascriptionId || "";
                let taskId = that.taskId || "";
                let goodsCode = that.goodsCode || "";
                wx.showToast({
                    title: that.tips,
                    icon: "none",
                    duration: 2000,
                    success: function () {
                        setTimeout(() => {
                            let url = "/pages/home/home";
                            let params = `?vipId=${vipId}&ascriptionId=${ascriptionId}&taskId=${taskId}`;
                            if (that.goodsCode) params += `&goodsCode=${goodsCode}`;
                            if (!!shareUrl) {
                                console.log('通过转发进入小程序，跳转路径为' + decodeURIComponent(shareUrl))
                                shareUrl = decodeURIComponent(shareUrl)

                                //  使用goPath作为home页面的识别标识
                                if(shareUrl.indexOf('goPath') !== -1) {
                                    let homeParams = shareUrl.split('?')[1]
                                    let goPath = global.getQueryVariable(homeParams,'goPath')
                                    if(!!goPath && goPath.indexOf('index') !== -1) {
                                        // 跳转首页，判断用户是否是分销商
                                        console.log('打开转发链接为首页的情况，判断用户是否是分销商')
                                        return global.userIsDistribution().then((res) => {
                                            console.log('userIsDistributionRes',res)
                                            if(!!res) {
                                                console.log('用户是分销商，跳转首页')
                                                // 用户是分销商跳转首页
                                                that.$router.push({
                                                    path: shareUrl,
                                                    reLaunch: true
                                                })
                                            }else{
                                                // 用户不是分销商跳转推广页
                                                console.log('用户不是分销商，跳转推广页')
                                                global.Storage.set('RELAY',{ flag: true })
                                                let spreadUrl = '/pages/distributionPackage/spread?'
                                                let spreadParams = {}
                                                let newParams = {}
                                                if(homeParams.indexOf('&') !== -1) {
                                                    spreadParams = homeParams.split('&')
                                                    for(let i=0;i<spreadParams.length;i++) {
                                                        let pair = spreadParams[i].split("=")
                                                        let key = pair[0]
                                                        newParams[key] = pair[1]
                                                    }
                                                }
                                                spreadParams = newParams
                                                if(!!spreadParams.goPath) delete spreadParams.goPath
                                                let paramsUrl = global.urlEncode(spreadParams)
                                                if(paramsUrl) {
                                                    spreadUrl += paramsUrl.slice(1)
                                                }
                                                that.$router.push({
                                                    path: spreadUrl,
                                                    reLaunch: true
                                                })
                                            }
                                        })
                                    }else{
                                        // 非首页直接跳转
                                        console.log('打开转发链接不为首页的情况，可以直接跳转')
                                        that.$router.push({
                                            path: shareUrl,
                                            reLaunch: true
                                        })
                                    }

                                }else{
                                    that.$router.push({
                                        path: shareUrl,
                                        reLaunch: true
                                    })
                                }
                            } else {
                                that.$router.push({
                                    path: url + params,
                                    reLaunch: true
                                })
                            }
                        }, 2000);
                    }
                });
            },

            goBack() {
                this.$router.back()
            },

            //  绑定上下级关系（用于分销商模块）
            bindLevel() {
                let that = this;
                let loginInfo = global.Storage.get("USER_INFO")
                let params = {
                    upVipId: that.vipId,
                    unVipId: loginInfo.vipInfoId,
                    busconsCode: global.baseConstant.busContsCode,
                    companyId: loginInfo.companyId,
                    usrId: loginInfo.usrId,
                    ownCompanyId: loginInfo.companyId
                };
                if (!!that.ascriptionId)
                    params.ascriptionId = that.ascriptionId; // 归属地id
                if (!!that.taskId) params.taskId = that.taskId; // 分销商任务id
                Distribution.bindLevel(params)
            },

            //  判断当前用户是否是分销商
            isDistribution() {
                wx.showLoading({
                    title: '加载中~'
                })
                let that = this
                let loginInfo = wx.getStorageSync('USER_INFO')
                //  判断当前用户是否是分销商
                let data = {
                    vipInfoHdId: loginInfo.vipInfoId,
                    busconsCode: global.baseConstant.busContsCode,
                    companyId: loginInfo.companyId,
                    usrId: loginInfo.usrId,
                    ownCompanyId: loginInfo.companyId
                }
                Distribution.isDistribution(data).then((res) => {
                    // 0代表不是分销商
                    that.checkLevel(res.isVipMdt)
                })
            },

            //  判断当前用户是否是上级会员的下级
            checkLevel(num) {
                let that = this
                let path = '/pages/'
                let loginInfo = global.Storage.get('USER_INFO')
                let data = {
                    usrId: loginInfo.usrId,
                    companyId: loginInfo.companyId,
                    ownCompanyId: loginInfo.companyId,
                    upVipId: that.vipId,
                    unVipId: loginInfo.vipInfoId
                }
                Distribution.canBindLevel(data).then((res) => {
                    //  存在商品的情况优先跳转商品详情(h5根据是否是分销商决定跳转页面)
                    if (!!that.goodsCode) {
                        path += `goodsPackage/wares/wares-detail?vipId=${that.vipId}&goodsCode=${that.goodsCode}&isVipMdt=${num}`
                    } else {
                        if (num === 0) {
                            // 用户不是分销商且是传参中上级会员的下级,跳转分销商注册推广页面
                            path += `distributionPackage/spread?vipId=${that.vipId || ''}`
                        } else {
                            // 用户是分销商且是传参中上级会员的下级,跳转分销商中心
                            path += `distributionPackage/center?isVip=true`
                        }
                    }
                    if (!!that.ascriptionId) path += `&ascriptionId=${that.ascriptionId}`  // 归属地id
                    if (!!that.taskId) path += `&taskId=${that.taskId}`  // 任务id
                    that.goPage(path)
                },(err) => {
                    if (!!that.goodsCode) {
                        path += `goodsPackage/wares/wares-detail?vipId=${that.vipId}&goodsCode=${that.goodsCode}&isVipMdt=${num}`
                    }else{
                        if (num === 0) {
                            // 用户不是分销商且不是传参中上级会员的下级且绑定了手机号,跳转会员中心
                            if(!!loginInfo.mobilePhone) {
                                let memberCenter = `member-center?vipId=${that.vipId || ''}`
                                path += `home/home?goPath=${memberCenter}`
                            }else{
                                // 用户不是分销商且不是传参中上级会员的下级且未绑定手机号,跳转绑定手机号页面
                                let memberCenter = `member-center?vipId=${that.vipId || ''}`
                                let successUrl = `/pages/home/home?goPath=${memberCenter}`
                                path += `UserPackage/phone/bind-phone?successUrl=${successUrl}`
                            }
                        } else {
                            // 用户是分销商,跳转分销商中心
                            path += `distributionPackage/center?vipId=${that.vipId || ''}`
                        }
                    }
                    that.goPage(path)
                })
            },

            //  小程序路由跳转
            goPage(path) {
                console.log('即将跳转的路径: ' + path)
                this.$router.replace({
                    path: path
                })
            },

            //  图片加载完成
            imgOnLoad() {
                this.imgLoadStatus = true
                wx.hideLoading()
            }

        }
    };
</script>

<style scoped lang="scss">
    .coupons {
        width: 100%;
        position: fixed;
        left: 0;
        bottom: 0;
        font-weight: bold;
        border-radius: 0;
    }

    button[type="warn"].coupons {
        background-color: #ffc321;
        color: #cf2431;
    }

    .coupbg {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
    }

    .marginBottom0 {
        padding-bottom: 0;
    }
</style>
