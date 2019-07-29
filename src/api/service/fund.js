/*
 * createTime：2018/12/22
 * author：en.chen
 * description: 资金模块api
 */

import http from "../../utils/http";

/**
 * 获取账户资金
 * @param config
 * var param = {
    usrId: 用户id,
    companyId: 公司id,
    }
 * @returns {*}
 */

export const getFundDetail = config => {
  return http.get("fund/getFundDetail", config);
};

/**
 * 获取资金详情列表
 * @param config
 * var param = {
    *usrId: 用户id,
    *companyId: 公司id,
    *fundId: 会员资金信息表id,(关联VIP_INFO_DT_FUND的id),
    typeCode: 增减类型编码,增加：D_GRVAADD、减少：D_GRVAREDU,
    affairCode: 消费型：D_GRVACOSP,事件型:D_GRVAEVEN,
    pageNum: 1, 分页页码
    pageSize: 10 分页条数
    }
 * @returns {*}
 */

export const getFundsList = config => {
  return http.get("fund/getFundsList", config);
};

/**
 * @description: 微信充值接口
 * @author: 林少敏
 * @param {}
 * @return:
 */
export const wxCharge = config => {
  return http.post("fund/wxCharge", config);
};
/**
 * @description: 获取充值卡信息列表
 * @author: 谢巍建
 * @param {pageNum:Number,pageSize:Number}
 * @return:
 */
export const getChargeCardList = config => {
  return http.get("fund/getChargeCardList", config);
};
/**
 * @description: 通过卡号密码充值
 * @author: 谢巍建
 * @param {cardNum:Number,cardPass:Number}
 * @return:
 */
export const chargeByCardNum = config => {
  return http.get("fund/chargeByCardNum", config);
};
/**
 * @description: 校验充值卡是否需要密码
 * @author: 谢巍建
 * @param {cardNum:Number}
 * @return:
 */
export const getCardInfoForCheck = config => {
  return http.get("fund/getCardInfoForCheck", config);
};

/**
 * @description: 根据充值卡id充值
 * @author: 谢巍建
 * @param {cardId:Number}
 * @return:
 */
export const chargeByCardId = config => {
  return http.get("fund/chargeByCardId", config);
};
/**
 * @description: 获取可充值列表
 * @author: 傅伟生
 * @param {cardId:Number}
 * @return:
 */
export const getChargeTypeList = config => {
  return http.get("fund/getChargeTypeList", config);
};
