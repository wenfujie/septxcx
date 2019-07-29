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
    display: flex;
    margin: computed(20) 0;
    .left {
      width: 20%;
      color: #999999;
    }
    .right {
      flex: 1;
      color: #333333;
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
      <div class="right">-¥&nbsp;{{ order.totalSumAmount }}</div>
    </div>
    <div class="row-content">
      <div class="left">积分抵现&nbsp;:</div>
      <div class="right">-¥&nbsp;{{ order.amountPoint }}</div>
    </div>
    <div class="row-content">
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
    <div class="actual-pay">
      实付：¥
      {{filter.goldDivide(filter.Fix2(actualPay))}}
    </div>
  </div>
</template>

<script>
import check from "@/utils/check";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  props: {
    order: Object
  },
  data() {
    return {};
  },
  methods: {},
  created() {},
  computed: {
    ...mapState("order", ["ordStatuNameMap"]),
    //发票信息
    invoiceInfo: function() {
      if (check.isEmpty(this.order.invoiceDetail)) {
        return "无";
      } else {
        return (
          this.order.invoiceDetail.typeName +
          "(" +
          this.order.invoiceDetail.title +
          ")"
        );
      }
    },
    //实付款
    actualPay: function() {
      let money =
        this.order.actualAmount -
        this.order.amountPoint -
        this.order.balancePayAmount;
      if (money <= 0) {
        money = 0;
      }
      return money;
    }
  }
};
</script>