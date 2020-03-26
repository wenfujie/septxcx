/**
 * createTime: 2018/10/23 19:21
 * author: zhibin.zhao
 * description:
 */
//  图片请求过滤器
import * as filter from "./filterCommon";
import {
    Base,
    Cms,
    Vouchers,
    UserService,
    Distribution
} from "@/api/service";
import Storage from "./storage";
import wechat from "./wechat";
import "./common";
import http from './http'
import Toast from 'vant-weapp/dist/toast/toast';
import Store from '../store/index'

global.getImg = function (e) {
    return filter.imgFilter(e);
};

// 验证手机号
global.isPhone = function (phone) {
    if (typeof phone === "string") {
        phone = parseInt(phone);
    }
    let reg = /^1(((5[0-35-9][0-9])|([34879][0-9]{2}))[0-9]{7})$/;
    return reg.test(phone);
};

//  校验电子邮箱
global.isEmail = function (str) {
    let reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g
    return reg.test(str)

}

//  截取url中search所带参数的值
global.getQueryVariable = function (url, variable) {
    var vars = url.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return "";
};

// 获取模板
global.getTemplate = function () {
    let busContsCode = global.baseConstant.busContsCode
    let properties = Storage.get('properties')
    if (!busContsCode && !!properties) {
        busContsCode = properties.busContsCode
    }
    let data = {
        busContsCode: busContsCode,
        shopId: Storage.get('properties').shopId
    };
    return Cms.getTemplate(data).then(res => {
        let template = res
        if(res.constructor==Array){
            template = res[0]
            Storage.set("TEMPLATE_INFO", res[0]);
        }else{
            Storage.set("TEMPLATE_INFO", res);
        }
        return template
    });
};

// 获取用户信息
global.c_getUserInfo = async function () {
    return UserService.getUserInfo({
        "vipInfoHdId": Storage.get("USER_INFO").vipInfoId,
        "usrId": Storage.get("USER_INFO").usrId,
        "companyId": Storage.get("COMPANYID").company_id,
    })
}

// 时间格式化
global.formatTime = function (date) {
    date = new Date(date);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let min = date.getMinutes();
    min = min < 10 ? ('0' + min) : min;
    let s = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;
    return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
}

/**
 * 对象去重
 *  利用对象访问属性的方法，判断对象中是否存在key
 * @param listData
 * @param key
 * @returns {Array}
 */
global.objCombine = function (listData, key) {
    let result = []
    let obj = {}
    for (let i = 0; i < listData.length; i++) {
        if (!obj[listData[i][key]]) {
            result.push(listData[i])
            obj[listData[i][key]] = true
        }
    }

    return result
}

/**
 * 赠品sku排序
 * @param field 根据哪个字段名排序
 * @returns {Function}
 */
global.compare = function (field) {
    return function (obj1, obj2) {
        let val1 = obj1[field]
        let val2 = obj2[field]
        if (val1 < val2) { // 倒序
            return -1
        } else if (val1 > val2) {
            return 1
        } else {
            return 0
        }
    }
}

/**
 * 生成随机数
 * mathSelect(0,2)
 * 代表生成0-2之间的随机数
 * @param start 最小值
 * @param end 最大值
 * @returns {number}
 */
global.mathSelect = function (start, end) {
    let total = end - start + 1
    return Math.floor(Math.random() * total + start)
}

// 判断用户是否是分销商
global.userIsDistribution = function () {
    let data = {
        vipInfoHdId: Storage.get('USER_INFO').vipInfoId,
        busconsCode: global.baseConstant.busContsCode,
    }
    return Distribution.isDistribution(data).then((res) => {
        return !!res.isVipMdt ? true : false
    }, (err) => {
        return false
    })
}

// 获取省市区数据
global.getCityData = function(){
    return Base.getCityData().then(res=>{
        return res
    })
}

// 来自小程序
global.showLoading = function (option = {}) {
    wx.showLoading({
        title: '加载中',
        mask: option.mask || false,
    })
}
// 来自小程序
global.hideLoading = function () {
    wx.hideLoading();
}

global.setUserInfoAndNext = function (res) {
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (global.userInfoReadyCallback) {
        global.userInfoReadyCallback(res)
    }
    wx.hideLoading()
}

// 获取properties，在项目初始化时候请求，在每次登录时更新
global.getBaseParams = function () {
    return Base.getBaseParams({appId: global.baseConstant.appId}).then(res=>{
        if(!res.companyId){
            Storage.clear()
            return false
        }
        Storage.set('COMPANYID', {company_id: res.companyId})
        Storage.set('properties', {
            companyId: res.companyId,
            shopId: res.dptId,
            shopCode: res.dptCode,
            busContsCode: res.platformCode,
            ossOpenUrl: res.ossOpenUrl,
            wxUnionid: res.mpUuid,
            publicAccount: res.publicAccount,
            appId: res.appId,
            appSecret: res.appSecret
        })
        global.baseConstant.ossOpenUrl = res.ossOpenUrl
        global.baseConstant.busContsCode = res.platformCode
        return true
    })
}

