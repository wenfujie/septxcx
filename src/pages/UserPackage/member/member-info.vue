<template>
    <div class="member-information">
        <wxs module="filter" src="../../../filter/filterCommon.wxs"></wxs>
        <div class="title">个人信息</div>
        <!--头像-->
        <div class="detail-cell">
            <label class="cell-title">头像</label>
            <div class="cell-content">
                <div class="fr user-img-cell">
                    <img
                        :src="filter.imgFilter(userInfo.photoThumb,company_id)"
                        lazy-load="true"
                        alt
                    />
                </div>
            </div>
        </div>
        <!--姓名-->
        <div class="detail-cell">
            <label class="cell-title">姓名</label>
            <div class="cell-content">
                <input v-model="username" type="text" maxlength="40" />
            </div>
        </div>
        <!--性别-->
        <div class="detail-cell">
            <label class="cell-title">性别</label>
            <!-- <picker bindchange="bindPickerChange" :value="usersex" range="{{array}}" class="cell-content">
                <view class="picker">
                当前选择：{{array[index]}}
                </view>
            </picker>-->
            <div class="cell-content" @click="onShowpicker('sexPickerShow')">
                <p class="label-text">{{usersex}}</p>
            </div>
        </div>
        <!--手机号-->
        <div class="detail-cell">
            <label class="cell-title">手机号</label>
            <div class="cell-content">
                <p class="label-text color-gray">
                    {{userphone}}
                    <span
                        v-if="!!userphone&&userphone.length!=0"
                        class="fr pdL20 color-black"
                        @click.stop="changePhone()"
                    >更换</span>
                    <span v-else class="fr pdL20 color-black" @click.stop="bindPhone()">绑定</span>
                </p>
            </div>
        </div>
        <!--电子邮箱-->
        <div class="detail-cell">
            <label class="cell-title">电子邮箱</label>
            <div class="cell-content">
                <input v-model="userEmail" type="text" @change="checkEmail" />
            </div>
        </div>
        <!--生日-->
        <div class="detail-cell">
            <label class="cell-title">生日</label>
            <div class="cell-content">
                <p
                    class="label-text"
                    @click="onShowpicker('birthdayPickerShow')"
                >{{ userbirthday ? userbirthday : '请选择出生日期' }}</p>
            </div>
        </div>

        <div class="title" v-if="memberInfo.length > 0">身型信息</div>
        <!--会员属性-->
        <div
            class="detail-cell"
            :class="{'height-adj':item.selectClassCode === 'D_ALISTOF' }"
            v-for="(item,index) in memberInfo"
            :key="index"
            v-if="item.showFlag === 1"
        >
            <div class="cell-title" :class="{'heightAuto':item.selectClassCode === 'D_ALISTOF' }">
                <span>{{item.customName}}</span>
                <span class="cl-red" v-if="item.mustFlag === 1">*</span>
            </div>
            <div
                class="cell-content"
                v-if="item.selectClassCode === 'D_DOWNBOX' "
                @click="showPopup(item)"
            >
                <input
                    placeholder="请选择相关信息"
                    class="van-field__control unshow"
                    v-model="item.customValue"
                    readonly="readonly"
                    disabled="true"
                />
                <label class="input-label">{{item.customValueName}}</label>
            </div>
            <div class="cell-content radius" v-if="item.selectClassCode === 'D_ALISTOF'">
                <van-radio-group
                    :value="item.customValue"
                    class="clearfix"
                    v-if="item.unfontClassCode === 'D_THERADIO'"
                >
                    <van-radio
                        v-for="(val,index1) in item.choiceValues"
                        :name="val.valueCode"
                        :key="index1"
                    >
                        <span class="min-width">{{val.valueName}}</span>
                    </van-radio>
                </van-radio-group>
                <van-checkbox-group
                    :value="item.customValueArr"
                    v-if="item.unfontClassCode === 'D_MULTISELECT'"
                >
                    <van-checkbox
                        v-for="(val,index2) in item.choiceValues"
                        :name="val.valueCode"
                        @change="toggle(index)"
                        :key="index2"
                    >
                        <span>{{val.valueName}}</span>
                    </van-checkbox>
                </van-checkbox-group>
            </div>
            <div class="cell-content" v-if="item.inputClassCode === 'D_TEXTBOX' ">
                <input
                    placeholder="请填写相关信息"
                    class="van-field__control"
                    v-model="item.customValue"
                    type="number"
                    @focus="getFoucs"
                    @input="typeLimit(item)"
                    @blur="typeCheck(item)"
                    :data-item="item"
                    :data-index="index"
                    v-if="item.fieldType === 'D_INTEGER'"
                />
                <input
                    placeholder="请填写相关信息"
                    class="van-field__control"
                    v-model="item.customValue"
                    type="text"
                    @focus="getFoucs"
                    @input="typeLimit(item)"
                    @blur="typeCheck(item)"
                    :data-item="item"
                    :data-index="index"
                    v-else
                />
                <span class="unit-name" v-if="!!item.unitName">{{item.unitName}}</span>
            </div>
        </div>

        <!--性别弹窗-->
        <van-popup
            :show="showUserSelect"
            position="bottom"
            @click-overlay="closePop('sexPickerShow')"
            v-if="sexPickerShow"
        >
            <van-picker
                :columns="columns"
                @change="onSexChange"
                show-toolbar
                @cancel="onCancel('sexPickerShow')"
                @confirm="onSexConfirm"
                class="picker-fixed"
                :default-index="usersexIndex"
                v-if="sexPickerShow"
            />
        </van-popup>

        <!--生日弹窗-->
        <van-popup
            :show="showUserSelect"
            position="bottom"
            @click-overlay="closePop('birthdayPickerShow')"
            v-if="birthdayPickerShow"
        >
            <van-datetime-picker
                :value="currentDate"
                type="date"
                :max-date="maxDate"
                :min-date="minDate"
                @cancel="onCancel('birthdayPickerShow')"
                @confirm="onBirthdayConfirm"
                @input="onBirthday"
                class="picker-fixed"
                v-if="birthdayPickerShow"
            />
        </van-popup>

        <!--底部按钮-->
        <!--<div class="bottom-btn2" @click="putUserInfo">-->
        <!--<p class="btn-txt">提交</p>-->
        <!--</div>-->

        <div class="com-foot-btn-cont">
            <div class="com-foot-btn" @click="putUserInfo">提交</div>
        </div>

        <!--会员属性选择弹窗 begin-->
        <van-popup :show="showMemberSelect" position="bottom">
            <van-picker
                :columns="changeMemberInfo"
                :default-index="changeMemberInfo_index"
                show-toolbar
                @cancel="cancelMemberInfo"
                @confirm="changeMember"
                class="picker-fixed"
            />
        </van-popup>
        <van-toast id="van-toast" />
        <!--会员属性选择弹窗 end-->
    </div>
