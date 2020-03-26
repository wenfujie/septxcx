/*
 * @Author: yongtian.hong
 * @Date: 2018-08-13 13:43:18
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-15 22:05:02
 * @Description: 物流信息组件
 */
 <style lang='scss'>
.logis-wrap {
    width: 100%;
    background: #fff;
    margin-bottom: computed(30);
    box-sizing: border-box;
    background: whitesmoke;

    .logis-info-wrap {
        padding: computed(20) computed(30);
        margin-bottom: computed(30);
        background: #fff;
        .title {
            font-size: computed(30);
            font-weight: bold;
            background: #fff;
        }
        .group {
            margin: computed(20) 0;
            .cell {
                display: flex;
                font-size: computed(24);
                margin-bottom: computed(20);
                .left {
                    display: flex;
                    align-items: center;
                    min-width: 20%;
                    max-width: 30%;
                    color: #999999;
                }
                .right {
                    flex: 1;
                    display: flex;
                    word-break: break-all;
                }
            }
            .tips {
                font-size: computed(20);
                color: #999999;
                font-weight: normal;
                white-space: wrap;
            }
        }
    }
    // 收货地址
    .adress-block {
        display: flex;
        flex-direction: column;
        padding: computed(20) computed(30);
        margin-bottom: computed(20);
        background: #fff;
        .title {
            font-size: computed(30);
            font-weight: bold;
            margin-bottom: computed(20);
        }
        .content {
            display: flex;
            justify-content: space-between;
            .left {
                flex: 1;
                display: flex;
                flex-direction: column;
                &-top-box,
                &-bottom-box {
                    display: flex;
                    margin-bottom: computed(20);
                }
                &-top-box {
                    display: flex;
                    flex-wrap: wrap;
                    font-size: computed(30);
                    color: #333333;
                    font-weight: Medium;
                    word-break: break-all;
                    &-left {
                        width: 20%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    &-right {
                        flex: 1;
                    }
                }
                &-bottom-box {
                    display: flex;
                    font-size: computed(24);
                    color: #333333;
                    font-weight: Medium;
                    &-left {
                        display: flex;
                        align-items: center;
                        width: 20%;
                        // word-break: break-all;
                        .isDefault {
                            width: computed(60);
                            height: computed(30);
                            line-height: computed(30);
                            text-align: center;
                            color: $domaincolor;
                            border: 1px solid $domaincolor;
                            border-radius: computed(15);
                        }
                    }
                    &-middle {
                        flex: 1;
                        word-break: break-all;
                        // padding-left: computed(20);
                    }
                    &-right {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 10%;
                    }
                }
            }
        }

        .addrNoexist {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            font-size: computed(50);
            padding: computed(20) 0;
            color: #999999;
            .tip {
                font-size: computed(20);
            }
        }
    }
    .bg-grey {
        background: whitesmoke;
    }
    .word-break {
        word-break: break-all;
    }
}
.selected {
    color: #2ba4f3;
    padding-bottom: computed(5) !important;
    border-bottom: solid 2px #2ba4f3;
}
.input-box {
    height: computed(70);
    input {
        outline: 0;
        border: 0;
        input::placeholder {
            color: #cccccc;
        }
    }
}
</style>

 <template>
    <div class="logis-wrap" v-if="renderSelf">
        <div class="logis-info-wrap box-shadow">
            <div class="title">{{title }}</div>
            <!-- 快递寄回填写-->
            <div class="group" v-if="!data.expressCode">
                <div class="cell">
                    <div class="left">收货人 :</div>
                    <div class="right flex-between">
                        <div class="name">{{ data.expressRecipient }}</div>
                        <div class="phone">{{ phone }}</div>
                    </div>
                </div>
                <div class="cell">
                    <div class="left">收货地址 :</div>
                    <div class="right">{{ data.changeShopAddress }}</div>
                </div>
                <div class="cell">
                    <div class="left">快递单号</div>
                    <div class="right">
                        <custom-field v-model="kdInfo.expressNo" placeholder="请填写快递单号" />
                    </div>
                </div>
                <div class="cell">
                    <div class="left">物流公司</div>
                    <div class="right bg-grey" @click="selectLogis()">
                        <div class="pdLr20 pdTb20">{{ logis.shippingName || "请选择物流公司" }}</div>
                        <i class="iconfont icon-youfan grey99"></i>
                    </div>
                </div>
                <div class="tips">
                    <div class="mgB10">
                        退货说明：
                        退货商品需要符合以下要求：
                        保持吊牌完整（有防伪标签的需确保防伪标签未撕开），衣服未穿着洗涤过，不影响二次销售（注意：内裤和袜子不支持退货）
                    </div>
                    <div>
                        温馨提示：
                        收到包裹先检查下外包装是否完整，拆包后不要急于剪掉吊牌，试穿确认合适后再拆掉吊牌洗涤，避免影响二次销售。退货地址可联系工作人员获取，退货物流不支持顺丰、平邮和到付件。
                    </div>
                </div>
            </div>
            <!-- 快递信息回显 -->
            <div class="mgTb20 fs28" v-else>
                <div class="mgB10">快递寄回</div>
                <div class="flex-box mgB10">
                    <div class="mgR10">物流公司:</div>
                    <div class="flex-auto">{{ data.shipPingName }}</div>
                </div>
                <div class="flex-box mgB10">
                    <div class="mgR10">快递单号:</div>
                    <div class="flex-auto word-break">{{ data.expressCode }}</div>
                </div>
            </div>
        </div>
        <!-- 我的收货地址显示/选择 -->
        <div class="adress-block box-shadow" @click="selectAddr()">
            <div class="title">收货地址</div>
            <div class="addrExist" v-if="addrInfo.address">
                <div class="content">
                    <div class="left">
                        <div class="left-top-box">
                            <div class="left-top-box-left">{{ addrInfo.cargousrName }}</div>
                            <div class="left-top-box-right">{{ addrInfo.cargoMobile }}</div>
                        </div>
                        <div class="left-bottom-box">
                            <div class="left-bottom-box-left" v-if="addrInfo.isDefault">
                                <div class="isDefault">默认</div>
                            </div>
                            <div class="left-bottom-box-middle">{{ addrInfo.address }}</div>
                            <div class="left-bottom-box-right" v-if="!data.reciveWayCode">
                                <van-icon name="arrow"></van-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="addrNoexist" v-else>
                <van-icon name="location"></van-icon>
                <span class="tip">请新增地址</span>
            </div>
        </div>
    </div>
</template>

 <script>
import { getAddrList } from "@/api/service/user-service";
import check from "@/utils/check";
import ordStateMap from "../../../../common/stateCodeMap";
import customField from "./customField";
export default {
    props: {
        data: {},
        //选中的地区列表
        area: {},
        //选中的门店
        store: {},
        // 选中的物流
        logis: {},
        // 退回方式切换
        switchBackMode: {
            type: Function
        },
        // 控制门店,物流，省市区弹窗显示
        showLogisList: false,
        showStoreList: false,
        showAreaList: false
    },
    data() {
        return {
            userInfo: {},
            logisic: {
                shippingWayCode: "kdps", //快递配送方式
                expressCode: "", //快递运营商代码编号，如YTO(圆通)
                expressNo: "" //快递单号
            },
            state: {
                type: Boolean, //true:快递寄回，false:退回门店
                default: true
            },
            title: "",
            //快递寄回
            // kdInfo: {
            //     expressNo: "",
            //     company: ""
            // },
            // 退回门店
            mdInfo: {
                name: "",
                phone: "",
                area: {}, //地区
                store: {} //门店
            },
            renderSelf: false, //控制组件自身是否渲染
            showMdAddr: false, //显示(选择后的)门店地址
            repairedFinish: false, //显示维修完成商家发出
            showlayer: false,
            ordStateMap: ordStateMap,
            selectedArea: "",
            selectedStore: ""
        };
    },
    methods: {
        // 渲染控制
        renderContrl(ordState, returnType) {
            // 在下面这些售后单状态下，组件自身不渲染
            const noRenderCase = [
                "待审核",
                "待支付",
                "已取消",
                "已关闭",
                "已拒绝"
            ];
            // 在下面这些售后单状态下,组件渲染填写提交节点
            const renderFillCase = ["待寄回"];
            // 返修单在下面这些售后单状态下,组件渲染物流进度内容
            const repairedFinishCase = ["维修完成", "已完成"];
            if (noRenderCase.includes(ordState)) {
                this.renderSelf = false;
            } else if (renderFillCase.includes(ordState)) {
                this.renderSelf = true;
            } else {
                // 除以上所有的售后单状态外,剩余都渲染
                this.afterFill();
                if (returnType != "返修") return;
                if (repairedFinishCase.includes(ordState)) {
                    this.repairedFinish = true;
                }
            }
        },
        initState() {
            // this.noRenderSelf();
            // 售后单状态
            const ordState = this.ordStateMap[this.data.applyStatusCode];
            // 售后单类型
            const returnType = this.data.returnTypeName;
            // 组件渲染控制
            this.renderContrl(ordState, returnType);

            switch (returnType) {
                case "换货":
                    this.title = "换货物流";
                    break;
                case "返修":
                    this.title = "返修物流";
                    //物流初始化
                    this.logisic.expressNo = this.data.returnShipCode;
                    this.logisic.expressCode = this.data.returnShippingCode;
                    break;
                case "退货退款":
                    this.title = "退货物流";
                    break;
                default:
                    this.title = null;
                    this.renderSelf = false;
            }
        },
        //填写物流前
        beforFill() {
            this.renderSelf = true;
        },
        // 填写物流后
        afterFill() {
            this.renderSelf = true;
            if (!this.data.shipPingCode) {
                this.showMdAddr = false;
            }
        },
        // 组件不渲染自身
        noRenderSelf() {
            this.renderSelf = false;
        },
        // 初始化地址
        async initAddr() {
            // 用户选择完地址可以
            const ordStatusName = this.ordStateMap[this.data.applyStatusCode];
            if (ordStatusName === "待寄回") {
                // 判断地址是否空,则拉取接口数据
                if (!this.addrInfo.address) {
                    let params = {
                        vipUsrId: global.Storage.get("USER_INFO").usrId
                    };
                    let defaultAddr = await getAddrList(params).then(list => {
                        let defaultAddress =
                            list.filter(item => {
                                if (item.defaultFlag == 1) return item;
                            })[0] || list[0];

                        return Object.assign(defaultAddress || {}, {
                            isDefault:
                                defaultAddress && !!defaultAddress.defaultFlag
                        });
                    });
                    let address = defaultAddr || addressInfo;
                    this.$store.commit("afterSale/detail/saveAddress", address);
                }
            } else {
                // 非待寄回状态直接取售后详情接口返回的地址数据
                if (!this.data.addressInfo) return;
                this.addrInfo.cargousrName = this.data.addressInfo.cargousrname;
                this.addrInfo.cargoMobile = this.data.addressInfo.cargomobile;
                this.addrInfo.address = this.data.addressInfo.cargoaddress;
            }
        },
        // 切换快递寄回与退回门店
        select(code) {
            this.state = !this.state;
            this.switchBackMode(code);
            if (this.state) {
                this.mdInfo.name = null;
                this.mdInfo.phone = null;
            } else {
                this.$store.commit("afterSale/detail/clearKdInfo");
                this.kdInfo.expressNo = null;
            }
        },
        // 选择物流公司
        selectLogis() {
            this.showlayer = true;
            this.$parent.showLogisList = true;
        },
        //选择地区
        selectArea() {
            this.showlayer = true;
            this.$emit("update:showAreaList", this.showlayer);
        },
        // 选择门店
        selectShop() {
            if (this.area.length === 0) {
                Toast("请先选择门店所在地区");
            } else if (check.isEmpty(this.$parent.storeList)) {
                Toast("您所在地区无线下门店");
            } else {
                this.showlayer = true;
                this.$emit("update:showStoreList", this.showlayer);
            }
        },
        //选择地址
        selectAddr() {
            if (!this.data.reciveWayCode) {
                this.$router.push({
                    path: "/pages/UserPackage/address/address-list",
                    query: {
                        fromPage: "postSale",
                        reapplycode: this.$route.query.reapplycode,
                        addressId: this.addrInfo.id,
                        showList: 2
                    }
                });
            }
        },
        // 保留用户信息（失焦时触发）
        saveUsrInfo() {
            global.Storage.set("usrinfo", this.mdInfo);
        }
    },
    components: {
        customField
        // logis,
        // "van-field": Field,
        // "van-icon": Icon
    },
    computed: {
        // selectedStoreAddr: function() {
        //     // let addr =
        //     //     this.store.provinceName +
        //     //     this.store.cityName +
        //     //     this.store.districtName +
        //     //     this.store.address;
        //     // return addr;
        // },
        phone: function() {
            if (!check.isEmpty(this.data.expressPhone)) {
                return this.data.expressPhone;
            } else if (!check.isEmpty(this.data.expressMobile)) {
                return this.data.expressMobile;
            }
            return null;
        },
        kdInfo: {
            get() {
                return this.$store.state.afterSale.detail.kdInfo;
            },
            set() {
                // 使用vuex中的mutations中定义好的方法来改变
                this.$store.commit(
                    "afterSale/detail/updateKdInfo",
                    this.kdInfo
                );
            }
        },
        addrInfo: function() {
            return this.$store.state.afterSale.detail.address;
        }
        // addrInfo: {
        //     get() {
        //         return this.$store.state.afterSale.detail.address
        //     },
        //     set() {
        //         // 使用vuex中的mutations中定义好的方法来改变
        //         this.$store.commit('afterSale/detail/updateKdInfo', this.addrInfo)
        //     }
        // }
    },
    watch: {
        // area: function(list) {
        //     this.selectedArea = "";
        //     list.forEach((element, index) => {
        //         if (index < 2) {
        //             this.selectedArea += element.name + "-";
        //         } else {
        //             this.selectedArea += element.name;
        //         }
        //     });
        // },
        // store: function(obj) {
        //     // 判断门店选择时，如果选中门店且地区也存在,显示门店地址
        //     if (!check.isEmpty(obj)) {
        //         this.showMdAddr = true;
        //     } else {
        //         this.showMdAddr = false;
        //     }
        // },

        data: {
            handler() {
                this.initState();
                this.initAddr();
            },
            deep: true
        }
    },
    onUnload() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    }
};
</script>
