<style lang='scss' scoped>
.ord-list-wrap {
  width: 100%;
  min-height: 100%;
  padding-top: computed(120);
  background: whitesmoke;
  box-sizing: border-box;

  .tab-wrap {
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    padding: 0;
    margin: 0;
  }
  .content {
    padding: computed(0) computed(30) 0 computed(30);
    box-sizing: border-box;
  }
}
</style>
<template>
  <div class="ord-list-wrap">
    <div class="tab-wrap">
      <tabs :data="tabs" :index="sIndex" :onChange="search"/>
    </div>
    <empty-content v-if="isEmpty"></empty-content>
    <div class="content" v-else>
      <listItem v-for="order in orderList" :order="order" :key="order.id"/>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import listItem from "./components/list-item/list-item";
import tabs from "@/components/tab/tab";
import EmptyContent from "@/components/EmptyContent";
export default {
  config: {
    navigationBarTitleText: "订单列表"
  },
  components: {
    tabs,
    listItem,
    "empty-content": EmptyContent
  },
  methods: {
    ...mapActions("orderList", ["getOrderList", "loadMoreOrder"]),

    //按条件搜索
    search(tab, index) {
      this.$store.dispatch(
        "orderList/searchList",
        Object.assign(tab, { index: index })
      );
    },
    //展示定制清单
    async showCusList(order, good) {
      this.cusParams = {
        billCode: order.billCode,
        saleOrdDtIds: good.rtlOrdDtId
      };
    },

    onInit() {
      // 获取用户与公司信息
      this.$store.commit("order/getUserInfoAndCompanyId");
      // 获取订单列表
      this.getOrderList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    // 初始化页码
    this.getOrderList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1500);
  },
  //  加载更多商品
  onReachBottom() {
    if (!this.loadFinished) {
      this.loadMoreOrder();
    } else {
      Toast("没有更多了~");
    }
  },

  computed: {
    ...mapState("orderList", [
      "orderList",
      "tabs",
      "sIndex",
      "loadFinished",
      "isEmpty"
    ])
  },
  onShow() {
    this.onInit();
  }
};
</script>