<template>
    <div style="height:100%;">
        <index :isshow="tabIndex===0" ref="index" :query="query"></index>
        <good-sort v-if="tabValueArr[1]===1" :isshow="tabIndex===1" ref="good_sort" :query="query"></good-sort>
        <shopping-cart v-if="tabValueArr[2]===1" :isshow="tabIndex===2" ref="shopping_cart"></shopping-cart>
        <member-center :isshow="tabIndex===3" ref="member_center" :query="query"></member-center>
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>
        <van-toast id="van-toast" />
        <scroll-view scroll-y="false" style="z-index:10" :class="isX">
            <footer-bar :index="tabIndex" ref="footer_bar"></footer-bar>
        </scroll-view>
    </div>
</template>

<script>
import FooterBar from "../../components/FooterBar";
import Index from "./index";
import GoodSort from "./good-sort";
import ShoppingCarts from "./shopping-cart";
import MemberCenter from "./member-center";
import { mapState } from "vuex";
import { Cms, ShoppingCart, Distribution } from "../../api/service";
import Toast from "vant-weapp/dist/toast/toast";

export default {
    config: {
        navigationBarTitleText: "首页",
        enablePullDownRefresh: true,
        backgroundTextStyle: "dark"
    },
    data() {
        return {
            footerData: [],
            companyid: "",
            tabIndex: 0,
            tabNameArr: [
                "/index",
                "/good-sort",
                "/shopping-cart",
                "/member-center"
            ], //配置对应页面路径
            tabValueArr: [1, 0, 0, 0], //是否将组件创建出来的数组
            query: {},
            passLoad: false, //是否经过load,用于页面返回时触发一些接口
            isX: ""
        };
    },
    components: {
        index: Index,
        "good-sort": GoodSort,
        "shopping-cart": ShoppingCarts,
        "footer-bar": FooterBar,
        "member-center": MemberCenter
    },
    onLoad(options) {
        this.passLoad = true;
        try{
            let option = !!options ? options: this.$root.$mp.query;
            if (!!option && !!option.goPath) {
                this.switchMenu(option.goPath);
            }
            let res = wx.getSystemInfoSync();
            let phoneModel = res.model.toString();
            if (phoneModel.indexOf("iPhone X") != -1) {
                this.isX = "height90";
            }
            //  转发绑定上下级
            if (!!option && !!option.vipId) {
                this.bind(option.vipId);
            }
        } catch (e){}

    },
    onShow() {
        this.companyid = global.Storage.get("COMPANYID").company_id;
    },
    mounted(){
        let option = !!this.$root.$mp.query ? this.$root.$mp.query : {}
        if (!!option && !!option.goPath) {
            this.switchMenu(option.goPath);
        }
        //  转发绑定上下级
        if (!!option && !!option.vipId) {
            this.bind(option.vipId);
        }
        if (!this.passLoad) {
            this.passLoad = false;
            this.small_onRefresh(this.tabIndex);
        }
    },
    onShareAppMessage: function() {
        let path = "pages/home/home";
        let tabIndex = this.tabIndex;
        let shareParams = !!this.$root.$mp.query
            ? JSON.parse(JSON.stringify(this.$root.$mp.query))
            : {};
        let shareUrl = "";
        if (tabIndex === 0) {
            //  转发、分享首页 -> 打开首页
            shareParams.goPath = "/index";
            shareUrl = global.getShareUrl(path, shareParams);
        } else {
            //  转发、分享home中的其他页面 -> 打开用户中心页面
            shareParams.goPath = "/member-center";
            shareUrl = global.getShareUrl(path, shareParams);
        }

        return {
            //## 此为转发页面所显示的标题
            //title: '好友代付',
            //## 此为转发给微信好友或微信群后，对方点击后进入的页面链接，可以根据自己的需求添加参数
            path: shareUrl,
            //## 转发操作成功后的回调函数，用于对发起者的提示语句或其他逻辑处理
            success: function(res) {
                console.log(
                    "分享成功=====",
                    "/page/coupons/coupons?shareUrl=" + path
                );
            },
            //## 转发操作失败/取消 后的回调处理，一般是个提示语句即可
            fail: function() {
                console.log("分享失败");
            }
        };
    },
    onHide() {
        this.passLoad = false;
    },
    onUnload() {
        this.passLoad = false;
    },
    //下拉刷新
    onPullDownRefresh: function() {
        //触发对应组件页面的下拉刷新方法
        switch (this.tabIndex) {
            case 0:
                this.$refs.index.tabPullDownRefresh();
                break;
            case 1:
                this.$refs.good_sort.tabPullDownRefresh();
                break;
        }
        //模拟加载
        setTimeout(function() {
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
    methods: {
        // 判断当前选中的tab标签
        getTabIndex(path) {
            let index = -1;
            //通过path寻找对应tabbar页面的下标
            for (let i = 0; i < this.tabNameArr.length; i++) {
                if (path.indexOf(this.tabNameArr[i].slice(1)) !== -1) {
                    index = i;
                    break;
                }
            }
            console.log('home页面的标签索引',index)
            return index;
        },

        //点击切换tabbar时触发
        switchMenu(path) {
            console.log('切换tabbar时触发,跳转路径为',path)
            //  跳转至账户页面需要校验用户绑定手机号
            if (path.indexOf("member-center") !== -1 ) {
                // 缓存中存在手机号，则默认用户已绑定过
                let userInfo = global.Storage.get("USER_INFO");
                // && !!global.Storage.get('BIND_PHONE_FLAG')
                if (!!userInfo && !!userInfo.mobilePhone ) {
                    this.setPageIndex(path);
                } else {
                    this.$router.push("/pages/UserPackage/phone/bind-phone");
                    // 通过调用用户信息的接口获取用户是否绑定手机号
                    // return global.c_getUserInfo().then(res => {
                    //     global.Storage.set('BIND_PHONE_FLAG',{ flag: true })
                    //     if (!res.mobilePhone) {
                    //         console.log('未绑定手机号，跳转绑定手机号页面')
                    //         this.$router.push("/pages/UserPackage/phone/bind-phone");
                    //     } else {
                    //         console.log('已绑定手机号，跳转账户页面')
                    //         this.setPageIndex(path);
                    //     }
                    // });
                }
            }else{
                this.setPageIndex(path);
            }
        },

        //  设置页面标签
        setPageIndex(path) {
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
            });          
            let index = this.getTabIndex(path);
            if (index === -1) {
                return;
            }

            console.log('设置页面索引',index)
            this.$refs.footer_bar.tabIndex = index;
            this.setNavigationTitle(index);
            this.small_onRefresh(index);
            this.tabValueArr[index] = 1;
            this.tabIndex = index; //切换tabbar

        },

        //设置导航顶部名称
        setNavigationTitle(index) {
            switch (index) {
                case 0:
                    wx.setNavigationBarTitle({
                        title: "首页"
                    });
                    break;
                case 1:
                    wx.setNavigationBarTitle({
                        title: "分类"
                    });
                    break;
                case 2:
                    wx.setNavigationBarTitle({
                        title: "购物车"
                    });
                    break;
                case 3:
                    wx.setNavigationBarTitle({
                        title: "账户"
                    });
                    break;
            }
        },
        //触发有些tabbar再次进入需要触发的方法
        small_onRefresh(index) {
            //判断时候是再次进入tabbar对应的组件
            if (this.tabValueArr[index] == 1) {
                //触发有些tabbar再次进入需要触发的方法
                switch (index) {
                    case 2:
                        this.$refs.shopping_cart.onRefresh();
                        break;
                    case 3:
                        this.$refs.member_center.onRefresh();
                        break;
                }
            }
        },
        //  绑定上下级
        bind(id) {
            let data = {
                upVipId: parseInt(id),
                unVipId: global.Storage.get("USER_INFO").vipInfoId,
                ascriptionId:
                    !!this.$root.$mp.query &&
                    !!this.$root.$mp.query.ascriptionId
                        ? this.$root.$mp.query.ascriptionId
                        : null,
                busconsCode: global.baseConstant.busContsCode
            };
            Distribution.bindLevel(data);
        }
    }
};
</script>
<style lang="scss" type="text/scss" scoped>
scroll-view {
    position: fixed;
    bottom: 0;
    left: 0;
    height: computed(90);
    width: 100%;
}

.height90 {
    height: computed(121);
}
</style>
