/**
 * createTime: 2018/10/23 19:21
 * author: zhibin.zhao
 * description:
 */
import Vue from "vue";
//  图片请求过滤器
import * as filter from "./filterCommon";
import {
    Base,
    Login,
    Cms,
    UserService,
    Order,
    Distribution
} from "@/api/service";
import Storage from "./storage";
import wechat from "./wechat";
import "./common";
import http from './http'
import Toast from 'vant-weapp/dist/toast/toast';

global.getImg = function (e) {
    return filter.imgFilter(e);
};

global.getVideo = function (e) {
    return filter.videoFilter(e);
};
// 获取分享图片
Vue.prototype.getShareImg = function (fileUrl, cpmpanyId) {
    return filter.getShareImg(fileUrl, cpmpanyId);
};

//  图片破损或错误时返回
global.errImg = function (e) {
    e.target.src = require(global.baseConstant.serverUrl + 'assets/images/common/septwolves.png');
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

//  将富文本中的图片相对路径替换成文件资源路径
global.getImgPath = function (str) {
    return str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (img, src) {
        let index = src.indexOf("=") + 1;
        let imgData = getImg(src.substring(index, img.length));
        return (
            '<img src="' +
            imgData +
            '" style="width: 100%; display: block; margin: 0;">'
        );
    });
}

// 图片上传 参数为File类型
global.uploadImg = function (file) {
    let param = new FormData();
    param.append("companyId", Storage.get("COMPANYID").company_id);
    // param.append('file', convertBase64UrlToBlob(file.replace(/^data:image\/(png|jpg|jpeg);base64,/,"")), "file1.png")
    param.append("file", file);
    return Base.imgUpload(param).then(
        res => {
            return res;
        },
        function (err) {
            return err;
        }
    );
}

// 判断没有OSSOPENURL时候再次获取一次环境变量
global.getEnv = function(){
    return Base.getEnv().then(res=>{
        return res
    })
}

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
        Storage.set("TEMPLATE_INFO", res[0]);
        return res[0]
    });
};

// 获取用户信息
global.c_getUserInfo = async function () {
    return UserService.getUserInfo({
        "usrId": Storage.get("USER_INFO").usrId,
        "companyId": Storage.get("COMPANYID").company_id,
    })
}

// 获取公共常量配置信息
global.Const = function () {
    if (!global.baseConstant.wxUnionid) {
        return Cms.getProperties().then(res => {
            global.baseConstant.wxUnionid = res.mpUuid;
            Storage.set("COMPANYID", {
                company_id: res.companyId
            });
            Storage.set("properties", {
                iframeUrl: res.iframeUrl,
                wxUnionid: res.mpUuid,
                shopId: res.shopIds
            });
            return global.getTemplate();
        });
    } else {
        return global.getTemplate();
    }
}

//调取微信客服
global.contact = function () {
    wx.miniProgram.navigateTo({
        url: "../contact/contact"
    });
}

