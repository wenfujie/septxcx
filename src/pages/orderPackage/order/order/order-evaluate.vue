/*
* @Author: zhibin.zhao
* @Date: 2018-10-17 15:41:10
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-17 18:00:05
* @Description: 订单商品评价页面
*/
<template>
    <div class="flex-vbox wh100 bg-gray">
        <wxs module="filter" src="../../../../filter/filterCommon.wxs"></wxs>
        <div class="flex-auto support-ele">
            <div v-for="(item, index) in goodsList" :key="index" class="pd30 mgB30 bg-white">
                <!-- 衣服+评价 -->
                <div class>
                    <div class="product clearfix">
                        <div class="imgBox" :class="{'cusTag':item.orderFlag===1}">
                            <img :src="filter.imgFilter(item.thumb,company_id)" lazy-load="true" />
                        </div>
                        <div class="details">
                            <div class="goodsName">{{item.goodsName}}</div>
                            <div
                                class="sku"
                            >尺码: {{item.sizeName}}&nbsp;&nbsp;&nbsp;&nbsp;颜色: {{item.colorName}}</div>
                        </div>
                    </div>
                    <!--  -->
                    <div class="rateClass">
                        <!-- 商品评价 -->
                        <div class="mgB10">
                            <div class="pdL10 fs28B mgB10 rates">评分</div>
                            <div class="flex-box">
                                <van-rate
                                    :value="item.commentScore"
                                    :size="20"
                                    :count="5"
                                    color="#F5BE4D"
                                    void-color="#ccc"
                                    :data-index="index"
                                    data-position="commentScore"
                                    @change="rateChange"
                                />
                                <span
                                    class="fs28"
                                >&nbsp;&nbsp;{{commentScoreDesc[item.commentScore]}}</span>
                            </div>
                        </div>
                        <!-- 着装师评价 -->
                        <div v-if="item.orderFlag==1">
                            <div class="pdL10 fs28B mgB10">着装师评价</div>
                            <div class="flex-box">
                                <van-rate
                                    :value="item.msrCommentScore"
                                    :size="20"
                                    :count="5"
                                    color="#F5BE4D"
                                    void-color="#ccc"
                                    :data-index="index"
                                    data-position="msrCommentScore"
                                    @change="rateChange"
                                />
                                <span
                                    class="fs28"
                                >&nbsp;&nbsp;{{msrCommentScoreDesc[item.msrCommentScore]}}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 评价输入 -->
                <div class="w100 mgT30 textarea">
                    <!-- <div class="placeHolder" v-if="(focusIndex!=index)&&(item.reasonMemo==''||item.reasonMemo==null||item.reasonMemo==undefined||item.reasonMemo.length==0)">说说值得推荐的理由吧~</div> -->
                    <textarea
                        name
                        id
                        cols="200"
                        rows="10"
                        maxlength="150"
                        :data-index="index"
                        v-model="item.reasonMemo"
                        @input="textareaInput"
                        placeholder="说说值得推荐的理由吧~"
                    ></textarea>
                    <!-- <textarea
                        cols="200"
                        maxlength="150"
                        placeholder="说说值得推荐的理由吧~"
                        v-model="item.reasonMemo"
                        @input="textInput"
                        :data-index="index"
                        fixed="true"
                    ></textarea>-->
                    <div class="flex-end">{{item.reasonMemo?item.reasonMemo.length:0}}/150</div>
                </div>
                <!-- <upload max=4 :srcs="srcs" :good="item" @imgChange="imgChange(arguments[0],index)"/> -->
                <upload
                    max="4"
                    :srcs="srcs"
                    :good="item"
                    :images.sync="goodsList[index].commentPictList"
                />
                <!-- <upload-file :good="item" :images.sync="goodsList[index].commentPictList"></upload-file> -->
            </div>
        </div>

        <cover-view class="com-foot-btn-cont" v-if="goodsList.length > 0">
            <cover-view class="com-foot-btn" @click="submitEvaluate">提交</cover-view>
        </cover-view>
        <!-- <cover-view class="com-foot-btn" @click="submitEvaluate">提交</cover-view> -->
        <!-- <div class="com-foot-btn-cont" v-if="goodsList.length > 0">
            <div class="com-foot-btn" @click="submitEvaluate">提交</div>
        </div>-->
        <!-- <van-toast id="van-toast" /> -->
    </div>
</template>

