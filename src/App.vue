<script>
import Storage from "./utils/storage";

export default {
    globalConfig: {
        usingComponents: {
            "van-col": "/vant-weapp/dist/col/index",
            "van-row": "/vant-weapp/dist/row/index",
            "van-tag": "/vant-weapp/dist/tag/index",
            "van-tabbar": "/vant-weapp/dist/tabbar/index",
            "van-tabbar-item": "/vant-weapp/dist/tabbar-item/index",
            "van-toast": "/vant-weapp/dist/toast/index",
            "van-field": "/vant-weapp/dist/field/index",
            "van-action-sheet": "/vant-weapp/dist/action-sheet/index",
            "van-popup": "/vant-weapp/dist/popup/index",
            "van-dialog": "/vant-weapp/dist/dialog/index",
            "van-cell": "/vant-weapp/dist/cell/index",
            "van-cell-group": "/vant-weapp/dist/cell-group/index",
            "van-stepper": "/vant-weapp/dist/stepper/index",
            "van-icon": "/vant-weapp/dist/icon/index",
            "van-picker": "/vant-weapp/dist/picker/index",
            "van-datetime-picker": "/vant-weapp/dist/datetime-picker/index",
            "van-radio-group": "/vant-weapp/dist/radio-group/index",
            "van-radio": "/vant-weapp/dist/radio/index",
            "van-checkbox-group": "/vant-weapp/dist/checkbox-group/index",
            "van-checkbox": "/vant-weapp/dist/checkbox/index",
            "van-area": "/vant-weapp/dist/area/index",
            "van-rate": "/vant-weapp/dist/rate/index",
            "van-loading": "vant-weapp/dist/loading/index",
            "van-steps": "/vant-weapp/dist/steps/index"
        }
    },
    methods:{
        // 设置页面分享功能
        overShare() {
            //监听路由切换
            //间接实现全局设置分享内容
            wx.onAppRoute((res)=> {
                //获取加载的页面
                let pages = getCurrentPages(),
                    // 获取当前页面的对象
                    view = pages[pages.length - 1],
                    // 转发、分享页面
                    shareUrl;
                if (view) {
                    let shareParams = JSON.parse(JSON.stringify(res.query))

                    //  小程序转发、分享指定页面及普通页面,指定页面为（首页、商品详情、分销商推广、分销商二维码、分销商任务详情）
                    let url = res.path
                    if(url === 'pages/home/home') {
                        // home放在页面中特殊处理
                    }else{

                        //  转发、分享普通页面，默认跳转用户中心
                        let defaultPage = 'pages/home/home'
                        shareParams.goPath = '/member-center'

                        //  转发、分享分销商推广页（申请分销商）、分销商推广二维码页面跳转推广页
                        if(res.path.indexOf('distributionPackage/spread') !== -1 || res.path.indexOf('distributionPackage/qrcode') !== -1) {
                            defaultPage = 'pages/distributionPackage/spread'
                            if(!!shareParams.goPath) delete shareParams.goPath
                        }

                        //  转发、分享分销商任务，打开首页
                        if(res.path.indexOf('distributionPackage/task') !== -1){
                            if(!!shareParams.goPath) delete shareParams.goPath
                        }

                        //  转发、分享商品详情页，打开商品详情页
                        // if(res.path.indexOf('/goods-detail') !== -1 || res.path.indexOf('/wares-detail') !== -1){
                        //     defaultPage = res.path
                        //     if(!!shareParams.goPath) delete shareParams.goPath
                        // }
                        
                        shareUrl = global.getShareUrl(defaultPage,shareParams)

                        console.log(res.path,'res.path')
                        //不是商品详情页的就设置，商品详情页的已在其页面设置了分享
                        if(res.path.indexOf('wares/wares-detail') == -1){
                             //  设置公用分享函数
                            view.onShareAppMessage = function () {
                                return {
                                    path: shareUrl
                                };
                            }
                        }
                       
                        
                    }

                    wx.showShareMenu({
                        withShareTicket: true
                    })

                }
            })
        }
    },
    onShow() {
    },
    onHide(){
        if(!!global.Storage.get('RELAY')) {
            global.Storage.remove('RELAY')
        }
    },
    created() {
        // 设置页面分享功能
        this.overShare();
    },

};
</script>

<style lang="scss">
// .container {
//     height: 100%;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: space-between;
//     padding: 200rpx 0;
//     box-sizing: border-box;
// }
/* this rule will be remove */
* {
    transition: width 2s;
    -moz-transition: width 2s;
    -webkit-transition: width 2s;
    -o-transition: width 2s;
}
</style>
