<!--
 * @Author: zeping.jiang
 * @Date: 2019-09-18
 * @Description: 
 -->
<template>
    <div class="invoice_detail">
        <div class="section">
            <div class="view">
                <div class="title">发票状态</div>
                <div class="content invoice_detail_red">{{invoiceInfo.invStateName}}</div>
            </div>
        </div>

        <div class="section">
            <div class="view">
                <div class="title">发票类型</div>
                <div class="content">{{invoiceInfo.invTypeName}}</div>
            </div>
            <div class="view">
                <div class="title">发票抬头</div>
                <div class="content">{{invoiceInfo.invoiceTitle}}</div>
            </div>
            <div class="view" v-if="invoiceInfo.titleType === 'D_INVTITLETYPE2' ">
                <div class="title">纳税识别码</div>
                <div class="content">{{invoiceInfo.invoiceCode}}</div>
            </div>
            <div class="view addrWrap" v-if="invoiceInfo.invType === 'D_INVOICE_COMMON'">
                <div class="title">收票地址</div>
                <div class="content_addr">
                    <div class="content_addr_view" style="margin-bottom:19rpx">
                        <span>{{invoiceInfo.receiver}}</span>
                        <span>{{invoiceInfo.cargoName}}</span>
                    </div>
                    <div class="content_addr_view scontent_addr_color666">{{invoiceInfo.receiverCombo}}</div>
                </div>
            </div>
            <!-- 先隐藏 -->
            <!-- <div class="view" v-if="showDownImg && !!invoiceInfo.nnJpgUrl">
                <div class="title">下载方式1</div>
                <div class="content"><div class="download_way" @click="downLoadInvoice">下载电子发票</div></div>
            </div> -->
            <div class="view download_view" v-if="showDownImg && !!invoiceInfo.nnJpgUrl">
                <div class="download_view_info">
                    <div class="title">下载方式</div>
                    <div class="content"><div class="download_way" @click="copyInvoice">复制连接</div></div>
                </div>
                <div class="download_hint">在浏览器中打开下载</div>
            </div>
        </div>

        <div class="section" v-if="invoiceInfo.invType === 'D_INVOICE_COMMON' && invoiceInfo.isSendWithOrd !== 1">
            <div class="view addrWrap">
                <div class="title">物流信息</div>
                <div class="content_addr">
                    <div class="content_addr_view" style="margin-bottom:19rpx">
                        <span>物流公司：</span>
                        <span>{{invoiceInfo.shipCompanyName}}</span>
                    </div>
                    <div class="content_addr_view">
                        <span>物流单号：</span>
                        <span>{{invoiceInfo.invShipCode}}</span>
                    </div>
                </div>
            </div>
            <div class="view" @click="isShowLogis()" v-if="invoiceInfo.isSendWithOrd !== 1&&!!traceList[0]">
                <div class="content logis_content">[{{logis.state}}]{{traceList[0].desc}}</div>
                <div :class="['view_icon','iconfont',{'iconicondown-copy':showLogis},{'iconiconup-copy':!showLogis}]"></div>
            </div>
            <div class="logis" v-if="invoiceInfo.isSendWithOrd !== 1&&showLogis">
                <van-steps direction="vertical" :steps="traceList" :active="0" active-color="#000"/>
            </div>
            
        </div>


        <div class="section_hint" v-if="invoiceInfo.isSendWithOrd === 1&&invoiceInfo.invType === 'D_INVOICE_COMMON'&&invoiceInfo.invStateCode === 'D_INV_TRICKT'">
            温馨提示：发票已与订单商品一同寄出
        </div>

        <div v-if="staticBtn" class="submit" @click="clickStaticBtn">{{staticBtn}}</div>
        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />

    </div>
