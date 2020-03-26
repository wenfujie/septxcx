/*
 * @Author: yongtian.hong
 * @Date: 2018-08-03 16:43:04
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-12 10:48:08
 * @Description: 物流进度组件
 */

<style lang="scss" scoped>
.step-wrap {
    width: 100%;
    padding: computed(15) 0;
    font-size: computed(24);
    margin-bottom: computed(50);
    .line-wrap {
        padding: computed(15) computed(30);
        .line {
            position: relative;
            width: 100%;
            height: computed(19);
            background-color: #e6e6e6;
            .overlayer {
                position: absolute;
                left: 0;
                top: 0;
                width: 20%;
                height: 100%;
                background-color: $blackcolor;
            }
        }
    }
    .text-wrap {
        display: flex;
        justify-content: space-between;
        padding-top: 0px;
        padding-bottom: computed(10);
        .step {
            flex: 1;
            display: flex;
            flex-direction: column;
            text-align: center;
            .text {
                color: #999999;
            }
            .time {
                position: relative;
                color: #999999;
                .content {
                    position: absolute;
                    left: -10px;
                    top: 100%;
                    width: 120%;
                }
            }
        }
        .stepActive {
            color: $maincolor;
            .text {
                color: #333333;
            }
        }
        .finish {
            color: #999999;
        }
    }
}
</style>

<template>
    <div class="step-wrap">
        <div class="line-wrap">
            <div class="line">
                <div class="overlayer" ref="process"></div>
            </div>
        </div>
        <div>
            <div class="text-wrap">
                <div
                    class="step"
                    v-for="(step,index) in steps"
                    :key="index"
                    :class="{stepActive:activeIndex>=index}"
                >
                    <div class="text">{{step.name}}</div>
                    <div class="time" v-if="step.time">
                        <span class="content">{{step.time}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import getStepsText from "./stepText";
import check from "@/utils/check";
export default {
    name: "OrderStep",
    props: {
        pkg: Object
    },
    data() {
        return {
            steps: [],
            errMsg: {
                kdps: '已取消发货',
                mdzq: '已取消发货'
            },
            activeIndex: 1
        };
    },
    methods: {
        //初始化步骤
        initState(pkg) {
            const stepsText = getStepsText();
            const steps = stepsText[pkg.shippingWayCode];
            // 加载配送方式映射表
            if (check.isEmpty(pkg.nodeTime)) {
                pkg.nodeCode = 3;
                steps[pkg.nodeCode - 1].name = this.errMsg[pkg.shippingWayCode];
            } else {
                steps[pkg.nodeCode - 1].time = pkg.nodeTime;
            }
            let percent = (pkg.nodeCode / 5) * 100;
            this.$refs.process.style.width = percent + "%";
            this.activeIndex = pkg.nodeCode - 1;
            this.steps = steps;
        }
    },
    created(){
          this.initState(pkg);
    },
     onHide() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    },
      onUnload() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    },
    watch: {
        pkg: function (pkg) {
            this.initState(pkg);
        }
    }
};
</script>