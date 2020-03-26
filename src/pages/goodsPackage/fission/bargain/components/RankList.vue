/*
* createTime：2019/9/25
* author：fujie.wen
* description: 砍价排行榜
*/
<template>
    <div>
        <wxs module="filter" src="../../../../../filter/filterCommon.wxs"></wxs>
        <ul class="rank-list pdLr30">
            <li class="rank-item flex-between"
                v-for="(item,index) in rankListFilter"
                :key="index">
                <div class="rank-item-left flex-box">
                    <img :src="filter.imgFilter(item.glbFileUrl,company_id, '64*64')"
                         lazy-load="true" >
                    <span class="flex-center">{{item.vipInfoName}}</span>
                </div>
                <div class="rank-item-right flex-center">
                    <span>砍掉</span>
                    <span>￥{{filter.Fix2(item.price)}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        components:{},
        data() {
            return {
            }
        },
        props:{
            //排行榜列表
            rankList:{
                type: Array,
                default: []
            },
            // 最大展示条数
            maxVisibleLength:{
                type: Number,
                default: 10000
            }
        },
        computed:{
            /** 最终展示列表数据 **/
            rankListFilter(){
                return this.rankList.slice(0, this.maxVisibleLength);
            },
        },
        methods: {},
        onLoad() {
        }
    }
</script>

<style scoped lang="scss">
    .rank-list{
        box-sizing: border-box;
        font-size: $font-common;

        .rank-item {
            margin-bottom: computed(24);
            &:last-child{
                margin-bottom: 0;
            }
            .rank-item-left {
                img {
                    width: computed(64);
                    height: computed(64);
                    border-radius: 50%;
                }
                span {
                    margin-left: computed(17);
                }
            }
            .rank-item-right {

                span:last-child {
                    color: $domaincolor;
                }
            }

        }
    }
</style>
