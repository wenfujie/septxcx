/*
 * @Author: yongtian.hong
 * @Date: 2018-12-22 13:35:25
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-12-22 14:49:37
 * @Description: 用户账户接口操作
 */

class account {
  //  微信充值
  static async wxCharge(ctx, params) {
    return ctx
      .$post(
        ctx.baseUrl +
          ctx.serverPortUrl.memberService +
          "/vippay-logs/wechat-recharge",
        params
      )
      .then(res => {
        return res;
      });
  }
}

module.exports = account;
