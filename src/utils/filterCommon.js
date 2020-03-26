/*
 * @Author: lan.chen
 * @Date: 2019-06-29 14:02:08
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-08-10 19:58:07
 * @Description:
 */
require('./common.js')
var baseConstant = {
    busContsCode: 'D_BUSCONTS_WSC', // 业务触点 D_BUSCONTS_B2C
    signUpTypeCode: 'D_SMP', //小程序登陆编码
    serverUrl: global.baseConstant.serverUrl, //此域名在开发和生产时需要改
    imgBaseUrl: "https://wxxcx.qishon.com/septapi/v2/oss/image/"
}
//imgFilter在js部分有用到
function imgFilter(fileUrl, companyId, imageSize = '') {
    //如果是http开头，不需要处理
    var exp = /^http/;
    var exp1 = /(png|jpe?g)$/;
    if (exp.test(fileUrl)) {
        return fileUrl
    }else if(exp1.test(fileUrl)){//未经加密的地址
        return baseConstant.serverUrl + "file-system/getImg?fileUrl=" + fileUrl + '&companyId=' + companyId
    } else if (!!fileUrl) {
        var imageUrl = (baseConstant.imgBaseUrl || global.Storage.get('properties').ossOpenUrl) + fileUrl
        if (imageSize) {
            imageUrl += '?imageSize=' + imageSize
        }
        return imageUrl
    } else {
        return baseConstant.serverUrl + 'images/septwolves.png'
    }
}

function Fix2(value) {
    if (!value) return 0;
    value = Number(value)
    var times = Math.pow(10, 2)
    var des = value * times + 0.5;
    des = parseInt(des, 10) / times;
    return des.toFixed(2)
}

function minAmount(value) {
    var fix2 = Fix2(value);
    return fix2 > 0 ? fix2 : 0;
}

function goldDivide(value) {
    if (value) {
        return Number(value).toLocaleString();
    }
    return value;
}

function saveOneDecimals(val) {
    var arr = val.toString().split(".");
    if (arr.length > 1) {
        return val.toFixed(1);
    } else {
         return arr[0];
  }
}

function filterDate(val) {
    if (val && val.length > 10) {
        return val.substring(0, 10);
    }
    return val;
}
function indexOfM(val, str) {
    return val.indexOf(str)
}

// 手机号掩码
function phoneMask(value) {
    if(value){
        return value.substring(0, 3) + '****' + value.substring(7, 11);
    }
    return value;
}

// 日期过滤器
function dateFilter(str) {
    if (str !== undefined) {
        return str.substring(5, 7) + '.' + str.substring(8, 10) + ' ' + str.substring(11, 13) + ':' + str.substring(14, 16);
    }
}
// 移除小数位
function removeFix(str) {
    if (str !== undefined && str !== null) {
        if (str.substring(str.length - 2, str.length) === '.0') {}
        return str.substring(0, str.length -2);
    }
}

module.exports.imgFilter = imgFilter;
module.exports.minAmount = minAmount;
module.exports.Fix2 = Fix2;
module.exports.goldDivide = goldDivide;
module.exports.saveOneDecimals = saveOneDecimals;
module.exports.filterDate = filterDate
module.exports.indexOfM = indexOfM
module.exports.phoneMask = phoneMask
module.exports.dateFilter = dateFilter
module.exports.removeFix = removeFix
