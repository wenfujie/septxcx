<!--
 * @Author: zeping.jiang
 * @Date: 2019-09-18
 * @Description: 
 -->
<template>
    <div class="invoice_apply">
        <div class="section">
            <div class="view">
                <div class="title">是否开票</div>
                <div class="content">
                    <van-radio-group :value="isApplyInvoice" class="content_radio_group" @change="change" data-index='isApplyInvoice'>
                        <van-radio :name="1" class="content_radio" custom-class="'van-radio-reset'">是</van-radio>
                        <van-radio :name="0" class="content_radio" custom-class="'van-radio-reset'">否</van-radio>
                    </van-radio-group>
                </div>
            </div>
        </div>

        <div class="section" v-if="isApplyInvoice=='1'">
            <div class="view">
                <div class="title">发票类型</div>
                <div class="content">
                    <van-radio-group :value="invoiceType" class="content_radio_group" @change="change" data-index='invoiceType'>
                        <van-radio v-for="(item,index) in invoiceList" :key="index" :name="item.dictCode" class="content_radio" custom-class="'van-radio-reset'">{{item.dictName}}</van-radio>
                    </van-radio-group>
                </div>
            </div>
            <div class="view">
                <div class="title">发票抬头</div>
                <div class="content">
                    <van-radio-group :value="invoiceTitle" class="content_radio_group" @change="change" data-index='invoiceTitle'>
                        <van-radio v-for="(item,index) in invoiceTitleList" :key="index" :name="item.dictCode" class="content_radio" custom-class="'van-radio-reset'">{{item.dictName}}</van-radio>
                    </van-radio-group>
                </div>
            </div>
        </div>

        <div class="section" v-if="isApplyInvoice=='1'&&invoiceTitle === 'D_INVTITLETYPE2'">
            <div class="view">
                <div class="title">抬头名称<span class="star">*</span></div>
                <div class="content">
                    <input class="content_input" :value="companyName" type="text" placeholder="请输入公司名称" @input="inputChange" data-index='companyName' 
                        placeholder-class="content_input_placeholder">
                    <!-- <van-field class="content_input" :value="companyName" placeholder="请输入公司名称" :border="false" @change="change" data-index='companyName'/> -->
                </div>
            </div>
            <div class="view">
                <div class="title">纳税识别号<span class="star">*</span></div>
                <div class="content">
                    <input class="content_input" :value="taxpayerNum" type="text" placeholder="请输入纳税识别号" @input="inputChange" data-index='taxpayerNum'
                        placeholder-class="content_input_placeholder">
                    <!-- <van-field class="content_input" :value="taxpayerNum" placeholder="请输入纳税识别号" :border="false" @change="change" data-index='taxpayerNum'/> -->
                </div>
            </div>
        </div>

        <div class="section" v-if="isApplyInvoice=='1'&&invoiceType === 'D_INVOICE_COMMON'">
            <div class="view">
                <div class="title">收票地址</div>
                <div class="content content_addr" @click="toGetAddr">
                    <div class="addr">
                        <div class="none" v-if="!addrVal">请填写收货地址</div>
                        <div class="addr_top" v-if="!!addrVal">
                            <span class="addr_top_icon">默认</span>
                            <span>{{addrVal.cargousrName}}</span>
                            <span>{{addrVal.cargoPhone}}</span>
                        </div>
                        <div class="addr_text" v-if="!!addrVal">{{addrVal.destDesc}} {{addrVal.address}}</div>
                    </div>
                    <div class="content_addr_icon iconfont iconxuanze"></div>
                </div>
            </div>
        </div>

        <div class="submit" @click="putInvoice">提交</div>
        <van-toast id="van-toast" />

    </div>
