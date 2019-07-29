/*
* createTime：2019/3/11
* author：en.chen
* description:  分销商微信二维码
*/
<template>
    <div class="qr-code">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>
        <div class="qr-code-box">
            <!-- 会员头像 -->
            <div class="avatar"
                 :style="{ background : (!!usrInfo.photoThumb ? 'url('+ usrInfo.photoThumb +') no-repeat center' : 'url('+ filter.imgFilter(usrInfo.photoThumb) +') no-repeat center')}">
                <!--<img v-lazy="usrInfo.photoThumb" alt="" :key="usrInfo.photoThumb">-->
            </div>
            <!--<div class="avatar">-->
            <!--<img v-lazy="usrInfo.photoThumb" alt="" :key="usrInfo.photoThumb">-->
            <!--</div>-->
            <!-- 会员昵称 -->
            <!--<p class="nick-name">{{usrInfo.vipName}}</p>-->
            <!-- 二维码 -->

            <div id="code" class="code">

                <img :src="qrcode" class="qrcode-img" mode="widthFix" :key="qrcode" alt="" @click="handleLongPress" />

            </div>

            <div class="canvas-container">
                <canvas canvas-id="canvas" :style="{height: canvasHeight+'px',width: canvasWidth+'px'}"></canvas>
            </div>

            <!-- 分享提示 -->
            <!--<p class="tip">分享二维码给你的好友</p>-->
            <!--<p class="tip">开启七匹狼官方微分销，轻松赚钱</p>-->
        </div>
        <!--<p class="share">长按识别二维码，即可享受超值优惠</p>-->
        <van-toast id="van-toast" />
    </div>
