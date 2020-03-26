<!--
 * @Author: lan.chen
 * @Date: 2019-06-29 14:02:07
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-08-14 16:06:01
 * @Description: 
 -->
<template>
    <div class="address-list">
        <!-- 个人中心跳转收货地址 -->
        <ul class="address-list-content" v-if="addressList.length > 0 && showList ==1">
            <li class="address-list-item" v-for="(item, index) in addressList" :key="index">
                <div @click="selectAddress(item)" class="border-dash-b3">
                    <div class="address-header">
                        <span class="user-name">{{item.cargousrName}}</span>
                        <span class="user-phone">{{item.cargoPhone}}</span>
                    </div>
                    <div class="address-msg">{{ item.destDesc + item.address }}</div>
                </div>
                <div class="address-btn-box">
                    <div class="default-btn" @click="setDefault(item)">
                        <van-checkbox :value="item.defaultFlag">默认地址</van-checkbox>
                    </div>
                    <div class="common-btn">
                        <span @click="editAddress(item.id, item.destId)">编辑</span>
                        <span @click="deleteAddress(item)">删除</span>
                    </div>
                </div>
            </li>
        </ul>
        <!-- 订单跳转收货地址 -->
        <ul class="address-order-content" v-if="addressList.length > 0 && showList ==2">
            <li
                class="address-list-item border-dash-b3"
                v-for="(item,index) in addressList"
                :key="index"
            >
                <div @click="selectAddress(item)" class="address-box">
                    <div class="left">
                        <van-checkbox :value="item.defaultFlag"></van-checkbox>
                    </div>
                    <div class="middle">
                        <div class="address-header">
                            <span class="user-name">{{item.cargousrName}}</span>
                            <span class="user-phone">{{item.cargoPhone}}</span>
                        </div>
                        <div class="address-msg">
                            <span v-if="item.defaultFlag===1" class="text-red">[默认]</span>
                            {{item.destDesc + item.address}}
                        </div>
                    </div>
                    <div class="right">
                        <span @click.stop="editAddress(item.id,item.destId)">
                            编辑
                            <!-- <i class="iconfont icon-bianji">编辑</i> -->
                        </span>
                    </div>
                </div>
            </li>
        </ul>
        <!-- 收货地址为空  -->
        <div class="empty-box">
            <empty-content v-if="showEmpty"></empty-content>
        </div>
        <!--新增地址按钮 begin-->
        <div class="com-foot-btn-cont">
            <div class="com-foot-btn" @click="newAddr()">+ 新增地址</div>
        </div>
        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />
        <!--新增地址按钮 end-->
    </div>
