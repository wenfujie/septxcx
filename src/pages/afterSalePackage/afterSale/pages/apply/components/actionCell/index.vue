<style lang='scss' scoped>
.action-cell-container {
    display: flex;
    flex-direction: column;
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: computed(30);
        height: compouted(100);
        margin-bottom: 1px;
        border-bottom: solid computed(1) #cccccc;
        .title {
            flex: 1;
            color: #333333;
            font-size: computed(32);
        }
        .icon-box {
            width: 10%;
            height: 100%;
            text-align: right;
            padding-right: computed(20);
            .iconfont {
                color: #999999;
                font-size: computed(32);
            }
        }
    }
    .list-wrap {
        width: 100%;
        max-height: 50vh;
        padding: computed(10) computed(16);
        margin-bottom: computed(110);
        background: #fff;
        box-sizing: border-box;
    }
    .bottom {
        position: absolute;
        bottom: computed(10);
        z-index: 1000;
        width: 100%;
        display: flex;
        justify-content: center;
        background: #fff;
        .button-confirm {
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
    <overlayer v-model="show">
        <div class="action-cell-container">
            <div class="header">
                <p class="title">{{ title }}</p>
                <div class="icon-box" @click="onClose()">
                    <i class="iconfont iconguanbi1"></i>
                </div>
            </div>
            <div class="list-wrap overflow-scroll">
                <van-radio-group :value="sCode">
                    <van-cell-group>
                        <van-cell
                            v-for="(item, index) in list"
                            :key="index"
                            :title="item[label]"
                            :custom-class="'van-cell-reset'"
                            @click.stop="onCellClick(item)"
                        >
                            <van-radio :name="item[codeField]" custom-class="'van-radio-reset'" />
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>
            <div class="bottom">
                <button class="button-confirm" @click="onConfirm()">确认</button>
            </div>
        </div>
    </overlayer>
</template>

<script>
import overlayer from "@/components/overlayer/index";
export default {
    components: {
        overlayer
    },
    props: {
        list: Array,
        label: {
            type: String,
            default: "name"
        },
        title: {
            type: String,
            default: ""
        },
        checkedObj: Object,
        codeField: String,
        value: Boolean
    },
    data() {
        return {
            show: false,
            sCode: "",
            item: {},
            innerList: [],
            active: "checked",
            unactive: "circle"
        };
    },
    methods: {
        noop() {},
        // 选中
        onCellClick(item) {
            this.sCode = item[this.codeField];
            this.item = item;
        },
        // 关闭
        onClose() {
            this.show = false;
            this.$emit("input", false);
            this.$parent.hideTextarea = false;
            setTimeout(() => {
                this.sCode = this.checkedObj[this.codeField];
            }, 1000);
        },
        //确认
        onConfirm() {
            this.$emit("input", false);
            this.$emit("onChange", this.item);
        },
        //初始化选中状态
        initStatus() {
            // this.sCode = this.checkedObj[this.codeField];
            this.list.forEach((item, index) => {
                if (item[this.codeField] == this.checkedObj[this.codeField]) {
                    this.item = item;
                    this.onCellClick(item);
                }
            });
        }
    },
    watch: {
        value: function(val) {
            this.show = val;
        },
        show: function(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        list: {
            handler(list) {
                this.initStatus();
            },
            deep: true
        }
    },
    onUnload() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    }
};
</script>