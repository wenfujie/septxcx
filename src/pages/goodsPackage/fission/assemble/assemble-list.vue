/*
* createTime：2019/9/23
* author：junyong.hong
* description: 拼团
*/
<template>
    <div class="assemble-list">
        <!-- 头部标签 -->
        <tabs-comp :tabList="tabList" :tabActive.sync="tabActive" @tabClick="tabClick" :isFinish.sync="isLoadding"></tabs-comp>

        <!-- 内容 -->
        <div class="container">
            <fission-list-comp v-if="isLoadding" :goodsList="goodsList" :fissionType="2"></fission-list-comp>
        </div>

        <van-toast id="van-toast"/>
    </div>
</template>
<script>
    import TabsComp from '@/pages/goodsPackage/fission/components/Tabs.vue';
    import FissionListComp from '@/pages/goodsPackage/fission/components/FissionList.vue';
    import { Fission } from "../../../../api/service";
    import Toast from 'vant-weapp/dist/toast/toast';

    export default {
        config: {
            navigationBarTitleText: '拼团'
        },
        components: {
            TabsComp,
            FissionListComp
        },
        data() {
            return {
                tabActive: 0,
                tabList: [
                    {
                        tabType: 0,
                        nameEn: "PROCE",
                        nameCn: "进行中"
                    },
                    {
                        tabType: 1,
                        nameEn: "READY",
                        nameCn: "即将开始"
                    }
                ],
                goodsList: [],
                isLoadding: false
            }
        },
        onLoad() {
            this._initData()
        },
        methods: {
            _initData () {
                this._findGrpartList()
            },
            /**
             * 获取拼团列表
             */
            _findGrpartList () {
                this.isLoadding = false
                this.goodsList = []
                let statusCode = this.tabList[this.tabActive].nameEn

                let params = {
                    shopId: global.Storage.get("properties").shopId,
                    busContsCode: global.Storage.get("properties").busContsCode,
                    companyId: global.Storage.get("properties").companyId,
                    vipInfoHdId: global.Storage.get("USER_INFO").vipInfoId,
                    statusCode: statusCode  // PROCE进行中 READY即将开始
                }
                Fission.findGrpartList(params).then(async (res) => {
                    if (res.length) {
                        let currentTime = await this.getServerDate()

                        for (let i = 0; i < res.length; i++) {
                            let item = res[i]

                            let progressTitle = `已有${item.clustNum}人参团`     // 默认参团人数
                            let status = 'groupFn'                              // 默认未参团
                            let func = this.groupFn                             // 触发未参团方法
                            let time = ''

                            if (statusCode === 'PROCE') {                       // 进行中
                                time = global.c_getDateStamp(item.beginTime) + (item.times * 60 * 1000 * 60)
                                if (item.qty === item.clustNum && item.payNo === 1) {
                                    progressTitle = '已售罄'
                                    status = 'unStockAndhasGroupFn'
                                    func = this.unStockAndhasGroupFn
                                } else if (item.qty === item.clustNum) {               // 已售罄
                                    progressTitle = '已售罄'
                                    status = 'unStockFn'
                                    func = this.unStockFn
                                } else if (item.payNo === 1) {                  // 已参团（已付款）
                                    status = 'hasGroupFn'
                                    func = this.hasGroupFn
                                } else if (item.payNo === 0) {                  // 已参团（未付款）
                                    status = 'payforFn'
                                    func = this.payforFn
                                }
                            } else if (statusCode === 'READY') {                // 即将开始
                                time = global.c_getDateStamp(item.beginTime)
                                let selfTime = global.c_getDateStamp(item.beginTime) + (48*60*1000*60)
                                // 上架时间距离当前时间≤48小时
                                if (selfTime <= currentTime) {
                                    if (i + 1 === res.length) {
                                        this.isLoadding = true
                                    }
                                    continue
                                }

                                progressTitle = '待开始'
                                status = 'waitStartFn'
                                func = this.waitStartFn
                            }

                            this.goodsList.push({
                                goodsCode: item.ptiPartHdCode,
                                img: item.glbFileUrl || '',
                                title: item.ptiPartHdName,
                                progressTitle: progressTitle,
                                people: item.qty,
                                joinPeople: item.clustNum,
                                delPrice: item.oldPrice,
                                salePrice: item.price,
                                time: time,
                                status: status,
                                func: func,
                                id: item.id,
                                onlineHdId: item.onlineHdId,
                                currentTime: currentTime,
                                surpNum: item.surpNum,
                                billCode: item.billCode
                            })

                            if (i + 1 === res.length) {
                                this.isLoadding = true
                            }
                        }
                    } else {
                        this.isLoadding = true
                    }
                }, (err) => {
                    this.isLoadding = true
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
            /**
             * tab切换
             * @param item 当前对象
             * @param index 索引
             */
            tabClick(item, index) {
                this._findGrpartList()
            },
            /**
             * 已参团（已付款）
             * @param item 当前对象
             * @param index　索引
             */
            hasGroupFn(item, index) {
                Toast('每个用户限购1件')
            },
            /**
             * 已参团（未付款）
             * @param item 当前对象
             * @param index　索引
             */
            payforFn(item, index) {
                this.navigate(item)
            },
            /**
             * 参团
             * @param item　当前对象
             * @param index　索引
             */
            groupFn(item, index) {
                if (item.surpNum === 0 && item.joinPeople < item.people) {
                    Toast('有用户下单还未支付，等等再来')
                    return
                }

                this.navigate(item)
            },
            /**
             * 售罄
             * @param item　当前对象
             * @param index　索引
             */
            unStockFn(item, index) {
                Toast('该商品已售罄')
            },
            unStockAndhasGroupFn(item, index) {
                this.navigate(item)
            },
            /**
             * 待开始
             * @param item 当前对象
             * @param index 索引
             */
            waitStartFn(item, index) {
                this.navigate(item)
            },
            /**
             * 路由导航
             * @param item
             */
            navigate(item) {
                let url = ''
                if (item.billCode) {
                    url = `/pages/goodsPackage/fission/assemble/assemble-record`
                } else {
                    url = `/pages/goodsPackage/wares/wares-detail?goodsCode=${item.goodsCode}&dttGrpartId=${item.id}&onlineHdId=${item.onlineHdId}&fissionType=2`
                }

                this.$router.push(url);
            },
        }
    }
</script>
<style lang="scss" type="text/scss" scoped>
    .assemble-list{
        position: relative;
        background-color: $bg-gray-fission;
        .container{
            position: absolute;
            top: computed(85);
            width: 100%;
        }
    }
</style>
