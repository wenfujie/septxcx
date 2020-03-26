/*
* createTime：2018/11/1
* author：en.chen
* description: 文章详情
*/
<template>
    <div class="salon-detail">
        <p class="title">{{pageInfo.title}}</p>
        <p class="date">{{pageInfo.crtLog}}</p>
        <rich-text :nodes="pageInfo.content" class="salon-content"></rich-text>
        <van-toast id="van-toast"/>
    </div>
    
</template>

<script>
    import Toast from 'vant-weapp/dist/toast/toast';
    import { Salon } from '../../../api/service'
    export default {
        config: {
            navigationBarTitleText: "客服与帮助",
        },
        data () {
            return {
                id: '',
                pageInfo: {},
                company_id:''
            }
        },
        onShow () {
            this.company_id=global.Storage.get('COMPANYID').company_id
            this.id = this.$route.query.id
            this.getPage()
        },
        onUnload(){
            Object.assign(this.$data, this.$options.data())
        },
        methods: {
            getPage () {
                let root=this;
                global.toastLoading();
                let data = {
                    id: this.id || this.$route.query.id,
                }
                Salon.getDetail(data).then((res) =>{
                    this.pageInfo = res
                    let newImg = res.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (img, src) {
                        let index = src.indexOf('=') + 1
                        let imgData = root.filter.imgFilter(src.substring(index, img.length),root.company_id)
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
                    this.pageInfo.content = newP
                    global.toastLoading(false);
                })
            }
        },

    }
</script>

<style scoped lang="scss">
    .salon-detail{
        padding: computed(30);
        overflow: hidden;
        .title{
            font-size: computed(42);
            line-height: computed(44);
            font-weight: bold;
        }
        .date{
            color: #999;
            padding: computed(59) 0;
        }
        img{
            display: block;
            width: 100%;
        }
    }
</style>