<script>
// import { Rate, Toast } from "vant";
// import Storage from "@/util/storage";
import { Order } from "@/api/service";
// import Toast from 'vant-weapp/dist/toast/toast';
import UpLoad from "@/components/UpLoad";
export default {
    name: "order-evaluate",
    config: {
        navigationBarTitleText: "订单商品评价"
    },
    data() {
        return {
            goodsList: [],
            commentScoreDesc: [
                "",
                "不合体",
                "不合体",
                "基本合体",
                "合体",
                "非常合体"
            ],
            msrCommentScoreDesc: [
                "",
                "不满意",
                "不满意",
                "一般",
                "满意",
                "非常满意"
            ],
            company_id: ""
        };
    },
    components: {
        // "van-rate": Rate,
        upload: UpLoad
    },
    onLoad() {
        this.company_id = global.Storage.get("COMPANYID").company_id;
        this.getGoodsInfo();
    },
    onUnload() {
        Object.assign(this.$data, this.$options.data());
    },
    methods: {
        //多文本框输入时触发
        textareaInput(e) {
            let index = e.mp.currentTarget.dataset.index;
            var goodsList = this.goodsList;
            goodsList[index].reasonMemo = e.mp.detail.value;
            this.goodsList = goodsList.slice(0, goodsList.length);
        },
        //选择图片后触发
        // imgChange(arg,index){
        //     // let goodsList=this.goodsList;
        //     // goodsList[index].commentPictList=arg
        //     // console.log(this.goodsList,'imgChange')
        //     // this.goodsList=goodsList.slice(0,goodsList.length)
        //     this.goodsList[index].commentPictList=arg
        // },
        // 更改评分触发
        rateChange(e) {
            let position = e.mp.currentTarget.dataset.position;
            let index = e.mp.currentTarget.dataset.index;
            var goodsList = this.goodsList;
            goodsList[index][position] = e.mp.detail;
            this.goodsList = goodsList.slice(0, goodsList.length);
        },
        getGoodsInfo() {
            let companyId = global.Storage.get("COMPANYID").company_id;
            // let userInfo = Storage.get('USER_INFO')
            let param = {
                busContsCode: global.baseConstant.busContsCode,
                usrId: "",
                companyId: companyId,
                ownCompanyId: companyId,
                billCode: this.$route.query.billCode
            };
            Order.getDetailInfo(param).then(res => {
                this.goodsList = this.getGoodsList(res.data.packages);
            });
        },

        submitEvaluate() {
            let root = this;
            let companyId = global.Storage.get("COMPANYID").company_id;
            let userInfo = global.Storage.get("USER_INFO");
            let param = {
                companyId: companyId,
                usrId: userInfo.usrId,
                model: {
                    anonymousFlag: 0, //1匿名
                    billCode: this.$route.query.billCode,
                    buscontsCode: global.baseConstant.busContsCode,
                    shopCode: userInfo.shopCode,
                    usrId: userInfo.usrId
                }
            };
            let object = this.getEvaluate();
            if (object.flag == 1) {
                root.myToast("商品评分是必填项哦~");
                return;
            } else if (object.flag == 2) {
                root.myToast("量体师评分是必填项哦~");
                return;
            }
            param.model.goodsCommentList = object.goodsCommentList;
            // console.log("评价提交参数", param)
            Order.ordComment(param).then(res => {
                root.myToast("评价成功");
                //返回订单列表
                setTimeout(function() {
                    root.$router.replace({
                        path: "/pages/orderPackage/order/orderList/order-list"
                    });
                }, 2000);
            });
        },
        getEvaluate() {
            let goodsCommentList = [];
            let flag = 0;
            this.goodsList.forEach(function(item, index) {
                goodsCommentList.push({
                    commentMemo: item.reasonMemo, //备注
                    commentScore: item.commentScore, //商品评分
                    commentTypeCode: "D_MASPART", //D_MSR 量体师评价，D_MASPART商品评价
                    goodsCode: item.goodsCode,
                    rtlOrdDtId: item.saleOrdDtId, //订单明细ID，没件商品标识
                    commentPictList: item.commentPictList // 商品评价图片
                });
                if (!item.commentScore) flag = 1;
                if (item.orderFlag == 1) {
                    goodsCommentList[index].msrCommentScore =
                        item.msrCommentScore; //量体师评分
                    if (!item.msrCommentScore) flag = 2;
                }
            });
            return { flag: flag, goodsCommentList: goodsCommentList };
        },
        //采用小程序原生，因为textarea的穿透问题
        myToast(msg) {
            wx.showToast({
                title: msg,
                icon: "none",
                duration: 2200
            });
        },
        getGoodsList(packages) {
            let productList = [];
            packages.forEach(item => {
                productList = productList.concat(item.data.goodsList);
            });
            return productList;
        }
    }
};
</script>
<style lang="scss" scoped>
.product {
    width: 100%;
    box-shadow: 0px 4px 12px 0px #e6e6e6;
    padding: computed(30) 0;
    .details {
        width: computed(463);
        height: computed(160);
        font-size: computed(24);
        margin-left: computed(10);
        float: left;
        position: relative;
        .goodsName {
            color: #333333;
        }
        .sku {
            position: absolute;
            left: 0;
            bottom: 0;
            color: #999999;
        }
    }
}
.rateClass {
    margin-top: computed(30);
    .rates {
        float: left;
        margin-right: computed(40);
    }
}

.imgBox {
    width: computed(160);
    height: computed(160);
    float: left;
    img {
        width: 100%;
        height: 100%;
    }
}
.textarea {
    flex: 1;
    outline: 0;
    border: 0;
    color: #aaa;
    font-size: computed(28);
    // background: #f5f5f5;
    box-sizing: border-box;
    padding: computed(20);
    border: 1px solid #e6e6e6;
    position: relative;
    line-height: computed(40);

    .placeHolder {
        position: absolute;
        top: computed(20);
        left: computed(20);
        font-size: computed(28);
        line-height: computed(40);
        z-index: 1;
    }
}
textarea {
    position: relative;
    z-index: 2;
    width: 100%;
    outline: 0;
    border: 0;
    color: #aaa;
    min-height: computed(120);
    font-size: computed(28);
    background-color: transparent;
    line-height: computed(40);
    // background: #f5f5f5;
}
textarea::placeholder {
    font-weight: normal;
    font-family: "PingFang-SC-Medium";
    color: #cccccc;
    line-height: computed(40);
}
.btn-submit {
    height: computed(100);
    font-size: computed(32);
    color: #fff;
    background-color: #333333;
}
.wh100 {
    width: 100%;
    height: 100%;
}
.com-foot-btn-cont {
    background: $color-white;
    .com-foot-btn {
        background: #ff3636 !important;
        // background:linear-gradient(90deg, #FF3636, #FF632A) !important
    }
}

.support-ele {
    padding-bottom: computed(140);
}
</style>
