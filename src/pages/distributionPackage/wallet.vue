/*
* createTime：2019/3/4
* author：en.chen
* description:  我的钱包
*/
<template>
    <div class="wallet">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>
        <div class="top-content">
            <!-- 钱包金额提示 begin -->
            <div class="fund-box">
                <div class="fund-item total">
                    <p class="fund-val">{{filter.Fix2(!!vipInfo.currentTotalAmount && vipInfo.currentTotalAmount >= 0 ? vipInfo.currentTotalAmount : 0 )}}</p>
                    <p class="fund-tip">当前账户总金额（元）</p>
                    <div class="withdraw-btn" @click="canWithdraw">申请提现</div>
                </div>
                <div class="fund-item withdrawing">
                    <p class="fund-val">{{filter.Fix2(vipInfo.checkAmount || 0)}}</p>
                    <p class="fund-tip">提现审核中的金额（元）</p>
                </div>
            </div>
            <!-- 钱包金额提示 end -->

            <!-- 资金状态栏 begin -->
            <ul class="status-list">
                <li class="status-item" :class="{ 'act' : selectedStatus === '' }" @click="changeStatus('')">全部</li>
                <li class="status-item" :class="{ 'act' : selectedStatus === 'in' }"  @click="changeStatus('in')">收入</li>
                <li class="status-item" :class="{ 'act' : selectedStatus === 'out' }"  @click="changeStatus('out')">支出</li>
            </ul>
            <!-- 资金状态栏 end -->
        </div>
        <!--资金列表 begin-->
        <div class="fund-content">

            <div>
                <ul class="fund-list" v-if="walletList.length>0">
                    <li class="fund-item" v-for="item in walletList" :key="item.id">
                        <div>
                            <p class="memo">{{item.memo}}</p>
                            <p class="time">{{item.crtLog}}</p>
                        </div>
                        <div :class="['amount',{'in':item.inAmt>=0},{'out':item.inAmt<0}]">
                            <!-- {{item.inAmt>=0 ?
                            `+${Number(item.inAmt).toFixed(2)}`:
                            `-${item.inAmt == undefined ? Number(item.outAmt).toFixed(2) : Number(item.inAmt).toFixed(2)}`
                            }} -->
                            {{item.inAmt>=0 ? ('+'+filter.Fix2(item.inAmt)) :
                                ('-' + (item.inAmt == undefined ? filter.Fix2(item.outAmt) : filter.Fix2(item.inAmt)))
                            }}
                        </div>
                    </li>
                </ul>
            </div>
            <div class="fund-empty" v-if="walletList.length<=0 && !loading">
                <empty :emptyText="emptyText"></empty>
            </div>

        </div>

        <van-toast id="van-toast" />

        <footer-bar ref="footer_bar"></footer-bar>
    </div>
