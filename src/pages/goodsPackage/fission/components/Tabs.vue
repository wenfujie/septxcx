/*
* createTime：2019/9/23
* author：junyong.hong
* description: 通用：tab组件

tabList需遵循如下数据格式：
    [
        {
            tabType: "索引",
            nameEn: "名称[英文]",
            nameCn: "名称[中文]"
        },
        ...
    ]
*/
<template>
    <div class="tab-title bg-white">
        <div v-for="(item, index) in tabList"
             :key="index"
             :class="['tab-title-item', { 'active': tabActive === index}]"
             @click="tabClick(item, index)">
            <span>{{item.nameCn}}</span>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        props: {
            // 当前选中索引
            tabActive: {
                type: Number,
                default: 0
            },
            // tab列表
            tabList: {
                type: Array
            },
            // 判断当前tab的数据是否请求结束
            isFinish: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {}
        },
        methods: {
            /**
             * 点击事件回调函数
             * @param item 当前点击tab对象
             * @param index 当前点击索引值
             */
            tabClick (item, index) {
                if (this.tabActive === index || !this.isFinish) {
                    return
                }

                this.$emit('update:tabActive', index)
                this.$emit('tabClick', item, index)
            }
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    .tab-title {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: row;
        width: 100%;
        height: computed(80);
        line-height: computed(80);
        text-align: center;
        box-shadow: 0 computed(4) computed(8) 0 rgba(0, 0, 0, 0.06);
        z-index: 9;
        .tab-title-item {
            flex: 1;
            z-index: 99;
            color: $text-regular;
            font-size: computed(28);
            &.active {
                color: $domaincolor !important;
                font-size: computed(32) !important;
                span {
                    padding: computed(20);
                    border-bottom: computed(4) solid $domaincolor;
                }
            }
        }
    }
</style>
