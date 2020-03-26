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
            <div class="task-goods" v-if="!!taskInfo && !!taskInfo.goodsName">
                <!-- 封面 -->
                <div class="fl mgR30">
                    <div class="item-cover">
                        <img :src="filter.imgFilter(taskInfo.fileUrl,company_id, '240*240')" :key="" lazy-load="true" >
                    </div>
                </div>

                <!-- 详情 -->
                <div class="fl goods-detail">
                    <h2 class="item-name item-txt">{{taskInfo.goodsName}}</h2>
                    <p class="item-context item-txt">{{taskInfo.saleContent || ''}}</p>
                    <p class="price">
                        ￥{{filter.Fix2(taskInfo.salePrice)}}
                        <span class="tag-price" v-if="!!taskInfo.trgPrice">￥{{filter.Fix2(taskInfo.trgPrice)}}</span>
                    </p>
                    <div class="detail-btn">
                        <i class="iconfont iconzhuanduoshao"></i>
                        赚
                        <span class="mini">￥</span>
                        {{filter.Fix2(taskInfo.benefitAmount)}}
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
                <div class="task-content" v-html="taskInfo.contentText" @longpress="copyText($event)"></div>
                <ul class="img-list clearfix" v-if="!!imgList && imgList.length > 0">
                    <li class="img-item" v-for="item in imgList" :key="item.taskId">
                        <img class="cover-img" :src="item.mixPicStr" :key="item.mixPicStr" @click="onClickImg(item)"/>
                    </li>
                </ul>
                <div class="share-info clearfix" v-if="!!taskInfo && taskInfo.forwardedCount>0">
                    <div class="fr">
                        <i class="iconfont iconfaquanshu"></i>
                        <span>{{filter.goldDivide(taskInfo.forwardedCount)}}</span>人已发圈
                    </div>
                </div>
                <div class="share-box clearfix">
                    <div class="fr clearfix">
                        <button class="share-btn download fl" v-if="!!isAuthorityDown" @click="saveImg">
                            <i class="iconfont iconxiazaifaquan"></i>
                            <span class="btn-name">下载发圈</span>
                        </button>
                        <button class="share-btn download fl" v-if="!isAuthorityDown" open-type="openSetting"
                                @opensetting="getOpensettingInfo" @click="clickOpensettingInfo">
                            <i class="iconfont iconxiazaifaquan"></i>
                            <span class="btn-name">下载发圈</span>
                        </button>
                        <button open-type="share" class="share-btn share fl" data-name="shareBtn">
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
            <van-loading color="white"/>
        </div>
        <van-toast id="van-toast"/>
    </div>
