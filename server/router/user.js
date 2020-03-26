/*
 * updateTime：2018/7/25
 * author：en.chen
 * description: 中间层提供给前端的会员模块api
 */

//  会员地址模块功能
const addressFun = require('../controller/user/address')

//  会员基本模块功能
const baseFun = require('../controller/user/base')

//  会员信息模块功能
const infoFun = require('../controller/user/info')

//  会籍会员模块功能
const benefitFun = require('../controller/user/benefit')

module.exports = {
    "GET/getAddrList": addressFun.getAddrList,//获取会员地址列表
    "POST/changeAddrInfo": addressFun.changeAddrInfo,//新增/修改会员地址
    "DELETE/deleteAddrList": addressFun.deleteAddrList,//删除会员地址列表
    "GET/getAddrDetail": addressFun.getAddrDetail,// 获取地址详情
    "GET/getCaptcha": baseFun.getCaptcha,// 手机验证码先置code
    "GET/sendCaptcha": baseFun.sendCaptcha,//api暂无使用该接口
    "GET/checkPhone": baseFun.checkPhone,// 校验手机号是否绑定
    "PUT/bindMobile": baseFun.bindMobile,  //  绑定手机号
    "POST/checkCaptcha": baseFun.checkCaptcha, //  验证手机验证码
    "PUT/changePhone": baseFun.changePhone,  //  验证手机验证码
    "GET/getVipInfo": infoFun.getVipInfo,// 获取首页会员信息
    "GET/getUserInfo": infoFun.getUserInfo, //  获取用户信息
    "PUT/updateUserInfo": infoFun.updateUserInfo, //  修改用户信息
    "GET/getMemberInfo": infoFun.getMemberInfo, //  获取会员自定义信息
    "GET/getVipLevelInfo": infoFun.getVipLevelInfo,//根据用户获取下一等级还需要消费的金额，名称（暂时未用到）
    "PUT/updateChimaInfo": infoFun.updateChimaInfo,//api暂时未用到
    "PUT/updateMemberInfo": infoFun.updateMemberInfo, //  修改会员自定义信息
    "PUT/updateMemberBodyInfo": infoFun.updateMemberBodyInfo,////  修改会员自定义信息（api暂时未用到）
    "POST/saveUserFootprint": infoFun.saveUserFootprint,//保存浏览记录（api暂时未用到）
    "GET/getUserFootprint": infoFun.getUserFootprint,//获取我的足迹（api暂时未用到）
    "DELETE/deleteUserFootprint": infoFun.deleteUserFootprint,//删除我的足迹（api暂时未用到）
    "GET/getPurchaseHistory": infoFun.getPurchaseHistory,//消费记录（api暂时未用到）
    "GET/getCardList": benefitFun.getCardList,// 获取会籍会员列表（api未用到）
    "GET/getCardDetailValue": benefitFun.getCardDetailValue,// 获取会籍会员详情（api未用到）
    "GET/getMemberRcmd": infoFun.getMemberRcmd,//  获取会员推荐尺码（api未用到）
    "POST/saveMemberRcmd": infoFun.saveMemberRcmd,//  保存会员推荐尺码（api未用到）
    "GET/getGoodsClient": infoFun.getGoodsClient, //  获取商品详情的气泡，已购买的用户列表
    "GET/getPoint": benefitFun.getPoint,//获取积分余额（api暂未使用）
    "GET/getMyCardInfo": benefitFun.getMyCardInfo,   //  获取我的会籍会员
    "GET/getCardVouchers": benefitFun.getCardVouchers, //  获取会员卡促销
    "PUT/buyCard": benefitFun.buyCard,   //  购买会籍会员卡
    "POST/memberMergeOperator": baseFun.memberMergeOperator,  // 会员整合操作 （不整合；此账号不是我的；验证码确认；账号密码确认）
    "GET/memberMergeList": baseFun.memberMergeList,  // 获取会员整合用户列表
    "GET/getRelationAccountList": infoFun.getRelationAccountList,    //获取用户关联账户列表(包含自身)
    "GET/getMinIntegral": benefitFun.getMinIntegral, //  获取会员推荐尺码


};