</template>
<script>
    import {Distribution, UserService} from '../../api/service'

    export default {
        config:{
            navigationBarTitleText: '我的推广二维码'
        },
        data() {
            return {
                usrInfo: {},
                vipId: global.Storage.get('USER_INFO').vipInfoId,
                qrcode: null,
                qrcode2: null,
                showCanvas: false,  // canvas画布显示标识
                text1: '分享二维码给你的好友',  // 第一行文本
                text2: '开启小七快赚微分销，轻松赚钱',  // 第二行文本
				canvasWidth: 240,//240
                canvasHeight: 360,//360
                company_id:'',//公司id
            }
        },
        methods: {
            // 图片点击事件
            handleLongPress(e){
                wx.previewImage({
                    urls: [this.qrcode],
                    success: ()=>{
                        console.log("成功")
                    }
                })
            },
            //  获取个人信息
            getUserInfo() {
                let data = {};
                UserService.getUserInfo(data).then((res) => {
                    this.usrInfo = res;
                    this.getQrcode()
                });
            },

            //  获取小程序二维码
            getQrcode() {
                let data = {
                    vipId: this.vipId
                }
                Distribution.getWechatQrcode(data).then((res) => {
                    console.log("两个接口加载完成...")
                    this.qrcode = res
                    global.getImgBase64ToLocalUrl(this.qrcode).then(res=>{
                    console.log("图片转成本地地址")
                        this.createNewImg(res)
                    })

                })
            },

            //  图片合成
            createNewImg(imgUrl) {

                // let deviceWidth = document.documentElement.clientWidth || document.body.clientWidth;
                // let deviceWidth = wx.getSystemInfoSync().windowWidth;

                let per = wx.getSystemInfoSync().windowWidth / wx.getSystemInfoSync().windowHeight;
                // let per = 1;

                this.flag = !this.flag
                let ctx = wx.createCanvasContext('canvas')

				// const devicePixelRatio = window.devicePixelRatio || 1
                // const backingStoreRatio = ctx.webkitBackingStorePixelRatio || 1
				// const ratio = devicePixelRatio / backingStoreRatio
				const ratio = 5

                // console.log(`浏览器用${devicePixelRatio}个像素点来渲染1个像素`,window.devicePixelRatio)
				// console.log(`浏览器在渲染canvas之前会用${backingStoreRatio}个像素来来存储画布信息`,ctx.webkitBackingStorePixelRatio)

                per = 1 * ratio

				this.canvasWidth = this.canvasWidth * per
				this.canvasHeight = this.canvasHeight * per

                //  绘制白色背景
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, 240 * per, 360 * per)

                //  绘制二维码图片
                ctx.drawImage(imgUrl, 0, 30 * per, 240 * per, 240 * per)

                //  设置用户微信昵称
                if (!!this.usrInfo) {
                    let fontSize = 16 * per
                    ctx.font = `${fontSize}px PingFang-SC-Medium`
                    ctx.fillStyle = "#333333"
                    ctx.textAlign = "center"
                    ctx.fillText(this.usrInfo.vipName, 120 * per, 20 * per)
                    ctx.stroke()
                }
                //  设置第一行文字
                if (!!this.text1) {
                    let fontSize = 12 * per
                    ctx.font = `${fontSize}px PingFang-SC-Medium`
                    ctx.fillStyle = "#333333"
                    ctx.textAlign = "center"
                    ctx.fillText(this.text1, 120 * per, 290 * per)
                    ctx.stroke()
                }

                //  设置第二行文字
                if (!!this.text2) {
                    let fontSize = 12 * per
                    ctx.font = `${fontSize}px PingFang-SC-Medium`
                    ctx.fillStyle = "#333333"
                    ctx.textAlign = "center"
                    ctx.fillText(this.text2, 120 * per, 310 * per)
                    ctx.stroke()
                }
                ctx.draw()
                setTimeout(()=>{
                    this.saveImage()
                },500)
            },

            //  将画布生成图片
            saveImage() {
                var that = this;
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: this.canvasWidth,
                    height: this.canvasHeight,
                    destWidth: this.canvasWidth,
                    destHeight: this.canvasHeight,
                    canvasId: 'canvas',
                    success:(res)=> {
                    console.log("绘画完成...")
                        that.qrcode = res.tempFilePath
                        global.toastLoading(false);// 关闭

                    }
                })
            },
        },
        onLoad() {
            global.toastLoading();// 开启
            this.company_id = global.Storage.get('COMPANYID').company_id;
        },
        onUnload(){
            Object.assign(this.$data, this.$options.data());// 解决重复进页面数据未初始化
        },
        mounted() {
            this.getUserInfo()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
    .qr-code {
        box-sizing: border-box;
        min-height: 100%;
        padding: computed(30) computed(60);
        position: relative;
        overflow: hidden;
        background: $color-background;
        .qr-code-box {
            box-sizing: border-box;
            min-height: computed(720);
            padding: computed(90) computed(75) computed(30) computed(75);
            margin-top: computed(125);
            background: $color-white;
            position: relative;
            text-align: center;
            box-shadow: 0 computed(2) computed(8) computed(4) rgba(0, 0, 0, 0.1);
            .avatar {
                box-sizing: border-box;
                width: computed(150);
                height: computed(150);
                position: absolute;
                top: computed(-75);
                left: 50%;
                transform: translateX(-50%);
                border-radius: 50%;
                overflow: hidden;
                border: solid computed(4) $color-white;
                -webkit-background-size: cover !important;
                background-size: cover !important;
                background-position: center;
                box-shadow: 0 computed(1) computed(4) computed(2) rgba(0, 0, 0, 0.1);
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            .nick-name {
                font-size: $font-h2;
                line-height: 1;
                color: $text-primary;
                font-weight: bold;
            }
            .code {
                width: computed(480);
                min-height: computed(480);
                height: auto;
                margin: computed(30) auto 0 auto;
                overflow: hidden;
                .qrcode-img {
                    display: block;
                    width: computed(480);
                }
            }
            .tip {
                margin-top: computed(30);
                font-size: $font-common;
                line-height: 1;
                color: $text-primary;
                font-weight: bold;
            }
        }
        .share {
            margin-top: computed(35);
            font-size: $font-regular;
            line-height: 1;
            color: $text-primary;
            font-weight: bold;
            text-align: center;
        }
    }
    .canvas-container{
        visibility: hidden;
        position: absolute;
        left: computed(1000)
    }
</style>