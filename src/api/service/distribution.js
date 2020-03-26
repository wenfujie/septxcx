/*
* createTime：2019/2/28
* author：en.chen
* description: 分销模块
*/

import http from "../../utils/http";

/**
 * 发展下级分销商（用于绑定用户上下级关系）
 * @param config
 * var param = {
    "upVipId":"上级会员id（必填）",
    "unVipId":"下级会员id（必填，需要前端注册会员用户）",
    "taskId":"分销商任务id（非必填）",
    "ascriptionId":"归属id（非必填，不传时从上级分销商获取）",
    "busconsCode":"业务触点编码（必填）",
    "companyId":"公司Id（必填）",
    "usrId":"用户Id（必填）",
    "ownCompanyId":"所属公司id（必填）"
    }
 * @returns {*}
 */

export const bindLevel = config => {
    return http.post("distribution/bindLevel", config);
};

/**
 * 获取文章内容（用于获取分销商注册协议）
 * @param config
 * var param = {
    usrId: 用户id,
    companyId: 公司id,
    catCode: 'fxsbm',
    buscontsCode: 业务触点
    }
 * @returns {*}
 */

export const getAgreement = config => {
    return http.get("distribution/getArticle", config);
};

/**
 * 获取注册成为分销商的奖励金金额
 * @param config
 * var param = {
    companyId: 公司id,
    }
 * @returns {*}
 */

export const getReward = config => {
    return http.get("distribution/getReward", config);
};

/**
 * 注册成为分销商
 * @param config
 * var param = {
    *vipInfoHdId: '会员id',
    *busconsCode: '业务触点编码',
    ascriptionId: '归属id',
    companyId: 公司id,
    }
 * @returns {*}
 */

export const applyVip = config => {
    return http.post("distribution/applyVip", config);
};

/**
 * 获取分销商信息
 * @param config
 * var param = {
    *vipInfoHdId: '会员id',
    }
 * @returns {*}
 */

export const getVipInfo = config => {
    return http.get("distribution/getVipInfo", config);
};

/**
 * 查询提现、转账失败原因
 * @param config
 * var param = {
    id: '分销商',
    }
 * @returns {*}
 */

export const getFailReason = config => {
    return http.get("distribution/getFailReason", config);
};

/**
 * 获取分销商收支明细表列表
 * @param config
 * var param = {
    vipInfoMdtId: '分销商id',
    type:  '查询类别（'in' 收入 'out' 支出）',
    pageNum: 1,
    pageSize: 10
    }
 * @returns {*}
 */

export const getWalletList = config => {
    return http.get("distribution/getWalletList", config);
};

/**
 * 获取提现规则
 * @param config
 * var param = {
    id: '分销商id',
    }
 * @returns {*}
 */

export const getWithdrawRule = config => {
    return http.get("distribution/getWithdrawRule", config);
};

/**
 * 申请提现
 * @param config
 * var param = {
    "accounts": "账号，非必填",
    "amount":  "提现金额，必填",
    "cashTypeId":  "提现方式id，必填",
    "vipInfoMdtId":  "分销商id，必填",
    }
 * @returns {*}
 */

export const applyWithdraw = config => {
    return http.post("distribution/applyWithdraw", config);
};

/**
 * 获取分销商提现列表
 * @param config
 * var param = {
    id: '分销商id',
    pageNum: 1,
    pageSize: 10
    }
 * @returns {*}
 */

export const getWithdrawList = config => {
    return http.get("distribution/getWithdrawList", config);
};

/**
 * 获取分销商下级会员信息
 * @param config
 * var param = {
    "vipId":"会员id（必填）",
    "busconsCode":"业务触点编码（必填）",
    "pageSize":"分页-条数,为0或者空,不分页",
    "pageNum":"分页-页码，下标从1开始，默认1",
    "companyId":"公司Id（必填）",
    "ownCompanyId":"所属公司id（必填）"
    }
 * @returns {*}
 */

export const getSubordinateList = config => {
    return http.get("distribution/getSubordinateList", config);
};

/**
 * 获取下级会员对账单列表
 * @param config
 * var param = {
    id: '分销商id',
    pageNum: 1,
    pageSize: 10,
    nickName:  "微信昵称",
    dateStart:  "日期起始",
    dateEnd:  "日期结束"
    }
 * @returns {*}
 */

