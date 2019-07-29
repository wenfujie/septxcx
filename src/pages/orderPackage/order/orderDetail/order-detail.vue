<style lang='scss' scoped>
.order-detail {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #f5f5f5;
    .main {
        flex: 1;
        width: 100%;
        height: 100%;
        padding: computed(30);
        box-sizing: border-box;
        .content {
            padding: computed(30) computed(30) 0 computed(30);
            background: #fff;
            box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }
    }
}
.padding-top-80 {
    padding-top: computed(80);
}
.padding-bottom-100 {
    padding-bottom: computed(100);
}
</style>
<template>
    <div :class="['order-detail',{'padding-top-80':paddingTop},{'padding-bottom-100':paddingBottom}]">
        <down :order="order" />
        <tabs v-if="pkgs.length>1" :data="pkgs" :index="0" :onChange="changePackage" />
        <div class="main overflow-scroll">
            <div class="content">
                {{showSteps}}
                <orderSteps :pkg="pkg" v-if="showSteps" />
                <distrInfo :order="order" :pkg="pkg" />
                <goodList :order="pkg" />
                <orderInfo :order="order" />
            </div>
        </div>
        <actionBtn :order="order" />
    </div>
</template>


<script>
import tabs from "../../../../components/tab/tab";
import actionBtn from "./components/actionBtn/index";
import down from "./components/down/index";
import goodList from "./components/goodList/goodList";
import orderInfo from "./components/orderInfo/orderInfo";
import orderSteps from "./components/orderSteps/steps";
import distrInfo from "./components/distrInfo/distrInfo";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
    data() {
        return {
            paddingTop: false,
            paddingBottom: false
        };
    },
    components: {
        actionBtn,
        down,
        tabs,
        distrInfo,
        goodList,
        orderInfo,
        orderSteps
    },
    config: {
        navigationBarTitleText: "订单详情"
    },
    methods: {
        // 获取订单详情
        getOrdDetail() {

            this.$store.commit("order/getUserInfoAndCompanyId");
            this.$store.dispatch("order/getOrderDetail", this.$route.query);
  
            
        },
        // 包裹切换
        changePackage(pkg, index) {
            this.$store.commit("order/changePkg", pkg);
        }
    },
    computed: {
        ...mapState("order", ["order", "pkgs", "pkg"]),
        showSteps: function() {
            const unableStatus = ["D_ORDCANCEL", "D_ORDSPAYING"];
            return unableStatus.includes(this.order.ordStatusCodes)
                ? false
                : true;
        }
    },
    onShow() {
        // 解决申请页面待寄回信息滞留
        this.$store.commit("afterSale/detail/clearAll", "orderDetail");
        this.getOrdDetail();
    },
    watch: {
        $route: function() {
    
            this.getOrdDetail();
        }
    },
    onHide() {
        this.$store.commit("order/clear");

        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    }
};
</script>
