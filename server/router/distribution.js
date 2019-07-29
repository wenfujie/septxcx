/*
* createTime：2019/2/28
* author：en.chen
* description: 分销模块路由
*/

const distribution = require('../controller/distribution/distribution')

module.exports = {
    "POST/bind": distribution.bindLevel,  //  发展下级分销商(绑定上下级关系)（巍建）
    "GET/article": distribution.getArticle,  // 获取注册协议（巍建）
    "GET/reward": distribution.getReward,  // 获取成为分销商奖励金（巍建）
    "POST/apply": distribution.applyVip,  // 申请成为分销商（巍建）
    "GET/vipInfo": distribution.getVipInfo,  // 分销商账户信息记录（毅杰）
    "GET/failReason": distribution.checkFailReason,  // 查询提现、转账失败原因 (文杰)
    "GET/walletList": distribution.getWalletList,  // 查询我的钱包流水列表
    "GET/withdrawRule": distribution.getWithdrawRule,  // 获取申请提现之前的规则信息(文杰)
    "POST/applyWithdraw": distribution.applyWithdraw,  // 申请提现(文杰)
    "GET/withdrawList": distribution.getWithdrawList,  // 查询提现流水列表(文杰)
    "GET/subordinateList": distribution.getSubordinateList,  // 获取分销商下级会员信息（巍建）
    "GET/billList": distribution.getBillList,  // 获取下级会员对账单列表(文杰)
    "GET/secondaryBillInfo": distribution.getSecondaryBillInfo,  // 获取次级会员对账单信息(文杰)
    "GET/sendEmail": distribution.sendEmail,  // 导出到邮箱(下级会员账单) (文杰)
    "GET/rankList": distribution.getRankList,  // 获取分销商直属下级分润排名(文杰)
    "GET/taskList": distribution.getTaskList,  //  获取分销商任务列表 (少敏)
    "GET/taskDetail": distribution.getTaskDetail,  //  获取分销商任务详情（少敏）
    "GET/isDistribution": distribution.isDistribution,  //  判断用户是否是分销商(巍建)
    "GET/userInfo": distribution.getUserInfo,  //  通过vipId获取会员信息(公用接口)
    "GET/qrcode": distribution.getWechatQrcode,  //  通过vipId生成会员的小程序二维码(巍建)
    "GET/qrcodeWithText": distribution.qrcodeWithText,  //  通过vipId和转发文字生成会员的小程序二维码(伟生)
    "GET/canBindLevel": distribution.canBindLevel,  //  判断用户能否可以成为下级分销商(巍建)
    "PUT/setFlag": distribution.setFlag,  //  设置分销商首次登陆标记(毅杰)
    "GET/levelRule": distribution.getLevelRule,  //  获取分销商模块配置规则,用于分销商对账单查询传参(文杰)
};