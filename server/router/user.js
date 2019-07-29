/*
 * updateTime：2018/7/25
 * author：en.chen
 * description: 中间层提供给前端的会员模块api
 */

//  会员地址模块功能
const address = require('../controller/user/address')

//  会员基本模块功能
const base = require('../controller/user/base')

//  会员信息模块功能
const info = require('../controller/user/info')

//  会籍会员模块功能
const benefit = require('../controller/user/benefit')

module.exports = {
    "GET/addressList": address.getAddrList,
    "POST/changeAddr": address.changeAddrInfo,
    "DELETE/deleteAddr": address.deleteAddrList,
    "GET/addrDetail": address.addrDetail,
    "GET/captcha": base.getCaptcha,
    "GET/sendCaptcha": base.sendCaptcha,
    "GET/checkPhone": base.checkPhone,
    "PUT/bindMobile": base.bindMobile,
    "POST/checkCaptcha": base.checkCaptcha,
    "PUT/changePhone": base.changePhone,
    "GET/vipInfo": info.vipInfo,
    "GET/userInfo": info.userInfo,
    "PUT/updateUserInfo": info.updateInfo,
    "GET/memberInfo": info.memberInfo,
    "GET/getVipLevel": info.getVipLevel,
    "PUT/updateChimaInfo": info.updateChimaInfo,
    "PUT/updateMemberInfo": info.updateMemberInfo,
    "PUT/updateMemberBodyInfo": info.updateMemberBodyInfo,

    "POST/saveFootprint": info.saveFootprint,
    "GET/footPrint": info.userFootprint,
    "DELETE/deleteFootPrint": info.deleteFootprint,
    "GET/getPurchase": info.purchaseHistory,
    "GET/cardLevelList": benefit.cardLevelList,
    "GET/cardLevelDetail": benefit.cardLevelDetail,
    "GET/memberRcmd": info.memberRcmd,
    "POST/saveMemberRcmd": info.savememberRcmd,
    "GET/getGoodsClient": info.getGoodsClient,
    "GET/pointValue": benefit.pointValue,
    "GET/vipCardInfo": benefit.getVipcardinfo,
    "GET/cardVouchers": benefit.getCardVouchers,
    "PUT/buyCard": benefit.buyCard
};