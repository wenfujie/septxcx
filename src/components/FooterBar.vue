<template>
    <div style="position:relative;z-index:10000;" class="footer-bar">
        <wxs module="filter" src="../filter/filterCommon.wxs"></wxs>
        <van-tabbar route :active="active=='/pages/home/home'? tabIndex : -1 " :safe-area-inset-bottom='safe'>
            <button
                class="van-tabbar-item"
                v-for="(item,index) in footerData"
                :key="index"
                :class="[{'active-style':active === item.navigatUrl}]"
                :open-type="(item.navigatUrl === '/shopping-cart' || item.navigatUrl=== '/member-center') && (!isLogin) ? 'getUserInfo' : ''"
                @getuserinfo="getLoginInfo(item.navigatUrl)"
                @click="switchM(item.navigatUrl)"
            >
                <div v-show="tabIndex !== index" :class="'foot-img iconfont '+item.icon_select"></div>
                <div v-show="tabIndex === index"
                     :class="'foot-img foot-img-selected iconfont '+item.icon_selected"></div>
                <p :class="tabIndex === index?'foot-text-selected':''">{{item.cmsNavigatHdName}}</p>
                <!-- 购物车数量 -->
                <span
                    v-if="item.navigatUrl === '/shopping-cart' && shoppingCartNum > 0"
                    class="num"
                >{{shoppingCartNum}}</span>
                <span v-if="filter.indexOfM(item.navigatUrl,'task')!=-1 && !!taskFlag" class="task-num"></span>
            </button>
        </van-tabbar>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import {Cms, ShoppingCart, Distribution} from "../api/service";

    export default {
        name: "FooterBar",
        config: {},
        props: ['index'],
        data() {
            return {
                footerData: [],
                companyid: "",
                tabIndex: 0,
                safe: false,
                taskFlag: false, // 显示任务标识
                isLogin: false // 用户信息是否授权登陆
            };
        },
        computed: {
            ...mapState('user', ['shoppingCartNum']),
            active: {
                get: function () {
                    return this.$route.path;
                },
                set: function () {
                }
            }
        },
        onLoad() {
//            console.log('-底部导航组建加载-')
            this.companyid = global.Storage.get('COMPANYID').company_id
            this.getNav();
        },
        onShow() {
            //  判断用户登陆状态设置购物车、账户的按钮类型
            if (!!global.Storage.get('USER_INFO')) {
                this.isLogin = true
            } else {
                this.isLogin = false
            }

            //  判断用户是否是分销商查询是否有未读任务
            if (!!global.Storage.get('USER_INFO').isVipMdt) {
                this.getDistributionInfo()
            }
        },
        methods: {
            //点击tabbar
            switchM(path) {
                // 判断当前页和即将要去的是同个页面则拦截
                if (this.$route.query.goPath === path) return
                // 分销商任务跳转分销商模块
                if (path.indexOf('task') !== -1) {
                    this.$router.push(path)
                } else {
                    // 非分销商模块首页切换tab
                    if (path === "/member-center" || path === '/shopping-cart') {
                        if(!global.Storage.get('USER_INFO')) {
                            return
                        }else{
                            // 缓存中存在手机号，则默认用户已绑定过
                            let userInfo = global.Storage.get("USER_INFO");
                            if (!!userInfo && !!userInfo.mobilePhone) {
                                global.switchTab(path)
                            } else {
                                // 通过调用用户信息的接口获取用户是否绑定手机号
                                return global.c_getUserInfo().then(res => {
                                    if (!res.mobilePhone) {
                                        this.$router.push("/pages/UserPackage/phone/bind-phone")
                                    } else {
                                        global.switchTab(path)
                                    }
                                });
                            }
                        }
                    } else {
                        global.switchTab(path)
                    }
                }
            },

            //  获取导航栏菜单
            getNav() {
                let that = this
                let temCode = "";
                if (global.Storage.get("TEMPLATE_INFO") !== null) {
                    temCode = global.Storage.get("TEMPLATE_INFO").cmsTemplateCode;
                }
                let data = {
                    cmsTemplateCode: temCode,
                    busContsCode: global.baseConstant.busContsCode
                };
                Cms.getNavigation(data).then(
                    (res) => {
                        console.log("成功回调", res)
                        let navList = res.slice(0, 5);
                        let newArr = [];
                        //  按照seq进行排序
                        let seqSort = function (obj1, obj2) {
                            let val1 = obj1.seq;
                            let val2 = obj2.seq;
                            if (val1 < val2) {
                                return -1;
                            } else if (val1 > val2) {
                                return 1;
                            } else {
                                return 0;
                            }
                        };
                        newArr = navList.sort(seqSort);

                        //  获取购物车数量
                        for (let i = 0; i < newArr.length; i++) {
                            if (newArr[i].navigatUrl === '/shopping-cart') {
                                this.getCartCount();
                            }
                        }

                        //  底部导航判断是否显示分销商任务
                        for (let i = 0; i < newArr.length; i++) {
                            //  底部导航判断是否显示分销商任务
                            if (newArr[i].navigatUrl.indexOf('task') !== -1) {

                                //  用户未登录不显示分销商任务
                                if (!global.Storage.get('USER_INFO')) {
                                    let footerData_tem = []
                                    for (let i = 0; i < newArr.length; i++) {
                                        if (newArr[i].navigatUrl.indexOf('task') === -1) {
                                            footerData_tem.push(navList[i])
                                        }
                                    }
                                    that.footerData = this.getfootData_img(footerData_tem)
                                    return
                                } else {
                                    that.isDistribution(newArr)
                                    return
                                }
                            }
                        }

                        this.footerData = this.getfootData_img(newArr)
                    }, (err) => {
                        console.log("失败回调", err)
                        if (err.statusCode === 401 || err.error === "invalid_token" || err.errorCode === "100500") {    //处理token过期导航空白问题,token过期及连接超时
                            this.getNav()
                        }
                    }
                );
            },

            //设置底部选择图片，并返回
            getfootData_img(newArr) {
                let footerData = newArr;
                for (let i = 0; i < newArr.length; i++) {
                    if (newArr[i].navigatUrl.indexOf('index') != -1) {
                        footerData[i].icon_select = 'iconshouye_weixuanzhong';
                        footerData[i].icon_selected = 'iconshouye_xuanzhong';
                    } else if (newArr[i].navigatUrl.indexOf('good-sort') != -1) {
                        footerData[i].icon_select = 'iconfenlei_weixuanzhong';
                        footerData[i].icon_selected = 'iconfenlei_xuanzhong';
                    } else if (newArr[i].navigatUrl.indexOf('task') != -1) {
                        footerData[i].icon_select = 'iconrenwu_weixuanzhong';
                        footerData[i].icon_selected = 'iconrenwu_xuanzhong';
                    } else if (newArr[i].navigatUrl.indexOf('shopping-cart') != -1) {
                        footerData[i].icon_select = 'icongouwuche_weixuanzhong';
                        footerData[i].icon_selected = 'icongouwuche_xuanzhong';
                    } else if (newArr[i].navigatUrl.indexOf('member-center') != -1) {
                        footerData[i].icon_select = 'iconwode_weixuanzhong';
                        footerData[i].icon_selected = 'iconwode_xuanzhong';
                    }
                }
                return footerData;
            },

            // 获取购物车数量
            getCartCount() {
                this.$store.dispatch('user/getShoppingCart')
            },

            //  判断当前用户是否是分销商
            isDistribution(navList) {
                let that = this
                let userInfo = wx.getStorageSync('USER_INFO')
                if (!!userInfo.isVipMdt) {
                    this.footerData = this.getfootData_img(navList)
                    that.getDistributionInfo()
                } else {
                    //  判断当前用户是否是分销商
                    let data = {
                        vipInfoHdId: userInfo.vipInfoId,
                        busconsCode: global.baseConstant.busContsCode
                    }
                    return Distribution.isDistribution(data).then((res) => {
                        // 0代表不是分销商
                        if (!!res.isVipMdt) {
                            userInfo.isVipMdt = true
                            global.Storage.set('USER_INFO', userInfo)
                            that.footerData = this.getfootData_img(navList)
                            that.getDistributionInfo()
                        } else {
                            let footerData_tem = []
                            for (let i = 0; i < navList.length; i++) {
                                if (navList[i].navigatUrl.indexOf('task') === -1) {
                                    footerData_tem.push(navList[i])
                                }
                            }
                            that.footerData = this.getfootData_img(footerData_tem)
                        }
                    })
                }
            },

            //  获取分销商信息，用于判断
            getDistributionInfo() {
                let data = {
                    vipInfoHdId: global.Storage.get('USER_INFO').vipInfoId
                }
                Distribution.getVipInfo(data).then((res) => {
                    if (!!res.newTaskNumber && res.newTaskNumber > 0) {
                        this.taskFlag = true
                    } else {
                        this.taskFlag = false
                    }
                })
            },

            // getLoginInfo
            getLoginInfo(path) {
                // 验证登陆
                if (!global.Storage.get('USER_INFO')) {
                    global.loginAuthor().then((res) => {
                        if(!!res) {
                            this.isLogin = true
                            this.switchM(path)
                        }
                    })
                }
            },
        },
    };
