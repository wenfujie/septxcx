<template>
    <div style="position:relative;z-index:10000;" class="footer-bar">
        <wxs module="filter" src="../filter/filterCommon.wxs"></wxs>
        <van-tabbar route :active="active=='/pages/home/home'? tabIndex : -1 " :safe-area-inset-bottom='safe'>
            <div
                class="van-tabbar-item"
                v-for="(item,index) in footerData"
                :key="index"
                :class="[{'active-style':active === item.navigatUrl}]"
                @click="switchM(item.navigatUrl)"
            >
                <!-- switchM(item.navigatUrl) -->
                <img v-show="tabIndex !== index" :src="filter.imgFilter(item.navigatPicUrl,companyid)" class="foot-img">
                <img v-show="tabIndex === index" :src="filter.imgFilter(item.adCoverUrl,companyid)"class="foot-img">
                <p :class="{'van-tabbar-item--active':active === item.navigatUrl}">{{item.cmsNavigatHdName}}</p>
                <!-- 购物车数量 -->
                <span
                    v-if="item.navigatUrl === '/shopping-cart' && shoppingCartNum > 0"
                    class="num"
                >{{shoppingCartNum}}</span>
            </div>
        </van-tabbar>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { Cms, ShoppingCart, Distribution } from "../api/service";

    export default {
        name: "FooterBar",
        config: {},
        props: ['index'],
        data() {
            return {
                footerData: [],
                companyid: "",
                tabIndex: 0,
                safe: false
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
            console.log('-底部导航组建完成加载-')
            this.companyid = global.Storage.get('COMPANYID').company_id
            this.getNav();
        },
        methods: {
            //点击tabbar
            switchM(path) {
                // 分销商任务跳转分销商模块
                if(path.indexOf('task') !== -1) {
                    this.$router.push(path)
                }else{
                    // 非分销商模块首页切换tab
                    if (path === "/member-center") {
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
                    } else {
                        global.switchTab(path)
                    }
                }
            },

            //  获取千人千面模板
            getDefaultTemplate() {
                if (
                    global.Storage.get("TEMPLATE_INFO") !== null &&
                    global.Storage.get("TEMPLATE_INFO").cmsTemplateCode
                ) {
                    this.getNav();
                } else {
                    let data = {
                        busContsCode: global.baseConstant.busContsCode
                    };
                    Cms.getUsrCmsTemplate(data)
                        .then((res) => {
                            global.Storage.set("TEMPLATE_INFO", res[0]);
                        })
                        .then(() => {
                            this.getNav();
                        });
                }
            },

            //  获取导航栏菜单
            getNav() {
                let that =this
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
                                that.isDistribution(newArr)
                                return
                            }
                        }
                        this.footerData = newArr
                    }, (err) => {}
                );
            },

            // 获取购物车数量
            getCartCount() {
                this.$store.dispatch('user/getShoppingCart')
            },

            //  判断当前用户是否是分销商
            isDistribution(navList) {
                let that = this
                let loginInfo = wx.getStorageSync('USER_INFO')
                if(!!loginInfo.isVipMdt) {
                    this.footerData = navList
                }else{
                    //  判断当前用户是否是分销商
                    let data = {
                        vipInfoHdId: loginInfo.vipInfoId,
                        busconsCode: global.baseConstant.busContsCode,
                        companyId: loginInfo.companyId,
                        usrId: loginInfo.usrId,
                        ownCompanyId: loginInfo.companyId
                    }
                    return Distribution.isDistribution(data).then((res) => {
                        // 0代表不是分销商
                        if(!!res.isVipMdt) {
                            that.footerData = navList
                        }else{
                            for (let i = 0; i < navList.length; i++) {
                                if (navList[i].navigatUrl.indexOf('task') === -1) {
                                    that.footerData.push(navList[i])
                                }
                            }
                        }
                    })
                }
            },
        },
    };
</script>
<style lang="scss" type="text/scss">
    .van-tabbar {
        border-top: computed(2) solid #dbdbdb;
    }
</style>
<style lang="scss" type="text/scss" scoped>
.van-tabbar {
    height: computed(98);
    text-align: center;
    border-top: computed(2) solid #dbdbdb;
}
.van-tabbar-item{
    position: relative;
    flex: 1;
    height:100%;
    display:-webkit-flex;
    display:flex;
    line-height:1;
    font-size:12px;
    -webkit-align-items:center;
    align-items:center;
    -webkit-flex-direction:column;
    flex-direction:column;
    -webkit-justify-content:center;
    justify-content:center;
}
.van-tabbar--fixed {
    z-index: 11 !important;
    position: fixed !important;
}

    .van-tabbar-item {
        position: relative;
        color: #a8a9ad;

    }

    .van-tabbar-item .iconfont {

        position: relative;
        font-size: computed(40);
        line-height: computed(50);
        left: computed(-2);
    }

    .van-tabbar-item p {
        margin: computed(10) 0 computed(13) 0;
        font-size: computed(20);
        line-height: computed(22);
        color: $text-secondary;
    }

    .van-tabbar-item .num {
        position: absolute;
        top: computed(5);
        right: computed(55);
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

    .van-hairline--top-bottom::after {
        border: none;
    }

    .van-tabbar-item--active {
        color: $maincolor !important;
    }

    .tabbar-icon {
        /* 通过设置 font-size 来改变图标大小 */
        width: computed(70);
        height: computed(40);
        /* 图标和文字相邻时，垂直对齐 */
        vertical-align: -0.15em;
        /* 通过设置 color 来改变 SVG 的颜色/fill */
        /*fill: pink;*/
        /* path 和 stroke 溢出 viewBox 部分在 IE 下会显示 normalize.css 中也包含这行 */
        overflow: hidden;
    }

    .foot-img {
        width: computed(40);
        height: computed(40);
    }

    .active-style {
        background: $color-btn-bg;
        border-radius: computed(5);
        margin: computed(2) 0;
    }

</style>
