<style lang='scss' scoped>
.count-wrap {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  height: computed(80);
  line-height: computed(80);
  font-size: computed(24);
  text-align: center;
  color: $domaincolor;
  background: #fff;
}
</style>

<template>
  <div class="count-wrap" v-if="isRender">
    <wxs module="filter" src="../../../../../../filter/filterCommon.wxs"></wxs>
    <span>{{hours}}小时</span>
    <span>{{minutes}}分</span>
    <span>{{seconds}}秒</span>
    <span>&nbsp;后自动取消订单</span>
  </div>
</template>

<script>
export default {
  props: {
    order: Object
  },
  data() {
    return {
      time: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      maxtime: 0,
      timer: null
    };
  },
  methods: {
    // 初始化
    init_Time() {
      this.seconds = 0;
      this.minutes = 0;
      this.hours = 0;
      this.time = this.order.closeDate - this.order.nowDate;
    },
    // 获取结束时间与当前时间差值的毫秒值
    getEndTimeMill() {
      return Math.floor(this.time / 1000);
    },
    //时间设置
    set_Time(maxtime) {
      this.seconds = Math.floor(maxtime % 60);
      this.minutes = Math.floor(maxtime / 60) % 60;
      this.hours = Math.floor(maxtime / 3600);
    },
    // 判断订单是否待支付状态
    isPayed() {
      const isPayed =
        this.order.ordStatusCodes == "D_ORDSPAYING" ? true : false;
      const isPayedPart =
        this.order.payStatusCode == "D_PAIDPART" ? false : true;
      return isPayed && isPayedPart ? true : false;
    },
    // 倒计时
    countDown(maxtime) {
      let that = this;
      that.maxtime = maxtime;
      this.timer = setInterval(function() {
        if (that.maxtime > 0) {
          that.maxtime--;
          that.set_Time(that.maxtime);
        } else {
          that.$store.dispatch(
            "order/cancelWhenPayTimeout",
            that.order.billCode
          );
          clearInterval(that.timer);
        }
      }, 1000);
    },
    // 开始
    start() {
      console.log("start");
      this.clearTimer()
      if (!this.isPayed()) return;
      this.init_Time();
      const maxtime = this.getEndTimeMill();
      if (maxtime <= 0) return;
      this.set_Time(maxtime);
      this.countDown(maxtime);
    },

    clearTimer(){
       clearInterval(this.timer);
      this.timer=null
    }
  },

  computed: {
    isRender: function() {
      this.$parent.paddingTop = false;
      if (!this.isPayed()) return false;
      if (this.maxtime == 0) return false;
      this.$parent.paddingTop = true;
      return true;
    }
  },
  watch: {
    order: function() {
      this.start();
    }
  },

  mounted() {
    this.start();
  },
  onHide() {
    this.clearTimer();
    console.log(this.timer, "777777777777");
    Object.assign(this.$data, this.$options.data());
  },
  onUnload() {
    // 路由离开时清空定时器

  }
};
</script>