</script>
<style lang="scss" type="text/scss">
    .footer-bar {
        .van-tabbar {
            border-top: computed(2) solid #dbdbdb !important;
        }
    }
</style>
<style lang="scss" type="text/scss" scoped>
    .van-tabbar {
        height: computed(98);
        text-align: center;
        border-top: computed(2) solid #dbdbdb;
    }

    .van-tabbar-item {
        position: relative;
        flex: 1;
        height: 100%;
        display: -webkit-flex;
        display: flex;
        line-height: 1;
        font-size: 12px;
        -webkit-align-items: center;
        align-items: center;
        -webkit-flex-direction: column;
        flex-direction: column;
        -webkit-justify-content: center;
        justify-content: center;
        background: $color-white;
        border: none;
    }

    .van-tabbar-item::after {
        content: '';
        display: none;
    }

    .van-tabbar--fixed {
        z-index: 11 !important;
        position: fixed !important;
    }

    .van-tabbar-item {
        position: relative;
        color: #a8a9ad;
        .iconfont {
            position: relative;
            font-size: computed(48);
            line-height: computed(50);
            text-align: center;
            &.foot-img-selected {
                color: $color-red;
            }
        }
        p {
            padding: computed(4) 0 computed(6) 0;
            font-size: computed(20);
            line-height: computed(22);
            color: $text-secondary;
        }
        .foot-text-selected {
            color: $color-red;
        }
        .num {
            position: absolute;
            top: computed(5);
            // right: computed(55);
            left: calc(50% + 24rpx);
            transform: translate(-50%, 0);
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
        .task-num {
            position: absolute;
            top: computed(5);
            left: calc(50% + 20rpx);
            transform: translate(-50%, 0);
            width: computed(20);
            height: computed(20);
            line-height: computed(20);
            background-color: $domaincolor;
            color: $color-white;
            border-radius: 50%;
            text-align: center;
            font-size: $font-small;
        }
    }

    .van-hairline--top-bottom::after {
        border: none;
    }

    .van-tabbar-item--active {
        color: $maincolor !important;
    }

    .active-style {
        background: $color-btn-bg;
        border-radius: computed(5);
        margin: computed(2) 0;
    }
</style>
