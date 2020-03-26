/*
 * createTime: 2019/9/20 15:49
 * author: wei.wang
 * description: 中间层商品模块整合
 */

const goods = require('../model/goods');

class goodsController {

  // 商品模块查询商品列表/商品墙
  static async getGoodsList (ctx) {
    let res = await goods.getGoodsList(ctx, ctx.params);
    ctx.body = res;
  }

  //
  static async getDiscountList (ctx) {
    let res = await goods.getDiscountList(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 商品模块查询平台商品的推荐商品列表
  static async getGoodsRecommend (ctx) {
    let res = await goods.getGoodsRecommend(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 商品模块查询平台商品的推荐商品列表
  static async getGoodsRecommendList (ctx) {
    let res = await goods.getGoodsRecommendList(ctx, ctx.params);
    ctx.body = res.data;
  }

  //
  static async getHighestSellingList (ctx) {
    let res = await goods.getHighestSellingList(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 商品模块查询商品详情
  static async getGoodsInfo (ctx) {
    let res = await goods.getGoodsInfo(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 商品模块查询商品评价
  static async getGoodsComments (ctx) {
    let res = await goods.getGoodsComments(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 商品模块查询商品库存
  static async getGoodsStock (ctx) {
    let res = await goods.getGoodsStock(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 商品模块查询热门商品列表
  static async getHotGoods (ctx) {
    let res = await goods.getHotGoods(ctx, ctx.params);
    // let arr = []
    // if (!!res.data && res.data.length > 0) {
    //   res.data.forEach((item) => {
    //     var settime = item.invalidTime
    //     var time = new Date(settime);
    //     time = time.getTime();
    //     var d = new Date().getTime()
    //     if (d < time) {
    //       arr.push(item);
    //     }
    //   })
    //   ctx.body = arr
    // } else {
    //   ctx.body = res.data;
    // }
    ctx.body = res.data;
  }

  // 商品评价综合得分
  static async getGoodsScore (ctx) {
    let res = await goods.getGoodsScore(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 商品分类等级查询
  static async getGoodsLayerClass (ctx) {
    let res = await goods.getGoodsLayerClass(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 判断商品是否上架
  static async getGoodSellState (ctx) {
    let res = await goods.getGoodSellState(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 大货商品详情优惠促销信息
  static async getGoodsPromotion (ctx) {
    let res = await goods.getGoodsPromotion(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 满减、满折、赠品
  static async getGoodPreferential (ctx) {
    let res = await goods.getGoodPreferential(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 批量获取上下架
  static async getGoodsSellState (ctx) {
    let res = await goods.getGoodsSellState(ctx, ctx.params);
    ctx.body = res;
  }

  // 获取是否上下架
  static async getUseableGood (ctx) {
    /** 调用接口前参数处理 **/
    let params = ctx.params;
    params.goodList.forEach((item) => {
      item.ptiPartHdCode = item.goodsCode;
      item.count = item.amount;
      item.ptiPartDtskuId = item.ptiPartDtSkuId;// 上下架需要
    })
    params.spPartGoodsSearchDtoList = params.goodList;
    params.inventoryJudgeDtos = params.spPartGoodsSearchDtoList;
    delete params.goodList;
    console.log("ctx.params",ctx.params)
    let mergeRes = await ctx.$requestAll([
      goods.getGoodsSellState(ctx, ctx.params),
      goods.getCommonStockCust(ctx, ctx.params)
    ]);

    let sellRes = mergeRes[0];// 校验下架 返回值
    let stockRes = mergeRes[1];// 校验库存 返回值

    /** 错误抛错 **/
    if (sellRes.statusCode == 500) {
      ctx.body = sellRes;
      return;
    }
    if (stockRes.statusCode == 500) {
      ctx.body = stockRes;
      return;
    }

    /** 处理返回数据 抛回前端 **/
    let sellArr = [],// 上架列表
      stockArr = [],// 有库存列表
      unStockArr = [];// 无库存列表
    let orderFlag = 1;

    // 下架列表
    let unSellArr = sellRes.filter(item => {
      if (item.sellFlag != 1 || item.skuSellFlag != 1) {
        return true;
      } else {
        sellArr.push(item);
      }
    })
    stockRes.partEnoughInfoDtos.forEach(item => {
      orderFlag = 1;// 定制不进入以下判断
      for (let i = 0; i < stockRes.partEnoughSkuInfoDtos.length; i++) {
        if (item.ptiPartHdCode == stockRes.partEnoughSkuInfoDtos[i].ptiPartHdCode) {
          orderFlag = 0;// 进入判断代表是大货
          if (stockRes.partEnoughSkuInfoDtos[i].enough == 1) {
            // 判断数组数据是否存在对应sku 不存在则push
            let stockArrExist = stockArr.some((item) => {
              if (item.ptiPartSkuId == stockRes.partEnoughSkuInfoDtos[i].ptiPartSkuId) {
                return true;
              }
            })
            if (!stockArrExist) {
              stockArr.push(stockRes.partEnoughSkuInfoDtos[i]);
            }
          } else {
            // 判断数组数据是否存在对应sku 不存在则push
            let unStockArrExist = unStockArr.some((item) => {
              if (item.ptiPartSkuId == stockRes.partEnoughSkuInfoDtos[i].ptiPartSkuId) {
                return true;
              }
            })
            if (!unStockArrExist) {
              unStockArr.push(stockRes.partEnoughSkuInfoDtos[i]);
            }
          }
          // stockRes.partEnoughSkuInfoDtos.splice(i,1);
        }
      }
      if (orderFlag == 1) {
        if (item.enough == 1) {
          stockArr.push(item);
        } else {
          unStockArr.push(item);

        }
      }
    })

    // 过滤出上架且有库存商品
    stockArr = stockArr.filter(item => {
      for (let j = 0; j < sellArr.length; j++) {
        if (item.ptiPartHdCode == sellArr[j].goodsCode) {
          if (item.ptiPartSkuId) {
            if (item.ptiPartSkuId == sellArr[j].ptiPartDtSkuId) {
              return true;
            }
          } else {
            return true;
          }
        }
      }
    })

    let sellAll = sellArr.length == sellRes.length ? 1 : 0;

    ctx.body = {
      sellAll: sellAll,
      unSellList: unSellArr,
      sellList: sellArr,
      stockAll: sellAll == 1 && stockRes.enoughAll == 1 ? 1 : 0,
      stockList: stockArr,
      unStockList: unStockArr
    };
  }

  // 获取是否有搭配记录
  static async getCollocate (ctx) {
    let res = await goods.getCollocate(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 获取面包屑查询条件ids的前置接口
  static async getCrumbsGoodsIds (ctx) {
    let res = await goods.getCrumbsGoodsIds(ctx, ctx.params);
    ctx.body = res;
  }

  // 获取商品详情（接口聚合）
  static async getGoodsDetailTogether (ctx) {
    // 参数重组
    let sellStateData = {
      partGoodsCodeList: ctx.params.goodsCode,
      buscontsCode: ctx.params.busContsCode,

    }
    ctx.params = Object.assign(ctx.params, sellStateData)

    // 接口聚合
    let res = await ctx.$requestAll([
      goods.getGoodSellState(ctx, ctx.params),    // 判断商品上下架
      goods.getGoodsInfo(ctx, ctx.params),        // 获取商品详情信息
      goods.getGoodsComments(ctx, ctx.params),    // 查询商品评价
    ])
    let data = {
      partId: res[1].data.ptiPartHdId,
      dptId: ctx.params.shopId
    }
    let preferentialData = await goods.getGoodPreferential(ctx, Object.assign(ctx.params, data))      // 满减、满折、赠品

    ctx.body = {
      sellFlagData: res[0].data,
      infoData: res[1].data,
      commentsData: res[2].data,
      preferentialData: preferentialData.data
    };
  }

  // 查询商品是否上架（nettyUrl接口）
  static async getIsShelves (ctx) {
    let res = await goods.getIsShelves(ctx, ctx.params);
    ctx.body = res.data;
  }
}

module.exports = goodsController;
