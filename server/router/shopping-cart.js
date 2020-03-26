/*
 * createTime：2018/7/16
 * author：en.chen
 * description: 中间层提供给前端的购物车模块api
 */

const shoppingCartFun = require("../controller/shopping-cart");

module.exports = {
    // "PUT/transfer": shoppingCartFun.cartTransfer,
    "DELETE/deleteCart": shoppingCartFun.deleteCart,  // 删除购物车
    "POST/saveCart": shoppingCartFun.saveCart,  // 保存购物车
    "GET/getCartList": shoppingCartFun.getCartList,  // 获取购物车列表
    "GET/getCartCount": shoppingCartFun.getCartCount,  // 获取购物车数量
    // 'POST/isGoodsAndSkuShevel': shoppingCartFun.isGoodsAndSkuShevel,
    // 'POST/getshopVouchers': shoppingCartFun.getshopVouchers,
    'POST/getShopDiscountsDetail': shoppingCartFun.getShopDiscountsDetail,  // 获取购物车促销的详细信息
};
