/*
* createTime：2019/3/6
* author：en.chen
* description:  对账单模块
*/
<template>
    <div class="bill-info">
        <wxs module="filter" src="../../filter/filterCommon.wxs"></wxs>
        <!-- 页面标签 begin -->
        <!--<div class="bill-tab">-->
        <!--<div v-for="item in tabMenu" @click="tabHandle(item.value)" class="tab-item" :class="{'active' : item.value === activeIndex}" :key="item.value">{{item.title}}</div>-->
        <!--</div>-->
        <!-- 页面标签 end -->

        <!-- 下级会员对账单 begin -->
        <div class="bill-list-box" v-show="activeIndex === 0">
            <!-- 筛选条件 begin -->
            <div class="condition-box">
                <form @submit.prevent action="javascript:return true">
                    <!-- 微信昵称 -->
                    <van-field
                            class="search-name mgL30 mgR30"
                            :value="name"
                            placeholder="请输入微信昵称"
                            @keypress="searchHandel"
                            @change="fieldChange('name',$event)"
                            type="search"
                            clearable
                    />
                </form>
                <!-- 筛选层级 -->
                <div class="member-level mgL30 mgR30" @click="handleLevelDialog(true)">
                    <p><span>筛选会员：</span>{{levelName}}<text class="iconfont iconxuanzexiao"></text></p>
                </div>
                <!-- 时间 -->
                <div class="time-box mgL30 mgR30">
                    <span>从</span>
                    <label @click="showPopup('dateStart')">{{timeStart}}<text class="iconfont iconxuanzexiao"></text></label>
                    <span>至</span>
                    <label @click="showPopup('dateEnd')">{{timeEnd}}<text class="iconfont iconxuanzexiao"></text></label>
                    <div class="search-btn" @click="onRefresh">搜索</div>
                </div>
                <!-- 会员数量统计 -->
                <div class="member-level mgL30 mgR30">
                    <p><span style="color: #666;">会员总数/有购买会员数：</span>{{totalVip}}/{{consumer}}</p>
                </div>
                <!-- 金额 -->
                <div class="fund-box mgL30 mgR30">
                    <div class="fund-item clearfix">
                        <p class="fl">订单总金额（元）：<span>{{filter.Fix2(orderAmount)}}</span></p>
                        <!--<div class="fr fund-btn" @click="isShowEmail = true">导出到邮箱<text class="iconfont iconxuanze"></text></div>-->
                    </div>
                    <div class="fund-item clearfix">
                        <p class="fl">总返利金额（元）：<span>{{filter.Fix2(interestAmount)}}</span></p>
                        <a href="/pages/distributionPackage/rank-list" tag="div" class="fr fund-btn">查看分润排行<text
                                class="iconfont iconxuanze"></text></a>
                    </div>
                </div>
                <!-- 下级会员对账单表头 -->
                <div class="bill-content bill-title">
                    <div class="bill-item">微信昵称</div>
                    <div class="bill-item">订单编号</div>
                    <div class="bill-item">订单金额</div>
                    <div class="bill-item">返利金额</div>
                    <div class="bill-item">订单状态</div>
                    <div class="bill-item">交易时间</div>
                </div>
            </div>
            <!-- 筛选条件 end -->

            <!-- 下级会员对账单列表 begin -->
            <div class="bill-list">
                <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height="100">
                    <van-list
                            v-model="loading"
                            :finished="finished"
                            @load="loadMore"
                            :offset="80"
                    >
                        <ul class="bill-content-list" v-if="billList.length>0">
                            <li class="bill-content" v-for="item in billList" :key="item.id">
                                <div class="bill-item">{{item.nickName || '匿名用户'}}</div>
                                <div class="bill-item">{{item.billCode}}</div>
                                <div class="bill-item">{{item.amountOrd | $goldDivide}}</div>
                                <div class="bill-item">{{item.inAmt | $goldDivide}}</div>
                                <div :class="['bill-item',
                                { 'already' : item.ordStatusCode === 'D_DONE' || item.ordStatusCode === 'D_ORDRECEIVED'}]">
                                    {{item.ordStatusName}}
                                </div>
                                <div class="bill-item time">{{item.crtLog}}</div>
                            </li>
                        </ul>
                    </van-list>
                    <div class="fund-empty" v-if="billList.length<=0 && !loading">
                        <empty :emptyText="emptyText"></empty>
                    </div>
                </van-pull-refresh> -->

                <div>
                    <div>
                        <ul class="bill-content-list" v-if="billList.length>0">
                            <li class="bill-content" v-for="item in billList" :key="item.id">
                                <div class="bill-item">{{item.nickName || '匿名用户'}}</div>
                                <div class="bill-item">{{item.billCode}}</div>
                                <div class="bill-item">{{filter.goldDivide(item.amountOrd)}}</div>
                                <div class="bill-item">{{filter.goldDivide(item.inAmt)}}</div>
                                <div :class="['bill-item',
                                { 'already' : item.ordStatusCode === 'D_DONE' || item.ordStatusCode === 'D_ORDRECEIVED'}]">
                                    {{item.ordStatusName}}
                                </div>
                                <div class="bill-item time">{{item.crtLog}}</div>
                            </li>
                        </ul>
                    </div>
                    <div class="fund-empty" v-if="billList.length<=0 && !loading">
                        <empty :emptyText="emptyText"></empty>
                    </div>
                </div>
            </div>
            <!-- 下级会员对账单列表 end -->
        </div>
        <!-- 下级会员对账单 end -->

        <!-- 次级会员对账单 begin -->
        <div class="secondary-bill" v-show="activeIndex === 1">
            <div class="secondary-bill-list bg-gray">
                <div class="bill-item">会员总数</div>
                <div class="bill-item">订单总金额</div>
                <div class="bill-item">返利总金额</div>
            </div>
            <div class="secondary-bill-list">
                <div class="bill-item">{{billInfo.totalVip || 0}}</div>
                <div class="bill-item">{{filter.Fix2(billInfo.totalAmountOrd || 0)}}</div>
                <div class="bill-item">{{filter.Fix2(billInfo.totalInAmt || 0)}}</div>
            </div>
        </div>
        <!-- 次级会员对账单 end -->

        <!--查询时间弹窗 begin-->
        <van-popup :show="isShowPopup"  position="bottom">
            <van-datetime-picker
                    :value="currentDate"
                    type="date"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @cancel="isShowPopup = false"
                    @confirm="selectTime"
                    @input="onDateInput"
            />
        </van-popup>

        <!--查询时间弹窗 end-->

        <!-- 筛选等级选择菜单 begin -->
        <van-action-sheet
                :overlay="true"
                :show="showLevel"
                :close-on-click-overlay="true"
                :actions="levelCodesList"
                @select="choseLevel"
        />
        <!-- 筛选等级选择菜单 end -->

        <!-- 导出邮箱弹窗 begin -->
        <!-- <van-dialog
                :show="isShowEmail"
                title="请填写您要接受账单的邮箱"
                show-cancel-button
                cancelButtonText="先不填写"
                confirmButtonText="确认提交"
                @confirm="sendEmail"
        >
            <van-field
                    class="dialog-filed"
                    :value="email"
                    @change="fieldChange('name',$event)"
                    type="email"
                    placeholder="邮箱地址"
            />
        </van-dialog> -->
        <!-- 导出邮箱弹窗 end -->

        <van-toast id="van-toast" />
    </div>