// 获取用户授权
global.loginAuthor = function () {
    return wechat.login().then(result => {
        return wechat.getSetting().then(res => {
            if (res.authSetting['scope.userInfo'] === true) { // 成功授权
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                // console.log("已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框")
                // that.showLoading();
                let loginInfo = wx.getStorageSync('USER_INFO')
                if (!loginInfo) {
                    return global.mergLogin(result.code)
                } else {
                    global.setUserInfoAndNext(res);
                    return true
                }
            } else if (res.authSetting['scope.userInfo'] === false) { // 授权弹窗被拒绝
                console.log("弹窗被拒绝")
                global.setUserInfoAndNext(res)
                return false
            } else { // 没有弹出过授权弹窗
                global.setUserInfoAndNext(res)
                console.log("没有弹出过授权弹窗")
                return false
            }
        })
    })
}

// 校验登录状态，sessionKey是否过期
global.getPhoneNumber = function (data) {
    let loginInfo = wx.getStorageSync('USER_INFO')
    let param = {
        encryptedData: data.encryptedData,
        iv: data.iv,
        sessionKey: loginInfo.sessionKey,
        appId: loginInfo.appId,
        secret: loginInfo.secret,
        ownCompanyId: loginInfo.companyId,
        companyId: loginInfo.companyId,
        usrId: loginInfo.usrId,
        sourceCode: global.baseConstant.busContsCode,
        isUnVerifyBind: 1
    }
    return wechat.checkSession().then((status) => {
        // session_key 未过期，并且在本生命周期一直有效
        console.log("未过期，并且在本生命周期一直有效")
        return global.bindPhoneNumber(param).then(res => {
            return res
        })
    }, () => {
        console.log("过期")
        return global.againGetLogin(param)
    })
}

// 调用绑定手机号接口
global.bindPhoneNumber = function (param) {
    return wechat.putRequest(global.baseConstant.serverUrl + 'analysis/bindPhone', param).then(res => {
        console.log("-------", res, res.data)
        if (!res.data.usrId) {
            if (!!res.data.statusCode) {
                return res.data
            } else {
                console.log("得重新授权")
                return global.againGetLogin(param)
            }
        }
        return true
    }, err => {
        return false
    }).catch(e => {
        console.log(e)
    })
}

// 联合登录
global.mergLogin = function (code) {
    return wechat.getUserInfo().then(res => {
        console.log("res",res)
        return new Promise((reslove, reject) => {
            let properties = wx.getStorageSync('properties')
            http.get(
                global.baseConstant.serverUrl + 'login/mergeLogin', {
                code: code,
                userInfo: res,
                properties: properties
            }
            ).then(result => {
                console.log('联合登陆结果', result)
                if (!result.vipInfoId) {
                    reject(false)
                }
                wx.setStorageSync('USER_INFO', result)
                console.log(result)
                wx.setStorageSync('WECHAT_INFO', { openid: result.openId })
                reslove(result)
            })
        })
    })
}
// 重新获取用户信息
global.updateUserInfo = function () {
    return wechat.login().then(result => {
        return wechat.getSetting().then(res => {
            if (res.authSetting['scope.userInfo'] === true) { // 成功授权
                return global.mergLogin(result.code)
            }
        });
    });
};
//类似小程序switchTab跳转
global.switchTab = function (goPath) {
    var currentPages = getCurrentPages();
    //没有经过首页时,如通过分享进来时
    if (currentPages[0].route != "pages/home/home") {
        wx.redirectTo({
            url: '/pages/home/home?goPath=' + goPath
        })
    } else {
        let length = currentPages.length;
        //触发首页onLoad去改变tab
        currentPages[0].onLoad({
            "goPath": goPath
        });
        if (length > 1) {
            wx.navigateBack({
                delta: length - 1
            })
        }
    }
}

//封装小程序Toast
//icon为none	不显示图标，此时 title 文本最多可显示两行
global.Toast = function (title, icon = 'none') {
    return new Promise(function (resolve, reject) {
        wx.showToast({
            title: title,
            icon: icon,
            duration: 3000,
            success: function () {
                resolve();
            },
            fail: function (error) {
                reject(error);
            },
        })
    });
}

/**
 * @action vant toast的loading提示
 * @params
 *  msg：内容；
 *  duration：展示时长；
 *  loadingType：加载图标类型,可选值为 spinner；
 *  mask：是否显示背景蒙层；
 *  forbidClick：是否禁止背景点击；
 * @use
 * html: <van-toast id="van-toast" />
 * js:
 * global.toastLoading();// 开启
 * global.toastLoading(false);// 关闭
 *
 */
