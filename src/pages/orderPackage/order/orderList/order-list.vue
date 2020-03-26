<!--
 * @Author: yongtian.hong
 * @Date: 2019-07-02 16:37:17
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-08-14 15:00:31
 * @Description: 
 -->
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
        width: calc(100% - 40rpx);
        padding: 0;
        margin: 0;
        padding: 0 20rpx;
        background: white;
        .tab-wrap-top{
            border-bottom: 1px solid #eee;
        }
    }
    .content {
        padding: computed(0) computed(30) 0 computed(30);
        box-sizing: border-box;
    }
}
</style>
<template>
    <div class="ord-list-wrap" :style="accountListShow?'padding-top: 200rpx;':''">
        <div class="tab-wrap">
            <div class="tab-wrap-top" v-show="accountListShow">
                <account-dropdown :hasFilterDistribution="true" @getList='getList' @onConfirm='selectAccount' 
                    :allAccountId=-1
                    :defaultSelectedId=-1
                ></account-dropdown>
            </div>
            <tabs :data="tabs" :index="sIndex" :onChange="search" />
        </div>
        <empty-content v-if="isEmpty"></empty-content>
        <div class="content" v-else>
            <listItem v-for="order in orderList" :ordItem="order" :key="order.billCode" />
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import listItem from "./components/list-item/list-item";
import tabs from "../tab/tab";
import EmptyContent from "@/components/EmptyContent";
import AccountDropdown from "@/components/AccountDropdown";
import Toast from "vant-weapp/dist/toast/toast";
export default {
    components: {
        tabs,
        listItem,
        "empty-content": EmptyContent,
        'account-dropdown':AccountDropdown
    },
    config: {
        navigationBarTitleText: "订单列表",
        enablePullDownRefresh: true,
        backgroundTextStyle: "dark"
    },
    data(){
        return{
            accountListShow:false,
            accountList:[],//账户列表
            selected_AccountId:[],//选中的id
        }
    },
    methods: {
        ...mapActions("orderList", ["getOrderList", "loadMoreOrder","setAccountId"]),

        //按条件搜索
        search(tab, index) {
            this.$store.dispatch(
                "orderList/searchList",
                Object.assign(tab, { index: index })
            );
        },
        //获取账户列表后触发，获取订单列表要在它之后
        getList(accountList){
            this.accountList=accountList||[]
            console.log(accountList,'accountList')
            if(accountList.length>1){
                this.accountListShow=true;
            }else{
                this.accountListShow=false;
            }
            this.selectAllAccount();
            this.beforeOrderList();
        },
        //选中账户时触发
        selectAccount(account){
            console.log(account.id,'selectAccount')
            if(account.id==-1){
                this.selectAllAccount();
                this.beforeOrderList();
            }else{
                this.selected_AccountId=[account.id]
                this.beforeOrderList();
            }
        },
        //将当为全部账号时的id数组赋值到变量
        selectAllAccount(){
            let selected_AccountId=[];
            this.accountList.forEach((item)=>{
                selected_AccountId.push(item.id)
            })
            this.selected_AccountId=selected_AccountId;
        },
        //获取订单前需要设置哪个账号
        beforeOrderList(){
            let selected_AccountId=''
            //如果是整合后的账号
            if(this.accountList.length>0){
                selected_AccountId=this.selected_AccountId.join(',')
            }
            this.setAccountId(selected_AccountId).then(()=>{
                this.getOrderList()
            })
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
            // this.getOrderList();
        }
    },
    onPullDownRefresh() {
        // 初始化页码
        this.getOrderList().then(() => {
            wx.stopPullDownRefresh();
        });
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
