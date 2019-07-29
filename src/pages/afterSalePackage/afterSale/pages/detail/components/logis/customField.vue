<style lang='scss'>
.custom-field {
    width: 100%;
    ._input {
        background: whitesmoke;
        padding: 15rpx 20rpx;
    }
}
</style>

<template>
    <div class="custom-field">
        <input
            type="number"
            :value="value"
            :placeholder="placeholder"
            @input="onInput"
            cursor-spacing="30"
        />
    </div>
</template>

<script>
export default {
    props: {
        value: "",
        placeholder: ""
    },

    methods: {
        onInput(e) {
            this.$emit("input", e.target.value);
        }
    }
};
</script>