</template>
<script>
import { UserService } from "../../../api/service";
import EmptyContent from "@/components/EmptyContent";
import Toast from "vant-weapp/dist/toast/toast";
import Dialog from "vant-weapp/dist/dialog/dialog";
export default {
    config: {
        enablePullDownRefresh: true,
        backgroundTextStyle: "dark",
        navigationBarTitleText: "地址管理"
    },
    components: {
        "empty-content": EmptyContent
    },
    data() {
        return {
            checked: false,
            fromPage: "", // 来源页面，用于地址选择的点击跳转
            addressList: [], // 地址列表
            showEmpty: false, //空判断
            type: 0, //判断是否无地址列表进入编辑地址，1是 0否
            isNew: false, //判断是否是新增地址,来判断地址详情的头部标题
            btnLock: false, //按钮锁
            showList: 0 //0为订单跳转入口  1为账户页跳转入口
        };
    },
    // 下拉刷新事件
    onPullDownRefresh() {
        // 初始化页码
        this.pageNum = 1;
        this.addressList = [];
        this.getAddress();
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1500);
    },
    methods: {
        // 获取地址列表
        getAddress(items) {
            this.showEmpty = false;
            let data = {
                vipUsrId: global.Storage.get("USER_INFO").usrId
            };
            global.toastLoading();
            UserService.getAddrList(data).then(res => {
                this.addressList = res;
                global.toastLoading(false);
                if (!this.addressList.length || this.addressList.length < 1) {
                    this.showEmpty = true;
                }
                res.forEach(item => {
                    if (item.defaultFlag === 1) {
                        this.type = 1; //判断是否无地址列表进入新增地址，1是 0 否（测试要求第一次新增地址，复选框默认勾选）
                    } else {
                        this.type = 0;
                    }
                });
            });
        },
        // 编辑地址
        editAddress(id, destId, defaultFlag) {
            if (defaultFlag == 1) this.type = 1;
            this.$router.push(
                "/pages/UserPackage/address/address-detail?id=" +
                    id +
                    "&destId=" +
                    destId +
                    "&type=" +
                    this.type
            );
        },
        clearSettlementAddr(item) {
            let addr = global.Storage.get("settlementAddr");
            if (addr && addr.id === item.id) {
                global.Storage.set("settlementAddr", {});
            }
        },
        // 删除地址
        deleteAddress(item) {
            // if (this.btnLock) return;
            // this.btnLock = true;
            Dialog.confirm({
                message: "确定删除该地址吗？",
                confirmButtonText: "确定"
            }).then(
                () => {
                    let data = {
                        ids: item.id
                    };
                    UserService.deleteAddrList(data).then(() => {
                        this.btnLock = false;
                        this.clearSettlementAddr(item);
                        this.getAddress();
                        Toast("删除地址成功~");
                    });
                    //由售后页面来的话就删除对应store地址
                    if (
                        this.fromPage === "postSale" &&
                        item.id == this.$route.query.addressId
                    ) {
                        this.$store.commit("afterSale/detail/clearAddress");
                    }
                },
                err => {}
            );
        },

        //  选择事件
        selectAddress(item) {
            if (this.fromPage === "settlement") {
                // 订单结算页面进入时的操作
                global.Storage.set("settlementAddr", item);
                this.$router.go(-1);
            } else if (this.fromPage === "postSale") {
                this.$store.commit("afterSale/detail/saveAddress", item);
                this.$router.go(-1);
                this.$router.replace({
                    path: "/pages/afterSalePackage/afterSale/pages/detail/page",
                    query: {
                        reapplycode: this.$route.query.reapplycode
                    }
                });
            }
        },
        //  跳转新增地址
        newAddr() {
            if (this.addressList.length === 0) {
                this.type = 1; //判断是否无地址列表进入新增地址 1是
                this.isNew = true;
            } else {
                this.type = 0;
            }
            if (this.addressList.length > 19) {
                Toast("最多可添加20条收货地址");
                return;
            }
            this.$router.push(
                "/pages/UserPackage/address/address-detail?type=" +
                    this.type +
                    "&isNew=" +
                    this.isNew
            );
        },

        //  设置默认地址
        setDefault(item) {
            this.type = 1;
            if (item.defaultFlag === 1) {
                return;
            } else {
                let data = {
                    id: item.id,
                    address: item.address,
                    cargousrName: item.cargousrName,
                    cargoMobile: item.cargoMobile,
                    cargoPhone: item.cargoPhone,
                    defaultFlag: 1,
                    destCode: item.districtCode
                };
                UserService.changeAddrInfo(data).then(
                    res => {
                        Toast("设置默认地址成功~");
                        this.addressList.forEach(list => {
                            if (list.id === item.id) {
                                list.defaultFlag = 1;
                            } else {
                                list.defaultFlag = 0;
                            }
                        });
                        this.getAddress();
                    },
                    err => {}
                );
            }
        }
    },
    onShow() {
        this.fromPage = this.$route.query.fromPage || "";
        this.showList = this.$route.query.showList;
        this.getAddress();
         setTimeout(() => {
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 300
            });
        }, 0);
    }
};
</script>
<style lang="">
page {
    height: 100%;
    background: #f5f5f5;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
.address-list {
    position: relative;
    width: 100%;
    min-height: computed(1000);
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
    padding: computed(20) 0 computed(140) 0;
    .address-list-content {
        .address-list-item {
            width: 85%;
            height: computed(231);
            margin: computed(26);
            padding: 0 computed(30);
            position: relative;
            background: $color-white;
            color: $color-black-33;
            box-shadow: 0px computed(4) computed(12) 0px rgba(0, 0, 0, 0.1);
            border-radius: computed(5);
            .address-header {
                padding: computed(28) 0 computed(18) 0;
                font-size: $font-title1;
                line-height: computed(32);
                &::after {
                    content: "";
                    clear: both;
                    display: table;
                }
                .user-name {
                    float: left;
                    display: inline-block;
                    width: computed(145);
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .user-phone {
                    margin-left: computed(20);
                    float: left;
                }
            }
            .address-msg {
                margin: 0 0 computed(14) 0;
                font-size: $font-common;
                line-height: computed(30);
                width: 75%;
                height: computed(60);
                color: $text-regular;
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
            }
            .address-btn-box {
                display: flex;
                height: computed(36);
                padding: computed(27) 0;
                font-size: computed(28);
                justify-content: space-between;
                align-items: center;
                .default-btn {
                    position: relative;
                    .van-icon-success {
                        font-size: computed(20);
                    }
                }
                .common-btn {
                    margin-top: computed(-10);
                    span {
                        display: inline-block;
                        width: computed(86);
                        // height: computed(40);
                        line-height: computed(40);
                        font-size: $font-common;
                        text-align: center;
                        margin-left: computed(35);
                        color: #666666;
                        border: computed(2) solid rgba(102, 102, 102, 1);
                        border-radius: 3px;
                        border-radius: $btn-radius25;
                    }
                    i {
                        font-size: computed(24);
                        line-height: computed(36);
                        // margin-right: computed(10);
                    }
                }
            }
        }
    }
    .address-order-content {
        width: 90%;
        margin: 0 computed(35);
        background: $color-white;
        box-shadow: 0 computed(4) computed(12) 0px rgba(0, 0, 0, 0.1);
        border-radius: computed(5);
        margin-bottom: computed(40);
        .address-list-item {
            width: 90%;
            margin: computed(5) computed(5) computed(0) computed(35);
            padding-top: computed(25);
            color: #1a1a1a;
            &:last-child {
                border-bottom: none;
            }
            .address-box {
                display: flex;
                justify-content: space-between;
                height: computed(156);
            }
            .left {
                margin: computed(40) 0 0 0;
            }
            .middle {
                width: 68%;
                margin: computed(15) 0 0 computed(-10);
                .address-header {
                    width: 85%;
                    display: flex;
                    justify-content: space-between;
                    text-align: left;
                    font-size: $font-title1;
                    line-height: computed(32);
                    color: $text-primary;
                    .user-name {
                        float: left;
                        display: inline-block;
                        width: computed(145);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
                .address-msg {
                    color: $text-regular;
                    font-size: $font-common;
                    padding-top: computed(12);
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 2;
                }
            }
            .right {
                margin-top: computed(40);
                span {
                    display: inline-block;
                    width: computed(86);
                    // height: computed(40);
                    line-height: computed(40);
                    font-size: $font-common;
                    text-align: center;
                    color: $text-regular;
                    border: computed(2) solid $text-regular;
                    border-radius: $btn-radius25;
                }
            }
        }
        .text-red {
            color: $domaincolor;
        }
    }
}
</style>
