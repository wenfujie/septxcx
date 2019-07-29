/*
* createTime：2018/11/2
* author：fujie.wen
* description: 商品评价
*/
<template>
    <div class="container">
        <wxs module="filter" src="../../../filter/filterCommon.wxs"></wxs>
        <!--头部评分-->
        <div class="head-comment flex-box">
            <div class="head-comment-label fs24">评价</div>
            <div class="head-comment-star">
                <van-rate disabled :value="score" :size="18" :count="5" disabled-color="#FF632A" color="#FF632A"/>
            </div>
            <span class="head-comment-info">{{score/5*100 | Fix2}}% 好评</span>
        </div>

        <div class="comment-main">

            <!-- <van-list :immediate-check="false"
                      v-model="loading"
                      :finished="finished"
                      @load="onLoad"> -->
                <!--评价列表-->
                <ul class="comment-list">
                    <li class="comment-list-item"
                        v-for="(item,index) in comments"
                        :key="index"
                        v-if="item.anonymousFlag === 1">
                        <div class="comment-user flex-between">
                            <div class="comment-user-left">
                                <span class="fs30">{{item.usrName}}</span>
                                <van-rate
                                        class="start"
                                        disabled
                                        :value="item.commentTypeScore"
                                        :size="12"
                                        :count="5"
                                        disabled-color="#FF632A"
                                        color="#FF632A"
                                        void-color="#ccc"/>
                            </div>
                        </div>
                        <span class="date fs20">{{filter.filterDate(item.commentTime)}}</span>
                        <span v-if="item.sizeName && item.colorName" class="info fs20">尺码：{{item.sizeName}} ; 颜色：{{item.colorName}}</span>

                        <div class="comment-text fs24" v-if="item.commentMemo">{{item.commentMemo}}</div>

                        <ul class="comment-img-list flex-box flex-wrap"
                            v-if="item.thumbsVos && item.thumbsVos.length > 0">
                            <li class="comment-img-item" v-for="(thumItem,thumIndex) in item.thumbsVos" :key="thumIndex">
                                <img :src="filter.imgFilter(thumItem.url,company_id)" @error="errImg($event)" alt="评价缩略图" @click="bigPic(item.thumbsVos, thumIndex)"  lazy-load="true">
                            </li>
                        </ul>

                        <p class="comment-reply fs24" v-if="item.answerCommentmo">
                            <span>回复：</span>
                            {{item.answerCommentmo}}
                        </p>
                    </li>
                </ul>
            <!-- </van-list> -->


            <div class="empty-content" v-if="!comments.length">
                <p>暂无评价</p>
            </div>
        </div>

        <!--评论大图轮播-->
        <!-- <van-popup v-model="showBigPic" :overlay="true" class="comment-detail">
            <swiper indicator-dots="true" autoplay="true" interval="3000" class="swiper">
                <block v-for="(image,index) in bigPics" :key="index">
                    <swiper-item>
                    <img
                        :src="filter.imgFilter(image,company_id)"
                        lazy-load="true"
                    >
                    </swiper-item>
                </block>
            </swiper>

        </van-popup> -->
    </div>
</template>

