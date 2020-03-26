/*
* createTime：2019/2/28
* author：en.chen
* description: 分销模块路由
*/

const distributionFun = require('../controller/distribution')

module.exports = {
    "POST/bindLevel": distributionFun.bindLevel,  //  发展下级分销商(绑定上下级关系)（巍建）
    "GET/getArticle": distributionFun.getArticle,  // 获取注册协议（巍建）
    "GET/getReward": distributionFun.getReward,  // 获取成为分销商奖励金（巍建）
    "POST/applyVip": distributionFun.applyVip,  // 申请成为分销商（巍建）
    "GET/getVipInfo": distributionFun.getVipInfo,  // 分销商账户信息记录（毅杰）
    "GET/getFailReason": distributionFun.checkFailReason,  // 查询提现、转账失败原因 (文杰)
    "GET/getWalletList": distributionFun.getWalletList,  // 查询我的钱包流水列表
    "GET/getWithdrawRule": distributionFun.getWithdrawRule,  // 获取申请提现之前的规则信息(文杰)
    "POST/applyWithdraw": distributionFun.applyWithdraw,  // 申请提现(文杰)
    "GET/getWithdrawList": distributionFun.getWithdrawList,  // 查询提现流水列表(文杰)
    "GET/getSubordinateList": distributionFun.getSubordinateList,  // 获取分销商下级会员信息（巍建）
    "GET/getBillList": distributionFun.getBillList,  // 获取下级会员对账单列表(文杰)
    "GET/getSecondaryBillInfo": distributionFun.getSecondaryBillInfo,  // 获取次级会员对账单信息(文杰)
    "GET/sendEmail": distributionFun.sendEmail,  // 导出到邮箱(下级会员账单) (文杰)
    "GET/getRankList": distributionFun.getRankList,  // 获取分销商直属下级分润排名(文杰)
    "GET/getTaskList": distributionFun.getTaskList,  //  获取分销商任务列表 (少敏)
    "GET/getTaskDetail": distributionFun.getTaskDetail,  //  获取分销商任务详情（少敏）
    "GET/taskDetailInfo": distributionFun.getTaskDetailInfo,  //  获取分销商任务详情（伟生）
    "PUT/addShareTaskCount": distributionFun.addShareTaskCount,  // 记录转发任务的次数(毅杰)
    "GET/isDistribution": distributionFun.isDistribution,  //  判断用户是否是分销商(巍建)
    "GET/getUserInfo": distributionFun.getUserInfo,  //  通过vipId获取会员信息(公用接口)
    "GET/getWechatQrcode": distributionFun.getWechatQrcode,  //  通过vipId生成会员的小程序二维码(巍建)
    "GET/qrcodeWithText": distributionFun.qrcodeWithText,  //  通过vipId和转发文字生成会员的小程序二维码(伟生)
    "GET/canBindLevel": distributionFun.canBindLevel,  //  判断用户能否可以成为下级分销商(巍建)
    "PUT/setFlag": distributionFun.setFlag,  //  设置分销商首次登陆标记(毅杰)
    "GET/getLevelRule": distributionFun.getLevelRule,  //  获取分销商模块配置规则,用于分销商对账单查询传参(文杰)
    "PUT/readTask": distributionFun.readTask,  //  把所有任务标记为已读(罗凯铭)
    "GET/getDistributionList": distributionFun.getDistributionList,  // 会员整合新增查询同账号下的分销商账号列表
};
