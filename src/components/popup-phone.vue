<!--
 * @Author: lan.chen
 * @Date: 2019-07-02 15:21:30
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-07-25 11:43:47
 * @Description: 绑定手机号弹窗，样式在style.css
 -->
<template>
    <div class="popup-phone" ref="phoneBox">
        <div class="phone-box">
            <div class="titile" @click="close()">
                绑定手机账号
                <text class="iconfont iconguanbi popup-close"></text>
            </div>
            <!--  v-inputfix -->
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
            <!-- v-inputfix -->
            <div class="form-box">
                <input
                    type="tel"
                    class="captcha-text"
                    v-model="captcha"
                    placeholder="请输入验证码"
                    maxlength="6"
                />
                <!-- v-inputfix -->
                <button
                    :class="['captcha-btn','color-mian fr',captchaLocked == true ? 'disabled' : '']"
                    @click="checkPhone"
                >{{captchaText}}</button>
            </div>
            <div class="bottom-btns" @click.stop="bindPhone">立即绑定</div>
        </div>
    </div>
</template>
<script>
import Toast from "vant-weapp/dist/toast/toast";
import { UserService } from "../api/service";
export default {
    config: {},
    props: ["touch"], //判断是调用收藏（等于1），加入购物车（等于2），还是购买（等于3）的方法
    data() {
        return {
            phoneNum: "", // 绑定手机号
            captcha: "", //验证码
            captchaText: "获取验证码", // 文字提示
            captchaLocked: false, // 获取验证码按钮锁
            isSendCaptcha: false, // 是否获取过验证码
            time: 60, // 倒计时时间
            checkStatus: false, // 手机号是否允许绑定状态
            btnLock: false //  绑定手机号按钮锁
        };
    },
    methods: {
        // 关闭绑定手机号弹框
        close() {
            this.$emit("update:showPopup", false);
        },
        //  获取用户信息
        getUser() {
            let data = {};
            UserService.getUserInfo(data).then(res => {
                this.userInfo = res;
            });
        },
        //  保留正确手机号
        phoneRule() {
            this.phoneNum = this.phoneNum.replace(/\D/g, "");
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
            this.captchaLocked = true;
            let phone = this.phoneNum;
            let data = {
                mobile: phone,
                id: global.Storage.get("USER_INFO").usrId,
                verifyClassCode: "VERIFY_BIND_MOBILE"
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
                Toast("该手机号已经被绑定了");
                this.btnLock = false;
                return false;
            }
            let data = {
                mobilePhone: this.phoneNum,
                registCode: this.captcha,
                verifyType: "D_VERIFYLOG",
                verifyClassCode: "VERIFY_BIND_MOBILE"
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
                                // 绑定手机号成功，缓存usrd
                                global.updateUserInfo().then(res => {
                                    Toast("绑定手机号成功");
                                    this.$emit("update:showPopup", false); //绑定成功，弹窗关闭
                                    this.$emit("update:showMessage", true);
                                    this.$emit("success");
                                    this.btnLock = false;
                                });
                                // global.sendCardCoupons()    // 绑定手机号成功发券
                                // let userInfo = global.Storage.get("USER_INFO");
                                // userInfo.mobilePhone = this.phoneNum;
                                // global.Storage.set("USER_INFO", userInfo);
                            },
                            () => {
                                Toast("绑定手机出错");
                                this.$emit("update:showMessage", false);
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
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.popup-phone {
    width: 100;
    padding-top: computed(60);
    .titile {
        width: 100%;
        text-align: center;
        font-size: $font-h1;
        color: rgba(13, 14, 9, 1);
        .popup-close {
            position: absolute;
            margin: computed(-15) computed(143);
        }
    }
    .bottom-btns {
        margin-top: 60px !important;
    }
}
</style>
