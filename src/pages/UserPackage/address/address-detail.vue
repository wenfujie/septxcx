/*
* createTime：2018/11/3
* author：en.chen
* description:  新增/展示/修改地址详情
*/
<template>
    <div class="address-detail bg-gray">
        <!--地址信息 begin-->
        <div class="bg-white greycc box">
            <!-- <input> -->
            <van-cell-group>
                <van-field
                    v-model="addressInfo.name"
                    maxlength="40"
                    placeholder="姓名"
                    autofocus="autofocus"
                    @blur="formName"
                />
                <van-field
                    v-model="addressInfo.phone"
                    @blur="checkPhoneNum"
                    @focus="clearErr"
                    maxlength="11"
                    placeholder="手机号码"
                    :error-message="errphone"
                    type="number"
                />
                <van-field
                    placeholder="省市、城市、区县"
                    :value="addressInfo.province + addressInfo.city + addressInfo.district"
                    maxlength="300"
                    @click="showAreaList = true"
                    readonly
                />
                <textarea
                    v-if="showAreaList==true"
                    placeholder="详细地址：如楼道、楼盘号等"
                    v-model="addressInfo.detail"
                    maxlength="300"
                    class="addressDetail"
                    @blur="addressDetail"
                    placeholder-style="color: rgba(0, 0, 0, .7);"
                />
                <textarea
                    v-else
                    placeholder="详细地址：如楼道、楼盘号等"
                    v-model="addressInfo.detail"
                    maxlength="300"
                    class="addressDetail"
                    @blur="addressDetail"
                />
            </van-cell-group>
        </div>
        <div class="set-default">
            <van-checkbox :value="checked" @change="changeDefault(checked)">设为默认地址</van-checkbox>
        </div>
        <!--地址信息 end-->
        <!--提交按钮 begin-->
        <div class="com-foot-btn-cont">
            <div class="com-foot-btn" @click="submit" v-if="destId">修改</div>
            <div class="com-foot-btn" @click="submit" v-else>保存</div>
        </div>
        <!--提交按钮 end-->
        <!--弹窗 begin-->
        <van-popup :show="showAreaList" position="bottom">
            <!--<van-area :value="addressInfo.addressId" :area-list="areaList" @confirm="areaChange" @cancel="showAreaList = false" />-->
            <van-area
                :area-list="areaList"
                @confirm="areaChange"
                @cancel="showAreaList = false"
                :visible-item-count="5"
            />
        </van-popup>
        <!--弹窗 end-->
        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />
    </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.address-detail {
    height: 100%;
    overflow: hidden;
    .bg-white {
        width: computed(690);
        margin: computed(30);
        box-shadow: 0px computed(4) computed(12) 0px rgba(0, 0, 0, 0.1);
        border-radius: computed(5);
    }
    // .addressDetail {
    //     height: computed(100);
    // }
    textarea {
        border: none;
        height: computed(95);
        padding-top: computed(20);
        width: computed(580);
        line-height: computed(40);
        font-size: computed(30);
        color: #333;
        padding-left: computed(38);
        &::-webkit-input-placeholder {
            /*WebKit browsers*/
            color: #cccccc;
        }
    }
    .set-default {
        width: computed(690);
        margin: computed(36) computed(30);
        line-height: computed(40);
        display: flex;
        justify-content: space-between;
        .cell-to {
            color: #50b242;
            .van-icon-arrow::before {
                font-size: $font-small;
            }
        }
    }
    /* 地址详情页面switch按钮 */
    .reset-UI {
        width: computed(100);
        height: computed(60);
        margin-top: computed(20);
        .van-switch--on .van-switch__node {
            transform: translateX(0.65em);
        }
    }
    .van-switch {
        background: #e6e6e6;
    }
    .van-switch--on {
        background-color: #0d0e09;
    }
    .bottom-btn {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 999;
    }
}
</style>
<script>
import debounce from "@/utils/debounce";
import { UserService, Base } from "../../../api/service";
import { cityData } from "../../../assets/js/cityData";
import Toast from "vant-weapp/dist/toast/toast";
import Dialog from "vant-weapp/dist/dialog/dialog";
export default {
    config: {
        // navigationBarTitleText: "地址详情"
    },
    data() {
        return {
            id: "",
            destId: "",
            addressInfo: {
                name: "",
                phone: "",
                province: "",
                district: "",
                city: "",
                addressId: "",
                detail: ""
            },
            checked: false,
            checkPhone: true,
            setDefault: 0,
            defaultStatus: false,
            showAreaList: false,
            areaList: cityData,
            btnLock: false, // 按钮锁
            errphone: "", //错误提示
            type: "", //判断是否是新增地址，type 0 为编辑地址 1为修改地址
            isNew: false
        };
    },
    onLoad() {
        this.id = parseInt(this.$route.query.id) || "";
        this.destId = parseInt(this.$route.query.destId) || "";
        this.type = this.$route.query.type;
        this.isNew = this.$route.query.isNew;
        wx.setNavigationBarTitle({
            title: this.isNew == 0 ? "新增地址" : "编辑地址" //动态修改小程序头部挑剔
        });
        if (this.destId && this.destId !== undefined) {
            let data = {
                addressId: this.id,
                destId: this.destId
            };
            global.toastLoading();
            UserService.getAddrDetail(data).then(res => {
                this.addressInfo.name = res.cargousrName;
                this.addressInfo.phone = res.cargoPhone;
                this.addressInfo.addressId = res.districtCode;
                this.addressInfo.province = res.provinceCnName;
                this.addressInfo.district = res.districtCnName;
                this.addressInfo.city = res.cityCnName;
                this.addressInfo.detail = res.address;
                this.setDefault = res.defaultFlag;
                global.toastLoading(false);
                if (this.setDefault === 1) {
                    this.defaultStatus = true;
                    this.checked = true;
                } else {
                    this.defaultStatus = false;
                }
            });
        }
        // type 0 为编辑地址 1为修改地址
        if (this.type == 1) {
            this.checked = true;
            this.send = true;
            this.changeDefault();
        } else {
            this.checked = false;
        }
    },
    onUnload() {
        Object.assign(this.$data, this.$options.data());
    },
    methods: {
        // 更新本地保存的信息
        updateAddrInLocal(addrObj) {
            let addr = global.Storage.get("settlementAddr");
            if (!!addr && addr.id === addrObj.id) {
                addr.cargousrName = this.addressInfo.name;
                addr.cargoPhone = this.addressInfo.phone;
                addr.destDesc =
                    this.addressInfo.province +
                    this.addressInfo.city +
                    this.addressInfo.district;
                addr.address = this.addressInfo.detail;
                global.Storage.set("settlementAddr", addr);
            }
        },
        submit: debounce(function() {
            this.editAddress();
        }, 10000),
        // 提交地址信息
        editAddress() {
            if (this.btnLock) return;
            this.btnLock = true;
            if (
                !this.addressInfo.name ||
                !this.addressInfo.province ||
                !this.addressInfo.detail ||
                !this.addressInfo.addressId ||
                !this.addressInfo.phone
            ) {
                Toast("请完善收货信息~");
                this.btnLock = false;
                return;
            }
            if (this.checkPhone == false) {
                this.errphone = "请输入正确的手机号格式";
                return;
            } else {
                let addrData = {
                    id: parseInt(this.id),
                    address: this.addressInfo.detail,
                    cargousrName: this.addressInfo.name,
                    cargoMobile: this.addressInfo.phone,
                    cargoPhone: this.addressInfo.phone,
                    defaultFlag: this.setDefault,
                    destCode: this.addressInfo.addressId
                };
                UserService.changeAddrInfo(addrData)
                    .then(
                        () => {
                            this.updateAddrInLocal(addrData);
                            Toast("保存地址信息成功~");
                            setTimeout(() => {
                                this.$router.go(-1);
                            }, 2000);
                            this.btnLock = false;
                        },
                        () => {
                            this.btnLock = false;
                        }
                    )
                    .then(() => {
                        this.btnLock = false;
                    });
            }
        },
        // 姓名
        formName(e) {
            this.addressInfo.name = e.target.value;
        },
        // 地址详情
        addressDetail(e) {
            this.addressInfo.detail = e.target.value;
        },
        // 校验电话号码
        checkPhoneNum(e) {
            this.addressInfo.phone = e.target.value;
            if (!global.isPhone(this.addressInfo.phone)) {
                this.checkPhone = false;
                this.errphone = "请输入正确的手机号格式";
                setTimeout(() => {
                    this.$nextTick(() => {
                        wx.pageScrollTo({
                            scrollTop: 0,
                            duration: 300
                        });
                    });
                }, 100);
            } else {
                this.checkPhone = true;
                this.errphone = "";
                setTimeout(() => {
                    this.$nextTick(() => {
                        wx.pageScrollTo({
                            scrollTop: 0,
                            duration: 300
                        });
                    });
                }, 100);
            }
        },
        clearErr() {
            this.errphone = "";
        },
        //  省市区选择
        areaChange(value) {
            this.addressInfo.province = value.target.values[0].name;
            this.addressInfo.city = value.target.values[1].name;
            this.addressInfo.district = value.target.values[2].name;
            if (value.target.values[2].code) {
                this.addressInfo.addressId = value.target.values[2].code;
            } else if (value.target.values[1].code) {
                this.addressInfo.addressId = value.target.values[1].code;
            } else {
                this.addressInfo.addressId = value.target.values[0].code;
            }
            this.showAreaList = false;
        },
        //  设置默认地址
        changeDefault(checked) {
            this.checked = !this.checked;
            if (this.checked === true) {
                this.setDefault = 1;
            } else if (this.checked === false) {
                this.setDefault = 0;
            }
        },
        //  input框失去焦点
        bindBlur() {
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 300
            });
        }
    }
};
</script>
