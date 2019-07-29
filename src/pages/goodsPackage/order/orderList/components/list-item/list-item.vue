/*
 * @Author: yongtian.hong
 * @Date: 2018-11-06 16:51:17
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-13 19:27:09
 * @Description: 订单列表item组件
 */

<style lang='scss' scoped>
.wrap {
  padding: 0 computed(30);
  border-radius: 5px;
  box-shadow: 6px 6px 16px 0px rgba(0, 0, 0, 0.1);

  .img-responsive {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }
  .dateTime {
    .date {
      color: #333333;
      font-weight: bold;
      font-size: computed(30);
    }
    .time {
      color: #999999;
      font-size: computed(24);
    }
  }
  .imgBox {
    width: computed(140);
    height: computed(140);
  }
  .order-state {
    font-size: computed(30);
    color: $domaincolor;
  }
  .border-dash {
    border-bottom: #b3b3b3 1px dashed;
  }
  .good {
    display: flex;
    padding: computed(30) 0px;
    .good-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      padding-left: computed(20);
      .cloth-name-price {
        display: flex;
        justify-content: space-between;
        font-size: computed(28);
        .name {
          max-width: 75%;
        }
      }
      .size-color-number {
        color: #999999;
        font-size: computed(24);
        .color {
          margin-left: computed(10);
        }
      }
    }
  }
  .color-grey {
    color: #999999;
    font-size: computed(24);
  }
  .btn-action {
    display: flex;
    justify-content: center;
    align-items: center;
    height: computed(46);
    font-size: computed(22);
    margin-left: computed(20);
    color: $text-secondary;
    background: #fff;
    border: solid 1px $text-secondary;
    border-radius: computed(24);
    box-sizing: border-box;
  }
  .btn-bg-black {
    color: $domaincolor;
    border: 1px solid $domaincolor;
  }
}
// .wrap:nth-child(1) {
//   margin-top: computed(30);
// }
</style>

