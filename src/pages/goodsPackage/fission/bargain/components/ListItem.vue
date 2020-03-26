/*
* createTime：2019/9/24
* author：fujie.wen
* description: 砍价列表的item
*/
<template>
    <li class="list-item flex-box" @click="clickItem(item)">
        <wxs module="filter" src="../../../../../filter/filterCommon.wxs"></wxs>

        <div class="list-item--img">
            <img :src="filter.imgFilter(item.glbFileUrl, company_id)"
                 :style="{'width': imgBorderLength+'rpx','height': imgBorderLength+'rpx'}"
                 lazy-load="true">

            <div class="unstock" v-if="isUnstock">已售罄</div>
            <div class="time-over" v-if="isBargainEnd">
                <p>砍价</p>
                <p>结束</p>
            </div>
        </div>
        <div class="list-item--cont">
            <p class="title">{{item.ptiPartHdName}}</p>
            <div class="list-item--detail flex-box">
                <div class="flex-auto flex-vbox">
                    <p class="stock-count flex-auto" v-if="!hideStock">仅剩{{item.clustNum}}件</p>
                    <div class="price">
                        <p class="price-tag">￥{{item.oldPrice}}</p>
                        <p class="price-sale">
                            <span>{{priceDescribe}}</span>
                            <span>￥{{filter.Fix2(bargainPrice>=0?bargainPrice:0)}}</span>
                        </p>
                    </div>
                </div>

                <div class="operator flex-end">
                    <count-down :targetTime="targetTime"
                                :title="countdownTitle"
                                :spreadServerTime="spreadServerTime"
                                :key="index"
                                countDownType="secondCountDown"
                                @over="timeOver">
                        <template v-if="showSlot">
                            <p class="time-end-text">砍价时间</p>
                            <p class="time-end-text">已结束</p>
                        </template>
                    </count-down>
                    <div :class="['list-item--cont__btn', {'disabled': item.btn.disabled}]"
                         v-if="!hideBtn" @click="clickBtn(item,index)">
                        {{item.btn.title}}
                        <button class="authorization-btn"
                                @click.stop=""
                                open-type="getUserInfo"
                                v-if="!vipInfoId"
                                @getuserinfo="getuserinfo(item,index)">授权按钮</button>
                    </div>
                </div>
            </div>
        </div>
        <van-toast id="van-toast" />
    </li>
</template>

<script>
    import CountDown from '@/pages/goodsPackage/fission/components/CountDown.vue';
    import Toast from 'vant-weapp/dist/toast/toast';
    import { Fission, UserService } from '@/api/service';

    export default {
        components:{ CountDown },
        props:{
            // item信息
            item: {},
            // item索引
            index: {
                type: Number,
                default: 0
            },
            // 目标时间（可以是时间戳或Date类型） 必须是未来时间
            targetTime: 0,
            // 商品图边长
            imgBorderLength:{
                type: Number,
                default: 220
            },
            // 是否隐藏按钮
            hideBtn:{
                type: Boolean,
                default: false
            },
            // 是否隐藏库存展示
            hideStock:{
                type: Boolean,
                default: false
            },
            // 是否库存不足
            isUnstock:{
                type: Boolean,
                default: false
            },
            // 是否砍价时限结束
            isBargainEnd:{
                type: Boolean,
                default: false
            },
            // 计时器title
            countdownTitle:{
                type: String,
                default: '距砍价结束'
            },
            // 价格描述
            priceDescribe:{
                type: String,
                default: '可砍至：'
            },
            // 已砍至多少钱
            bargainPrice:{
                type: Number,
                default: 0
            },
            // 是否展示倒计时结束slot
            showSlot:{
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                vipInfoId: "",
                serverUrl: '',
                company_id: '',
                spreadServerTime: 0,
            }
        },
        methods: {
            /** 点击item **/
            clickItem(item){
                this.$emit('clickItem', item);
            },
            /** 授权获取用户信息 **/
            async getuserinfo(item,index){
                let isSuccess = await global.loginAuthor();
                if(isSuccess) {
                    this.vipInfoId = global.Storage.get('USER_INFO').vipInfoId;
                    this.clickBtn(item,index);
                }else{
//                    Toast('授权失败');
                }
            },
            /** 获取服务器时间 **/
            async getServerDate(){
                this.spreadServerTime = +new Date();
                return
                // todo 存在多层传递时间undefined问题
                return await Fission.getServerDate().then(res=>{
//                    this.spreadServerTime = global.c_getDateStamp(res);
                })
            },
            /** 点击按钮 **/
            clickBtn(item,index){
                this.$emit('clickBtn', item, index);
            },
            /** 倒计时结束事件 **/
            timeOver(item,index){
                this.$emit('timeOver', this.item, this.index);
            },
        },
        onLoad() {
            this.vipInfoId = global.Storage.get('USER_INFO').vipInfoId;
            this.getServerDate();
            this.serverUrl = global.baseConstant.serverUrl;
            this.company_id = global.Storage.get('COMPANYID').company_id;
        },
    }
</script>

<style scoped lang="scss">
    .list-item{
        width:100%;
        border-bottom: computed(1) solid $color-border;
        padding: computed(30) 0;
        &:last-child{
            border-color: transparent;
        }

        .list-item--img {
            font-size: $font-common;
            margin-right: computed(30);
            position: relative;
            img{
                width: computed(220);
                height: computed(220);
            }
            .unstock,
            .time-over{
                position: absolute;
                background-color: #000;
                color: $color-white;
                text-align: center;
                opacity: .5;
            }
            .unstock{
                left: 0;
                bottom:0;
                width: 100%;
                line-height: computed(40);
            }
            .time-over {
                left: 50%;
                top: 50%;
                width: computed(96);
                height: computed(96);
                margin-left: computed(-48);
                margin-top: computed(-48);
                border-radius: 50%;
                p{
                    text-align: center;
                    &:first-child{
                        margin-top: computed(18);
                    }
                }
            }
        }
        .list-item--cont{
            width: calc(100% - #{computed(250)});
            display: flex;
            flex-wrap: wrap;

            .list-item--detail{
                flex: 1;
                margin-top: computed(22);

            }
            .title{
                width: 100%;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                font-size: $font-regular;
                color: $text-primary;
            }
        }
    }
    // 按钮，各种状态
    .list-item--cont__btn {
        width: computed(168);
        line-height: computed(60);
        text-align: center;
        background: $bggradientcolor;
        color: $color-white;
        font-size: $font-regular;
        margin-top: computed(25);
        border-radius: computed(30);
        position: relative;

        &.disabled{
            background: $text-placeholder;
        }
    }
    .stock-count {
        color: $gradientcolor;
        font-size: $font-common;
    }
    .price{
        .price-tag {
            color: $text-placeholder;
            font-size: $font-common;
            text-decoration: line-through;
        }
        .price-sale{
            span:first-child {
                color: $domaincolor;
                font-size: $font-small;
            }
            span:last-child {
                color: $domaincolor;
                font-size: $font-h2;
            }
        }
    }
    .operator{
        align-content: flex-end;
        flex-wrap: wrap;
        max-width: computed(180);
    }
    .time-end-text {
        color: $text-placeholder;
        font-size: $font-common;
        text-align: right;
    }
</style>
