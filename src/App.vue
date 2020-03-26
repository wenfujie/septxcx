<script>
import Storage from "./utils/storage";

export default {
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

                        shareUrl = global.getShareUrl(defaultPage,shareParams)

                        console.log(res.path,'res.path')
                        // 页内自定义分享的页面路由
                        let shareCustomList = ['wares/wares-detail','task-detail','bargain/bargain-detail', 'assemble/assemble-record'];
                        let isShareCustom = false;// 是否页内自定义分享
                        for(let i=0;i<shareCustomList.length;i++) {
                            if(res.path.indexOf(shareCustomList[i]) !== -1) {
                                isShareCustom = true;
                                break;
                            }
                        }

                        if(!isShareCustom){
                             //  设置公用分享函数
                            view.onShareAppMessage = function () {
                                return {
                                    path: shareUrl,
                                    success: function () {
                                        global.gio('track', 'onShareAppMessage', {
                                            path: shareUrl
                                        });
                                    }
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