global.toastLoading = function (msg = '加载中...', duration = 0, loadingType = 'circular', mask = false, forbidClick = true) {
    if (arguments.length === 1 && !arguments[0]) {
        Toast.clear();
    } else {
        Toast.loading({
            message: msg,
            duration: duration,
            loadingType: loadingType,
            mask: false,
            forbidClick: true
        });
    }
}

// 对象转化成url上带的参数
global.urlEncode = function (param, key, encode) {
    if (param == null) return '';
    let paramStr = '';
    let t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
        for (let i in param) {
            let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
            paramStr += global.urlEncode(param[i], k, encode)
        }
    }
    return paramStr;
}


//将网络图片等图片地址转化为本地图片地址，不然canvas上绘画不出来
global.getImgToLocalUrl = function (imgUrl) {
    console.log('getImgToLocalUrl，转为本地图片')
    return new Promise(function (resolve, reject) {
        wx.getImageInfo({
            src: imgUrl,
            success: function (res) {
                console.log('getImageInfo，成功转为本地图片')
                //res.path是网络图片的本地地址
                let Path = res.path;
                resolve(Path);
            },
            fail: function (res) {
                reject('');
            }
        });
    })
}
global.randomNum = function (num) {
    num = !!num ? num : 2
    let randomNum = '';
    for (let i = 0; i < num; i++) {
        randomNum += Math.floor(Math.random() * 10);
    }
    return randomNum;
}
//将base64转化为本地图片地址，不然canvas上绘画不出来
global.getImgBase64ToLocalUrl = function (base64Img) {
    console.log('getImgBase64ToLocalUrl，转临时文件')
    let timeStap = Date.now()
    let root = this;
    const FILE_BASE_NAME = 'tmp_base64src' + timeStap + global.randomNum(); //自定义文件名
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64Img) || [];
    if (!format) {
        return (new Error('ERROR_BASE64SRC_PARSE'));
    }
    return new Promise(function (resolve, reject) {
        /// 临时图片路径
        let filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
        let buffer = wx.base64ToArrayBuffer(bodyData);//转二进制的base64需要去掉文件的data:image前面部分
        /// 绘制成图片
        const fsm = wx.getFileSystemManager();
        fsm.writeFile({
            filePath,
            data: buffer,
            encoding: 'binary',
            async success(res) {
                console.log('getFileSystemManager，转临时文件成功')
                let path = await global.getImgToLocalUrl(filePath)
                resolve(path);
            },
            fail() {
                reject('');
            }
        });
    })
}

//  绑定手机号成功发券
global.sendCardCoupons = function () {
    return Vouchers.sendCardCoupons({ shopId: Storage.get('properties').shopId })
}

// 获取分享页面参数
global.getShareUrl = function (url, shareParams = {}) {

    //  授权页面路由配置
    let baseUrl = '/pages/coupons?shareUrl='

    //  转发、分享的页面路径
    let pageUrl = '/' + url

    //  去掉页面路径上可能重复携带的分享参数
    for (let key in shareParams) {
        if (key === 'vipId' || key === 'isVipMdt' || key === 'shareUrl') {
            delete shareParams[key]
        }
    }

    //  转发、分享携带当前用户的会员id，作为绑定上下级的标识
    shareParams.vipId = global.Storage.get('USER_INFO').vipInfoId

    //  会员整合后分销商模块使用选中的分销商id以及对应的会员id
    if(url.indexOf('distributionPackage') !== -1) {
        shareParams.vipId = Store.state.distribution.accountInfo.vipInfoHdId
    }

    //  将对象转化成拼接在url上的参数格式
    shareParams = global.urlEncode(shareParams);
    shareParams = shareParams ? '?' + shareParams.substring(1, shareParams.length) : '';

    //  分享路径
    pageUrl += shareParams
    pageUrl = encodeURIComponent(pageUrl)
    let shareUrl = baseUrl + pageUrl

    console.log('分享路径', shareUrl)

    return shareUrl

}
//商品详情页的数据栈
global.detail_data = [];

/** 更新已整合用户长度 **/
global.updateRelationAccountLength = function () {
    let data = {
        vipInfoHdId: global.Storage.get('USER_INFO').vipInfoId,
    }
    // 增加缓存变量(会员整合用户长度)
    UserService.getRelationAccountList(data).then(res => {
        let userInfo = global.Storage.get("USER_INFO");
        userInfo.relationAccountLength = res.length ? res.length - 1 : 0;
        global.Storage.set("USER_INFO", userInfo);
    })
}

global.c_debounce = function(fn, wait, vm) {
//        this.timeout = null;
    if(vm.c_timeout) clearTimeout(vm.c_timeout);
    vm.c_timeout = setTimeout(fn, wait);
}

/** 解决苹果手机兼容问题：new Date('2018-09-09 23:23:23').getTime()  值为NaN问题
 * @param dateStr:  String (如'2018-09-09 23:23:23')
 * **/
global.c_getDateStamp = function(dateStr) {
    return new Date(dateStr.replace(/-/g,'/')).getTime();
}
