<template>
    <div class="default">
        <!-- 404 BEGIN -->
        <div v-if="type == 1" class="default-box">
            <img :src="serverUrl+'images/goods/default.png'">
            <p>错误代码:404</p>
            <p>啊咧，该页面不存在~</p>
            <div class="default-btn">
                <div class="goBack" @click="GoBack">
                    上一页
                    <span>({{count}})s</span>
                </div>
                <div class="goIndex" @click="GoIndex">回到首页</div>
            </div>
        </div>
        <!-- 404 END -->
        <div v-if="type == 2" class="default-box">
            <img :src="serverUrl+'images/goods/default.png'">
            <p>错误代码:500</p>
            <p>啊咧，该页面不存在~</p>
            <div class="default-btn">
                <div class="goBack" @click="GoBack">
                    上一页
                    <span>({{count}})s</span>
                </div>
                <div class="goIndex" @click="GoIndex">回到首页</div>
            </div>
        </div>
        <!-- 商品未上架 BEGIN -->
        <div v-if="type == 3" class="default-box">
            <img :src="serverUrl+'images/goods/obtained.png'">
            <p>商品未上架</p>
            <div class="default-btn center">
                <div class="goBack" @click="GoBack">
                    上一页
                    <span>({{count}})s</span>
                </div>
            </div>
        </div>
        <!-- 商品未上架 END -->
    </div>
</template>
<script>

export default {
    config:{},
    data() {
        return {
            type: 1,    // 1代表404页面 2代表500页面 3商品未上架
            count: '',
            serverUrl:''
        }
    },
    onShow() {
        this.type = this.$route.query.type ? this.$route.query.type : this.type
        this.serverUrl=global.baseConstant.serverUrl;
        this.goLocation()
    },
    methods: {
        // 返回上一页
        GoBack() {
            this.$router.go(-1)
            clearInterval(this.timer);
        },
        // 返回首页
        GoIndex() {
            global.switchTab('/index')
            // this.$router.push('index')
            clearInterval(this.timer);
        },
        // 倒计时五秒后跳转
        goLocation() {
            const time_count = 5;
            if (!this.timer) {
                this.count = time_count;
                this.show = false;
                this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= time_count) {
                        this.count--;
                    } else {
                        this.show = true;
                        clearInterval(this.timer);
                        this.timer = null;
                        //跳转上一个页面
                        this.$router.go(-1)
                    }
                }, 1000)
            }
        }
    },
    onUnload() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
</script>
<style lang="scss" type="text/scss" scoped>
$blackColor: #333333;
$whiteColor: #ffffff;
.default {
    width: 100%;
    height: 100%;
    .default-box {
        position: fixed;
        width: computed(300);
        margin: computed(230) computed(230) 0 computed(225);
        text-align: center;
        p {
            color: $text-secondary;
            font-size: $font-common;
            margin-top: computed(23);
            line-height: computed(20);
        }
    }
    .default-btn {
        display: flex;
        justify-content: space-between;
        margin-top: computed(30);
        div {
            display: inline-block;
            width: computed(132);
            height: computed(50);
            line-height: computed(50);
            text-align: center;
            border-radius: computed(25);
            font-size: $font-common;
            border: 1px solid $color-red;
        }
        .goBack {
            color: $color-red;
        }
        .goIndex {
            background-color: $color-red;
            color: $whiteColor;
        }
        &.center {
            display: inline-block !important;
            text-align: center;
            margin-top: computed(80) !important;
        }
    }
    img {
        width: computed(300);
        height: computed(300);
    }
}
</style>
