/*
 * createTime：2018/7/14
 * author：en.chen
 * description: 中间层提供给前端的商品模块api
 */

const goodsFun = require("../controller/goods");

module.exports = {
    "GET/getGoodsList": goodsFun.getGoodsList,  // 商品墙/商品列表
    "GET/getDiscountList": goodsFun.getDiscountList,  // 折扣商品
    "GET/getGoodsRecommend": goodsFun.getGoodsRecommend,  // 推荐商品列表
    "GET/getGoodsRecommendList": goodsFun.getGoodsRecommendList,  // 获取猜你喜欢商品列表（新人页面，购物车页面）（主推商品）
    "GET/getHighestSellingList": goodsFun.getHighestSellingList,  // 获取猜你喜欢商品列表(商品详情页的)（按商品分类的销量商品）
    "GET/getGoodsInfo": goodsFun.getGoodsInfo,  // 商品详情
    // "GET/goodsCombgoodInfo": goodsCombgoodInfo,
    // "GET/infoTitle": getGoodsTitle,
    // "GET/goodsClass": getGoodsClass,
    // "GET/goodsSku": getGoodsSku,
    // "GET/platformList": getPlatformList,
    "GET/getGoodsComments": goodsFun.getGoodsComments,  // 获取商品评价
    // "GET/propList": goodsPropList,
    // "GET/goodsSize": getGoodsSize,
    "GET/getGoodsStock": goodsFun.getGoodsStock,  // 获取商品库存(大货)
    // "GET/getGoodsFlag": getGoodsFlag,
    // "POST/goodsStockCust": getGoodsStockCust,
    "GET/getHotGoods": goodsFun.getHotGoods,  // 获取热门商品
    // "GET/getPutGoods": getPutGoods,
    // "GET/filterGoods": getFilterGoodsList,
    // "GET/infoCus": getGoodsInfoCusValue,
    // "GET/groupInfoCus": getGroupGoodsInfoCusValue,
    "GET/getGoodsScore": goodsFun.getGoodsScore,  // 获取商品评价综合评分
    "GET/getGoodsLayerClass": goodsFun.getGoodsLayerClass,  // 获取商品分类
    // "GET/fabricInfo": getMainFabricInfo,
    // "GET/recommendPackages": getRecommendPackages,
    // "GET/buyablePackages": getBuyablePackages,
    // "GET/fontColorList": getEmbFontColorList,
    // "GET/embPicList": getEmbPicList,
    // "GET/useablePart": getUseablePart,
    "GET/getGoodSellState": goodsFun.getGoodSellState,  // 判断商品是否上架
    // "POST/commonStockCust": getCommonStockCust,
    "GET/getGoodsPromotion": goodsFun.getGoodsPromotion, //  大货商品详情优惠促销信息(少敏)
    // "POST/judgeStock": judgeStock,
    // "GET/getGoodsCount": getGoodsCount, // 碧娟
    "GET/getGoodPreferential": goodsFun.getGoodPreferential, // 满减、满折、赠品(谢权)
    "POST/getGoodsSellState": goodsFun.getGoodsSellState, //  批量获取商品是否上架（建荣）
    "POST/getUseableGood": goodsFun.getUseableGood, //  获取商品是否上架（建荣）
    "GET/getCollocate": goodsFun.getCollocate, // 获取是否有搭配记录
    "GET/getCrumbsGoodsIds": goodsFun.getCrumbsGoodsIds,  // 获取面包屑查询条件ids的前置接口(毅杰)
    "GET/getGoodsDetailTogether": goodsFun.getGoodsDetailTogether,  // 获取商品详情（接口聚合）
    "GET/getIsShelves": goodsFun.getIsShelves,// 查询商品是否上架（nettyUrl接口）
};
