<style lang="scss" type="text/scss" scoped>
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
            .fissionType{
                text-align: center;
                width: 100%;
                max-height: computed(72);
                line-height: computed(72);
                background:rgba(255,246,242,1);
                color:rgba(255,59,53,1);
                font-size: computed(28);
                margin-bottom: computed(37);
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
        <down :order="order"/>
        <tabs v-if="pkgs.length>1" :data="pkgs" :index="0" :onChange="changePackage"/>
        <div class="main overflow-scroll">
            <div class="content">
                <orderSteps :pkg="pkg" v-if="showSteps"/>
                <distrInfo :order="order" :pkg="pkg"/>
                <goodList :order="pkg"/>

                <div v-if="fissionType===2" class="fissionType">
                    <span v-if="fissionData.payNo === 1 && fissionData.finishFlag === 0 && !fissionData.isOverTime" class="header-status">待成团</span>
                    <span v-if="fissionData.payNo === 1 && fissionData.finishFlag === 1 && !fissionData.isOverTime" class="header-status">已成团</span>
                    <span v-if="fissionData.payNo === 1 && fissionData.finishFlag === 2" class="header-status">拼团失败</span>
                </div>

                <orderInfo :order="order" :fissionType="fissionType" :fissionData="fissionData"/>
            </div>
        </div>
        <actionBtn :order="order"/>
        <van-dialog id="van-dialog"/>
    </div>
</template>


<script>
    import tabs from "../tab/tab";
    import actionBtn from "./components/actionBtn/index";
    import down from "./components/down/index";
    import goodList from "./components/goodList/goodList";
    import orderInfo from "./components/orderInfo/orderInfo";
    import orderSteps from "./components/orderSteps/steps";
    import distrInfo from "./components/distrInfo/distrInfo";
    import {mapState} from "vuex";
    import {Fission} from "../../../../api/service";

    export default {
        data() {
            return {
                paddingTop: false,
                paddingBottom: false,
                fissionType: '',
                fissionData: {},
                vipInfoDtFssId: '', // 拼团记录id
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
                this.$store.commit("order/clear");
                this.$store.commit("order/getUserInfoAndCompanyId");
                this.$store.dispatch("order/getOrderDetail", this.$route.query).then((res) => {
                    let id = this.vipInfoDtFssId ? this.vipInfoDtFssId : res.vipInfoDtFssId
                    if (this.fissionType === 2) {
                        this._findAllVipinforid(id)
                    }
                })
            },
            // 包裹切换
            changePackage(pkg, index) {
                this.$store.commit("order/changePkg", pkg);
            },
            /**
             * 拼团记录
             */
            async _findAllVipinforid (id) {
                let currentTime = await this.getServerDate()

                let params = {
                    shopId: global.Storage.get("properties").shopId,
                    busContsCode: global.Storage.get("properties").busContsCode,
                    companyId: global.Storage.get("properties").companyId,
                    vipInfoHdId: global.Storage.get("USER_INFO").vipInfoId,
                    vipInfoDtFssId: id
                }
                await Fission.findAllVipinforid(params).then(async (res) => {
                    if (res.length === 1) {
                        let item = res[0]
                        let time = global.c_getDateStamp(item.beginTime) + (item.times * 60 * 1000 * 60)
                        let isOverTime = time <= currentTime ? true : false  // 是否结束 true结束 false未结束
                        item.isOverTime = isOverTime

                        // 待成团不能申请售后
                        if (item.payNo === 1 && item.finishFlag === 0 && !item.isOverTime) {
                            this.$store.commit('order/isShowApplyBtn')
                        }

                        this.fissionData = item
                    }
                }, err => {
                })
            },
            /**
             * 获取服务器时间
             */
            getServerDate(){
                return Fission.getServerDate().then(res=>{
                    return global.c_getDateStamp(res)
                })
            },
        },
        computed: {
            ...mapState("order", ["order", "pkgs", "pkg"]),
            showSteps: function () {
                const unableStatus = ["D_ORDCANCEL", "D_ORDSPAYING"];
                return unableStatus.includes(this.order.ordStatusCodes) ? false : true;
            }
        },
        async onShow() {
            let query = this.$route.query
            this.fissionType = parseInt(query.fissionType)
            this.vipInfoDtFssId = query.vipInfoDtFss ? query.vipInfoDtFss : ''

            // 解决申请页面待寄回信息滞留
            this.$store.commit("afterSale/detail/clearAll", "orderDetail");
            this.getOrdDetail();
        },
        watch: {
            $route: function () {
                this.getOrdDetail();
            }
        },
        onHide() {
            this.$store.commit("order/clear");

            // 解决重复进页面数据未初始化
            Object.assign(this.$data, this.$options.data());
        },
        onUnload() {
            Object.assign(this.$data, this.$options.data());
        }
    };
</script>