</template>
<script>
    import FooterBar from '@/components/FooterBar'
    import Empty from '../../components/EmptyContent.vue'
    import { Distribution } from '../../api/service'

    import Toast from 'vant-weapp/dist/toast/toast';
    export default {
        config: {
            navigationBarTitleText: "我的钱包",
            enablePullDownRefresh: true,

        },
        components:{
            'empty': Empty,
            'footer-bar': FooterBar
        },
        data() {
            return {
                vipInfo: {},  // 会员账户信息（用于获取账户总金额及提现审核中的金额）
                selectedStatus: '',  // 查询状态（'in'收入,'out'支出，''全部）
                loading: false,    // 是否处于加载更多
                isLoading: false,  // 是否处于上拉刷新状态
                finished: true,  // 控制是否允许加载更多商品
                walletList: [],  // 资金列表
                pageNum: 1,
                pageSize: 10,
                emptyText: '暂无数据~'
            }
        },
        // 小程序 滚动到底部事件
        onReachBottom(){
            this.loadMore();
        },
        // 小程序 下拉刷新事件
        onPullDownRefresh(){
            this.onRefresh();
        },
        methods: {
            //  获取分销商账户信息
            getVipInfo(){

                let data = {}

                //  会员整合新增选中分销商查询
                if(!!this.$store.state.distribution.accountInfo.id) {
                    data.vipInfoHdId = this.$store.state.distribution.accountInfo.vipInfoHdId
                }else{
                    data.vipInfoHdId = global.Storage.get('USER_INFO').vipInfoId
                }

                Distribution.getVipInfo(data).then((res) =>{
                    this.vipInfo = res
                })
            },

            //  查询我的钱包流水列表
            async getList(){
                if(this.isLoading || this.loading) return
                this.loading = true
                this.isLoading = true
                let data = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    vipInfoMdtId: await this.$store.dispatch('distribution/getDistributionId'),
                    type: this.selectedStatus
                }

                //  会员整合新增选中分销商查询
                if(!!this.$store.state.distribution.accountInfo.id) {
                    data.vipInfoMdtId = this.$store.state.distribution.accountInfo.id
                    data.vipInfoHdId = this.$store.state.distribution.accountInfo.vipInfoHdId
                }

                Distribution.getWalletList(data).then((res) => {
                    this.walletList.push.apply(this.walletList,res.list)
                    if(this.walletList.length >= res.total || this.pageNum >= res.pages || res.total <= 0) {
                        this.finished = true
                    }else{
                        this.finished = false
                    }
                    global.toastLoading(false);// 关闭
                    wx.stopPullDownRefresh();
                    this.loading = false
                    this.isLoading = false
                },() => {
                    this.loading = false
                    this.isLoading = false
                }).then(() =>{
                    this.loading = false
                    this.isLoading = false
                })
            },

            // 切换查询状态
            changeStatus(status) {
                if(status === this.selectedStatus) return
                this.selectedStatus = status
                this.statusInit()
                this.getList()
            },

            //  下拉刷新
            onRefresh() {
                this.statusInit()
                this.getList()
            },

            //  上拉加载更多
            loadMore() {
                if(!!this.finished || this.loading) {
                    return
                }
                this.pageNum += 1
                this.getList()
            },

            //  状态初始化
            statusInit() {
                this.pageNum = 1
                this.walletList = []
                this.finished = true
                this.loading = false
                this.isLoading = false
            },

            //  判断是否允许跳转提现页面
            canWithdraw(){
                if(this.vipInfo.currentTotalAmount - this.vipInfo.nonWithdrawableAmount > 0) {
                    this.$router.push('/pages/distributionPackage/withdraw-apply')
                }else{
                    Toast('可提现金额不足~')
                }
            }
        },
        onShow() {
            Object.assign(this.$data, this.$options.data());
            global.toastLoading();// 开启
            this.getVipInfo()
            this.getList()
        },
        mounted() {
            this.$refs.footer_bar.tabIndex = -1;
            this.$refs.footer_bar.getDistributionInfo()
        },
        // 点击左上角返回不会触发onHide
        onHide(){
            Object.assign(this.$data, this.$options.data());
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
    body{
        height: 100%;
    }
    .wallet{
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding-top: computed(400);
        min-height: 100%;
        background: $color-background;
        .top-content{
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9;
            .fund-box{
                box-sizing: border-box;
                height: computed(310);
                padding: computed(35) computed(30);
                background: $bggradientcolor;
                overflow: hidden;
                position: relative;
                &::after{
                    position: absolute;
                    top: 50%;
                    left: computed(30);
                    transition: translateY(-50%);
                    content: '';
                    width: calc(100% - #{computed(60)});
                    height: 0;
                    border-bottom: dashed 1px $text-placeholder;
                }
                .fund-item{
                    box-sizing: border-box;
                    position: relative;
                    height: computed(120);
                    .fund-val{
                        font-size: $font-h1;
                        line-height: 1;
                        color: $color-white;
                        margin-bottom: computed(22);
                    }
                    .fund-tip{
                        font-size: $font-regular;
                        line-height: 1;
                        color: $text-gray;
                    }
                    .withdraw-btn{
                        width: computed(132);
                        height: computed(50);
                        background: $color-white;
                        font-size: $font-common;
                        line-height: computed(50);
                        color: $domaincolor;
                        text-align: center;
                        position: absolute;
                        right: 0;
                        bottom: computed(50);
                        border-radius: $btn-radius25;
                    }
                    &.withdrawing{
                        padding-top: computed(30);
                    }
                }
            }
            .status-list{
                box-sizing: border-box;
                display: flex;
                height: computed(88);
                border-bottom: solid 1px $text-placeholder;
                z-index: 9;
                background: $color-background;
                .status-item{
                    flex: 1;
                    font-size: $font-regular;
                    line-height: computed(88);
                    color: $text-regular;
                    text-align: center;
                    position: relative;
                    transition: all .3s;
                    &.act{
                        font-weight: bold;
                        color: $domaincolor;
                        &::after{
                            content: '';
                            position: absolute;
                            width: computed(100);
                            height: computed(4);
                            left: 50%;
                            bottom: 0;
                            transform: translateX(-50%);
                            animation: line-animation 0.3s forwards;
                            background: $domaincolor;
                        }
                    }
                }
            }
        }
        .fund-content{
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            flex: 1;
            position: relative;
            background: $color-white;
            z-index: 3;
            padding-bottom: computed(98);
           .fund-list{
               .fund-item{
                   display: flex;
                   box-sizing: border-box;
                   height: computed(138);
                   padding: 0 computed(30);
                   border-bottom: solid 1px $text-placeholder;
                   align-items: center;
                   justify-content: space-between;
                   .memo{
                       font-size: $font-h2;
                       line-height: 1;
                       color: $color-black;
                   }
                   .time{
                       margin-top: computed(24);
                       font-size: $font-common;
                       color: $text-secondary;
                       line-height: 1;
                   }
                   .amount{
                       font-size: $font-h1;
                       line-height: 1;
                       &.in{
                           color: $domaincolor;
                       }
                       &.out{
                           color: $text-green;
                       }
                   }
               }
           }
        }
        .fund-empty{
            display: flex;
            background: $color-background;
            flex-direction: column;
            flex: 1;
        }
    }
    @keyframes line-animation {
        from {
            width: computed(10);
        }
        to {
            width: computed(100);
        }
    }
</style>
