/*
* createTime：2019/9/19
* author：fujie.wen
* description: 砍价列表
*/
<template>
    <div>
        <wxs module="filter" src="../../../../filter/filterCommon.wxs"></wxs>

        <!--进行中列表-->
        <div class="doing-list" v-if="bargainingList && bargainingList.length">
            <p class="doing-list-title">正在进行中</p>
            <ul class="list pdLr20">
                <!--砍价结束 只有在进行中列表展示 通过isBargainEnd控制-->
                <list-item v-for="(item,index) in bargainingList"
                           :key="index"
                           :index="index"
                           :item="item"
                           :hideStock="item.clustNum<=500?false:true"
                           :isUnstock="item.clustNum <= 0?true:false"
                           :isBargainEnd="serverTime > item._bargainEndTime ?true:false"
                           :countdownTitle="item._countdownTitle"
                           :targetTime="item._targetTime"
                           :priceDescribe="item.sendBgpart?'已砍至：':'可砍至：'"
                           :bargainPrice="item.sendBgpart?(item.oldPrice - item.bgpartPrice):(item.oldPrice - item.brLimit)"
                           @clickBtn="clickBtn"
                           @timeOver="timeOver"></list-item>
            </ul>
        </div>

        <!--未开始列表-->
        <div>
            <ul class="list pdLr30">
                <list-item v-for="(item,index) in bargainList"
                           :key="index"
                           :index="index"
                           :item="item"
                           :hideStock="item.clustNum<=500?false:true"
                           :isUnstock="item.clustNum <= 0?true:false"
                           :bargainPrice="item.sendBgpart?(item.oldPrice - item.bgpartPrice):(item.oldPrice - item.brLimit)"
                           @clickBtn="clickBtn"></list-item>
            </ul>
        </div>

        <empty emptyText="暂无商品参与活动" v-if="!bargainingList.length && !bargainList.length"></empty>

        <!--绑定手机弹窗-->
        <div class="showPhone">
            <van-popup :show="showPopup">
                <phone-popup :showPopup.sync="showPopup" @success="bindPhoneSuccess"></phone-popup>
            </van-popup>
        </div>

        <van-toast id="van-toast"/>
    </div>
</template>

