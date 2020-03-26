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
 * @description: 根据充值卡id充值
 * @author: 谢巍建
 * @param {cardId:Number}
 * @return:
 */
export const chargeByCardId = config => {
  return http.get("fund/chargeByCardId", config);
};