</template>
<script>
import {Invoice,UserService} from "@/api/service";
import Toast from 'vant-weapp/dist/toast/toast';
export default {
    config: {
        navigationBarTitleText: "开具发票",
    },
    data(){
        return{
            radio:'1',
            fromPage: "",
            storageData: {},
            invoiceList: [], // 发票类型列表
            invoiceTitleList: [], //发票抬头列表
            invoiceType: "", // 发票类型
            invoiceTitle: "", //发票抬头
            companyName: "",
            taxpayerNum: "",
            addressList: [],
            addrVal: "",
            btnLock: false,
            isKeyBoardHide: true,
            isApplyInvoice:'0', //是否开发票
            passLoad:true, //经过onload
        }
    },
    onLoad(){
        this.getInvoiceType();
        this.getInvoiceTitleType();
        this.fromPage = this.$route.query.fromPage || "";
        this.getInvoiceStorage();
        
    },
    onShow(){
        //判断是否经过onload
        if(this.passLoad){
            this.passLoad=false;
            return
        }
        //从收货地址列表返回时赋值
        let addr=global.Storage.get("settlementAddr");
        if(!!addr){
            this.addrVal=addr;
            global.Storage.remove("settlementAddr");
        }
    },
    onUnload() {
        Object.assign(this.$data, this.$options.data());
    },
    watch: {
        //  纳税识别号数字和英文的正则过滤
        // taxpayerNum: function () {
        //     this.taxpayerNum = this.taxpayerNum.replace(/[\W]/g, "");
        //     if (this.taxpayerNum.length > 20)
        //         this.taxpayerNum = this.taxpayerNum.slice(0, 20);
        // }
    },
    methods:{
        //  获取收货地址列表
        getAddrList() {
            let data = {
                vipUsrId: global.Storage.get("USER_INFO").usrId,
                pageNum: 1
            };
            UserService.getAddrList(data).then(res => {
                this.addressList = res.list;
                if(!!this.addressList&&this.addressList.length>0){
                    this.addrVal=this.addressList[0];
                }
            },err => {});
        },
        //  获取缓存
        getInvoiceStorage() {
            this.storageData = global.Storage.get("invoiceData") || {};
            if (this.storageData.type) {
                this.invoiceType = this.storageData.data.invoiceTypeCode||'';
                this.invoiceTitle = this.storageData.data.invoiceTitle||'';
                this.addrVal = this.storageData.invoiceAddr || "";
                this.companyName = this.storageData.data.invoiceCompany || "";
                this.taxpayerNum = this.storageData.data.invoiceTaxAlias || "";
            }
            if(this.storageData.isApplyInvoice!=undefined){
                this.isApplyInvoice=this.storageData.isApplyInvoice;
            }else{
                this.isApplyInvoice='';
            }
            //若是填写，而不是修改时触发
            if(!this.addrVal){
                this.getAddrList();
            }
            
        },
        //单选
        change(e){
            console.log('radioChange',e)
            let index=e.currentTarget.dataset.index;
            let value=e.mp.detail;
            this[index]=value
        },
        //输入框改变
        inputChange(e){
            let index=e.currentTarget.dataset.index;
            var value=e.mp.detail.value.trim()
            //公司名需要去掉空格
            if(index=='companyName'){
                value=value.replace(/\s/g,'')
            }
            this[index]=value
        },
        
        //  获取发票类型
        getInvoiceType() {
            let data = {
                type: "D_INVOICETYPE"
            };
            Invoice.getInvoiceType(data).then(res => {
                this.invoiceList = res;
            });
        },

        //  获取发票抬头
        getInvoiceTitleType() {
            let data = {
                type: "D_INVTITLETYPE"
            };
            Invoice.getInvoiceType(data).then(res => {
                this.invoiceTitleList = res;
            });
        },

        //跳转到收货地址列表，选择地址
        toGetAddr(){
            //跳到收货地址的参数和订单结算页的一样就行
            this.$router.push(
                "/pages/UserPackage/address/address-list?showList=2&fromPage=settlement"
            );
        },

        //  提交发票申请
        putInvoice() {
            if (!!this.btnLock) return;
            this.btnLock = true;
            //不开发票时
            if(this.isApplyInvoice=='0'){
                // global.Storage.remove("invoiceData");
                global.Storage.set("invoiceData", {'isApplyInvoice':'0'});
                this.btnLock = false;
                this.$router.go(-1)
                return
            }
            
            if (!this.invoiceType) {
                Toast("请先选择发票类型");
                this.btnLock = false;
                return;
            }
            if (!this.invoiceTitle) {
                Toast("请先选择发票抬头");
                this.btnLock = false;
                return;
            }
            let data = {
                ctmUsrId: global.Storage.get("USER_INFO").usrId,
                cookieId: global.Storage.get("USER_INFO").usrId,
                invoiceTypeCode: this.invoiceType,
                invoiceTitle: this.invoiceTitle
            };
            //  判断发票类型
            if (this.invoiceType === "D_INVOICE_ELC") {
                //  类型为电子发票
                if (this.invoiceTitle === "D_INVTITLETYPE1") {
                    //  个人电子发票参数不变
                } else if (this.invoiceTitle === "D_INVTITLETYPE2") {
                    //  公司电子发票必填公司名称、纳税识别号
                    if (!this.companyName) {
                        this.btnLock = false;
                        Toast("请先填写公司名称");
                        return;
                    }else if (!!this.companyName&&this.companyName.length>20) {
                        this.btnLock = false;
                        Toast("公司名称过长");
                        return;
                    } else if(!this.taxpayerNum){
                        this.btnLock = false;
                        Toast("请先填写纳税识别号");
                        return;
                    } else if(!this.verifyTaxpayerNum(this.taxpayerNum)){
                        this.btnLock = false;
                        Toast("请填写正确的纳税识别号");
                        return;
                    } else {
                        //  提交参数修改
                        data.invoiceCompany = this.companyName;
                        data.invoiceTaxAlias = this.taxpayerNum;
                    }
                }
            } else if (this.invoiceType === "D_INVOICE_COMMON") {
                //  类型为纸质发票
                if (this.invoiceTitle === "D_INVTITLETYPE1") {
                    //  个人纸质发票必填收货地址
                    if (!this.addrVal) {
                        Toast("请先填写收货地址");
                        this.btnLock = false;
                        return;
                    } else {
                        data.invoiceAddrId=this.addrVal.id
                    }
                } else if (this.invoiceTitle === "D_INVTITLETYPE2") {
                    //  公司电子发票必填公司名称、纳税识别号、收货地址
                    if (!this.companyName) {
                        this.btnLock = false;
                        Toast("请先填写公司名称");
                        return;
                    }else if (!!this.companyName&&this.companyName.length>20) {
                        this.btnLock = false;
                        Toast("公司名称过长");
                        return;
                    } else if(!this.taxpayerNum){
                        this.btnLock = false;
                        Toast("请先填写纳税识别号");
                        return;
                    } else if(!this.verifyTaxpayerNum(this.taxpayerNum)){
                        this.btnLock = false;
                        Toast("请填写正确的纳税识别号");
                        return;
                    } else if (!this.addrVal) {
                        Toast("请先填写收货地址");
                        this.btnLock = false;
                        return;
                    } else {
                        //  选中的地址区code作为提交参数
                        data.invoiceAddrId=this.addrVal.id
                        //  提交参数修改
                        data.invoiceCompany = this.companyName;
                        data.invoiceTaxAlias = this.taxpayerNum;
                    }
                }
            }
            console.log("putData", data);

            //  判断来源页面
            if (this.fromPage === "settlement") {
                //  储存信息并返回订单结算页面
                let invoiceData = {};
                this.invoiceList.forEach(item => {
                    if (item.dictCode === this.invoiceType) {
                        invoiceData.type = item.dictName;
                    }
                });
                this.invoiceTitleList.forEach(item => {
                    if (item.dictCode === this.invoiceTitle) {
                        invoiceData.title = item.dictName;
                    }
                });
                if(!this.addrVal){
                    invoiceData.invoiceAddrId=this.addrVal
                }
                invoiceData.data = data;
                invoiceData.isApplyInvoice='1';
                this.btnLock = false;
                console.log(invoiceData);
                global.Storage.set("invoiceData", invoiceData);
                this.$router.go(-1)
            } else {
                let billCode = this.$route.query.billCode;
                let params = Object.assign(data, {
                    billCode: billCode
                });

                Invoice.putInvoice(params).then(
                    invoice => {
                        console.log("invoice", invoice);
                        Toast("发票提交成功");
                        setTimeout(() => {
                            this.btnLock = false;
                            global.Storage.remove("invoiceData");
                            this.$router.go(-1);
                        }, 1000);
                    },
                    err => {
                        Toast("发票提交失败");
                        this.btnLock = false;
                    }
                );
            }
        },
        //验证纳税识别号
        verifyTaxpayerNum(str){
            let exp=/[^a-zA-Z0-9]/;
            if(!str||str.length<15||str.length>20||exp.test(str)){
                return false
            }else{
                return true
            }
        },
    }
}
</script>
<style lang='scss' scoped>
.invoice_apply{
    width: 100%;
    min-height: 100%;
    background: #F5F5F5;
    color: $color-black-33;
    font-size: $font-num;
    .section{
        width: calc(100% - 60rpx);
        padding: 0 computed(30);
        background: white;
        margin-bottom: computed(20);
        .view{
            width: 100%;
            min-height: computed(40);
            border-bottom: 1rpx solid #F5F5F5;
            padding: computed(22) 0;
            display: flex;
            align-items: center;
            .title{
                flex-shrink: 0;
                width: computed(176);
                color: $text-secondary;
                .star{
                    color: $color-red;
                    margin-left: computed(13)
                }
            }
            .content{
                width: 100%;
                .content_radio_group{
                    width: 100%;
                    display: flex;
                    .content_radio{
                        width: 100%;
                    }
                }
            }
            .content_addr{
                display: flex;
                width: 100%;
                align-items: center;
                min-height: computed(100);
                font-size: $font-common;
                .addr{
                    width: 100%;
                    .addr_top{
                        margin-bottom: computed(18);
                        display: flex;
                        align-items: center;
                        .addr_top_icon{
                            display: inline-block;
                            color: $domaincolor;
                            border: 1rpx solid $domaincolor;
                            padding: 0 computed(10);
                            line-height: computed(30);
                            border-radius: computed(15);
                            font-size: $font-small;
                        }
                        span{
                            margin-right: computed(13);
                        }
                    }
                    .addr_text{
                        color: $text-regular;
                        text-align: justify;
                    }
                }
                .content_addr_icon{
                    flex-shrink: 0;
                    width: computed(30);
                    color: $text-gray-white;
                    text-align: right;
                }
            }
        }   
    }
    .submit{
        width: computed(690);
        height: computed(80);
        line-height: computed(80);
        text-align: center;
        position: fixed;
        bottom: computed(16);
        left: 50%;
        transform: translate(-50%,0);
        background: linear-gradient(to right,#FF3636,#FF632A);
        color: white;
        font-size: $font-regular;
        border-radius: computed(40);
    }
}
</style>
<style lang='scss'>
// 写在这里是因为这些样式不能在scoped上实现
.invoice_apply{
    .content_radio{
        .van-radio{
            .van-icon{
                width: 27px;
                position: relative;
                left: -4px;
            }
            .van-radio__input{
                // font-size: $font-num;
            }
            .van-radio__label{
                margin-left: computed(10);
                font-size: $font-num;
            }
        }
    }
    .content_input{
        .van-cell{
            padding:0;
        }
    }
    .content_input_placeholder{
        color: $text-placeholder;
    }
}

</style>
