/*
 * createTime：2018/7/2
 * author：en.chen
 * description: 前端用户模块api聚合
 */

import http from '../../utils/http'

/**
 * 获取会员地址列表
 * @param config
 * var param = {
    usrId：用户Id,
    companyId：公司Id,
    vipUsrId: 用户id
    }
 * @returns {*}
 */
export const getAddrList = (config) => {
    return http.get('user/getAddrList', config);
}
/**
 * 新增/修改会员地址
 * @param config
 * var param = {
    usrId：用户Id,
    companyId：公司Id,
    id: 地址id, // 新增可不传
    address: 详细地址,
    cargousrName: 收货人,
    cargoMobile: 收货人手机,
    cargoPhone: 收货人电话,
    cargoZipcode: 收货人邮编,
    addressMemo: 会员地址说明,
    defaultFlag: 是否默认
    }
 * @returns {*}
 */
export const changeAddrInfo = (config) => {
    return http.post('user/changeAddrInfo', config);
}

/**
 * 删除会员地址列表
 * @param config
 * var param = {
    usrId：用户Id,
    companyId：公司Id,
    ids: '会员地址信息表id'
    }
 * @returns {*}
 */
export const deleteAddrList = (config) => {
    return http.delete('user/deleteAddrList', config);
}

/**
 * 获取会员地址详情
 * @param config
 * var param = {
    usrId：用户Id,
    companyId：公司Id,
    addressId: '区id'
    }
 * @returns {*}
 */
export const getAddrDetail = (config) => {
    return http.get('user/getAddrDetail', config);
}

/**
 * 获取验证码先置msg
 * @param config
 * var param = {
    mobile: 手机号，
    isSend: 为true直接发短信，false或null则不发
    verifyClassCode：（VERIFY_LOGON  登录，VERIFY_BIND_MOBILE  绑定手机号，VERIFY_FIND_PWD  找回密码，VERIFY_CHANGE_MOBILE  修改手机号）
    }
 * @returns {*}
 */
export const getCaptcha = (config) => {
    return http.get('user/getCaptcha', config);
}

/**
 * 校验手机号是否绑定
 * @param config
 * var param = {
    ctmUsrId: 用户Id,
    mobile: 手机号,
    companyKey: 公司id
    }
 * @returns {*}
 */
export const checkPhone = (config) => {
    return http.get('user/checkPhone', config);
}

/**
 * 绑定手机号
 * @param config
 * var param = {
    usrId:"用户ID",
    companyId:"公司",
    mobile:"手机号",
    buscontsId: '业务触点'
    }
 * @returns {*}
 */
export const bindMobile = (config) => {
    return http.put('user/bindMobile', config);
}

/**
 * 校验手机验证码
 * @param config
 * var param = {
    "usrId":"1",
    "companyId":"1005203",
    "mobilePhone":"15280017042",
    "registCode":"验证码",
    "verifyType":"D_VERIFYLOG",
        *verifyClassCode：（VERIFY_LOGON  登录，VERIFY_BIND_MOBILE  绑定手机号，VERIFY_FIND_PWD  找回密码，VERIFY_CHANGE_MOBILE  修改手机号），
    onlyVerify: "登陆标识（未登陆传1）"
    }
 * @returns {*}
 */
export const checkCaptcha = (config) => {
    return http.post('user/checkCaptcha', config);
}

/**
 * 更改绑定的手机号
 * @param config
 * var param = {
    "usrId": 用户id,
    "companyId": 公司id,
    "newMobile": 新手机号,
    "oldMobile":"旧手机号",
    }
 * @returns {*}
 */
export const changePhone = (config) => {
    return http.put('user/changePhone', config);
}

/**
 * 获取账户页面会员信息
 * @param config
 * var param = {
    "usrId": 用户id,
    "companyId": 公司id,
    busContsCode: '业务触点'
    }
 * @returns {*}
 */
export const getVipInfo = (config) => {
    return http.get('user/getVipInfo', config);
}

/**
 * 获取会员信息
 * @param config
 * var param = {
    "usrId": 用户id,
    "companyId": 公司id,
    }
 * @returns {*}
 */
export const getUserInfo = (config) => {
    return http.get('user/getUserInfo', config);
}

/**
 * 修改会员信息
 * @param config
 * var param = {
    "usrId": 用户id,
    "companyId": 公司id,
    account: '会员账号',
    solarCalendar: '会员生日',
    sexCode: '性别',
    email: '邮箱',
    usrCode: '用户编码',
    destId: '省市区id',
    addr: '省市区地址',
    secRetQuestion: '密保问题',
    secRetAnswer: '密保答案'
    }
 * @returns {*}
 */
