/*
 * createTime：2018/12/22
 * author：en.chen
 * description: 资金模块
 */

class fund {
  // 获取账户可用资金
  static async getFund(ctx, params) {
    let url = "/vip-info-dt-funds/usr-id/" + params.usrId;
    return ctx
      .$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params)
      .then(res => {
        return res;
      });
  }

  // 获取资金详情列表
  static async getFundsList(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl + ctx.serverPortUrl.memberService + "/vip-info-dtt-funds",
        params
      )
      .then(res => {
        return res;
      });
  }

  //  微信充值
  static async wxCharge(ctx, params) {
    return ctx
      .$post(
        ctx.baseUrl +
          ctx.serverPortUrl.memberService +
          `/vippay-logs/wechat-recharge?paysetDtDisId=${
            params.paysetDtDisId
          }&busContsCode=${params.busContsCode}&usrId=${
            params.usrId
          }&companyId=${params.companyId}`,
        params
      )
      .then(res => {
        return res;
      });
  }
  //  获取充值卡信息列表
  static async getChargeTypeList(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
          ctx.serverPortUrl.memberService +
          "/payset-hds/detail-list",
        params
      )
      .then(res => {
        return res;
      });
  }
  //  获取充值卡信息列表
  static async getChargeCardList(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
          ctx.serverPortUrl.memberService +
          "/value-card-cards-aggregate/getValueCardCardList",
        params
      )
      .then(res => {
        return res;
      });
  }
  //  通过卡号密码充值
  static async chargeByCardNum(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
          ctx.serverPortUrl.memberService +
          "/value-card-cards-aggregate/rechargeByCardNum",
        params
      )
      .then(
        res => {
          return {
            code: 200,
            msg: "充值成功"
          };
        },
        err => {
          return {
            code: err.status,
            msg: err.data.errorMsg
          };
        }
      );
  }
  //  通过校验卡是否需要密码才能充值
  static async getCardInfoForCheck(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
          ctx.serverPortUrl.memberService +
          `/value-card-cards-aggregate/getCardInfo`,
        params
      )
      .then(res => {
        return res;
      });
  }
  // 根据充值卡id充值
  static async chargeByCardId(ctx, params) {
    return ctx
      .$get(
        ctx.baseUrl +
          ctx.serverPortUrl.memberService +
          "/value-card-cards-aggregate/rechargeImmediately",
        params
      )
      .then(res => {
        return res;
      });
  }
}

module.exports = fund;
