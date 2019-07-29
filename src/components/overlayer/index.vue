<style lang='scss' scoped>
.layer-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    .layer {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 101;
        width: 100vw;
        height: 100vh;
        background: rgba($color: #000000, $alpha: 0.8);
        transition: all ease 0.5;
    }
    .content {
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 102;
        width: 100vw;
        background: #fff;
    }
}
</style>

<template>
    <div class="layer-container" v-if="value">
        <div class="layer" catch:touchmove="noop"></div>
        <div class="content">
            <slot></slot>
        </div>
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
        noop() {}
    }
};
</script>