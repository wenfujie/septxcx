<!--
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 底部按钮操作
 * @Date: 2019-03-23 16:11:46
 * @LastEditTime: 2019-06-14 11:21:27
 -->
<style lang='scss' scoped>
.action-btn-wrap {
  position: fixed;
  bottom: 0;
  z-index: 100;
  width: 100%;
  padding: computed(12) 0;
  background: #fff;
  .btn-group {
    display: flex;
    width: computed(690);
    margin: 0 auto;
    overflow: hidden;
    background: $bggradientcolor;
    border-radius: $btn-radius40;
    background: linear-gradient(
      90deg,
      rgba(255, 54, 54, 1),
      rgba(255, 99, 42, 1)
    );
    box-sizing: border-box;
    button {
      flex: 1;
      justify-content: center;
      outline: 0;
      height: computed(80);
      color: #fff;
      background: rgba(255, 255, 255, $alpha: 0);
    }
    .btn-left {
      width: 50%;
      background: linear-gradient(
        90deg,
        rgba(255, 181, 76, 1),
        rgba(255, 133, 51, 1)
      );
    }
    .btn-right {
      width: 50%;
      background: linear-gradient(
        90deg,
        rgba(255, 99, 42, 1),
        rgba(255, 54, 54, 1)
      );
    }
  }
}
</style>

<template>
  <div>
    <van-dialog id="van-dialog" />
    <van-toast id="van-toast" />
    <div class="action-btn-wrap" v-if="renderSelf">
      <div class="btn-group">
        <button @click="onBtnClick(btnCancel)" v-if="btnCancel" :class="{'btn-left':unique}">
          <a>{{btnCancel}}</a>
        </button>
        <button v-if="btnTypeName" @click="onBtnClick(btnTypeName)" :class="{'btn-right':unique}">
          <a>{{btnTypeName}}</a>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Dialog from "vant-weapp/dist/dialog/dialog";
import Toast from "vant-weapp/dist/toast/toast";
export default {
  props: {
    order: Object
  },
  data() {
    return {
      btnCancel: null,
      btnTypeName: null
    };
  },
  methods: {
    initState() {
      const ordStatuNameMap = {
        D_ORDSPAYING: "立即付款", //待付款
        D_ORDSDELIVERY: "确认收货", //待收货
        D_ORDSCOMMENTING: "立即评价" //待评价
      };
      const ordStatus = this.order.ordStatusCodes;
      const btnName = ordStatuNameMap[ordStatus];
      this.btnCancel = ordStatus === "D_ORDSPAYING" ? "取消订单" : null;
      this.btnTypeName = btnName ? btnName : null;
    },
    // 取消订单
    cancelOrder() {
      this.$store.dispatch("order/cancel", this.order.billCode).then(() => {
        this.$store.dispatch("order/getOrderDetail").then(() => {
          this.initState();
        });
      });
    },
    // 签收订单(确认收货)
    signUp() {
      this.$store.dispatch("order/signUp", this.order.billCode).then(() => {
        this.$store.dispatch("order/getOrderDetail").then(() => {
          this.initState();
        });
      });
    },
    // 付款
    pay() {
      // let successUrl =
      //   "/pages/goodsPackage/order/orderDetail/order-detail?billCode=" + this.order.billCode + "&fromPage=order";
      // let failUrl =
      //   "/pages/goodsPackage/order/orderDetail/order-detail?billCode=" + this.order.billCode + "&fromPage=order";

      this.$store
        .dispatch("order/pay", {
          order: this.order
        })
        .then(
          res => {
            Toast("支付成功~");
            this.$store
              .dispatch("order/getOrderDetail", this.$route.query)
              .then(() => {
                this.initState();
              });
            // this.$router.replace(successUrl);
          },
          err => {
            this.$store
              .dispatch("order/getOrderDetail", this.$route.query)
              .then(() => {
                this.initState();
              });
            // this.$router.replace(failUrl);
          }
        )
        .catch(() => {
          this.$store
            .dispatch("order/getOrderDetail", this.$route.query)
            .then(() => {
              this.initState();
            });
          // this.$router.replace(failUrl);
        });
    },
    // 去评价
    toEvaluate() {
      this.$router.push({
        path: "/pages/orderPackage/order/order/order-evaluate",
        query: {
          billCode: this.order.billCode
        }
      });
    },
    //点击事件
    onBtnClick(name) {
      switch (name) {
        case "取消订单":
          this.cancelOrder();
          break;
        case "确认收货":
          this.signUp();
          break;
        case "立即付款":
          this.pay();
          break;
        case "立即评价":
          this.toEvaluate();
          break;
        default:
          this.btnCancel = null;
          this.btnTypeName = null;
      }
    }
  },
  computed: {
    unique: function() {
      return this.btnCancel && this.btnTypeName;
    },
    renderSelf: function() {
      let isRender = this.btnCancel || this.btnTypeName;
      this.$parent.paddingBottom = isRender;
      return isRender;
    }
  },
  onUnload() {
    // 解决重复进页面数据未初始化
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.initState();
  },
  watch: {
    order: function() {
      this.initState();
    }
  }
};
</script>