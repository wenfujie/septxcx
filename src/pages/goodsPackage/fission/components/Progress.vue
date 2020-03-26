/*
* createTime：2019/9/24
* author：lan.chen
* description: 进度条
*/
<template>
    <!-- proContent 进度条内容文字  -->
    <!-- percent 进度条百分比 -->
    <!-- proBackColor进度条底部色 -->
    <!-- proColor进度条色 -->
    <div class="progress-box">
        <div class="progress-total" :style="{background:proBackColor}">
           
            <!-- 进度条，到时候动态修改width -->
            <span class="bg-percent" :style="{width:percent+'%',background:proColor}"></span>
            <span class="progress-content" :style="{color:officalColor}">&nbsp;&nbsp;{{proContent}}</span>
        </div>
        <div class="cut-sale">
            <p v-show="leftTitle">{{leftTitle}}</p>
            <p v-show="rightTitle">{{rightTitle}}</p>
        </div>
        
    </div>
</template>

<script>
export default {
    props: {
        // 进度条显示内容
        proContent: {
            type: String,
            default: ""
        },
        // 进度条底色
        proBackColor: {
            type: String,
            default: "#FFEDE6"
        },
        // 进度条颜色
        proColor: {
            type: String,
            default: "#FF3636"
        },
        // 进度条文案颜色
        officalColor: {
            type: String,
            default: "#FFFFFF"
        },
        // 进度条左下角文案
        leftTitle: {
            type: String,
            default: ''
        },
        // 进度条右下角文案
        rightTitle: {
            type: String,
            default: ''
        },
        // 进度条动态修改width百分比
        percent: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
        };
    },
    computed: {},
    methods: {},
    onLoad() {}
};
</script>

<style scoped lang="scss">
.progress-box {
    margin-top:computed(18);
    .progress-total {
        height: computed(26);
        width: 100%;
        border-radius: computed(13);
        position: relative;
        .progress-content,.bg-percent {
            position: absolute;
            display: inline-block;
            height: computed(26);
            font-size: $font-little;
            border-radius: computed(13);
        }
      }
    .cut-sale {
        color: $text-secondary;
        font-size: $font-common;
        padding:computed(15) 0;
         p:nth-of-type(1) {
            float: left;
            color: $domaincolor;
          }
          p:nth-of-type(2) {
            float: right;
            right: 0;
        }
    }
  
}
</style>
