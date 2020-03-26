<style lang='scss' >
$activeColor: $domaincolor;
$unActiveColor: #999999;
$normalColor: #333333;
.step {
    position: relative;
    display: inline-block;
    &-title {
        position: relative;
        font-size: computed(28);
        color: $unActiveColor;
        .label {
            position: absolute;
            top: -2px;
            left: -30px;
            min-width: 100%;
            text-align: center;
        }
    }
    &-icon-container {
        position: absolute;
        top: 24px;
        left: 0px;
        color: $unActiveColor;
        z-index: 100;
        background: #fff;
        // padding: 0 computed(20);
        .icon {
            position: absolute;
            top: 0px;
            left: -1px;
            z-index: 100;
            font-size: computed(40);
        }
    }
    &-line {
        position: absolute;
        top: 32px;
        z-index: 10;
        width: 100%;
        height: 2px;
        // padding: 0 computed(20);
        background: $unActiveColor;
    }
    &-sub-title {
        position: absolute;
        top: 40px;
        left: -30px;
        width: 100%;
        font-size: computed(18);
        text-align: center;
        color: $unActiveColor;
    }

    .active-color {
        color: $activeColor;
    }

    .unactive-color {
        color: $unActiveColor;
    }

    .normal-color {
        color: $normalColor;
    }

    .active-line {
        background: $activeColor;
    }
}

.step:last-of-type {
    .step-title {
        min-width: 40px;
        left: -12px;
        .label {
            left: -3px;
        }
    }
    .step-line {
        display: none;
    }
    .step-sub-title {
        left: computed(-50);
        min-width: computed(120);
        text-align: center;
    }
}
</style>

<template>
    <div class="step" :style="{width:curIndex<length?stepWidth:0}">
        <div class="step-title">
            <div
                :class="['label',{'active-color':curIndex==active},{'normal-color':curIndex<active}]"
            >{{node.name}}</div>
        </div>
        <div :class="['step-icon-container',{'active-color':curIndex<=active}]">
            <i class="iconfont iconhuisequan" v-if="curIndex>active"></i>
            <i class="iconfont iconxuanzhong" v-else></i>
        </div>
        <div :class="['step-line',{'active-line':curIndex<active}]"></div>
        <div class="step-sub-title">{{node.time}}</div>
    </div>
</template>

<script>
export default {

    props: {
        curIndex: Number,
        active: Number,
        node: Object,
        length: Number
    },
    data() {
        return {};
    },
    computed: {
        stepWidth: function() {
            return 100 / this.length - 1 + "%";
        }
    },
    onHide() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    },
      onUnload() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    },
    mounted() {}
};
</script>