export const getBillList = config => {
    return http.get("distribution/getBillList", config);
};

/**
 * 获取次级会员对账单信息
 * @param config
 * var param = {
    id: '分销商id',
    }
 * @returns {*}
 */

export const getSecondaryBillInfo = config => {
    return http.get("distribution/getSecondaryBillInfo", config);
};

/**
 * 导出到邮箱(下级会员账单)
 * @param config
 * var param = {
    id: '分销商id',
    addressee: '收件人邮箱地址'
    }
 * @returns {*}
 */

export const sendEmail = config => {
    return http.get("distribution/sendEmail", config);
};

/**
 * 获取下级会员对账单列表
 * @param config
 * var param = {
    id: '分销商id',
    nickName: '微信昵称',
    pageNum: 1,
    pageSize: 10,
    orderFlag: 1, // '分润排名排序方式,0按分润金额，1按下级人数'
    }
 * @returns {*}
 */

export const getRankList = config => {
    return http.get("distribution/getRankList", config);
};

/**
 * 获取分销商任务列表
 * @param config
 * var param = {
    *dateFlag: 1, // 进行中(1),已结束(0)
    }
 * @returns {*}
 */

export const getTaskList = config => {
    return http.get("distribution/getTaskList", config);
};

/**
 * 获取分销商任务详情
 * @param config
 * var param = {
    id: '分销商id',
    }
 * @returns {*}
 */

export const getTaskDetail = config => {
    return http.get("distribution/getTaskDetail", config);
};

/**
 * 判断会员是否是分销商
 * @param config
 * var param = {
    "vipInfoHdId":"会员id",
    "busconsCode":"业务触点编码",
    "companyId":"公司Id",
    "usrId":"用户Id",
    "ownCompanyId":"所属公司id"
    }
 * @returns {*}
 */

export const isDistribution = config => {
    return http.get("distribution/isDistribution", config);
};

/**
 * 通过会员id获取用户信息
 * @param config
 * var param = {
    "vipId":"会员id",
    "companyId":"公司Id",
    "usrId":"用户Id",
    "ownCompanyId":"所属公司id"
    }
 * @returns {*}
 */

export const getUserInfo = config => {
    return http.get("distribution/getUserInfo", config);
};

/**
 * 通过会员id生成小程序二维码
 * @param config
 * var param = {
    *vipId: '会员id',
    "taskId":"分销商任务id",
    "goodsCode": 商品id
    }
 * @returns {*}
 */

export const getWechatQrcode = config => {
    return http.get("distribution/getWechatQrcode", config);
};

/**
 * 判断用户能否可以成为下级分销商
 * @param config
 * var param = {
    *usrId:'用户id',
    *companyId: '公司id',
    *upVipId: '上级会员id',
    *unVipId: '下级会员id'
    }
 * @returns {*}
 */

export const canBindLevel = config => {
    return http.get("distribution/canBindLevel", config);
};

/**
 * 设置分销商首次登陆标记
 * @param config
 * var param = {
    id: '分销商id',
    usrId: '用户id',
    companyId: '公司id'
    }
 * @returns {*}
 */

export const setFlag = config => {
    return http.put("distribution/setFlag", config);
};

/**
 * 获取分销等级列表
 * @param config
 * var param = {
    companyId: '公司id'
    }
 * @returns {*}
 */

export const getLevelRule = config => {
    return http.get("distribution/getLevelRule", config);
};

/**
 * 记录分销商任务分享、转发人数
 * @param config
 * var param = {
    companyId: '公司id',
    taskId: 任务id
    }
 * @returns {*}
 */

export const addShareTaskCount = config => {
    return http.put("distribution/addShareTaskCount", config);
};

/**
 * 所有任务标记为已读
 * @param config
 * var param = {
 * vipInfoHdId: '会员id',
 * companyId: '公司id',
    }
 * @returns {*}
 */

export const readTask = config => {
    return http.put("distribution/readTask", config);
};

/**
 * 会员整合新增查询同账号下的分销商账号
 * @param config
 * var param = {
    companyId: '公司id'
    }
 * @returns {*}
 */

export const getDistributionList = config => {
    return http.get("distribution/getDistributionList", config);
};
