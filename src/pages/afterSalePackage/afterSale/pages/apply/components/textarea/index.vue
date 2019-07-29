<style lang='scss' scoped>
.textarea-box {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: computed(5) 0;
    color: #000 !important;
    font-size: computed(26);
    font-family: "PingFang-SC-Medium";
    background: whitesmoke;
    textarea {
        padding: 10rpx;
        min-height: 150rpx;
        background: whitesmoke;
    }
    textarea:placeholder {
        text-align: center;
    }
    .text-limit-count {
        position: absolute;
        right: 0;
        bottom: computed(10);
        right: computed(20);
    }
}
</style>

<template>
    <div class="textarea-box">
        <textarea
            :value="value"
            :placeholder="placeholder"
            auto-height
            maxlength="100"
            cursor-spacing="80"
            @input="onTextareaInput"
        />
        <span class="text-limit-count">{{value.length }}/100</span>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            default: ""
        },
        placeholder: {
            type: String
        },
        maxLength: {
            type: Number,
            default: 100
        }
    },
    methods: {
        onTextareaInput(e) {
            this.$emit("input", e.target.value);
        }
    }
};
</script>