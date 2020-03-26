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
    }
}
</script>
<style scoped lang="scss">
.empty-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
    background: url("../assets/images/empty.png") no-repeat center 20%;
    background-size: 40%;
    font-size: $font-common;
    line-height: 1;
    color: $text-secondary;
    height: computed(300);
    padding-top: computed(300);
}
</style>