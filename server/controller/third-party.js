/*
 * @Author: yongtian.hong
 * @Date: 2018-09-26 11:33:16
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-03-21 13:21:50
 * @Description: 第三方服务
 */
const thirdParty = require("../model/third-party");

class thirdPartyController {

    // 获取物流
    static async getLogis(ctx, next) {
        let params = {
            ownCompanyId: ctx.params.companyId,
            companyId: ctx.params.companyId,
            expressCode: ctx.params.expressCode,
            logisticCode: ctx.params.logisticCode
        };
        let logis = await thirdParty.getLogis(ctx, params);
        ctx.body = logis;
    }
}
module.exports = thirdPartyController;
