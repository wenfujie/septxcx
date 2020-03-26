<!--
 * @Author: yongtian.hong
 * @Date: 2019-07-07 20:00:59
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-08-13 17:43:07
 * @Description: 
 -->
<style lang='scss' scoped>
.layer-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1001;
    width: 100%;
    height: 100%;
    transition: all 0.03 ease-out;
    .layer {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1002;
        width: 100vw;
        height: 100%;
        background: rgba($color: #000000, $alpha: 0.8);
        transition: all ease 0.5;
    }
    .content {
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 1003;
        max-height: 50vh;
        width: 100vw;
        background: #fff;
    }
}
</style>

<template>
    <div class="layer-container" v-show="value" catch:touchmove="noop">
        <div class="layer" @click.prevent="close()" catch:touchmove="noop"></div>
        <scroll-view class="content" scroll-y="true">
            <slot></slot>
        </scroll-view>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    methods: {
        noop() {},

        close() {
            this.$emit("input", false);
        }
    }
};
</script>