</template>
<script>
    // import {Field, Toast, DatetimePicker, Popup, PullRefresh, List, Actionsheet} from 'vant'
    import {Distribution} from '../../api/service'
    import Empty from '../../components/EmptyContent.vue'
    import Toast from 'vant-weapp/dist/toast/toast';

    export default {
        config: {
            navigationBarTitleText: "对账单",
            enablePullDownRefresh: true
        },
        // 小程序 滚动到底部事件
        onReachBottom(){
            this.loadMore();
        },
        // 小程序 下拉刷新事件
        onPullDownRefresh(){
            this.onRefresh();
        },
        components: {
            // 'van-field': Field,
            // 'van-datetime-picker': DatetimePicker,
            // 'van-popup': Popup,
            'empty': Empty,
            // 'van-pull-refresh': PullRefresh,
            // 'van-list': List,
            // 'van-actionsheet': Actionsheet
        },
        data() {
            return {
                tabMenu: [  // 标签菜单
                    {
                        title: '对账单明细',
                        value: 0,
                    },
                    {
                        title: '对账单汇总',
                        value: 1,
                    }
                ],
                activeIndex: 0,  // 选中的标签
                name: null,  // 查询下级的微信昵称
                isShowPopup: false,  // 控制提现弹窗遮罩显示的变量
                isShowEmail: false,  // 控制导出邮箱弹窗遮罩显示的变量
                email: null,  // 导出对账单对应的邮箱地址
                timeType: null,  // 时间类型
                currentDate: new Date().getTime(),  // 选中时间
                dateStart: new Date(),  // 起始时间
                dateEnd: new Date(),  // 结束时间
                minDate: new Date(2019, 2, 1, 0, 0, 0).getTime(),  // 最小截止时间与产品沟通定在2019-03-01
                maxDate: new Date().getTime(),  // 最大截止时间
                loading: false,    // 是否处于加载更多
                isLoading: false,  // 是否处于上拉刷新状态
                finished: true,  // 控制是否允许加载更多商品
                billList: [],  // 下级会员对账单列表
                billInfo: {},  // 次级会员对账单列表
                pageNum: 1,
                pageSize: 10,
                emptyText: '暂无数据~',
                btnLock: false,  // 按钮锁
                showLevel: false,  // 显示上下级菜单
                levelName: '全部会员',  // 上下级等级编码名称
                levelCodes: 0,  // 上下级等级编码（用于查询对账单明细）
                levelCodesList: [],
                totalVip: 0,  // 总会员数
                consumer: 0,  // 购买会员总数
            }
        },
        methods: {
            // 键盘失焦
            // handleBlur(){
            //     setTimeout(()=>{
            //         this.$nextTick(() => {
            //             window.scrollTo(0, 1)
            //         })
            //     }, 0)
            // },
            // 控制 筛选会员 dialog显示
            handleLevelDialog(flag = false){
                console.log(flag,"----")
                this.showLevel = flag;
            },
            // input change事件
            fieldChange(key,event){
                this[key] = event.mp.detail;
            },
            //  时间组件初始化
            timeInit() {
                let date = new Date()
                let year = date.getFullYear()
                let month = date.getMonth()
                let day = date.getDate()
                this.dateStart = new Date(year, month, day, 0, 0, 0)
                this.dateEnd = new Date(year, month, day, 23, 59, 59)
            },

            //  获取分销等级列表
            getLevelRule() {
                Distribution.getLevelRule({}).then((res) => {
                    let levelCodesList = this.$store.state.distribution.levelCodesList;
                    if (!!res && res.length > 0) {
                        this.levelCodesList = levelCodesList[res[0].levelCode]
                    } else {
                        this.levelCodesList = levelCodesList['D_MATRULELEVEL01']
                    }
                    console.log(this.levelCodesList,"--------")
                })
            },

            //  获取分销商下级对账单
            async getList() {
//                this.loading = true
                let data = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    id: await this.$store.dispatch('distribution/getDistributionId'),
                    nickName: this.name,
                    dateStart: this.timeStart || this.dateStart,
                    dateEnd: this.timeEnd || this.dateEnd,
                    level: this.levelCodes
                }
                Distribution.getBillList(data).then((res) => {
                    global.toastLoading(false);// 关闭
                    wx.stopPullDownRefresh();
                    this.billList.push.apply(this.billList, res.list)
                    this.totalVip = !!res.totalVip ? res.totalVip : 0
                    this.consumer = !!res.consumeTotalVip ? res.consumeTotalVip : 0
                    if (this.billList.length >= res.total || res.total <= 0) {
                        this.finished = true
                    } else {
                        this.finished = false
                    }
                }, (err) => {
                    this.loading = false
                    this.isLoading = false
                }).then(() => {
                    this.loading = false
                    this.isLoading = false
                })
            },

            //  获取分销商次级对账单信息
            async getBillInfo() {
                let data = {
                    id: await this.$store.dispatch('distribution/getDistributionId'),
                }
                Distribution.getSecondaryBillInfo(data).then((res) => {
                    if (!!res) this.billInfo = res
                })
            },

            //  切换tab标签
            tabHandle(index) {
                if (this.activeIndex === index) return
                this.activeIndex = index
            },

            //  显示时间选择
            showPopup(activeTime) {
                let dateStartStamp = this.dateStart.getTime()
                let dateEndStamp = this.dateEnd.getTime()
                this.timeType = activeTime
                //  选择起始时间的弹窗最小截止时间为3月1日，选择结束时间的弹窗最小截止时间为起始时间，选择结束时间的弹窗最大截止时间为当前时间
                if (activeTime === 'dateStart') {
                    this.minDate = new Date(2019, 2, 1, 0, 0, 0).getTime()
                    this.maxDate = dateEndStamp
                    this.currentDate = dateStartStamp;
                } else if (activeTime === 'dateEnd') {
                    this.minDate = dateStartStamp
                    this.maxDate = new Date().getTime()
                    this.currentDate = dateEndStamp;
                }
                setTimeout(()=>{
                    this.isShowPopup = true
                },200)
            },
            // 日期值改变事件
            onDateInput(e){
                this.currentDate = e.mp.detail;
            },
            //  选择时间
            selectTime(value) {
                console.log("修改选中start和end的时间")
                this[this.timeType] = new Date(value.mp.detail);
                this.isShowPopup = false
            },

            //  下拉刷新
            onRefresh() {
                this.statusInit()
                this.getList()
            },

            //  上拉加载更多
            loadMore() {
                if (!!this.finished) {
                    Toast('没有更多了~')
                    return
                } else {
                    setTimeout(() => {
                        this.pageNum += 1
                        this.getList()
                    }, 100)
                }
            },

            //  状态初始化
            statusInit() {
                this.pageNum = 1
                this.billList = []
                this.finished = true
                this.loading = false
            },

            // 导出邮箱
            async sendEmail() {
                if (!!this.btnLock) return
                this.btnLock = true
                if (!global.isEmail(this.email)) {
                    Toast('输入的邮箱号不正确')
                    this.btnLock = false
                    return
                } else {
                    let data = {
                        id: await this.$store.dispatch('distribution/getDistributionId'),
                        addressee: this.email
                    }
                    Distribution.sendEmail(data).then((res) => {
                        console.log(res)
                        if (res === true || res === 'true') {
                            Toast('邮件已发送，请您在相应邮箱中查收~')
                        } else {
                            Toast('发送失败了~请重试~')
                        }
                    }, (err) => {
                        Toast(err.errorMsg)
                        this.btnLock = false
                    }).then(() => {
                        this.btnLock = false
                    })
                }
            },

            //  选择查询对账单明细等级
            choseLevel(item) {
                item = item.mp.detail;
                this.levelName = item.name
                this.levelCodes = item.code
                this.showLevel = false
            },

            //  监听软键盘搜索的事件
            searchHandel(event){
                console.log(this.name,event)
                if (event.keyCode == 13) {
                    event.preventDefault(); //禁止默认事件（默认是换行）
                    this.name = event.target.value;
                    this.onRefresh();
                }
            },
        },
        computed: {
            //  用于显示的起始时间
            timeStart: function () {
                let time = global.formatTime(this.dateStart)
                return time.substring(0, 10)
            },
            //  用于显示的结束时间
            timeEnd: function () {
                let time = global.formatTime(this.dateEnd)
                return time.substring(0, 10)
            },
            //  订单总金额
            orderAmount: function () {
                let amount = 0
                if (this.billList.length > 0) amount = this.billList[0].totalAmountOrd
                return amount
            },
            //  总分润金额
            interestAmount: function () {
                let amount = 0
                if (this.billList.length > 0) amount = this.billList[0].totalInAmt
                return amount
            }/* ,
            totalVip: function () {
                let totalVip = 0
                if(this.billList.length >0) totalVip = this.billList[0].totalVip
                return totalVip
            } */
        },
        onLoad() {
            global.toastLoading();// 开启

            this.timeInit()
            this.getBillInfo()
            this.getList()
            this.getLevelRule()
        },
        onUnload(){
            Object.assign(this.$data, this.$options.data());// 解决重复进页面数据未初始化
        },
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/scss" lang="scss">
    .van-cell{
        background-color: transparent;
        padding: 8rpx 0 0 0;
    }
    .bill-info {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        min-height: 100%;
        background: $color-white;
        .bill-tab {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            display: flex;
            width: 100%;
            height: computed(88);
            position: fixed;
            top: 0;
            left: 0;
            background: $color-background;
            z-index: 9;
            align-items: center;
            .tab-item {
                flex: 1;
                text-align: center;
                font-size: $font-regular;
                line-height: computed(88);
                color: $text-regular;
                position: relative;
                &.active {
                    color: $text-primary;
                    font-weight: bold;
                    &::after {
                        content: '';
                        width: computed(100);
                        height: computed(4);
                        position: absolute;
                        bottom: computed(4);
                        left: 50%;
                        transform: translateX(-50%);
                        background: $text-primary;
                        animation: line-animation 0.3s forwards;
                    }
                }
            }
        }
        .bill-list-box {
            flex: 1;
            box-sizing: border-box;
            position: relative;
            padding-top: computed(500);
            display: flex;
            flex-direction: column;
            .condition-box {
                box-sizing: border-box;
                position: fixed;
                width: 100%;
                top: 0;
                left: 0;
                z-index: 9;
                background: $color-white;
                input[type="search"]::-webkit-search-cancel-button {
                    display: none !important;
                }
                .search-name {
                    box-sizing: border-box;
                    display: block;
                    width: auto;
                    height: computed(58);
                    margin-top: computed(30);
                    padding: 0 computed(24);
                    background: $color-background;
                    font-size: $font-common;
                    line-height: computed(58);
                    color: $text-primary;
                    &::placeholder {
                        color: $text-placeholder;
                    }
                }
                .time-box {
                    margin-top: computed(20);
                    height: computed(58);
                    overflow: hidden;
                    position: relative;
                    font-size: $font-common;
                    line-height: computed(58);
                    color: $text-primary;
                    span {
                        font-weight: bold;
                        margin-right: computed(10);
                    }
                    .iconxuanzexiao {
                        display: inline-block;
                        transform: rotate(90deg);
                    }
                    .search-btn {
                        box-sizing: border-box;
                        position: absolute;
                        right: 0;
                        top: computed(4);
                        width: computed(132);
                        height: computed(50);
                        background: $color-white;
                        color: $color-red;
                        line-height: computed(50);
                        text-align: center;
                        -webkit-border-radius: computed(5);
                        -moz-border-radius: computed(5);
                        border-radius: computed(50);
                        border: solid 1px $color-red;
                    }
                }
                .member-level {
                    margin-top: computed(30);
                    overflow: hidden;
                    font-size: $font-regular;
                    line-height: computed(30);
                    color: $text-primary;
                    .iconxuanzexiao {
                        display: inline-block;
                        transform: rotate(90deg);
                    }
                }
                .fund-box {
                    overflow: hidden;
                    .fund-item {
                        height: computed(30);
                        margin-top: computed(30);
                        overflow: hidden;
                        font-size: $font-regular;
                        line-height: computed(30);
                        color: $text-primary;
                        position: relative;
                        P {
                            color: $text-regular;
                            span {
                                color: $text-primary;
                                font-weight: bold;
                            }
                        }
                        .fund-btn {
                            font-size: $font-regular;
                            line-height: computed(30);
                            text-decoration: underline;
                            color: $text-primary;
                            .iconfont {
                                color: $text-placeholder;
                            }
                        }
                    }
                }
            }
            .bill-list {
                position: relative;
                display: flex;
                flex: 1;
                flex-direction: column;
            }
            .bill-content {
                box-sizing: border-box;
                display: flex;
                min-height: computed(88);
                padding: computed(5) 0;
                &:nth-of-type(2n) {
                    background: $color-background;
                }
                .bill-item {
                    box-sizing: border-box;
                    flex: 1;
                    display: flex;
                    padding: 0 computed(5);
                    align-items: center;
                    justify-content: center;
                    font-size: $font-common;
                    color: $text-regular;
                    line-height: computed(30);
                    text-align: center;
                    word-break: break-all;
                    &.already {
                        color: $domaincolor;
                    }
                    &.time {
                        font-size: $font-small;
                        line-height: computed(24);
                    }
                }
                &.bill-title {
                    margin-top: computed(30);
                    height: computed(60);
                    min-height: computed(60);
                    border-top: solid 1px $text-placeholder;
                    background: $color-background;
                    .bill-item {
                        flex: 1;
                        color: $text-primary;
                    }
                }
            }
        }
        .secondary-bill {
            box-sizing: border-box;
            padding: computed(30);
            position: relative;
            overflow: hidden;
            .secondary-bill-list {
                display: flex;
                .bill-item {
                    flex: 1;
                    box-sizing: border-box;
                    height: computed(88);
                    border: solid 1px $text-placeholder;
                    font-size: $font-regular;
                    line-height: computed(88);
                    text-align: center;
                    color: $text-regular;
                    &:nth-of-type(2) {
                        border-left: none;
                        border-right: none;
                    }
                }
                &.bg-gray {
                    .bill-item {
                        border-bottom: none;
                        color: $text-primary;
                    }
                }
            }
        }
        .fund-empty {
            display: flex;
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
