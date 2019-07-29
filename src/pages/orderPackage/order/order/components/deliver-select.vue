<!--
 * @Author: yongtian.hong
 * @Date: 2018-12-18 18:36:50
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-07-11 17:24:26
 * @Description: 配送方式选择
 -->
<style lang="scss" type="text/scss" scoped>
.container {
    background: #fff;
    //  padding: computed(30);
    margin-bottom: computed(30);
    box-shadow: 0 computed(4) computed(12) 0 rgba(0, 0, 0, 0.1);
    .user-name {
        display: inline-block;
        width: computed(165);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .defaults {
        width: 27%;
    }
}
.title {
    padding: computed(37) computed(30) computed(30) computed(30);
    border-bottom: 1px dashed $color-gray-dashed;
    font-size: $font-h2;
    font-weight: bold;
    color: $text-primary;
    width: calc(100% - 60rpx);
}
.choose-adrress {
    width: 100%;
}
.active {
    border-bottom: solid computed(1) #000;
}
.inActive {
    color: #ccc;
    border-bottom: solid computed(1) #ccc;
}
.border1px {
    border-bottom: solid computed(1) #ccc;
}
.black-1A {
    color: #1a1a1a;
}
.info {
    font-size: $font-title1;
    color: $text-primary;
}
.address {
    div:nth-child(1) {
        span {
            width: computed(60);
            height: computed(30);
            line-height: computed(30);
            display: inline-block;
            font-size: $font-small;
            color: $domaincolor;
            border: 1px solid $domaincolor;
            border-radius: computed(15);
            text-align: center;
        }
    }
    div:nth-child(2) {
        font-size: $font-common;
        color: $text-regular;
    }
    > text {
        text-align: right;
        color: $text-gray-white;
    }
}
</style>

<template>
    <div class="container">
        <p class="title">配送信息</p>
        <!-- 头部tab -->
        <div v-if="!isDeliveryOne" class="flex-box h100px">
            <div
                class="flex-auto flex-center"
                :class="{'active':method==item.shipCode,'inActive':method!=item.shipCode}"
                @click="onReiceveWayChanged(item)"
                v-for="item in deliveryTypes"
                :key="item.id"
            >{{item.shipName}}</div>
        </div>
        <!-- 地址选择/信息填写 -->
        <div class="flex-vbox pd30 choose-adrress">
            <!-- 快递配送-->
            <div class="flex-box flex-auto w100 fs28" v-if="method=='kdps'" @click="onSelectAddr()">
                <div class="flex-between w100" v-if="addressMsg">
                    <div class="flex-vbox flex-auto">
                        <div class="flex-box info">
                            <span class="user-name">{{kdpsUsrName}}</span>
                            <span>{{kdpsPhone}}</span>
                        </div>
                        <div class="flex-box pdTb10 address">
                            <div class="defaults">
                                <span v-if="addressMsg.defaultFlag === 1">默认</span>
                            </div>
                            <div class="flex-auto overflow-two">{{kdpsaddress}}</div>
                            <text class="w20 iconfont iconxuanze"></text>
                        </div>
                    </div>
                    <div class="flex-center">
                        <text class="iconfont icon-gengduo"></text>
                    </div>
                </div>
                <div class="nAddress flex-center w100" v-if="!addressMsg">
                    <div class="flex-vbox flex-center h100px" @click="onSelectAddr()">
                        <text class="iconfont icon-daohang fs36"></text>
                        <p class="mgT20 fs24 black-1A">请添加收货地址</p>
                    </div>
                </div>
            </div>
            <!-- 门店自提 -->
            <div class="flex-auto w100 fs28" v-if="method=='mdzq'">
                <div class="flex-box pdTb10 border1px">
                    <div class="w25 flex-vcenter">取货人</div>
                    <div class="flex-auto">
                        <van-field
                            :value="storeForm.username"
                            placeholder="请输入您的姓名"
                            maxlength="12"
                            @blur="onBlur('name')"
                        />
                    </div>
                </div>
                <div class="flex-box pdTb10 border1px">
                    <div class="w25 flex-vcenter">联系方式</div>
                    <div class="flex-auto">
                        <van-field
                            :value="storeForm.phone"
                            placeholder="请输入您的联系方式"
                            maxlength="11"
                            @blur="onBlur('phone',storeForm.phone)"
                        />
                    </div>
                </div>
                <div class="flex-box pdTb10 border1px" @click="onSelectEvent('area')">
                    <div class="w25 flex-vcenter">取货地区</div>
                    <div class="flex-auto">
                        <van-field
                            :value="storeForm.region"
                            placeholder="请选择您的所在地区"
                            :readonly="true"
                        />
                    </div>
                    <div class="flex-center fs24">
                        <text class="iconfont icon-gengduo"></text>
                    </div>
                </div>
                <div class="flex-box pdTb10" @click="onSelectEvent('store')">
                    <div class="w25 flex-vcenter">取货门店</div>
                    <div class="flex-auto">
                        <van-field
                            :value="storeForm.storeName"
                            placeholder="请选择取货门店"
                            :readonly="true"
                        />
                    </div>
                    <div class="flex-center fs24">
                        <text class="iconfont icon-gengduo"></text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

 <script>
import { Base, Order, UserService } from "@/api/service";
import check from "@/utils/check";
import Toast from "vant-weapp/dist/toast/toast";
export default {
    props: {
        params: Object,
        Address: Array,
        Store: Object,
        areaList: Object,
        storeList: Array,
        showAreaList: Boolean,
        showStoreList: Boolean,
        isDeliveryOne: Boolean
    },
    components: {},
    data() {
        return {
            storeForm: {
                username: "", //取货人
                phone: "", //联系方式
                region: "", //地区
                storeName: "", //门店
                addressId: null, //地址Id,
                storeId: null
            },
            deliveryTypes: [], //配送方式
            addressMsg: null,
            transFee: 0,
            param: {
                kdps: {},
                mdzq: {}
            },
            shipWay: {
                shipCode: "",
                id: ""
            },
            method: "kdps" //默认配送方式
        };
    },
    methods: {
        //切换配送方式
        onReiceveWayChanged(item) {
            this.method = item.shipCode;
            this.shipWay = item;
            switch (item.shipCode) {
                case "kdps":
                    this.param.mdzq = {};
                    this.$parent.transFee = this.transFee;
                    this.updateKdpsParams();
                    break;
                case "mdzq":
                    this.param.kdps = {};
                    this.getCityData();
                    this.updateMdzqParams();
                    this.$parent.transFee = 0;
                    break;
            }
        },
        // 获取配送方式
        async getShipType() {
            let params = {
                effFlag: 1,
                policyTypeCode: "D_SALERETAIL"
            };
            let ways = await Order.getShipType(params);
            ways.forEach(item => {
                // 只要快递配送
                if (["kdps"].indexOf(item.shipCode) != -1) {
                    this.deliveryTypes.push(item);
                }
            });
            this.deliveryTypes.reverse();
            this.shipWay = this.deliveryTypes[0];
            console.log("shipWay", this.shipWay);
            this.updateKdpsParams();
        },
        // 获取快递配送地址
        async getAddress() {
            let defaultAddr = global.Storage.get("settlementAddr") || null;
            console.log("--获取到缓存地址-", defaultAddr);
            let addrList = [];
            if (!defaultAddr) {
                let params = {
                    vipUsrId: global.Storage.get("USER_INFO").usrId
                };
                console.log("bbbb");
                addrList = await UserService.getAddrList(params);
                console.log("ccc", addrList);
                if (addrList && addrList.length) {
                    addrList.forEach(function(item) {
                        if (item.defaultFlag === 1) {
                            defaultAddr = item;
                        }
                    });
                    defaultAddr = defaultAddr ? defaultAddr : addrList[0];
                    global.Storage.set("settlementAddr", defaultAddr);

                    this.addressMsg = defaultAddr;
                    console.log(defaultAddr, "=====aaaaaaaaaaaaa");
                    this.getTransFee();
                    this.updateKdpsParams();
                }
            } else {
                this.addressMsg = defaultAddr;
                this.getTransFee();
                this.updateKdpsParams();
            }
        },
        // 获取运费
        getTransFee() {
            if (!this.addressMsg) return;
            let data = {
                id: this.$parent.orderHdId,
                destCode: this.addressMsg.addressId
                    ? this.addressMsg.addressId
                    : this.addressMsg.districtCode
            };
            if (this.addressMsg.destId) {
                data.destId = this.addressMsg.destId;
            }
            Order.getFreight(data).then(res => {
                this.$parent.transFee = res;
                this.transFee = res;
            });
        },
        //  获取省市区
        async getCityData() {
            if (!check.isEmpty(this.areaList)) return;
            let areaList = {};
            let area = await Base.getDestnation();
            let provinceMap = {};
            let cityMap = {};
            let countyMap = {};
            // let areaList = {}
            area.list.forEach(item => {
                if (item.destTypeId === area.code[0]) {
                    provinceMap[item.code] = item.name;
                }
                if (item.destTypeId === area.code[1]) {
                    cityMap[item.code] = item.name;
                }
                if (item.destTypeId === area.code[2]) {
                    countyMap[item.code] = item.name;
                }
            });
            areaList.province_list = provinceMap;
            areaList.city_list = cityMap;
            areaList.county_list = countyMap;
            //                sessionStorage.setItem('areaList', JSON.stringify(areaList));
            this.$emit("update:areaList", areaList);
        },
        // 获取门店列表
        async getShopList(addressId) {
            let params = {
                code: addressId,
                pageNo: 1,
                pageSize: 100
            };
            let store = await Base.getShopList(params);
            console.log("store", store);
            if (check.isEmpty(store.list)) {
                Toast("该地区暂无可取货的门店~");
                return;
            }
            store.list.forEach(item => {
                item.text = item.dptName;
                item.addressText = item.address;
            });
            this.$emit("update:storeList", store.list);

            // this.storeList = store.list;
        },
        // 快递配送地址选择
        onSelectAddr() {
            let orderCouponData = global.Storage.get("orderCoupon");
            if (orderCouponData) {
                orderCouponData.flag = 1;
                global.Storage.set("orderCoupon", orderCouponData);
            }
            this.$router.push(
                "/pages/UserPackage/address/address-list?showList=2&fromPage=settlement"
            );
        },
        // 更新门店自取参数
        updateMdzqParams() {
            this.param.mdzq = {
                cargoUsrName: this.storeForm.username,
                cargoMobile: this.storeForm.phone,
                buyUsrMobile: this.storeForm.phone,
                cargoAddr: this.storeForm.storeName,
                cargoDestrictCode: this.storeForm.addressId,
                recptDptId: this.storeForm.storeId,
                receiptWayCode: this.shipWay.shipCode,
                receiptWayId: this.shipWay.id
            };
            this.$emit("update:params", this.param);
        },
        // 更新快递自取参数
        updateKdpsParams() {
            if (!this.addressMsg) {
                this.param.kdps = {
                    cargoAddr: "",
                    cargoUsrName: "",
                    cargoMobile: "",
                    buyUsrMobile: "",
                    cargoDestrictCode: "",
                    receiptWayCode: "",
                    receiptWayId: ""
                };
                this.$emit("update:params", this.param);
                return;
            }
            this.param.kdps = {
                cargoAddr: this.addressMsg.address,
                cargoUsrName: this.addressMsg.cargousrName,
                cargoMobile: this.addressMsg.cargoMobile,
                buyUsrMobile: this.addressMsg.cargoMobile,
                cargoDestrictCode: this.addressMsg.districtCode
                    ? this.addressMsg.districtCode
                    : this.addressMsg.addressId,
                receiptWayCode: this.shipWay.shipCode,
                receiptWayId: this.shipWay.id
            };
            console.log(this.param, "cccccccccc");
            this.$emit("update:params", this.param);
        },
        //门店自取联系人/联系方式输入更新
        onBlur(type, phone) {
            if (
                type == "phone" &&
                !global.isPhone(phone) &&
                this.method == "mdzq"
            ) {
                Toast("请输入正确的联系方式!");
                this.storeForm.phone = "";
                return;
            }
            this.updateMdzqParams();
        },
        // 门店自取选择地区/门店选择
        onSelectEvent(type) {
            switch (type) {
                case "area":
                    this.$emit("update:showAreaList", true);
                    break;
                case "store":
                    if (check.isEmpty(this.storeList)) {
                        Toast("该地区暂无可取货的门店~");
                        return;
                    }
                    this.$emit("update:showStoreList", true);
                    break;
            }
        },
        // 初始化
        onInit() {
            this.method = "kdps";
            // 获取配送方式
            this.getShipType();
            // 获取用户可选地址列表
            this.getAddress();
        }
    },
    computed: {
        kdpsUsrName: function() {
            if (!this.addressMsg) return "";
            return this.addressMsg.cargousrName || "";
        },
        kdpsPhone: function() {
            if (!this.addressMsg) return "";
            return (
                this.addressMsg.cargoPhone || this.addressMsg.cargoMobile || ""
            );
        },
        kdpsaddress: function() {
            if (!this.addressMsg) return "";
            return this.addressMsg.destDesc + this.addressMsg.address;
        }
    },
    watch: {
        Address: function(addr) {
            console.log(addr, "===");
            if (!addr || !addr[0] || !addr[1] || !addr[2]) {
                return;
            }
            this.storeForm.region = `${addr[0].name}-${addr[1].name}-${
                addr[2].name
            }`;
            this.storeForm.addressId = addr[2].code;
            this.updateMdzqParams();
            this.getShopList(addr[2].code);
        },
        Store: function(store) {
            if (!store) return;
            this.storeForm.storeName = store.dptName;
            this.storeForm.storeId = store.id;
            this.updateMdzqParams();
        }
    },
    onLoad() {
        console.log("已经这样了1111");
        this.onInit();
    },
    onShow() {
        console.log("已经这样了");
        // 获取用户可选地址列表  此处不能注释 否则从选择地址页返回  不会重新从缓存获取地址
        this.getAddress();
    },
    onUnload() {
        Object.assign(this.$data, this.$options.data());
    }
};
</script>