export const updateUserInfo = (config) => {
    return http.put('user/updateUserInfo', config);
}

/**
 * 获取会员自定义属性
 * @param config
 * var param = {
    usrId: 用户id,
    companyId: 公司id,
    busContsCode: 业务触点
    }
 * @returns {*}
 */
export const getMemberInfo = (config) => {
    return http.get('user/getMemberInfo', config);
}

/**
 * 修改会员自定义属性
 * @param config
 * var param = {
    usrId: 用户id,
    companyId: 公司id,
    customs: [
      {
         "customCode":"会员属性",
         "customValue":"属性值"
      }
   ]
    }
 * @returns {*}
 */
export const updateMemberInfo = (config) => {
    return http.put('user/updateMemberInfo', config);
}

/**
 * 获取我的会籍会员
 * @param config
 * var param = {
   "usrId":"用户ID",
   "companyId":"公司id",
   "wxUnionid":"微信公众号唯一标示"
    }
 * @returns {*}
 */
export const getMyCardInfo = (config) => {
    return http.get('user/getMyCardInfo', config);
}

/**
 * 获取商品详情的气泡，已购买的用户列表
 * var param = {
    num:"返回的气泡数量",
    companyId: 公司id,
    }
 * @param {*}
 */
export const getGoodsClient = (config) => {
    return http.get('user/getGoodsClient', config);
}
/**
 * 保存我的足迹
 * @param config
 * var param = {
    usrId: 用户id,
    companyId: 公司id,
    busContsCode: '业务触点'
    dptId: '店铺id',
    goodsCode: '商品编码'
    }
 * @returns {*}
 */
export const saveUserFootprint = (config) => { return http.post('user/saveUserFootprint', config); }
/**
 * 获取会员整合用户列表
 * @param config
 * var param = {
    companyId：公司Id,
    ownCompanyId：公司Id,
    vipInfoHdId：会员id
    windowFlag：弹窗或者非弹窗标识（1弹窗，0非弹窗）
    }
 * @returns {*}
 */
export const memberMergeList = (config) => {
    return http.get('user/memberMergeList', config);
}

/**
 * 获取用户关联账户列表
 * @param config
 * var param = {
    companyId：公司Id,
    ownCompanyId：公司Id,
    vipId:会员id(vipInfoHdId)
    }
 * @returns {*}
 */
export const getRelationAccountList = (config) => {
    return http.get('user/getRelationAccountList', config);
}

/**
 * 会员整合操作 （不整合；此账号不是我的；验证码确认；账号密码确认）
 * @param 不整合
 * var param = {
  "confirmFlag": 0, // 操作标识
  "ids": [45,49], // 被整合用户列表id
  "usrId": 1331,
  "companyId": 536,
  "vipInfoHdId": 653 // 当前登录用户的vipInfoHdId
}
 * @param 此账号不是我的
 * var param = {
  "confirmFlag": 1, // 操作标识
  "relId": 50, // 被整合用户列表id
  "relVipInfoHdId": 645, // 被整合用户列表vipInfoHdId
  "usrId": 1331,
  "companyId": 536,
  "vipInfoHdId": 653 // 当前登录用户的vipInfoHdId
}
 * @param 验证码确认
 * var param = {
  "confirmFlag": 2,
  "relId": 50,
  "relVipInfoHdId": 645,
  "account": "手机号",
  "verifyClassCode": "前端调用获取验证码传什么类型，就传一样的类型",
  "verifyCode": "验证码",
  "usrId": 1331,
  "companyId": 536,
  "vipInfoHdId": 653
}
 * @param 账号密码确认
 * var param = {
  "confirmFlag": 3,
  "relId": 50,
  "relVipInfoHdId": 645,
  "account": "账号/手机号",
  "verifyCode": "密码（加密）",
  "usrId": 1331,
  "companyId": 536,
  "vipInfoHdId": 653
}
 * @returns {*}
 */
export const memberMergeOperator = (config) => {
    return http.post('user/memberMergeOperator', config);
}

/**
 * 获取会员用户对应的等级设置的最低可用积分
 * @param config
 * var param = {
   "usrId":"用户ID"
   "companyId":"公司",
    }
 * @returns {*}
 */
export const getMinIntegral = (config) => {
    return http.get('user/getMinIntegral', config);
}
