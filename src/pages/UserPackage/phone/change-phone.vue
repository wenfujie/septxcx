/*
* createTime：2018/11/2
* author：en.chen
* description:  更换绑定手机号，样式在style.css
*/
<template>
    <div class="wrapper phone-box">
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
                :class="['verify-btn','captcha-btn','color-mian','fr',captchaLocked == true ? 'disabled' : '']"
                @click="checkPhone"
            >{{captchaText}}</button>
        </div>
        <div class="bottom-btns" @click="bindNewPhone">确定</div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import Toast from "vant-weapp/dist/toast/toast";
import { UserService } from "../../../api/service";
export default {
    config: {
        navigationBarTitleText: "更换绑定手机"
    },
    data() {
        return {
            phoneNum: "", // 绑定手机号
            captcha: "", //验证码
            captchaText: "获取验证码", // 文字提示
            captchaLocked: false, // 获取验证码按钮锁
            time: 60, // 倒计时时间
            btnLock: false, //  绑定手机号按钮锁
            checkStatus: false, // 手机号是否允许绑定状态
            userInfo: {},
            isSendCaptcha: false
        };
    },
    onShow() {
        this.getUser();
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
                        Toast("该手机号已绑定");
                    }
                );
            }
        },
        // 获取验证码
        getCaptcha() {
            if (this.captchaLocked === true) {
                // 判断是否可以发送验证码
                return;
            }
            const phone = this.phoneNum;
            if (!global.isPhone(phone)) {
                Toast("请填写正确的手机号");
                return;
            }
            let data = {
                id: global.Storage.get("USER_INFO").usrId,
                mobile: phone,
                verifyClassCode: "VERIFY_CHANGE_MOBILE"
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
            this.captchaLocked = true;
            this.captchaText = "验证码已发送";
            this.countDownData = setInterval(function() {
                that.captchaText = "重新获取" + that.time + "s";
                if (that.time-- <= 0) {
                    that.time = 60;
                    that.captchaLocked = false;
                    that.captchaText = "获取验证码";
                    clearInterval(that.countDownData);
                }
            }, 1000);
        },
        // 绑定新电话
        bindNewPhone() {
            if (this.btnLock === true) {
                return;
            }
            this.btnLock = true;
            if (!global.isPhone(this.phoneNum)) {
                Toast("请先输入正确的手机号");
                this.btnLock = false;
                return;
            }
            if (this.isSendCaptcha !== true) {
                Toast("请先获取验证码");
                this.btnLock = false;
                return false;
            }
            if (!this.captcha) {
                Toast("请先输入验证码");
                this.btnLock = false;
                return;
            }
            if (this.checkStatus === false) {
                Toast("该手机号已经被绑定了~");
                this.btnLock = false;
                return false;
            }

            //  验证手机验证码
            let data = {
                mobilePhone: this.phoneNum,
                registCode: this.captcha,
                verifyType: "D_VERIFYLOG",
                verifyClassCode: "VERIFY_CHANGE_MOBILE"
            };
            UserService.checkCaptcha(data)
                .then(
                    res => {
                        //  更换新手机号
                        let changeData = {
                            newMobile: this.phoneNum,
                            oldMobile: this.userInfo.mobilePhone
                        };
                        UserService.changePhone(changeData)
                            .then(
                                res => {
                                    Toast("更换绑定成功~");
                                    this.$router.back();
                                    this.btnLock = false;
                                    // this.getUser();
                                    let userInfo = global.Storage.get(
                                        "USER_INFO"
                                    );
                                    userInfo.mobilePhone = this.phoneNum;
                                    global.Storage.set("USER_INFO", userInfo);
                                },
                                err => {
                                    Toast("绑定失败了");
                                    this.btnLock = false;
                                }
                            )
                            .then(() => {
                                this.btnLock = false;
                            });
                    },
                    () => {
                        Toast("验证码错误~");
                        this.btnLock = false;
                    }
                )
                .then(() => {
                    this.btnLock = false;
                });
        }
    }
};
</script>