<script>
    import {Goods} from "../../../api/service";

    export default {
        config: {
            navigationBarTitleText: '评价',
        },
        data () {
            return {
                score: 5,
                pageNum: 1,
                pageSize: 10,
                comments: [],//评论列表
                loading: false,
                finished: false,
                // showBigPic: false,// 显示评论大图
                bigPics: [],// 评论大图数组
                bannerIndex: 0,  // 轮播图默认第一章
                company_id: "",
            }
        },
        onLoad () {
            this.company_id = global.Storage.get("COMPANYID").company_id;
            this.goodsCode = this.$route.query.goodsCode;
            this.getGoodsComments();
            this.getGoodsScore();
        },
        onUnload(){
            Object.assign(this.$data, this.$options.data())
        },
        onReachBottom: function () {
            if (!this.finished) {
                this.pageNum++;
                this.getGoodsComments();
            }
        },
        methods: {
            //  放大图片
            bigPic (data, index) {
                let arr = []
                data.forEach((item) => {
                    if (item.url) {
                        let newUrl=this.filter.imgFilter(item.url,this.company_id)
                        arr.push(newUrl)
                    }
                })
                this.bannerIndex = index
                this.bigPics = arr
                // this.showBigPic = true
                
                wx.previewImage({
                    current: arr[index], // 当前显示图片的http链接
                    urls: arr // 需要预览的图片http链接列表
                })

            },

            // 查询商品评价
            getGoodsComments () {
                let commentData = {
                    goodsCode: this.goodsCode,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    busContsCode: global.baseConstant.busContsCode
                };
                Goods.getGoodsComments(commentData).then((res) => {
                    if (res.list && res.list.length > 0) {
                        res.list.forEach((item) => {
                            this.comments.push(item)
                        })
                    }
                    if (res.pages <= this.pageNum) {
                        this.finished = true;
                    }
                }).then(() => {
                    this.loading = false;
                });
            },

            // 获取综合评分
            getGoodsScore(){
                let commentData = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    goodsCode: this.goodsCode,
                    busContsCode: global.baseConstant.busContsCode
                };
                Goods.getGoodsScore(commentData).then((res) => {
                    this.score = Math.round(res);
                })
            },
        },

    }
</script>

<style lang="scss" type="text/scss" scoped>
    .container {
        height: 100%;
        padding: computed(30) computed(30) 0 computed(30);
        overflow-y: hidden;
        background: $color-border;
        min-height: 100%;
    }
    .comment-main {
        height: calc(100% - #{computed(88)});
        overflow: auto;
    }
    .head-comment {
        background: #fff;
        padding: computed(26) computed(24);
        border-radius: computed(20);
        margin-bottom: computed(30);
    }
    .head-comment-label {
        padding-right: computed(24);
        color: $text-primary;
        font-size: $font-regular;
    }
    .head-comment-star {
        margin-top:computed(-5)
    }

    .head-comment-info{
        padding: computed(3) 0 0 computed(20);
        font-size:$font-common;
        color:$text-primary;
    }
    .comment-list-item {
        padding: computed(30) computed(23);
        background: #fff;
        box-shadow:0 computed(-1) 0 0 $text-gray;
        border-radius: computed(20);
        margin-bottom: computed(20);
        .comment-user {
            line-height: computed(30);

            .comment-user-left {
                margin-bottom: computed(10);

                .comment-vip {
                    display: inline-block;
                    margin-left: computed(10);
                    color: #fff;
                    font-size: computed(22);
                    background: #d5af6e;
                    padding: 0 computed(15);
                }
                .start{
                    margin: 0 0 0 computed(30);
                    display: inline-block;
                }
            }
            .comment-user-right {
                color: #999;
            }
        }
        .date, .info{
            color: $text-secondary;
        }
        .info{
            margin-left: computed(30);
        }

        .comment-text {
            color: #666;
            line-height: computed(30);
            padding: computed(15) 0 computed(18) 0;
        }

        .comment-img-list {
            .comment-img-item {
                width: computed(144);
                height: computed(144);
                margin: 0 computed(16) computed(30) 0;
                border:1px solid $text-placeholder;
                border-radius: 5rpx;
                img {
                    width: 100%;
                    height: 100%;
                }
                &:nth-child(4n){
                    margin: 0 0 computed(30) 0;
                }
            }
        }

        .comment-reply {
            color: $text-secondary;
            line-height: computed(30);
            padding: computed(18) computed(14);
            background-color: $color-light-gray;
            border-radius: 5rpx;
            span{
                color: $text-primary !important;
            }
        }
    }
    .comment-detail{
        width: 100%;
        .van-swipe-item{
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                display: block;
                height: computed(750);
                max-width: 100%;
            }
        }
    }
    .big-pic-box .van-swipe {
        width: auto;
        .van-swipe__track {
            width: auto !important;
            .van-swipe-item {
                width: auto !important;
            }
        }
    }
    .big-pic {
        width: 80vw;
        height: 80vw;
        display: block;
    }
    .empty-content{
        height: 100%;
    }
</style>