<script>
    import ListItem from '@/pages/goodsPackage/fission/bargain/components/ListItem.vue';
    import { Fission, UserService } from '@/api/service';
    import Empty from '@/components/EmptyContent.vue'
    import phonePopup from '@/components/popup-phone'
    import Toast from 'vant-weapp/dist/toast/toast';

    export default {
        config: {
            navigationBarTitleText: "砍价"
        },
        components:{ ListItem, Empty, phonePopup },
        computed:{
        },
        data() {
            return {
                serverUrl: '',
                company_id: '',
                bargainList: [],// 砍价列表 未开始
                bargainingList: [],// 砍价列表 进行中
                serverTime: '',// 服务器时间
                showPopup: false,// 控制显示绑定手机弹窗
            }
        },
        methods: {
            /** 绑定手机成功 **/
            bindPhoneSuccess(){

            },
            /** 获取砍价列表 **/
            getBargainList(statusCode,resolve){
                let data = {
                    shopId: global.Storage.get("properties").shopId,
                    busContsCode: global.baseConstant.busContsCode,
                    // 分组标识: PROCE处于活动时间内 READY处于活动时间外
                    statusCode: statusCode,
                }
                Fission.getBargainList(data).then(res=>{
                    let title = "去砍价";// 默认成去砍价
                    res.forEach((item,index)=>{
                        /**
                         * 继续砍（未到砍价时限，可邀请好友帮砍）；
                         * 去砍价(未发起砍价)；
                         * 购买（已到砍价时限，未到支付时限，可进行下单）
                         */
                        item.btn = {
                            title:title,
                            disabled:true,
                        }
                    })
                    if(statusCode === 'PROCE') {
                        res.forEach((item)=>{
                            // 活动中商品有库存不禁用按钮
                            item.btn.disabled = item.clustNum<=0?true:false;
                            if(item.sendBgpart) {
                                item._sendTime = global.c_getDateStamp(item.sendTime);// 发起砍价时间
                                item._bargainEndTime = item._sendTime + item.times * 3600000;// 砍价截止时间
                                item._payEndTime = item._bargainEndTime + item.payTimes * 60000;// 优惠截止时间

                                // 设置倒计时标题和时间 设置按钮文案
                                if(this.serverTime > item._bargainEndTime ||
                                    item.payNo === 0 ||
                                    (item.oldPrice - item.bgpartPrice) <= (item.oldPrice - item.brLimit)) {
                                    item._countdownTitle = '距优惠结束';
                                    item._targetTime = item._payEndTime;
                                    title = '购买';
                                }else{
                                    item._countdownTitle = '距砍价结束';
                                    item._targetTime = item._bargainEndTime;
                                    title = '继续砍';
                                }
                                if(item.payNo === 1 || item.btn.disabled) {
                                    title = '去砍价';
                                    item._targetTime = 0;
                                }
                                item.btn.title = title;
                                this.bargainingList.push(item);
                            }else{
                                this.bargainList.unshift(item);
                            }
                        })
                    }else{
                        // 非活动中商品按钮券禁用，按钮文案默认为'去砍价'
                        this.bargainList = this.bargainList.concat(res);
                    }
                    resolve && resolve();
                })
            },
            /** 点击按钮 **/
            async clickBtn(item,index){

                if(item.btn.disabled)return;

                await this.getServerDate();

                if(item.payNo === 1){
                    Toast('每个用户限购一件');
                    return
                }

                if(this.serverTime > item._bargainEndTime && this.serverTime <= item._payEndTime) {
                    // 购买 处于付款时间

                }else if(this.serverTime < item._bargainEndTime) {
                    // 处于砍价时间
                    if(item.sendBgpart) {
                        // 继续砍

                    }else{
                        // 去砍价 判断绑定手机
                        await this.getUserInfo();
                        if(!this.userInfo.mobilePhone) {
                            Toast('请先绑定手机号');
                            this.showPopup = true;
                            return;
                        }

                    }
                }

                // 校验库存下架 不过关return
                let checkPass = this.checkoutSellStock(item).then(checkPass=>{
                    if(checkPass) {
                        let queryUrl = `?goodsCode=${item.ptiPartHdCode}&onlineHdId=${item.onlineHdId}&id=${item.id}`;
                        this.$router.push('/pages/goodsPackage/fission/bargain/bargain-detail' + queryUrl);
                    }
                });
            },
            /** 倒计时结束事件 **/
            async timeOver(item,index){
                await this.getServerDate();

                // 由砍价时限 切换成 优惠时限
                if(this.serverTime > item._bargainEndTime && this.serverTime <= item._payEndTime) {
                    item._countdownTitle = '距优惠结束';
                    item._targetTime = item._payEndTime;
                    item.btn.title = '购买';
                }else if(this.serverTime > item._payEndTime) {

                    // 有下单
                    if(item.payNo === 1 || item.payNo === 0) {

                    }else{
                        // 无下单或已下单但单子已过期
                        this.initPage();
                    }

                }
            },
            // 获取用户信息
            async getUserInfo() {
                return await UserService.getUserInfo().then((res) => {
                    this.userInfo = res;
                });
            },
            /** 获取服务器时间 **/
            async getServerDate(){
                return await Fission.getServerDate().then(res=>{
                    this.serverTime = global.c_getDateStamp(res);
                })
            },
            /** 校验库存和上下架 **/
            async checkoutSellStock(item){
                let data = {
                    shopId: global.Storage.get("properties").shopId,
                    busContsCode: global.baseConstant.busContsCode,
                    onlineHdId: item.onlineHdId,
                    ptiPartHdId: item.ptiPartHdId,
                }
                return await Fission.checkoutSellStock(data).then(res=>{
                    let tip = '';
                    if(res.sellFlag === 1){
                        // 不存在真实库存
                        if(!res.clustNum) {
                            tip = '已售罄';
                        }else {
                            // 存在真实库存 && 不存在下单库存
                            if(!res.surpNum){
                                tip = '有用户下单还未支付，等等再来';
                            }
                        }
                    }else{
                        tip = '商品已下架，无法砍价';
                    }
                    if(tip) {
                        Toast(tip);
                        // 不延迟 会导致提示语被load弹窗覆盖
                        setTimeout(()=>{
                            this.initPage();
                        },2000)
                        return false;
                    }
                    return true;
                },err=>{
                    Toast(err.errorMsg)
                    return false;
                })
            },
            /** 初始化页面 **/
            async initPage(){
                global.toastLoading();
                await this.getServerDate();

                this.bargainList = [];
                this.bargainingList = [];
                let procePromise = new Promise((resolve)=>{
                    this.getBargainList('PROCE',resolve);
                })
                let readyPromise = new Promise((resolve)=>{
                    this.getBargainList('READY',resolve);
                })
                Promise.all([procePromise, readyPromise]).then(res=>{
                    wx.nextTick(()=>{
                        global.toastLoading(false);
                    })
                })
            },
        },
        onShow() {
            this.serverUrl = global.baseConstant.serverUrl;
            this.company_id = global.Storage.get('COMPANYID').company_id;

            this.initPage();
        }
    }
</script>

<style scoped lang="scss">
    .doing-list {
        border: computed(1) solid $gradientcolor;
        margin: computed(10);
        margin-bottom: 0;
        width: calc(100% - #{computed(20)});
    .doing-list-title {
        background: $gradientcolor;
        line-height: computed(60);
        text-align: center;
        color: $color-white;
        font-size: $font-common;
    }
    }
    .list{
        width:100%;
        box-sizing: border-box;
    }

</style>
