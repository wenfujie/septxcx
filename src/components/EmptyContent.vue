/*
* createTime：2019/3/4
* author：en.chen
* description:
*/
<template>
    <div class="empty-box" :style="wrapStyle">
        <p class="content">{{emptyText}}</p>
    </div>
</template>
<script>
export default {
    name: "Empty",
    props: {
        emptyText: {
            type: String,
            default: '当前暂无数据~'
        },
        wrapStyle: ""
    },
    data() {
        return {}
    },
    methods: {},
    created() {
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.empty-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
    background: url($serverUrl+"images/common/empty.png") no-repeat center 20%;
    background-size: 40%;
    font-size: $font-common;
    line-height: 1;
    color: $text-secondary;
    height: computed(300);
    padding-top: computed(300);
    .content {
        // padding-top: computed(400);
    }
}
</style>