</template>
<script>
    import {Distribution} from '../../api/service'
    import Toast from 'vant-weapp/dist/toast/toast';

    export default {
        config: {
            navigationBarTitleText: '任务'
        },
        components: {},
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
                company_id: '',//公司id
                save_Img: global.baseConstant.serverUrl + 'images/distribution/save-img.png',
                isAuthorityDown: false,  //是否有下载文件的权限,false为拒绝
                goAuthPage: false, //用于判断是否从授权页面回来，是的话不重新请求接口
                isSave: false,  // 当前页面记录保存状态，用于样式显示与隐藏
                copyContent: null
            }
        },
        methods: {
            onClickImg(item) {
                global.getImgBase64ToLocalUrl(item.mixPicStr).then(res => {
//                    console.log("图片转成本地地址", res)
                    wx.previewImage({
                        urls: [res],
                        success: () => {
//                            console.log("成功")
                        }
                    })
                })
            },
            //  获取任务信息
            getInfo() {
                this.isLoading = true
                let data = {
                    taskId: this.$route.query.taskId,
                    busContsCode: !!global.baseConstant.busContsCode ? global.baseConstant.busContsCode : global.Storage.get('properties').busContsCode,
                    shopId: global.Storage.get('properties').shopId,
                    vipId: global.Storage.get('USER_INFO').vipInfoId
                }

                //  会员整合新增选中分销商查询
                if(!!this.$store.state.distribution.accountInfo.id) {
                    data.vipId = this.$store.state.distribution.accountInfo.vipInfoHdId
                }

                Distribution.getTaskDetail(data).then((res) => {
                    this.taskInfo = res.taskInfo
                    this.copyContent = this.textHandel(this.taskInfo.contentText)
                    let newStr = this.taskInfo.contentText.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (img, src) {
                        let index = src.indexOf('=') + 1
                        let imgData = global.getImg(src.substring(index, img.length))
                        return '<img src="' + imgData + '">'
                    })
                    let newContent = newStr.replace(/\<p\>/gi, function () {
                        return '<p style="word-wrap: break-word;white-space:pre-wrap;">'
                    })
                    this.taskInfo.contentText = newContent
                    this.imgList = res.imgList
                    this.imgHandel()
                    this.isLoading = false
                }, () => {
                    this.isLoading = false
                })
            },

            //  将任务二维码转换成本地图片
            async imgHandel() {
                this.downLoadList = await Promise.all(this.imgList.map((item) => {
//                    console.log('下载图片地址', item.mixPicStr)
                    return global.getImgBase64ToLocalUrl(item.mixPicStr)
                }))
//                console.log('本地图片', this.downLoadList)
            },

            //  生成小程序二维码
            getQrcode(item) {
                let data = {
                    vipId: global.Storage.get('USER_INFO').vipInfoId,
                    taskId: this.$route.query.taskId,
                }

                //  会员整合新增选中分销商查询
                if(!!this.$store.state.distribution.accountInfo.id) {
                    data.vipId = this.$store.state.distribution.accountInfo.vipInfoHdId
                }

                if (item.qrParameterCode === 'D_QRPARAMETER02') data.goodsCode = item.mdtTaskDttPartDto.partCode
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
//                            console.log('getSetting_success')
                            // 如果没有则获取授权
                            if (!res.authSetting['scope.writePhotosAlbum']) {
//                                console.log('刚授权了')
                                wx.authorize({
                                    scope: 'scope.writePhotosAlbum',
                                    success() {
//                                        console.log('授权成功')
                                        root.isAuthorityDown = true
                                        resolve(true)
                                    },
                                    fail() {
//                                        console.log('拒绝保存之后，唤起权限授权')
                                        root.isAuthorityDown = false
                                        resolve(false)
                                    }
                                })
                            } else {
                                root.isAuthorityDown = true
//                                console.log('有授权直接保存')
                                resolve(true)
                                // 有则直接保存
//                                 root.saveImg()
                            }
                        },
                    })
                })

            },

            //点击opensetting状态的下载按钮
            clickOpensettingInfo() {
                this.goAuthPage = true;//回来时不去触发onShow
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
                        return new Promise((reslove, reject) => {
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
//                console.log('下载图片', result)
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
//                        console.log('getSetting_success')
                        // 如果没有则获取授权
                        if (!res.authSetting['scope.writePhotosAlbum']) {
                            root.isAuthorityDown = false
                        } else {
                            root.isAuthorityDown = true
                        }
                    },
                })
            },

            // 分享成功调用接口记录次数
            addShareTaskCount() {
                let that = this
                let data = {
                    taskId: that.$route.query.taskId
                }
                Distribution.addShareTaskCount(data).then((res) => {
                    this.isSave = true
//                    console.log('记录成功~',res)
                })
            },

            // 复制文本
            copyText(e) {
                let that = this
                wx.setClipboardData({
                    data: this.copyContent,
                    success: function (res) {}
                });
            },

            textHandel(inputText) {
                let returnText = "" + inputText;
                returnText = returnText.replace(/<\/p>/ig, '\r\n');
                returnText = returnText.replace(/<\/pre>/ig, '\r\n');
                returnText = returnText.replace(/<\/li>/ig, '\r\n');
                returnText = returnText.replace(/<li>/ig, ' * ');
                returnText = returnText.replace(/<\/ul>/ig, '\r\n');

                //-- remove BR tags and replace them with line break
                returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

                //-- remove P and A tags but preserve what's inside of them
                returnText=returnText.replace(/<p.*?>/gi, "\r\n");
                returnText=returnText.replace(/<pre.*?>/gi, "\r\n");
                returnText=returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

                //-- remove all inside SCRIPT and STYLE tags
                returnText=returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
                returnText=returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");

                //-- remove all else
                returnText=returnText.replace(/<(?:.|\s)*?>/g, "");

                //-- get rid of more than 2 multiple line breaks:
                returnText=returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

                //-- get rid of more than 2 spaces:
                returnText = returnText.replace(/ +(?= )/g,'');

                //-- get rid of html-encoded characters:
                returnText=returnText.replace(/ /gi," ");
                returnText=returnText.replace(/&/gi,"&");
                returnText=returnText.replace(/"/gi,'"');
                returnText=returnText.replace(/</gi,'<');
                returnText=returnText.replace(/>/gi,'>');

                return returnText
            },

            //清除缓存、临时文件
            clearSaveFile(){
                const fsm=wx.getFileSystemManager();
                fsm.readdir({
                    dirPath:wx.env.USER_DATA_PATH,
                    success:(res)=>{
                        var filesArr = res.files;
                        filesArr.forEach((item)=>{
                            fsm.unlink({
                                filePath:`${wx.env.USER_DATA_PATH}/${item}`
                            })
                        })
                    }
                })
            },
        },
        onLoad() {
            this.checkImgCanSave()
            Object.assign(this.$data, this.$options.data()); // 解决重复进页面数据未初始化问题
            this.company_id = global.Storage.get('COMPANYID').company_id;
            this.getInfo()
        },
        //  分享(转发任务详情跳转首页)
        onShareAppMessage: function (options) {
            let that = this;
            let shareUrl = global.getShareUrl('pages/home/home', that.$route.query);

            that.addShareTaskCount()

            // 分享埋点
            global.gio('track', 'onShareAppMessage', {
                path: shareUrl
            });

            let shareObj = {
                path: shareUrl
            }

            return shareObj;
        },
        onShow() {
            //从授权页面回来的话,不重新请求接口
            if (this.goAuthPage) {
                this.goAuthPage = false
                return
            }
        },
        onUnload() {
            Object.assign(this.$data, this.$options.data());
            this.clearSaveFile()
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
        .task-goods {
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
                box-shadow: 0 computed(10) computed(30) 0 rgba(69, 69, 69, 0.2);
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
                    -webkit-line-clamp: 1 !important;
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
                        text-decoration: line-through;
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
                    .iconzhuanduoshao {
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
                    .iconzhuanduoshao {
                        font-size: $font-h2;
                        display: inline;
                    }
                }

            }
        }

        .task-info {
            box-sizing: border-box;
            margin-top: computed(20);
            padding: computed(30);
            background: $color-white;
            overflow: hidden;
            .task-tip {
                width: 100%;
                height: computed(54);
                overflow: hidden;
                .save-icon {
                    width: computed(70);
                    height: computed(54);
                    overflow: hidden;
                    img {
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                }
                .save-txt {
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
                    box-shadow: 0 computed(10) computed(30) 0 rgba(69, 69, 69, 0.2);
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
            .share-info {
                margin-top: computed(10);
                height: computed(28);
                overflow: hidden;
                .fr {
                    font-size: $font-common;
                    line-height: $font-regular;
                    color: $color-gray-C5;
                    i {
                        display: inline;
                        font-size: $font-common;
                        line-height: $font-regular;
                    }
                }
            }
            .share-box {
                margin-top: computed(20);
                height: computed(60);
                overflow: hidden;
                .share-btn {
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
                    i {
                        display: inline;
                        font-size: computed(36);
                        line-height: computed(60);
                        color: $color-white;
                    }
                    .btn-name {
                        margin-left: computed(10);
                    }
                    &.download {
                        background: $domaincolor;
                    }
                    &.share {
                        background: $bg-green;
                        margin-left: computed(20);
                    }
                }
            }
        }

        .share-tip {
            margin: computed(30);
            font-size: $font-common;
            line-height: $font-regular;
            text-align: center;
            color: $color-gray-C5;
        }
    }

    .loading-tip {
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

    .loading-mask {
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        .van-loading--white {
            background: none;
        }
    }
</style>
