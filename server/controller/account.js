const account = require("../model/account.js");

class AccountController {

  //  微信充值
  static async wxCharge(ctx, next) {
    let res = await account.wxCharge(ctx, ctx.params);
    ctx.body = res;
  }

}

module.exports = AccountController;
