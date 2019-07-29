<style lang='scss' scoped>
.page-coupon {
    padding: computed(30) computed(30) computed(100) computed(30);
}
</style>

<template>
    <div class="page-coupon">
        <voucher
            v-for="(card,index) in cardList"
            :card="card"
            :key="reIndex(index)"
            :source="source"
            @onSelectSuccess="onSelectSuccessDeail"
        />
    </div>
</template>

<script>
import voucher from "./voucher"
export default {
    props: {
        cardList: Array,
        cardState: Number,
        // 来源：默认0为领券中心  1为商品详情页
        source: {
            type: Number,
            default: 0
        }
    },
    components: {
        voucher
    },
    data() {
        return {
            list: []
        }
    },
    methods: {
        onSelectSuccessDeail: function () {
            this.$emit('onSelectSuccessDeail')
        },
        reIndex: function (index) {
            return 'index_' + global.mathSelect(0, 999) + index
        }
    },

}
</script>
