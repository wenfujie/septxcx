<style lang='scss' scoped>
.good-list-wrap {
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
}
</style>

<template>
  <div class="good-list-wrap">
    <p class="title">商品清单({{ordQty}})</p>
    <!-- 商品信息 -->
    <good v-for="(good,index) in order.goodsList" :key="index" :good="good"></good>
  </div>
</template>

<script>
import good from "./good";
export default {
  components: {
    good
  },
  props: {
    order: Object
  },
  data(){
    return {}
  },
  computed: {
    ordQty: function() {
      const goods = this.order.goodsList || [];
      let goodNum = 0;
      if (!goods.length) return goodNum;
      goods.forEach(good => {
        goodNum += good.ordQty;
      });
      return goodNum;
    }
  },
    onHide() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    },
  onLoad(){

  }

};
</script>