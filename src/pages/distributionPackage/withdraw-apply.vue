/*
* createTime：2019/3/4
* author：en.chen
* description:  提现页面
*/
<template>
    <div class="withdraw-apply">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>
        <!-- 金额显示 begin -->
        <div class="fund-box">
            <h2 class="amount">{{maxAmount}}</h2>
            <p>当前可提现金额（元）</p>
            <p v-if="!!ruleInfo.totalTaxPoint && ruleInfo.totalTaxPoint>0 && !!taxPoint">提现需扣除{{filter.Fix2(taxPoint)}}%税点作为手续费</p>
            <a href="/pages/distributionPackage/withdraw-history" class="history-btn" tag="div">历史提现记录</a>
        </div>
        <!-- 金额显示 end-->

        <!-- 提示 begin -->
        <p class="tip clearfix">
            <!--<svg class="icon-tip fl" aria-hidden="true">-->
                <!--<use xlink:href="#iconjingshi"></use>-->
            <!--</svg>-->
            <text class="iconfont iconjingshi icon-tip fl"></text>
            <span>温馨提示：余额提现目前仅支持微信提现，提现申请需要客服人员审核，审核通过后将会通过微信转账至您的账户中。</span>
        </p>
        <!-- 提示 end -->

        <!-- 提现方式 begin -->
        <div class="cell withdraw-type">
            <p class="cell-label">提现到</p>
            <div class="cell-content type-box clearfix" @click="isShowTypeList">
                <p class="default-tip" v-if="!cashTypeId">请选择提现方式</p>
                <div class="clearfix" v-else>
                    <!-- <svg class="icon-withdraw-type fl" aria-hidden="true">
                        <use xlink:href="#iconweixinzhifu"></use>
                    </svg> -->
                    <text class="iconfont iconweixinzhifu icon-withdraw-type fl"></text>
                    <span class="fl">微信</span>
                </div>
            </div>
        </div>
        <!-- 提现方式 end -->

        <!-- 提现金额 begin -->
        <div class="cell withdraw-type">
            <p class="cell-label">提现金额</p>
            <div class="cell-content type-box clearfix">
                <div class="input-container">
                    <van-field type="digit" :value="amount" :placeholder='lowAmount' @change="amountChange"/>
                </div>
                <div class="withdraw-btn" @click="setMaxAmount">全部提现</div>
            </div>
            <p class="procedure" v-show="!!procedure">额外扣除￥{{ filter.Fix2(procedure) }}手续费<span v-if="!!taxPoint">(税点{{ filter.Fix2(taxPoint) }}%)</span></p>
        </div>
        <!-- 提现金额 end -->

        <!-- 提交按钮 begin -->
        <!--<button class="bottom-btn" @click="apply">提交申请</button>-->
        <div class="com-foot-btn-cont">
            <div class="com-foot-btn" @click="apply">提交申请</div>
        </div>
        <!-- 提交按钮 end -->

        <!-- 提现方式选择弹窗 begin -->
        <van-action-sheet
                :show="showTypeList"
                :actions="cashTypeList"
                @select="selectType"
        />
        <!-- 提现方式选择弹窗 end -->

        <van-dialog id="van-dialog" />
        <van-toast id="van-toast" />
    </div>