</template>
<script>
import ThirdParty from "@/api/service/thirdParty";
import {Invoice} from "@/api/service";
import Toast from 'vant-weapp/dist/toast/toast';
import Dialog from 'vant-weapp/dist/dialog/dialog';
export default {
    config: {
        navigationBarTitleText: "发票详情",
    },
    data(){
        return{
            billCode: "", //订单号
            invoiceInfo: {}, //发票详情,
            logis: {},
            showContent: false,
            showDownImg: false,
            staticBtn: "",
            isAllowOpenTicketStatus: '',
            
            traceList :{},
            sliceList:[],
            // steps:[],
            showLogis:false,
        }
    },
    onLoad(){
        //   BLWX001201909182123254277722 无信息  BLWX001201909191002494619563 与快递一起寄出 BLWX001201909191050491696002
        this.billCode = this.$route.query.billCode || "";
        this.isAllowOpenTicketStatus = this.$route.query.isAllowOpenTicketStatus || ''
    },
    onShow(){
        this.getDetail();
    },
    onUnload(){
        Object.assign(this.$data, this.$options.data());
    },
    methods:{
        isShowLogis(){
            this.showLogis=!this.showLogis
        },
         initState() {
            switch (this.invoiceInfo.invStateName) {
                case "未审核":
                    this.staticBtn = "取消";
                    break;
                case "已同意":
                    if (this.invoiceInfo.invTypeName === "普通发票") {
                        this.showDownImg = false;
                    }
                    this.showContent = true;
                    break;
                case "已拒绝":
                    break;
                case "已开票":
                    this.showContent = true;
                    console.log("已开票");

                    // 电子发票，显示下载按钮
                    if (
                        this.invoiceInfo.invTypeName === "电子发票" &&
                        this.invoiceInfo.invStateName === "已开票"
                    ) {
                        this.showDownImg = true;
                    }

                    break;
                case "已取消":
                    this.staticBtn = this.$route.query.isAllowOpenTicket==1
                        ? "重新申请"
                        : null;

                    break;
            }
        },
        // 获取物流
        async getLogisInfo() {
            let params = {
                expressCode: this.invoiceInfo.shipCompanyCode,
                logisticCode: this.invoiceInfo.invShipCode
            };
            ThirdParty.getLogis(params).then(res => {
                let logis =res;
                this.logis=logis;
                console.log(logis,'logis')
                // this.traceList = logis.traceList;
                // this.sliceList = this.traceList.slice(0, 2);

                this.traceList = logis.traceList;
                this.traceList.forEach(item => {
                    item.text = item.acceptTime;
                    item.desc = item.acceptStation;
                });
                // this.steps = [];
                // this.steps = this.traceList.slice(0, -1);
            },()=>{})
            // let logis = await this.$post("third-party/getLogis", params);
        },
        //  获取发票详情
        getDetail() {
            let data = {
                cookieId: global.Storage.get("USER_INFO").cookieId,
                ctmUsrId: global.Storage.get("USER_INFO").usrId,
                billCode: this.billCode || this.$route.query.billCode
            };
            Invoice.getDetail(data).then(res => {
                this.invoiceInfo = res;
                if (this.invoiceInfo.invType === "D_INVOICE_COMMON" &&this.invoiceInfo.isSendWithOrd === 0) {
                    this.getLogisInfo()
                }
                this.initState();
                console.log("vodetail", res);
            });
        },
        /**
         * 取消发票
         */
        clickStaticBtn() {
            let flag = this.staticBtn;
            if (flag === "取消") {
                Dialog.confirm({
                    title: "取消发票",
                    message: "您确定要取消发票吗？"
                }).then(() => {
                    let data = {
                        billCode:
                            this.billCode || this.$route.query.billCode
                    };
                    Invoice.cancelInvoice(data).then(res => {
                        this.staticBtn = "重新申请";
                        this.invoiceInfo.invStateName = "已取消";
                    });
                },() => {
                    Toast("您取消了操作~");
                });
            } else if (flag === "重新申请") {
            	if(!!this.$route.query.isAllowOpenTicketStatus&&this.$route.query.isAllowOpenTicketStatus!='0') {
					this.$router.push({
						path: "/pages/orderPackage/invoice/invoiceApply",
						query: {
							billCode: this.billCode
						}
					});
                }else{
            		Toast('暂时无法申请发票~')
                    return
                }
            }
        },

        //  下载发票
        downLoadInvoice() {
            let root=this;
            wx.downloadFile({
                url:root.invoiceInfo.nnPdfUrl,
                success: function(res) {
                    if (res.statusCode === 200) {
                        let img = res.tempFilePath;
                        wx.saveImageToPhotosAlbum({
                            filePath: img,
                            success(res) {
                                Toast('下载成功')
                            },
                        })
                    }
                }
            })
        },
        //复制发票连接
        copyInvoice(){
            let root=this;
            wx.setClipboardData({
                data: root.invoiceInfo.nnJpgUrl,
                success (res) {
                    // Toast('复制成功')
                }
            })
        },
    }
}
</script>
<style lang='scss' scoped>
.invoice_detail{
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
            &.addrWrap{
                align-items: flex-start;
            }
            &.download_view{
                display: block;
                .download_view_info{
                    display: flex;
                    align-items: center;
                }
            }
            .invoice_detail_red{
                color:$color-red;
            }
            .title{
                flex-shrink: 0;
                width: computed(176);
                color: $text-secondary;
                .star{
                    color: $color-red;
                    margin-left: computed(13)
                }
            }
            .view_icon{
                width: computed(80);
                text-align: right;
                color: $text-placeholder;
            }
            .content{
                width: 100%;
                .download_way{
                    color: $color-red;
                    border: 1rpx solid $color-red;
                    height: computed(40);
                    width: computed(160);
                    line-height: computed(40); 
                    text-align: center;
                    font-size: $font-small;
                    border-radius: computed(20);
                }
            }
            .content_addr{
                width: 100%;
                .scontent_addr_color666{
                    font-size: $text-regular;
                }
                .content_addr_view{
                    word-break: break-all;
                    span{
                        margin-right: computed(13);
                    }
                }
            }
            .logis_content{
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .download_hint{
                font-size: $font-small;
                color: $text-placeholder;
                margin-top: computed(17);
            }
        }   
    }
    .section_hint{
        width: calc(100% - 60rpx);
        padding: 0 computed(30);
        color: $color-red;
        font-size: $font-common;
    }
    .submit{
        width: computed(690);
        height: computed(80);
        line-height: computed(80);
        text-align: center;
        position: fixed;
        bottom: computed(16);
        z-index: 100;
        left: 50%;
        transform: translate(-50%,0);
        background: linear-gradient(to right,#FF3636,#FF632A);
        color: white;
        font-size: $font-regular;
        border-radius: computed(40);
    }
}
</style>
