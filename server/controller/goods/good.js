const goods = require("../../model/goods");

const getUseableGood = async function (ctx, next) {
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

    let mergeRes = await ctx.$requestAll([
        goods.getSellStateValue(ctx, ctx.params),
        goods.getCommonStockCustValue(ctx, ctx.params)
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
};

module.exports = {
    getUseableGood
};
