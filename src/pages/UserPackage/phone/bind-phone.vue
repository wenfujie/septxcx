/*
* createTime：2018/11/2
* author：en.chen
* description:  手机号绑定/更换手机号,样式在style.css
*/
<template>
    <div class="phone-box">
        <div class="form-box">
            <input
                type="tel"
                placeholder="请输入手机号"
                class="input-phone"
                v-model="phoneNum"
                maxlength="11"
                @input="phoneRule"
            />
        </div>
        <div class="form-box">
            <input
                type="tel"
                class="captcha-text"
                v-model="captcha"
                placeholder="请输入验证码"
                maxlength="6"
            />
            <button
                class="captcha-btn color-mian fr"
                :class="[captchaLocked == true ? 'disabled' : '']"
                @click="checkPhone"
            >{{captchaText}}</button>
        </div>
        <div class="bottom-btns" @click="bindPhone">{{phoneStatus}}</div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import Toast from "vant-weapp/dist/toast/toast";
import { UserService } from "../../../api/service";
export default {
    config: {
        // navigationBarTitleText: "绑定手机"
    },
    data() {
        return {
            phoneNum: "", // 绑定手机号
            captcha: "", //验证码
            captchaText: "获取验证码", // 文字提示
            captchaLocked: false, // 获取验证码按钮锁
            isSendCaptcha: false, // 是否获取过验证码
            time: 60, // 倒计时时间
            checkStatus: false, // 手机号是否允许绑定状态
            btnLock: false, //  绑定手机号按钮锁
            type: 0, //绑定手机号为0 ，更换手机号为1
            phoneStatus: "",
            title: "" //动态修改头部导航名字
        };
    },
    onShow() {
        // 绑定手机成功后要跳转路由
        this.successUrl = this.$route.query.successUrl;
        this.type = this.$route.query.type;
        if (this.type == 1) {
            this.phoneStatus = "确定";
            this.title = "更换手机号";
        } else {
            this.phoneStatus = "立即绑定";
            this.title = "绑定手机号";
        }
        wx.setNavigationBarTitle({
            title: this.title //动态修改小程序头部标题
        });
    },
    onUnload() {
        let root = this;
        root.phoneNum = "";
        root.captcha = "";
        root.captchaText = "获取验证码";
        root.captchaLocked = false;
        root.time = 60;
        root.btnLock = false;
        root.checkStatus = false;
        root.userInfo = {};
        clearInterval(root.countDownData);
    },
    methods: {
        //  保留正确手机号
        phoneRule() {
            this.phoneNum = this.phoneNum.replace(/\D/g, "");
        },
        //  获取用户信息
        getUser() {
            let data = {};
            UserService.getUserInfo(data).then(res => {
                this.userInfo = res;
            });
        },
        //  校验手机号是否绑定
        checkPhone() {
            if (this.captchaLocked === true) {
                return;
            }
            // 校验手机号正确性
            if (!global.isPhone(this.phoneNum)) {
                Toast("请填写正确的手机号");
                return;
            } else {
                let data = {
                    id: global.Storage.get("USER_INFO").usrId,
                    mobile: this.phoneNum,
                    ownCompanyId: global.Storage.get("COMPANYID").company_id
                };
                UserService.checkPhone(data).then(
                    res => {
                        this.checkStatus = true;
                        this.getCaptcha();
                    },
                    err => {
                        this.checkStatus = false;
                        Toast("该手机号已绑定");
                    }
                );
            }
        },
        // 获取验证码
        getCaptcha() {
            if (this.captchaLocked === true || this.checkStatus === false) {
                // 判断是否可以发送验证码
                return;
            }
            if (this.type == 1) {
                var verifyClassCodeStatus = "VERIFY_CHANGE_MOBILE";
            } else {
                var verifyClassCodeStatus = "VERIFY_BIND_MOBILE";
            }
            this.captchaLocked = true;
            let phone = this.phoneNum;
            let data = {
                mobile: phone,
                id: global.Storage.get("USER_INFO").usrId,
                verifyClassCode: verifyClassCodeStatus
            };
            UserService.getCaptcha(data)
                .then(res => {}, err => {})
                .then(() => {
                    this.isSendCaptcha = true;
                });
            this.countDown();
        },
        // 倒计时
        countDown() {
            let that = this;
            that.captchaLocked = true;
            that.captchaText = "验证码已发送";
            let interval = setInterval(function() {
                that.captchaText = "重新获取" + that.time + "s";
                if (that.time-- <= 0) {
                    that.time = 60;
                    that.captchaLocked = false;
                    that.captchaText = "点击获取验证码";
                    clearInterval(interval);
                }
            }, 1000);
        },
        // 绑定手机号
        bindPhone() {
            if (this.btnLock === true) return;
            this.btnLock = true;
            if (this.type == 1) {
                var verifyClassCodeStatus = "VERIFY_CHANGE_MOBILE";
            } else {
                var verifyClassCodeStatus = "VERIFY_BIND_MOBILE";
            }
            if (!global.isPhone(this.phoneNum)) {
                Toast("请填写正确的手机号");
                this.btnLock = false;
                return false;
            }
            if (this.isSendCaptcha !== true) {
                Toast("请先获取验证码");
                this.btnLock = false;
                return false;
            }
            if (!this.captcha) {
                Toast("请先填写验证码");
                this.btnLock = false;
                return false;
            }
            if (this.checkStatus === false) {
                Toast("该手机号已经被绑定了~");
                this.btnLock = false;
                return false;
            }
            let data = {
                mobilePhone: this.phoneNum,
                registCode: this.captcha,
                verifyType: "D_VERIFYLOG",
                verifyClassCode: verifyClassCodeStatus
            };
            //  验证手机号和验证码
            UserService.checkCaptcha(data)
                .then(
                    () => {
                        // 绑定手机号
                        let bindData = {
                            mobile: this.phoneNum,
                            buscontsId: global.baseConstant.busContsCode
                        };
                        UserService.bindMobile(bindData).then(
                            () => {
                                Toast("绑定手机号成功~");
                                this.btnLock = false;
                                // this.getUser();
                                let userInfo = global.Storage.get("USER_INFO");
                                userInfo.mobilePhone = this.phoneNum;
                                global.Storage.set("USER_INFO", userInfo);
                                // 存在成功后需跳转地址
                                if (this.successUrl) {
                                    this.$router.replace(this.successUrl);
                                } else {
                                    this.$router.go(-1);
                                }
                            },
                            () => {
                                Toast("绑定手机出错~");
                            }
                        );
                    },
                    err => {
                        Toast("手机验证码错误");
                    }
                )
                .then(() => {
                    this.btnLock = false;
                });
        }
    }
};
</script>