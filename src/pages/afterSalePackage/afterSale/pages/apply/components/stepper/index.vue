<style lang='scss' scoped>
.stepper-wrap {
    margin-top: 10px;
    display: flex;
    width: computed(200);
    font-size: 16px;
    border: solid 1px #b3b3b3;
    background: #f2f3f5;
    border-radius: computed(4);
    .step-minus,
    .step-plus {
        display: flex;
        justify-content: center;
        align-items: center;
        width: computed(60);
        height: computed(60);
        color: #666666;
        padding: 1px;
        text-align: center;
        vertical-align: middle;
        background: #f2f3f5;
        box-sizing: border-box;
    }
    .step-minus {
        border-right: solid 1px #b3b3b3;
    }
    .step-plus {
        border-left: solid 1px #b3b3b3;
    }
    .btn-disabled {
        color: #ada9a9;
        background: #f5f5f5;
    }
    input {
        width: computed(80);
        height: 100%;
        font-size: 14px;
        text-align: center;
        vertical-align: middle;
        padding-top: 8rpx;
        border: none;
        box-sizing: border-box;
        background: #f2f3f5;
    }
}
</style>

<template>
    <div class="stepper-wrap">
        <div
            :disabled="currentValue<=1 "
            @click="minus(-step)"
            :class="['step-minus',{'btn-disabled':currentValue===1}]"
        >-</div>
        <input
            type="tel"
            pattern="[0-9]*"
            v-model="currentValue"
            @blur="handleBlur()"
            cursor-spacing="30"
        />
        <div
            :disabled="currentValue>=max"
            @click="increase(step)"
            :class="['step-plus',{'btn-disabled':currentValue===max}]"
        >+</div>
    </div>
</template>

<script>
export default {
    props: {
        max: Number,
        min: {
            type: Number,
            default: 1
        },
        step: {
            type: Number,
            default: 1
        },
        value: Number
    },
    data() {
        return {
            currentValue: this.value || 1
        };
    },
    methods: {
        minus(val) {
            if (this.currentValue <= this.min) return;
            this.currentValue += val;
        },
        increase(val) {
            if (this.currentValue >= this.max) return;
            this.currentValue += val;
        },
        handleBlur() {
            this.currentValue = !this.currentValue ? 1 : this.currentValue;
            this.$emit("input", this.currentValue);
        }
    },
    watch: {
        currentValue: function(val) {
            val = String(val).replace(/[^\d]/g, "") - 0;
            if (this.max) {
                this.currentValue = val > this.max ? this.max : val;
            } else {
                this.currentValue = val;
            }
            this.$emit("input", this.currentValue);
        }
    },
    onUnload() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    }
};
</script>