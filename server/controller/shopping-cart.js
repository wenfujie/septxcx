/*
 * createTime: 2019/9/21 9:27
 * author: wei.wang
 * description: 中间层提供给前端的购物车模块api
 */

const shoppingCart = require('../model/shopping-cart');

class shoppingCartController {

  // 删除购物车
  static async deleteCart (ctx) {
    let res = await shoppingCart.deleteCart(ctx, ctx.params);
    ctx.body = res;
  }

  // 保存购物车
  static async saveCart (ctx) {
    let res = await shoppingCart.saveCart(ctx, ctx.params);
    ctx.body = res;
  }

  // 获取购物车列表
  static async getCartList (ctx) {
    let res = await shoppingCart.getCartList(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 获取购物车数量
  static async getCartCount (ctx) {
    let res = await shoppingCart.getCartCount(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 获取购物车促销的详细信息
  static async getShopDiscountsDetail (ctx) {
    let res = await shoppingCart.getShopDiscountsDetail(ctx, ctx.params);
    ctx.body = res;
  }
}

module.exports = shoppingCartController;