</template>
<script>
    import { Distribution } from '../../api/service'
    import accounting from 'accounting'
    import Toast from 'vant-weapp/dist/toast/toast';
    import Dialog from 'vant-weapp/dist/dialog/dialog';

    export default {
        config:{
            navigationBarTitleText: '提现'
        },
        components: {
        },
        data() {
            return {
                ruleInfo: {},  // 提现前置规则
                amount: null,  // 提现金额
                showTypeList: false, // 显示提现方式
                cashTypeList: [],  // 提现方式列表
                cashTypeId: '',  // 提现id
                btnLock: false,  // 按钮锁
            }
        },
        methods: {
            //  获取提现前置规则信息
            async getWithdrawInfo(){
                let data = {
                    id: await this.$store.dispatch('distribution/getDistributionId')
                }
                Distribution.getWithdrawRule(data).then((res) =>{
                    this.ruleInfo = res
                    if(!!res.cashTypes && !!res.cashTypes.length >0) {
                        res.cashTypes.forEach((item) => {
                            item.name = item.cashTypeName
                        })
                        this.cashTypeList = res.cashTypes
                    }
                    global.toastLoading(false);// 关闭
                })
            },

            //  设置最大金额
            setMaxAmount() {
                setTimeout(()=>{
                    // 可提现金额小等0或者可提现金额小于最小体现金额
                    if(this.maxAmount <= 0.00 || this.maxAmount < this.ruleInfo.lamount) {
                        this.amount = 0
                        Toast('可提现金额不足')
                        return
                    }
                    this.amount = this.ruleInfo.maxAmount
                    this.amount = parseInt(this.amount * 100)/100
                },200)
            },

            //  金额变化处理
            amountChange(e) {
                this.amount = e.mp.detail;
                if(!!this.amount) {
                    // this.amount = parseFloat(this.amount.match(/^\d*(\.?\d{0,2})/g)[0])
//                    this.amount = parseInt(this.amount * 100)/100
                    // 可提现金额小等0或者可提现金额小于最小体现金额
                    if(isNaN(Number(this.amount))){
                        this.amount = '';
                        return;
                    }
                    if(this.maxAmount <= 0.00 || this.maxAmount < this.ruleInfo.lamount) {
                        this.amount = 0
                        return
                    }
                    // 截取两位小数
                    let pointIndex = this.amount.indexOf('.');
                    if(pointIndex >= 0 && this.amount.length - (pointIndex+1) > 2){
                        this.amount = this.amount.substring(0,pointIndex+3);
                    }
                    if(this.amount < this.ruleInfo.lamount && this.amount != 0) this.amount = ''
                    if(this.amount > this.ruleInfo.maxAmount) this.amount = this.ruleInfo.maxAmount
                }
            },

            // 申请提现
            async apply() {
                if(!this.checkApply()) return
                if(!!this.btnLock) return
                this.btnLock = true
                let data = {
                    amount:  this.amount,
                    cashTypeId:  this.cashTypeId,
                    vipInfoMdtId: await this.$store.dispatch('distribution/getDistributionId')
                }
                Distribution.applyWithdraw(data).then(() =>{
                    Toast('提交成功，等待后台人员审核，审核通过会立马转账到您个人微信号~')
                    // 由于getWithdrawInfo中会异步关闭toast 所以延迟一秒执行
                    setTimeout(()=>{
                        this.getWithdrawInfo()
                        this.$router.push('/pages/distributionPackage/wallet')
                    },1000)
                },(err) =>{
                    Dialog.confirm({
                        title: '失败提示',
                        message: err.errorMsg,
                        confirmButtonText: '联系客服',
                        cancelButtonText: '再试一次'
                    }).then(() => {
                        // todo 联系客服
                        Toast('暂无客服~')
                    }).catch(() => {
                        this.btnLock = false
                        this.apply()
                    });
                }).then(() =>{
                    this.btnLock = false
                })
            },

            // 校验是否可以提现
            checkApply() {
                if(this.maxAmount <= 0.00) {
                    Toast('可提现金额不足~')
                    return
                }
                if(!this.cashTypeId) {
                    Toast('请先选择提现方式~')
                    return false
                }
                if(!this.amount) {
                    Toast('请先输入符合提现规则的金额~')
                    return false
                }
                if(this.amount > this.ruleInfo.maxAmount) {
                    Toast('提现金额超过最大限制~')
                    return false
                }
                if(this.amount < this.ruleInfo.lamount) {
                    Toast('当前提现金额不足最小提现金额~')
                    return false
                }
                return true
            },

            // 是否允许显示提现方式弹窗
            isShowTypeList(){
                if(!!this.cashTypeList.length && this.cashTypeList.length > 0) {
                    this.showTypeList = true
                }else{
                    Toast('当前暂无可用提现方式~')
                }
            },

            // 选择提现方式
            selectType(item) {
                console.log(item.target,"===")
                this.cashTypeId = item.target.cashTypeId
                this.showTypeList = false
            },

            // 两位小数四舍五入计算
            numFix(val){
                val = Number(val)
                let times = Math.pow(10, 2)
                let des = val * times + 0.5;
                des = parseInt(des, 10) / times;
                return des
            }
        },
        onLoad() {

        },
        onUnload(){
            // Object.assign(this.$data, this.$options.data());
        },
        onShow(){
            Object.assign(this.$data, this.$options.data());
            global.toastLoading();// 开启
            this.getWithdrawInfo()

        },
        onReady(){
        },
        computed: {
            lowAmount: function () {
                return !!this.ruleInfo.lamount ? `提现金额(最低提现金额${this.ruleInfo.lamount}元)` : `提现金额`
            },
            maxAmount: function () {
                // console.log(accounting.formatNumber(parseInt(this.ruleInfo.maxAmount * 100) /100, 2))
                return (!!this.ruleInfo.maxAmount && this.ruleInfo.maxAmount > 0) ? accounting.formatNumber(this.ruleInfo.maxAmount, 2) : 0.00
            },

            // 税点
            taxPoint: function () {
                let amount = null
                if(!!this.ruleInfo.totalTaxPoint && this.ruleInfo.totalTaxPoint>0) {
                    amount = this.ruleInfo.totalTaxPoint * 100
                }
                return amount
            },

            // 手续费
            procedure: function () {
                let num = 0
                if(!!this.amount && !!this.ruleInfo.totalTaxPoint && this.ruleInfo.totalTaxPoint > 0) {
                    num = this.numFix(this.amount * this.ruleInfo.totalTaxPoint)
                    if(num < 0.01) num = 0
                }
                return num
            }
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
    .withdraw-apply{
        box-sizing: border-box;
        min-height: 100%;
        position: relative;
        overflow: hidden;
        background: $color-background;
        padding-bottom: computed(140);
        .fund-box{
            box-sizing: border-box;
            height: computed(200);
            margin: computed(30);
            padding: 0 computed(42);
            background: $bggradientcolor;
            color: $color-white;
            overflow: hidden;
            position: relative;
            .amount{
                margin-top: computed(40);
                font-size: $font-h1;
                line-height: 1;
                font-weight: bold;
            }
            .history-btn{
                width: computed(180);
                height: computed(50);
                position: absolute;
                background: $color-white;
                font-size: $font-common;
                line-height: computed(50);
                color: $domaincolor;
                text-align: center;
                top: computed(70);
                right: computed(30);
                border-radius: $btn-radius25;
            }
            p{
                &:first-of-type {
                    margin-top: computed(22);
                    font-size: $font-regular;
                    line-height: 1;
                }
                &:last-of-type {
                    margin-top: computed(16);
                    font-size: $font-common;
                    line-height: 1;
                }
            }

        }
        .tip{
            margin: 0 computed(30);
            font-size: $font-small;
            line-height: computed(40);
            color: $domaincolor;
            .icon-tip{
                width: computed(32);
                height: computed(32);
                margin-right: computed(12);
            }
        }
        .cell{
            margin-top: computed(20);
            .cell-label{
                padding: 0 computed(30);
                font-size: $font-regular;
                line-height: 2;
                color: $text-secondary;
            }
            .cell-content{
                box-sizing: border-box;
                height: computed(96);
                display: flex;
                align-items: center;
                border-top: solid 1px $text-placeholder;
                border-bottom: solid 1px $text-placeholder;
                padding: 0 computed(30);
                background: $color-white;
                position: relative;
                &.type-box{
                    .icon-withdraw-type{
                        width: computed(32);
                        height: computed(32);
                        margin-right: computed(12);
                        overflow: hidden;
                        color: #40BA49;
                    }
                    span{
                        font-size: $font-h2;
                        line-height: $font-h2;
                        color: $color-black;
                    }
                    .input-container{
                        flex: 1;
                        line-height: 1;
                    }
                }
                .van-cell{
                    margin-top: computed(10);
                    padding: 0;
                    font-size: $font-h2;
                    line-height: $font-h2;
                    &::placeholder {
                        color: $text-placeholder;
                    }
                }
                .withdraw-btn{
                    width: computed(132);
                    height: computed(50);
                    background: $bggradientcolor;
                    font-size: $font-common;
                    line-height: computed(50);
                    color: $color-white;
                    text-align: center;
                    -webkit-border-radius: computed(5);
                    -moz-border-radius: computed(5);
                    border-radius: $btn-radius25;
                }
                .default-tip{
                    font-size: $font-h2;
                    line-height: 1;
                    color: $text-secondary;
                }
            }
            .procedure{
                margin-top: computed(10);
                padding-left: computed(30);
                font-size: $font-small;
                line-height: computed(24);
                color: $text-secondary;
            }
        }
        .com-foot-btn-cont{
            position: absolute;
        }
    }
</style>
