 <style lang='scss' >
.wheel-picker-container {
    width: 100%;
    .wheel-picker-wrapper {
        width: 100%;
        font-size: 30rpx;
        background: #fff;
    }
    .picker-bottom {
        width: 100%;
        display: flex;
        justify-content: center;
        padding-bottom: computed(16);
        .btn-confirm {
            display: flex;
            justify-content: center;
            align-items: center;
            width: computed(690);
            height: computed(80);
            color: #fff;
            outline: 0;
            background: $bggradientcolor;
            border-radius: $btn-radius40;
        }
    }
}
</style>
 
 <template>
    <overlayer v-model="show" @touchmove.prevent="noop()">
        <div class="wheel-picker-container" @click.stop="noop()">
            <van-picker
                v-if="show"
                :columns="leftData"
                @change="onChange"
                :default-index="defaultIndex"
            />
            <div class="picker-bottom">
                <div class="btn-confirm" @click="onConfirm()">确定</div>
            </div>
        </div>
    </overlayer>
</template>
 
 <script>
import overlayer from "../../../overlayer/index";
export default {
    props: {
        data: {
            type: [Array, Object],
            default: () => []
        },
        value: Boolean
    },
    components: {
        overlayer
    },
    data() {
        return {
            show: this.value,
            model: [],
            leftData: [],
            rightData: [],
            seletedModel: {},
            rightIndex: null,
            defaultIndex: 0,
            cacheIndex: 0
        };
    },
    methods: {
        noop() {},

        initData() {
            this.leftData = [];
            if (this.data instanceof Array) {
                this.data.forEach(item => {
                    let obj = {
                        text: item.shippingName,
                        id: item.id,
                        shippingId: item.shippingId,
                        shippingName: item.shippingName
                    };
                    this.leftData.push(obj);
                });
            }
            // this.defaultIndex =
            //     this.leftData.length >= 2 ? this.defaultIndex : 0;
            this.seletedModel = this.leftData[this.defaultIndex];
        },
        onChange(e) {
            this.seletedModel = e.target.value;
            this.cacheIndex = e.target.index;
        },
        onConfirm() {
            this.defaultIndex = this.cacheIndex;
            this.$emit("confirm", this.seletedModel);
            this.show = false;
        },
        onClose() {
            this.show = false;
        }
    },
    created() {
        this.initData();
    },
    watch: {
        data: {
            handler() {
                this.initData();
            },
            deep: true
        },
        value: {
            handler(val) {
                if (val) {
                    this.show = val;
                    this.initData();
                }
            },
            deep: true
        },
        show: function(params) {
            this.$emit("input", this.show);
        }
    },
    onHide() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    }
};
</script>