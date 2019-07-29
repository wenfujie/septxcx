/*
* createTime：2019/3/11
* author：en.chen
* description:  分销商任务详情
*/
<template>
    <div class="task-detail">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>
        <template v-if="!isLoading">

            <!-- 任务商品详情 begin -->
            <div class="task-goods">
                <!-- 封面 -->
                <div class="fl mgR30">
                    <div class="item-cover">
                        <img :src="filter.imgFilter()" :key="" lazy-load="true" @onerror="global.errImg(event)">
                    </div>
                </div>

                <!-- 详情 -->
                <div class="fl goods-detail">
                    <h2 class="item-name item-txt">祈求者！</h2>
                    <p class="item-context item-txt">哈雷克之火葬魔咒！康瑞克斯的杀戮之墙！西美尔的精华脉冲！托纳鲁斯之爪！坚甲与意志的摧毁者！</p>
                    <p class="price">
                        ￥239
                        <span class="tag-price">￥439</span>
                    </p>
                    <div class="detail-btn">
                        <i class="iconfont iconzhuanduoshao"></i>
                        赚
                        <span class="mini">￥</span>
                        66.66
                    </div>
                </div>
            </div>
            <!-- 任务商品详情 end -->

            <!-- 任务详情 begin -->
            <div class="task-info">
                <div class="task-tip clearfix">
                    <div class="fl save-icon">
                        <img :src="save_Img" :key="save_Img">
                    </div>
                    <div class="fl save-txt">
                        <p>长按全选文字</p>
                        <p>保存推广文案</p>
                    </div>
                </div>
                <h1 class="task-name">{{taskInfo.taskName}}</h1>
                <p class="task-time">活动时间：{{taskInfo.beginDate}}至{{taskInfo.endDate}}</p>
                <!--<p class="task-title">{{taskInfo.taskTitle}}</p>-->
                <div class="task-content" v-html="taskInfo.contentText"></div>
                <ul class="img-list clearfix" v-if="!!imgList && imgList.length > 0">
                    <li class="img-item" v-for="item in imgList" :key="item.taskId">
                        <img class="cover-img"  :src="item.mixPicStr" :key="item.mixPicStr" @click="onClickImg(item)"/>
                    </li>
                </ul>
                <div class="share-info clearfix">
                    <div class="fr">
                        <i class="iconfont iconzhuanfashu"></i>
                        <span>{{filter.goldDivide(shareAmount)}}</span>人已发圈
                    </div>
                </div>
                <div class="share-box clearfix">
                    <div class="fr clearfix">
                        <button class="share-btn download fl" v-if="!!isAuthorityDown" @click="saveImg">
                            <i class="iconfont iconxiazaifaquan"></i>
                            <span class="btn-name">下载发圈</span>
                        </button>
                        <button class="share-btn download fl" v-if="!isAuthorityDown" open-type="openSetting" @opensetting="getOpensettingInfo" @click="clickOpensettingInfo">
                            <i class="iconfont iconxiazaifaquan"></i>
                            <span class="btn-name">下载发圈</span>
                        </button>
                        <button open-type="share" class="share-btn share fl">
                            <i class="iconfont iconyijianfaquan"></i>
                            <span class="btn-name">一键发圈</span>
                        </button>
                    </div>
                </div>
            </div>
            <!-- 任务详情 end-->

            <!-- 未转发状态显示提示 begin -->
            <p v-if="!isSave" class="share-tip">快分享给你的好友吧 (´•×•`)</p>
            <!-- 未转发状态显示提示 end -->

        </template>
        <template v-else="isLoading">
            <div class="loading-tip"><p>正在努力加载中~</p></div>
        </template>
        <div class="loading-mask" v-if="!!isLoading">
            <van-loading color="white" />
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
    import {Distribution} from '../../api/service'
    import Toast from 'vant-weapp/dist/toast/toast';
    export default {
        config:{
            navigationBarTitleText: '任务'
        },
        components: {
        },
        data() {
            return {
                taskInfo: {},  // 任务信息
                ImgPosition: {  //  二维码图片位置
                    'D_QRPOSITION05': {
                        name: '全覆盖',
                        qrPositionCode: 'D_QRPOSITION05',
                        position: 'position-cover'
                    },
                    'D_QRPOSITION04': {
                        name: '右下',
                        qrPositionCode: 'D_QRPOSITION04',
                        position: 'position-br'
                    },
                    'D_QRPOSITION03': {
                        name: '右上',
                        qrPositionCode: 'D_QRPOSITION03',
                        position: 'position-tr'
                    },
                    'D_QRPOSITION02': {
                        name: '左下',
                        qrPositionCode: 'D_QRPOSITION02',
                        position: 'position-bl'
                    },
                    'D_QRPOSITION01': {
                        name: '左上',
                        qrPositionCode: 'D_QRPOSITION01',
                        position: 'position-tl'
                    }
                },  // 布局
                imgList: [],
                downLoadList: [],  // 下载图片
                isLoading: null,  // 加载状态
                company_id:'',//公司id
                save_Img: global.baseConstant.serverUrl+'images/distribution/save-img.png',
                shareAmount: 12345,
                isAuthorityDown: false,  //是否有下载文件的权限,false为拒绝
                goAuthPage: false, //用于判断是否从授权页面回来，是的话不重新请求接口
                isSave: false,  // 当前页面记录保存状态，用于样式显示与隐藏
            }
        },
        methods: {
            onClickImg(item){
                global.getImgBase64ToLocalUrl(item.mixPicStr).then(res=>{
                    console.log("图片转成本地地址",res)
                    wx.previewImage({
                        urls: [res],
                        success: ()=>{
                            console.log("成功")
                        }
                    })
                })
            },
            //  获取任务信息
            getInfo() {
                this.isLoading = true
                let data = {
                    id: this.$route.query.id,
                    vipId: global.Storage.get('USER_INFO').vipInfoId
                }
                Distribution.getTaskDetail(data).then((res) => {
                    this.taskInfo = res.taskInfo
                    let newStr = this.taskInfo.contentText.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (img, src) {
                        let index = src.indexOf('=') + 1
                        let imgData = global.getImg(src.substring(index, img.length))
                        return '<img src="' + imgData + '">'
                    })
                    this.taskInfo.contentText = newStr
                    this.imgList = res.imgList
                    this.imgHandel()
                    this.isLoading = false
                    global.toastLoading(false);// 关闭
                },() => {
                    this.isLoading = false
                })
            },

            //  将任务二维码转换成本地图片
            async imgHandel(){
                this.downLoadList = await Promise.all(this.imgList.map((item) => {
                    console.log('下载图片地址',item.mixPicStr)
                    return global.getImgBase64ToLocalUrl(item.mixPicStr)
                }))
                console.log('本地图片',this.downLoadList)
            },

            //  生成小程序二维码
            getQrcode(item) {
                let data = {
                    vipId: global.Storage.get('USER_INFO').vipInfoId,
                    taskId: this.$route.query.id,
                }
                if(item.qrParameterCode === 'D_QRPARAMETER02') data.goodsCode = item.mdtTaskDttPartDto.partCode
                Distribution.getWechatQrcode(data).then((res) => {
                    item.qrcodeImg = res
                })
            },

            //触发保存图片的授权
            touchAuthDown() {
                let root = this;
                // 获取用户是否开启用户授权相册
                return new Promise((resolve, reject) => {
                    wx.getSetting({
                        success(res) {
                            console.log('getSetting_success')
                            // 如果没有则获取授权
                            if (!res.authSetting['scope.writePhotosAlbum']) {
                                console.log('刚授权了')
                                wx.authorize({
                                    scope: 'scope.writePhotosAlbum',
                                    success() {
                                        console.log('授权成功')
                                        root.isAuthorityDown = true
                                        resolve(true)
                                    },
                                    fail() {
                                        console.log('拒绝保存之后，唤起权限授权')
                                        root.isAuthorityDown = false
                                        resolve(false)
                                    }
                                })
                            } else {
                                root.isAuthorityDown = true
                                console.log('有授权直接保存')
                                resolve(true)
                                // 有则直接保存
//                                 root.saveImg()
                            }
                        },
                    })
                })

            },

            //点击opensetting状态的下载按钮
            clickOpensettingInfo(){
                this.goAuthPage=true;//回来时不去触发onShow
            },

            //获取opensetting回调结果
            async getOpensettingInfo(e) {
                global.toastLoading()
                await this.touchAuthDown();
                Toast.clear();
            },

            //下载图片
            async saveImg() {
                let self = this;
                let result = Promise.all(
                    self.downLoadList.map((item) => {
                        return new Promise((reslove,reject) => {
                            wx.saveImageToPhotosAlbum({
                                filePath: item,
                                success() {
                                    reslove(200)
                                },
                                fail() {
                                    reject(-1)
                                }
                            })
                        })
                    })
                )
                console.log('下载图片',result)
                this.isSave = true
                wx.showToast({
                    title: '保存成功'
                })
            },

            // 检查图片权限
            checkImgCanSave() {
                let root = this;
                wx.getSetting({
                    success(res) {
                        console.log('getSetting_success')
                        // 如果没有则获取授权
                        if (!res.authSetting['scope.writePhotosAlbum']) {
                            root.isAuthorityDown = false
                        } else {
                            root.isAuthorityDown = true
                        }
                    },
                })
            }
        },
        onLoad() {
            global.toastLoading();// 开启
            this.checkImgCanSave()
            Object.assign(this.$data, this.$options.data()); // 解决重复进页面数据未初始化问题
            this.company_id = global.Storage.get('COMPANYID').company_id;
            this.getInfo()
        },
        onShow(){
            //从授权页面回来的话,不重新请求接口
            if (this.goAuthPage) {
                this.goAuthPage = false
                return
            }
        },
        onUnload(){
            Object.assign(this.$data, this.$options.data());
        },
    }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
    .task-detail {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        min-height: 100%;
        padding: computed(20);
        position: relative;
        overflow: hidden;
        background: $color-border;
        .task-goods{
            box-sizing: border-box;
            height: computed(300);
            padding: computed(30);
            position: relative;
            overflow: hidden;
            background: $color-white;
            .item-cover {
                width: computed(240);
                height: computed(240);
                overflow: hidden;
                box-shadow: 0 computed(10) computed(30) 0 rgba(69,69,69,0.2);
                -webkit-border-radius: computed(10);
                -moz-border-radius: computed(10);
                border-radius: computed(10);
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            .goods-detail {
                width: computed(380);
                height: computed(240);
                position: relative;
                .item-txt {
                    max-width: computed(380);
                    max-height: computed(50);
                    word-break: break-all;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                }
                .item-name {
                    box-sizing: border-box;
                    font-size: $font-h2;
                    color: $text-primary;
                    line-height: computed(44);
                    font-weight: bold;
                    border-bottom: solid 1px $color-border;
                    vertical-align: top;
                }
                .item-context {
                    margin-top: computed(18);
                    font-size: $font-common;
                    line-height: $font-num;
                    color: $text-placeholder;
                }
                .price {
                    margin-top: computed(14);
                    font-size: $font-h1;
                    line-height: computed(38);
                    vertical-align: text-bottom;
                    color: $color-red;
                    font-weight: bold;
                    .tag-price {
                        font-size: $font-small;
                        line-height: computed(38);
                        font-weight: normal;
                        color: $text-placeholder;
                        vertical-align: text-bottom;
                    }
                }
                .profit {
                    margin-top: computed(16);
                    width: computed(144);
                    height: computed(32);
                    -webkit-border-radius: computed(32);
                    -moz-border-radius: computed(32);
                    border-radius: computed(32);
                    font-size: $font-small;
                    line-height: computed(32);
                    color: $color-red;
                    text-align: center;
                    background: #FAEDE7;
                    .mini {
                        font-size: $font-mini;
                    }
                    .iconzhuanduoshao{
                        font-size: $font-common;
                        display: inline;
                    }
                }
                .detail-btn {
                    width: computed(202);
                    height: computed(60);
                    margin-top: computed(6);
                    -webkit-border-radius: computed(60);
                    -moz-border-radius: computed(60);
                    border-radius: computed(60);
                    background: $bggradientcolor;
                    font-size: $font-regular;
                    line-height: computed(60);
                    color: $color-white;
                    text-align: center;
                    box-shadow: 0 computed(6) computed(17) 0 rgba(255, 95, 43, 0.3);
                    .mini {
                        font-size: $font-small;
                    }
                    .iconzhuanduoshao{
                        font-size: $font-h2;
                        display: inline;
                    }
                }

            }
        }

        .task-info{
            box-sizing: border-box;
            margin-top: computed(20);
            padding: computed(30);
            background: $color-white;
            overflow: hidden;
            .task-tip{
                width: 100%;
                height: computed(54);
                overflow: hidden;
                .save-icon{
                    width: computed(70);
                    height: computed(54);
                    overflow: hidden;
                    img{
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                }
                .save-txt{
                    margin-left: computed(5);
                    font-size: $font-small;
                    line-height: computed(24);
                    color: #C5C5C5;
                    vertical-align: top;
                }
            }
            .task-name {
                margin-top: computed(20);
                font-size: $font-h1;
                line-height: 1;
                color: $text-primary;
                font-weight: bold;
            }
            .task-time {
                margin-top: computed(20);
                margin-bottom: computed(20);
                font-size: $font-common;
                line-height: 1;
                color: $text-secondary;
            }
            .task-title {
                margin-top: computed(20);
                font-size: $font-regular;
                line-height: 1;
                color: $text-primary;
            }
            .task-content {
                margin-top: computed(20);
                font-size: $font-regular;
                line-height: 1;
                color: $text-primary;
                overflow: hidden;
            }
            .img-list {
                margin-top: computed(30);
                .img-item {
                    position: relative;
                    width: computed(200);
                    height: computed(200);
                    margin-bottom: computed(25);
                    float: left;
                    overflow: hidden;
                    -webkit-border-radius: computed(10);
                    -moz-border-radius: computed(10);
                    border-radius: computed(10);
                    box-shadow: 0 computed(10) computed(30) 0 rgba(69,69,69,0.2);
                    > .cover-img {
                        display: block;
                        width: 100%;
                        height: 100%;
                        z-index: 1;
                    }
                    > .qrcode-img {
                        display: block;
                        position: absolute;
                        width: computed(48);
                        height: computed(48);
                        &.position-tl {
                            top: 0;
                            left: 0;
                        }
                        &.position-tr {
                            top: 0;
                            right: 0;
                        }
                        &.position-bl {
                            bottom: 0;
                            left: 0;
                        }
                        &.position-br {
                            bottom: 0;
                            right: 0;
                        }
                        &.position-cover {
                            width: 100%;
                            height: 100%;
                            top: 0;
                            left: 0;
                            z-index: 2;
                        }
                    }
                    &:nth-of-type(3n-1) {
                        margin-left: computed(25);
                        margin-right: computed(25);
                    }
                }
            }
            .share-info{
                margin-top: computed(10);
                height: computed(28);
                overflow: hidden;
                .fr{
                    font-size: $font-common;
                    line-height: $font-regular;
                    color: $color-gray-C5;
                    i{
                        display: inline;
                        font-size: $font-common;
                        line-height: $font-regular;
                    }
                }
            }
            .share-box{
                margin-top: computed(20);
                height: computed(60);
                overflow: hidden;
                .share-btn{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: computed(202);
                    height: computed(60);
                    -webkit-border-radius: computed(60);
                    -moz-border-radius: computed(60);
                    border-radius: computed(60);
                    text-align: center;
                    font-size: $font-common;
                    line-height: computed(60);
                    color: $color-white;
                    i{
                        display: inline;
                        font-size: computed(36);
                        line-height: computed(60);
                        color: $color-white;
                    }
                    .btn-name{
                        margin-left: computed(10);
                    }
                    &.download{
                        background: $domaincolor;
                    }
                    &.share{
                        background: $bg-green;
                        margin-left: computed(20);
                    }
                }
            }
        }

        .share-tip{
            margin: computed(30);
            font-size: $font-common;
            line-height: $font-regular;
            text-align: center;
            color: $color-gray-C5;
        }
    }
    .loading-tip{
        width: 100%;
        height: 100%;
        flex: 1;
        font-size: $font-h2;
        line-height: 1;
        color: $text-primary;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .loading-mask{
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.5);
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        .van-loading--white{
            background: none;
        }
    }
</style>
