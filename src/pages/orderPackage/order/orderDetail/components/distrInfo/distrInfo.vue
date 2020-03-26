<!--
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 配送信息
 * @Date: 2019-03-16 17:15:39
 * @LastEditTime: 2019-06-11 17:11:56
 -->
<style lang='scss' scoped>
.distr {
    max-width: 100%;
    background: #fff;
    margin-bottom: computed(30);
    box-sizing: border-box;
    margin-top: computed(20);
    .title {
        font-size: computed(32);
        margin-bottom: computed(20);
        font-family: "PingFang-SC-Bold";
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
    }
    .row-content {
        display: flex;
        font-size: computed(24);
        margin: computed(20) 0;
        box-sizing: border-box;
        .left {
            width: 20%;
            color: #999999;
        }
        .right {
            flex: 1;
            word-break: break-all;
            color: #333333;
        }
    }
}
</style>

<template>
    <div class="distr">
        <p class="title">配送信息</p>
        <logistic :data="pkg"></logistic>
        <div class="row-content">
            <div class="left">收货人：</div>
            <div class="right">{{order.cargoUsrName}}</div>
        </div>
        <div class="row-content">
            <div class="left">联系电话：</div>
            <div class="right">{{order.cargoMobile}}</div>
        </div>
        <div class="row-content">
            <div class="left">收货地址：</div>
            <div class="right">{{address}}</div>
        </div>
        <div class="row-content">
            <div class="left">订单备注：</div>
            <div class="right">{{order.ctmMessage||"暂无备注"}}</div>
        </div>
        <div class="row-content" v-if="orgrinAccout!=''">
            <div class="left">来源账号：</div>
            <div class="right">{{orgrinAccout}}</div>
        </div>
    </div>
</template>
<script>
import logistic from "../logistic";
export default {
    components: {
        logistic
    },
    props: {
        order: Object,
        pkg: Object
    },
    data() {
        return {};
    },
      onUnload() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    },
    computed: {
        address: function() {
            let addr =
                this.order.cargoStateName +
                this.order.cargoCityName +
                this.order.cargoDestName +
                this.order.cargoAddress;
            return addr;
        },
        orgrinAccout:function(){
            let curAccountId=this.$store.state.orderList.curAccountId;
            curAccountId=curAccountId.split(',')
            //若返回的整合账号小于等于1，则不显示
            if(curAccountId.length<2){
                return ''
            }
            let orgrinAccout=this.order.sourceAccount
            if(global.Storage.get("USER_INFO")&&(this.order.vipInfoHdId==global.Storage.get("USER_INFO").vipInfoId)){
                orgrinAccout='当前账号'
            }
            return orgrinAccout
        },
    }
};
</script>