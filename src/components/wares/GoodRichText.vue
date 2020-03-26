/*
* createTime：2019/9/26
* author：fujie.wen
* description: 商品详情 富文本
*/
<template>
    <div class="detail">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>

        <rich-text v-if="goodsDetail" class="detail-main" :nodes="goodsDetail"></rich-text>
        <div v-else-if="goodsDetails.length !=0" class="details-main">
            <img v-for="(item,index) in goodsDetails"
                 :src="filter.imgFilter(item,company_id)"
                 :key="index" lazy-load="true"
                 mode="widthFix">
        </div>
        <div class="detail-main no-detail" v-else>暂无商品详情</div>
    </div>
</template>

<script>
    export default {
        components:{},
        data() {
            return {
                company_id: global.Storage.get('COMPANYID').company_id,
            }
        },
        props:{
            // 商品详情 需包含descriptions或descFileUrl字段
            richInfo: {},
        },
        computed:{
            goodsDetail() {
                let root = this;

                if (this.richInfo.descriptions) {
                    let newImg = this.richInfo.descriptions.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (img, src) {
                        let index = src.indexOf('=') + 1
                        let imgData = root.filter.imgFilter(src.substring(index, img.length), root.company_id)
                        return '<img src="' + imgData + '" style="width: 100% !important; display: block; margin: 0;">'
                    })
                    let newPre = newImg.replace(/\<pre\>/gi, function () {
                        return '<div style="word-wrap: break-word;white-space:pre-wrap;">'
                    })
                    newPre = newPre.replace(/\<\/pre\>/gi, function () {
                        return '</div>'
                    })
                    newPre = newPre.replace(/\<blockquote\>/gi, function () {
                        return '<div>'
                    })
                    newPre = newPre.replace(/\<\/blockquote\>/gi, function () {
                        return '</div>'
                    })
                    let newP = newPre.replace(/\<p\>/gi, function () {
                        return '<p style="word-wrap: break-word;white-space:pre-wrap;">'
                    })
                    return newP;
                }
                return '';
            },
            goodsDetails() {
                if (this.richInfo.descFileUrl){
                    return this.richInfo.descFileUrl;
                }
                return [];
            }
        },
        methods: {
        },
        onLoad() {
        }
    }
</script>

<style scoped lang="scss">
    .detail {
        width: 100%;
        background-color: $color-white;
        > p {
            margin: 0 computed(30) computed(30) computed(30);
            padding-top: computed(30);
            font-size: $font-h1;
            font-weight: bold;
            color: $text-primary;
        }
        .detail-main {
            width: 100%;
            div {
                white-space: normal;
            }
        }
        .no-detail {
            font-size: $font-regular;
            padding: 10rpx 32rpx;
        }
        .details-main{
            width: 100%;
            img{
                width: 100%;
                display: block;
            }
        }

    }
</style>
