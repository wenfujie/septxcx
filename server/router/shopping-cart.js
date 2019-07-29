/*
 * createTime：2018/7/16
 * author：en.chen
 * description: 中间层提供给前端的购物车模块api
 */

//  批量转移购物车
const cartTransfer = require('../controller/shopping-cart/transfer')

//  删除购物车
const deleteCart = require('../controller/shopping-cart/delete')

//  保存购物车列表
const saveCart = require('../controller/shopping-cart/save')

//  获取购物车列表
const getCartList = require('../controller/shopping-cart/get-list')

//  获取购物车数量
const getCartCount = require('../controller/shopping-cart/count')

//  判断商品及SKU是否上下架
const isGoodsAndSkuShevel = require('../controller/shopping-cart/isGoodsAndSkuShevel')
// 获取优惠券
const getshopVouchers = require('../controller/shopping-cart/get-vouchers')
// 获取购物车促销的详细信息
const getshopDiscountsDetail = require('../controller/shopping-cart/get-discountsDetail')

module.exports = {
    "PUT/transfer": cartTransfer,
    "DELETE/deleteCart": deleteCart,
    "POST/saveCart": saveCart,
    "GET/cartList": getCartList, // 杨杰
    "GET/cartCount": getCartCount,
    'POST/isGoodsAndSkuShevel': isGoodsAndSkuShevel,
    'POST/getshopVouchers': getshopVouchers,
    'POST/getshopDiscountsDetail': getshopDiscountsDetail,
}