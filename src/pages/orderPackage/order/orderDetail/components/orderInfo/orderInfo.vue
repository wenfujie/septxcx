<style lang='scss' scoped>
.info-wrap {
  width: 100%;
  font-size: computed(24);
  box-sizing: border-box;
  .title {
    font-size: computed(32);
    font-family: "PingFang-SC-Bold";
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    padding-bottom: computed(30);
    border-bottom: dashed 1px #b3b3b3;
  }
  .row-content {
    position: relative;
    display: flex;
    margin: computed(20) 0;
    .left {
      width: 20%;
      color: #999999;
    }
    .right {
      flex: 1;
      color: #333333;
      &.goInvoice{
        color: #999999;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0,-50%);
        padding: computed(16) 0;
      }
    }
    .ord-status {
      color: $domaincolor;
    }
  }
  .actual-pay {
    font-size: computed(28);
    font-family: "PingFang-SC-Bold";
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    padding: computed(30) 0;
    border-top: dashed 1px #b3b3b3;
  }
}
</style>

<template>
  <div class="info-wrap">
    <wxs module="filter" src="../../../../../../filter/filterCommon.wxs"></wxs>
    <p class="title">订单信息</p>
    <div class="row-content">
      <div class="left">订单编号&nbsp;:</div>
      <div class="right">{{ order.billCode }}</div>
    </div>
    <div class="row-content">
      <div class="left">下单时间&nbsp;:</div>
      <div class="right">{{ order.ordTime }}</div>
    </div>
    <div class="row-content">
      <div class="left">订单状态&nbsp;:</div>
      <div class="right ord-status">{{ order.ordStatusNames }}</div>
    </div>
    <div class="row-content">
      <div class="left">优惠&nbsp;:</div>
        <!--裂变优惠用amountPm-->
      <div class="right">-¥&nbsp;{{ fissionType ? order.amountPm : order.totalSumAmount }}</div>
    </div>
    <div class="row-content" v-if="order.amountPoint!=0">
      <div class="left">使用积分&nbsp;:</div>
      <div class="right">-¥&nbsp;{{ order.amountPoint }}</div>
    </div>
    <div v-if="!fissionType" class="row-content">
      <div class="left">储值卡&nbsp;:</div>
      <div class="right">-¥&nbsp;{{ order.discAmount }}</div>
    </div>
    <div class="row-content">
      <div class="left">运费&nbsp;:</div>
      <div class="right" v-if="order.amountTrans != 0">¥&nbsp;{{ order.amountTrans }}</div>
      <div class="right" v-if="order.amountTrans == 0">包邮</div>
    </div>
    <div class="row-content">
      <div class="left">商品合计&nbsp;:</div>
      <div class="right">
        ¥&nbsp;
        {{filter.goldDivide(filter.Fix2(order.amountPart))}}
      </div>
    </div>
    <!-- 先隐藏发票入口 -->
    <div class="row-content" v-if="!!ticketBtnName">
      <div class="left">{{ticketBtnName=='查看发票'?order.invoiceDetail.typeName:'发票'}}&nbsp;:</div>
      <div class="right goInvoice" @click="openTicket(ticketBtnName)">
        {{ticketBtnName=='查看发票'?(order.invoiceDetail.invoiceCode?'公司':'个人'):'不开发票'}}
        <text class="iconfont iconxuanze" style="font-size:14px;"></text>
      </div>
    </div>
    <div class="actual-pay">
      实付：¥
      {{filter.goldDivide(filter.Fix2(order.amountNeedPay))}}
    </div>
  </div>
</template>

<script>
import check from "@/utils/check";
import { mapState } from "vuex";
import Dialog from 'vant-weapp/dist/dialog/dialog';
export default {
  props: {
    order: Object,
    fissionType: {
        type: String,
        default: ''
    }
  },
  data() {
    return {};
  },
  methods: {
    //查看发票
    toViewInvoice() {
      this.$router.push({
        path: "/pages/orderPackage/invoice/invoiceDetail",
        query: {
          billCode: this.order.billCode,
          isAllowOpenTicket: this.order.ordStatusCodes == "D_ORDCANCEL" ? 0 : 1,
          isAllowOpenTicketStatus: this.order.isAllowOpenTicket
        }
      });
    },
    // 开发票
    toOpenTicket() {
      const toOpenTicket = this.judgeAfterSaleOrdStatus();
      if (!toOpenTicket) return;
      this.$router.push({
        path: "/pages/orderPackage/invoice/invoiceApply",
        query: {
          billCode: this.order.billCode
        }
      });
    },
    // 跳转开发票/查看发票详情
    openTicket(name) {
      switch (name) {
        case "查看发票":
          this.toViewInvoice();
          break;
        case "开发票":
          this.toOpenTicket();
          break;
      }
    },
    //判断订单关联的售后单数量以及状态
    judgeAfterSaleOrdStatus() {
      let toOpenTicket = false;
      // 未确认的售后申请单数量
      const unconfirm_num = this.order.afterSalesInfo.unconfirmNum;
      // 处理中的售后申请单数量
      const handling_num = this.order.afterSalesInfo.handlingNum;
      // 订单关联的售后申请单数量
      const totalNum = this.order.afterSalesInfo.totalNum;
      //售后单号
      const applyCode = this.order.afterSalesInfo.applyCode;

      if (handling_num > 0) {
        Dialog.confirm({
          message: "有进行中的售后申请,暂时无法开票,请等待售后完成!",
          confirmButtonText: "前去查看",
          cancelButtonText: "关闭"
        }).then(() => {
          if (totalNum === 1) {
            this.$router.push({
              path: "/pages/afterSalePackage/afterSale/pages/detail/page",
              query: {
                reapplycode: applyCode
              }
            });
          } else {
            this.$router.push({
              path: "/pages/afterSalePackage/afterSale/pages/list/page",
            });
          }
          // on confirm
        }).catch(() => {
          // on cancel
        });
      } else if (unconfirm_num > 0) {
        Dialog.confirm({
          message: "该订单有未被处理的售后单,暂时无法开票,要去取消售后单吗?",
          confirmButtonText: "去取消",
          cancelButtonText: "不了"
        }).then(() => {
          if (totalNum === 1) {
            this.$router.push({
              path: "/pages/afterSalePackage/afterSale/pages/detail/page",
              query: {
                reapplycode: applyCode
              }
            });
          } else {
            this.$router.push({
              path: "/pages/afterSalePackage/afterSale/pages/list/page"
            });
          }
        }).catch(() => {
          // on cancel
        });
      } else {
        // 没有未处理或者处理中的售后单,允许去开票
        toOpenTicket = true;
      }
      return toOpenTicket;
    }
  },
  created() {},
  onHide() {
    // 解决重复进页面数据未初始化
    Object.assign(this.$data, this.$options.data());
  },
  computed: {
    ...mapState("order", ["ordStatuNameMap"]),
    //发票信息
    invoiceInfo: function() {
      if (check.isEmpty(this.order.invoiceDetail)) {
        return "无";
      } else {
        return (this.order.invoiceDetail.typeName +"(" +this.order.invoiceDetail.title +")");
      }
    },
    //判断是否允许开发票
    ticketBtnName: function() {
      console.log(this.order.invoiceDetail, "this.order.invoiceDetail");
      if (!check.isEmpty(this.order.invoiceDetail)) return "查看发票";
      let amount = this.order.actualAmount - this.order.amountTrans;
      if (this.order.isAllowOpenTicket == 1 && amount > 0) {
        return "开发票";
      } else {
        return null;
      }
    },
  }
};
</script>