<template>
  <div>
    <div class="wrap bg-white mgB30 pdLr30" @click="toViewDetail()">
      <wxs module="filter" src="../../../../../../filter/filterCommon.wxs"></wxs>

      <div class="flex-between pdTb30 border-dash">
        <div class="dateTime">
          <span class="date">{{ ord.date }}</span>
          <span class="time">&nbsp;(&nbsp;{{ ord.time }}&nbsp;)</span>
        </div>
        <div class="order-state">{{ order.ordStatusName }}</div>
      </div>

      <div class="good border-dash" v-for="good in order.goodsList" :key="good.billCode">
        <div class="imgBox">
          <img
            class="img-responsive"
            :src="filter.imgFilter(good.thumb,company_id)"
            lazy-load="true"
            alt
          />
        </div>
        <div class="good-info">
          <div class="cloth-name-price fs28">
            <p class="name">{{ good.goodsName }}</p>
            <p>¥{{ good.averagePrice }}</p>
          </div>
          <div class="size-color-number flex-between">
            <div>
              <span>
                尺码&nbsp;:&nbsp;{{
                good.sizeName
                }}&nbsp;&nbsp;&nbsp;
              </span>
              <span>颜色&nbsp;:&nbsp;{{ good.colorName }}</span>
            </div>
            <div class="fs26 grey99">x{{ good.ordQty }}</div>
          </div>
        </div>
      </div>

      <div class="flex-between pdTb30">
        <div class="flex-auto">
          <span class="fs28B">应付: ¥{{ filter.goldDivide(filter.Fix2(actualPay)) }}</span>
          <span class="fs16 color-grey">(共{{ order.totalQty }}件)</span>
        </div>
        <div class="flex-box flex-end">
          <button
            class="btn-action"
            @click.stop="onBtnClick(btnCancel,$event)"
            v-if="btnCancel"
          >{{ btnCancel }}</button>
          <button
            class="btn-action btn-bg-black"
            @click.stop="onBtnClick(btnTypeName,$event)"
            v-if="btnTypeName"
          >{{ btnTypeName }}</button>
        </div>
      </div>
    </div>
    <van-dialog id="van-dialog" />
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import Dialog from "vant-weapp/dist/dialog/dialog";
import Toast from "vant-weapp/dist/toast/toast";
import * as orderApi from "@/api/service/order";
export default {
  props: {
    order: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      btnTypeName: null,
      btnCancel: null,
      payLock: false,
      // 各种订单状态显示的按钮名称
      stateNames: {
        D_ORDSPAYING: "立即付款", //待付款
        D_ORDSDELIVERY: "确认收货", //待收货
        D_ORDSCOMMENTING: "立即评价", //待评价
        D_ORDRECEIVED: "再次购买"
      },
      stateNames2: {
        D_ORDSPAYING: "取消订单", //取消订单
        D_ORDCANCEL: "删除订单" //删除订单
      }
    };
  },
  methods: {
    // 初始化
    initState() {
      let code = this.order.ordStatusCode;
      //控制取消订单按钮是否显示
      this.btnCancel = this.stateNames2[code];
      //
      this.btnTypeName = this.stateNames[code];
    },

    // 查看订单详情
    toViewDetail($event) {
      this.$router.push({
        path: "/pages/goodsPackage/order/orderDetail/order-detail",
        query: {
          billCode: this.order.billCode,
          ordStatusCode: this.order.ordStatusCode
        }
      });
    },

    //付款
    payForOrder() {
      // let successUrl = "/pages/goodsPackage/order/orderList/order-list";
      // let failUrl = "/pages/goodsPackage/order/orderList/order-list";
      this.$store
        .dispatch("order/pay", {
          order: this.order
        })
        .then(
          res => {
            this.$store.dispatch("orderList/getOrderList");
            Toast("支付成功~");
                  this.initState();
          },
          err => {
            this.$store.dispatch("orderList/getOrderList");
                 this.initState();
          }
        )
        .catch(() => {
          this.$store.dispatch("orderList/getOrderList");
              this.initState();
        });
    },

    //取消订单
    cancel() {
      this.$store.dispatch("order/cancel", this.order.billCode).then(() => {
        this.$store.dispatch("orderList/getOrderList");
        this.initState();
      });
    },

    //删除订单
    delete() {
      this.$store.dispatch("order/delete", this.order.billCode).then(() => {
        this.$store.dispatch("orderList/getOrderList");
        this.initState();
      });
    },
    //再次购买
    buyAgain() {
      this.$store.dispatch("order/buyAgain", this.order).then(orderHdId => {
        if (!orderHdId) return;
        orderApi.orderPreferCal({ ordId: orderHdId }).then(() => {
          this.$router.push({
            path: "/pages/order/order-settlement",
            query: {
              orderHdId: orderHdId
            }
          });
        });
      });
    },

    //签收(确认收货)
    signUp() {
      this.$store.dispatch("order/signUp", this.order.billCode).then(() => {
        this.$store.dispatch("orderList/getOrderList");
        this.btnTypeName = null;
      });
    },
    // 去评价
    toEvaluate() {
      this.$router.push({
        path: "/pages/order/order-evaluate",
        query: {
          billCode: this.order.billCode
        }
      });
    },
    // 按钮点击触发
    onBtnClick(btnTypeName, $event) {
      switch (btnTypeName) {
        case "立即付款":
          this.payForOrder();
          break;
        case "立即评价":
          this.toEvaluate();
          break;
        case "确认收货":
          this.signUp();
          break;
        case "取消订单":
          this.cancel();
          break;
        case "删除订单":
          this.delete();
          break;
        case "再次购买":
          this.buyAgain();
          break;
      }
    }
  },
  computed: {
    actualPay: function() {
      if (!this.order) return;
      return this.order.amountNeedPay - this.order.amountDeduction;
    },
    // 格式化时间
    ord: function() {
      let dateTime = this.order.ordTime.split(" ");
      const time = dateTime[1].substr(0, 5);
      return {
        date: dateTime[0],
        time: time
      };
    }
  },
  created() {
    // 这一步不能少
    this.initState();
  },
  watch: {
    order: function() {
      this.initState();
    }
  }
};
</script>