// 商品提交订单 生成中间表id
global.c_emitBill = function (orderData) {
    return Order.saveCartTemp(orderData).then((res) => {
        return Order.orderPreferCal({
            ordId: res
        }).then(() => {
            return res;
        });
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

// 来自小程序
global.showLoading = function () {
    wx.showLoading({
        title: '加载中'
    })
}

global.setUserInfoAndNext = function (res) {
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (global.userInfoReadyCallback) {
        global.userInfoReadyCallback(res)
    }
    wx.hideLoading()
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

// 获取手机号sessionKey过期
global.againGetLogin = function (param) {
    return wechat.login().then(result => {
        param.code = result.code
        return global.bindExpire(param)
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

// 绑定手机号2，针对上一个接口绑定失败或者sessionKey过期的
global.bindExpire = function (param) {
        return wechat.putRequest(global.baseConstant.serverUrl + 'analysis/bindExpire', param).then(res => {
            console.log("-------", res, res.data)
            if (!res.data.usrId) {
                if (!!res.data.statusCode) {
                    return res.data
                } else {
                    console.log("获取手机号失败！！！")
                    return false
                }
            }
            return true
        }, err => {
            return false
        }).catch(e => {
            console.log(e)
            return false
        })
    }

// 联合登录
global.mergLogin = function (code) {
        return wechat.getUserInfo().then(res => {
            return new Promise((reslove, reject) => {
                http.get(
                    global.baseConstant.serverUrl + 'login/mergeLogin', {
                        code: code,
                        userInfo: res
                    }
                ).then(result => {
                    console.log('联合登陆结果', result)
                    if (!result.usrId) {
                        reject(false)
                    }
                    /* wx.setStorageSync("USER_INFO", {
						usrId: result.usrId,
						shopId: result.shopId,
						shopCode: result.shopCode,
						vipInfoId: result.vipInfoId
					}); */
                    wx.setStorageSync('USER_INFO', result)
                    console.log(result)
                    wx.setStorageSync('WECHAT_INFO', {openid: result.openId})
                    // global.setUserInfoAndNext();
                    reslove(result)
                })
            })
        })
    }

// 授权弹窗拒绝、未出现过即从未授权过需要执行的代码（）
global.authorWindow = function () {
        wx.reLaunch({
            url: '../../page/coupons/coupons'
        })
    },

// 判断在Storage中有无USER_INFO信息
global.getStorage = function () {
        wx.getStorage({
            key: 'USER_INFO',
            success: function (res) {
                return true;
            },
            fail: function (res) {
            },
            complete: function (res) {
            },
        })
    }

// 跳转首页
global.goToIndex = function () {
        wx.navigateTo({
            url: '../index/index'
        })
    }

//类似小程序switchTab跳转
global.switchTab = function (goPath) {
    var currentPages = getCurrentPages();
    //没有经过首页时,如通过分享进来时
    if (currentPages.length === 1 && currentPages[0].route != "pages/home/home") {
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

//弹窗处理
global.DialogDeal = function (option, showCancel = true) {
        return new Promise(function (resolve, reject) {
            var title = option.title || '';
            var content = option.message || '';
            var cancelText = option.cancelButtonText || '取消';
            var confirmText = option.confirmButtonText || '确定';
            wx.showModal({
                title: title,
                content: content,
                cancelText: cancelText,
                confirmText: confirmText,
                showCancel: showCancel,
                success(res) {
                    if (res.confirm) {
                        resolve(res);
                    } else if (res.cancel) {
                        reject(res);
                    }
                },
                fail(res) {
                    reject(res);
                },
            })
        })
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
    return new Promise(function (resolve, reject) {
        wx.getImageInfo({
            src: imgUrl,
            success: function (res) {
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


global.randomNum = function(num) {
    num = !!num ? num : 2
    let randomNum = '';
    for (let i = 0; i < num; i ++) {
        randomNum += Math.floor(Math.random()*10);
    }
    return randomNum;
}

//将base64转化为本地图片地址，不然canvas上绘画不出来
global.getImgBase64ToLocalUrl = function (base64Img) {
    let timeStap = Date.now()
    let root = this;
    const FILE_BASE_NAME = 'tmp_base64src' + timeStap + global.randomNum(3); //自定义文件名
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64Img) || [];
    if (!format) {
        return (new Error('ERROR_BASE64SRC_PARSE'));
    }
    return new Promise(function (resolve, reject) {
        /// 临时图片路径
        let filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
        let buffer = wx.base64ToArrayBuffer(bodyData);//转二进制的base64需要去掉文件的data:image前面部分
        /// 绘制成图片
        wx.getFileSystemManager().writeFile({
            filePath,
            data: buffer,
            encoding: 'binary',
            async success(res) {
                let path = await global.getImgToLocalUrl(filePath)
                resolve(path);
            },
            fail() {
                reject('');
            }
        });
    })
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