</template>
<script>
import Toast from "vant-weapp/dist/toast/toast";
import { UserService } from "../../../api/service";

export default {
    config: {
        navigationBarTitleText: "个人信息"
    },
    data() {
        return {
            username: "",
            userEmail: "",
            columns: [
                {
                    text: "男",
                    value: "D_MALE"
                },
                {
                    text: "女",
                    value: "D_FEMALE"
                }
            ],
            sexPickerShow: false,
            birthdayPickerShow: false,
            usersex: "",
            userSexCode: null,
            usersexIndex: 0,
            userphone: "",
            userbirthday: "",
            currentDate: new Date(1985, 0, 1).getTime(),
            maxDate: new Date().getTime(),
            minDate: new Date(1900, 1, 1).getTime(),
            userheight: "",
            userweight: "",
            userwaist: "",
            userInfo: {},
            memberInfo: [],
            showUserSelect: false,
            showMemberSelect: false,
            memberType: "",
            changeMemberInfo: [],
            changeMemberInfo_index: 0, //选择的下标
            scrollTop: 0, // 滚动距离
            btnLock: false, // 按钮锁
            company_id: ""
        };
    },
    onShow() {
        this.company_id = global.Storage.get("COMPANYID").company_id;
        this.getUserInfo();
        this.getMemberInfo();
    },
    onUnload() {
        Object.assign(this.$data, this.$options.data());
    },
    methods: {
        // 检查电子邮箱格式
        checkEmail() {
            if (!global.isEmail(this.userEmail)) {
                Toast("请输入正确的电子邮箱~");
                this.userEmail = "";
            }
        },

        //      生日和性别弹窗显示
        onShowpicker(attr) {
            //设置性别和生日的默认值
            if (attr == "sexPickerShow") {
                if (this.usersex == this.columns[1].text) {
                    this.usersexIndex = 1;
                } else {
                    this.usersexIndex = 0;
                }
            } else if (attr == "birthdayPickerShow" && !!this.userbirthday) {
                this.currentDate = new Date(this.userbirthday).getTime();
            }
            this[attr] = true;
            this.showUserSelect = true;
        },

        //      取消性别和生日弹窗
        onCancel(attr) {
            this[attr] = false;
            this.showUserSelect = false;
        },
        closePop(attr) {
            this.onCancel(attr);
        },
        //      性别change事件
        onSexChange(e) {
            this.sexName = e.mp.detail.value;
        },

        //      性别confirm事件
        onSexConfirm(e) {
            if (!this.sexName) {
                //          没有选择时点击确定默认选中第一项
                this.sexName = this.columns[0];
            }
            this.usersex = this.sexName.text;
            this.userSexCode = this.sexName.value;
            this.onCancel("sexPickerShow");
        },
        //      生日change事件
        onBirthday(e) {
            var temDate = new Date(e.mp.detail);
            this.birthday = [
                temDate.getFullYear(),
                ("0" + parseInt(temDate.getMonth() + 1)).slice(-2),
                ("0" + temDate.getDate()).slice(-2)
            ];
        },

        //     生日confirm事件
        onBirthdayConfirm(e) {
            this.currentDate = e.mp.detail;
            var newCurrentDate = new Date(this.currentDate);
            this.birthday = [
                newCurrentDate.getFullYear(),
                ("0" + parseInt(newCurrentDate.getMonth() + 1)).slice(-2),
                ("0" + newCurrentDate.getDate()).slice(-2)
            ];
            this.userbirthday =
                this.birthday[0] +
                "-" +
                this.birthday[1] +
                "-" +
                this.birthday[2];
            this.onCancel("birthdayPickerShow");
        },

        // 跳转更改绑定手机号
        changePhone() {
            this.$router.push("/pages/UserPackage/phone/bind-phone?type=1");
        },
        // 跳转绑定手机号
        bindPhone() {
            this.$router.push("/pages/UserPackage/phone/bind-phone");
        },
        //  获取个人信息
        getUserInfo() {
            let data = {};
            UserService.getUserInfo(data).then(res => {
                this.userInfo = res;
                //  会员信息整合，用户昵称取值字段变更
                this.username = !!res.vipAccount ? res.vipAccount : null;
                this.userEmail = !!res.email ? res.email : null;
                if (!!res.sexCode && !!res.sexName) {
                    this.userSexCode = res.sexCode;
                    this.usersex = res.sexName;
                }
                this.userbirthday = !!res.solarcalendar
                    ? res.solarcalendar.split(" ")[0]
                    : null;
                this.userphone = res.mobilePhone ? res.mobilePhone : "";
                console.log(this.userphone, "this.userphone");
            });
        },

        //  修改个人信息
        putUserInfo() {
            if (this.btnLock) return;
            this.btnLock = true;

            //  校验会员信息
            if (!this.username) {
                Toast("请输入用户姓名~");
                this.btnLock = false;
                return false;
            }

            //  校验会员属性
            let map = {};
            let arr = [];
            for (let i = 0; i < this.memberInfo.length; i++) {
                let item = this.memberInfo[i];
                if (item.showFlag === 1) {
                    //  只选择前端显示切不带图片的属性
                    if (item.mustFlag === 1) {
                        //  必填属性校验
                        if (
                            item.unfontClassCode === "D_MULTISELECT" &&
                            item.selectClassCode === "D_ALISTOF"
                        ) {
                            // 多选框模式
                            if (item.customValueArr.length > 0) {
                                for (
                                    let j = 0;
                                    j < item.customValueArr.length;
                                    j++
                                ) {
                                    map.customCode = item.customCode;
                                    map.customValue = item.customValueArr[j];
                                    arr.push(map);
                                    map = {};
                                }
                            } else {
                                Toast(item.customName + "为必填内容~");
                                this.btnLock = false;
                                return false;
                            }
                        } else if (!item.customCode || !item.customValue) {
                            Toast(item.customName + "为必填内容~");
                            this.btnLock = false;
                            return false;
                        } else {
                            map.customCode = item.customCode;
                            map.customValue = item.customValue;
                            arr.push(map);
                            map = {};
                        }
                    } else {
                        if (
                            item.unfontClassCode === "D_MULTISELECT" &&
                            item.selectClassCode === "D_ALISTOF"
                        ) {
                            // 多选框模式
                            if (item.customValueArr.length > 0) {
                                for (
                                    let j = 0;
                                    j < item.customValueArr.length;
                                    j++
                                ) {
                                    map.customCode = item.customCode;
                                    map.customValue = item.customValueArr[j];
                                    arr.push(map);
                                    map = {};
                                }
                            }
                        } else {
                            //  非必填属性直接添加进数组
                            map.customCode = item.customCode;
                            map.customValue = item.customValue;
                            arr.push(map);
                            map = {};
                        }
                    }
                }
            }

            // 表单提交
            let data = {
                //  用户信息
                solarCalendarStr: this.userbirthday,
                sexCode: this.userSexCode,
                email: this.userEmail,
                //  会员信息整合，用户昵称取值字段变更
                usrCode: this.username,
                account: this.username
            };
            let memberData = {
                //  会员属性
                customs: arr
            };
            UserService.updateUserInfo(data)
                .then(
                    res => {},
                    err => {
                        this.btnLock = false;
                    }
                )
                .then(() => {
                    UserService.updateMemberInfo(memberData).then(res => {
                        //  修改会员信息
                        if (res && res !== 0) {
                            this.$nextTick(() => {
                                this.getUserInfo();
                                this.getMemberInfo();
                            });
                        }
                        this.btnLock = false;
                        Toast("修改信息成功~");
                    });
                })
                .then(() => {
                    this.btnLock = false;
                });
        },

        //  获取会员自定义属性
        getMemberInfo() {
            let data = {
                busContsCode: global.baseConstant.busContsCode
            };
            UserService.getMemberInfo(data).then(res => {
                this.memberInfo = res;
            });
        },

        //  会员属性确认
        changeMember(event) {
            var value = event.target.value;
            this.memberInfo.forEach(item => {
                if (item.customCode === this.memberType) {
                    item.customValue = value.value;
                    item.customValueName = value.text;
                }
            });
            this.showMemberSelect = false;
            this.changeMemberInfo = [];
            this.changeMemberInfo_index = 0;
        },

        //  关闭会员属性弹窗
        cancelMemberInfo() {
            this.showMemberSelect = false;
            this.changeMemberInfo = [];
            this.changeMemberInfo_index = 0;
        },

        //  显示会员属性修改弹窗
        showPopup(item) {
            this.changeMemberInfo = [];
            let arr = {};
            this.memberType = item.customCode;
            let changeMemberInfo_index = 0;
            item.choiceValues.forEach((item_child, index_child) => {
                //循环判断是否有默认
                if (item.customValue == item_child.valueCode) {
                    changeMemberInfo_index = index_child;
                }
                arr.value = item_child.valueCode;
                arr.text = item_child.valueName;
                this.changeMemberInfo.push(arr);
                arr = {};
            });
            this.changeMemberInfo_index = changeMemberInfo_index;
            this.showMemberSelect = true;
        },

        // 身型数据中数字类型的输入框中的值的输入限制
        typeLimit(item) {
            if (item.fieldType === "D_INTEGER")
                item.customValue = item.customValue.replace(/[^0-9.]+/, "");
        },

        //  校验身型数据中数字类型的输入框中的值
        typeCheck(item) {
            if (!item.customValue) return;
            if (item.fieldType !== "D_INTEGER") {
                if (this.scrollTop > 0) window.scroll(0, this.scrollTop);
                return;
            }
            let rule = /^[0-9]+(.[0-9]{1,3})?$/;
            if (!rule.test(item.customValue)) {
                Toast(item.customName + "只允许输入不超过三位小数的数字~");
                item.customValue = "";
                return false;
            } else {
                if (!item.customValue) {
                    Toast(item.customName + "只允许输入不超过三位小数的数字~");
                    item.customValue = "";
                    return false;
                }
                if (!!item.maxValue) {
                    if (Number(item.customValue) > Number(item.maxValue)) {
                        Toast(
                            item.customName + "的最大值不能超过" + item.maxValue
                        );
                        item.customValue = "";
                        return;
                    }
                }
                if (!!item.minValue) {
                    if (Number(item.customValue) < Number(item.minValue)) {
                        Toast(item.customName + "的最小值为" + item.minValue);
                        item.customValue = "";
                        return;
                    }
                }
                item.customValue = Number(item.customValue);
                if (this.scrollTop > 0) window.scroll(0, this.scrollTop);
            }
        },

        //  输入框聚焦
        getFoucs() {
            // if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            //     this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || window.scrollY
            // }
        },

        // 解决ios弹起软键盘后影响页面
        resetPage() {
            // if (/iPhone|iPad|iPod/.test(navigator.userAgent) && this.scrollTop > 0) {
            //     window.scroll(0, this.scrollTop)
            // }
        }
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.member-information {
    overflow: hidden;
    padding-bottom: computed(94);
    .title {
        font-size: computed(36);
        line-height: computed(36);
        margin: computed(30);
        color: #0d0e09;
        font-weight: bold;
    }
    .detail-cell {
        box-sizing: border-box;
        display: flex;
        height: computed(100);
        min-height: computed(100);
        margin: 0 computed(30);
        position: relative;
        border-bottom: solid 1px #e6e6e6;
        &:nth-child(1) {
            margin-top: computed(30);
        }
        &:last-child {
            border-bottom: none;
        }
        .cell-title {
            display: flex;
            flex: inherit;
            align-items: center;
            justify-content: inherit;
            width: computed(140);
            min-width: computed(140);
            font-size: computed(28);
            line-height: computed(30);
            color: #0d0e09;
            white-space: nowrap;
            overflow: hidden;
            &.heightAuto {
                align-items: inherit;
                margin-top: computed(30);
            }
        }
        .cell-content {
            width: 100%;
            position: relative;
            margin-left: computed(10);
            text-align: left;
            .user-img-cell {
                margin-top: computed(14);
                width: computed(72);
                height: computed(72);
                overflow: hidden;
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            .label-text {
                padding: 0 computed(10);
                font-size: computed(30);
                line-height: computed(100);
                color: #0d0e09;
            }
            .color-gray {
                color: #d2d2d2;
            }
            .color-black {
                color: #0d0e09;
            }
            .van-radio {
                float: left;
                margin: computed(30);
                margin-left: 0;
                font-size: computed(28);
                line-height: computed(30);
            }
            .min-width {
                min-width: computed(90);
            }
            .unshow {
                opacity: 0;
                z-index: 2;
            }
            .input-label {
                position: absolute;
                top: 0;
                left: 0;
                font-size: computed(30);
                line-height: computed(100);
                color: #0d0e09;
                z-index: 1;
            }
            .unit-name {
                position: absolute;
                top: 0;
                right: 0;
                font-size: computed(30);
                line-height: computed(100);
                color: #d2d2d2;
                z-index: 1;
            }
        }
        .cell-content input {
            display: block;
            box-sizing: border-box;
            width: 100%;
            height: computed(98);
            padding: 0 computed(10);
            border: none;
            font-size: computed(30);
            line-height: computed(100);
            color: #0d0e09;
            position: relative;
            /* 解决ios版微信浏览器的边框和阴影*/
            border-radius: 0;
            box-shadow: 0 0 0 rgba(0, 0, 0, 0);
            -webkit-appearance: none;
        }
    }
    .cl-red {
        color: #c41717;
    }
    .clearfix:after {
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    .height-adj {
        height: auto;
    }
}
.com-foot-btn-cont {
    background: $color-white;
}
</style>
