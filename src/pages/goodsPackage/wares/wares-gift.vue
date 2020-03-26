/*
* createTime：2019/3/14
* author：junyong.hong
* description: 赠品列表
*/
<template>
    <div class="gift">
        <wxs module="filter" src="../../../filter/filterCommon.wxs"></wxs>
        <div v-for="(item, index) in mzList" :key="index" class="gift-block">
            <p class="title">{{item.onlineName}}</p>
            <ul>
                <li v-for="(giftItem,giftIndex) in item.giftVoList" :key="giftIndex">
                    <img
                        :src="filter.imgFilter(giftItem.fileUrl,company_id, '148*148')"
                        :key="giftItem.fileUrl"
                    />
                    <div class="info">
                        <p>{{giftItem.ptiPartHdName}}</p>
                        <span>x {{giftItem.qty}}</span>
                    </div>
                </li>
            </ul>
        </div>
        <van-toast id="van-toast"/>
    </div>
</template>
<script>
import { Goods } from "../../../api/service";
import Toast from 'vant-weapp/dist/toast/toast';
export default {
    config: {
        navigationBarTitleText: '赠品列表',
    },
    components: {},
    data() {
        return {
            goodsId: "",
            mzList: [], // 满减、满折、赠品
            company_id:"",
        };
    },
    onShow() {
        this.company_id=global.Storage.get('COMPANYID').company_id
        this.goodsId = this.$route.query.goodsId;
        this.getGoodPreferential();
    },
    onUnload(){
        Object.assign(this.$data, this.$options.data())
    },
    methods: {
        // 满减、满折、赠品
        getGoodPreferential() {
            let data = {
                partId: this.goodsId,
                dptId: global.Storage.get("properties").shopId
            };
            global.showLoading({mask:true});
            Goods.getGoodPreferential(data).then(res => {
                this.mzList = res.mzList;
                global.hideLoading()
            },()=>{global.hideLoading()});
        }
    }
};
</script>
<style lang="scss" type="text/scss" scoped>
.gift {
    min-height: calc(100% - #{computed(60)});
    padding: computed(30);
    background-color: $color-light-gray;
    .gift-block {
        padding: computed(26) computed(30) computed(30);
        background-color: $color-white;
        box-shadow: 0 computed(4) computed(12) 0 rgba(0, 0, 0, 0.1);
        margin-bottom: computed(30);
        border-radius: computed(20);
        .title {
            font-size: $font-title1;
            font-weight: bold;
            color: $gradientcolor;
            padding-bottom: computed(26);
            border-bottom: 1px solid $color-gray-dashed;
        }
        ul {
            li {
                display: flex;
                flex-direction: row;
                padding-top: computed(24);

                img {
                    height: computed(148);
                    width: computed(148);
                    box-shadow: 0 computed(4) computed(12) 0 rgba(0, 0, 0, 0.1);
                    border-radius: computed(5);
                }
                .info {
                    position: relative;
                    flex: 1;
                    margin-left: computed(25);
                    font-size: $font-num;
                    color: $text-primary;
                    padding-top: computed(16);
                    span {
                        position: absolute;
                        bottom: computed(16);
                        font-size: $font-num;
                        color: $text-primary;
                    }
                }
            }
        }
    }
}
</style>
