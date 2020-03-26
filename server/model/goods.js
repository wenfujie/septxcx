/*
 * @Author: lan.chen
 * @Date: 2019-06-29 14:02:07
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-08-12 09:17:55
 * @Description:
 */
/*
 * createTime：2018/7/14
 * author：en.chen
 * description: 商品模块用于处理前端请求的中间层接口
 */
const common = require('./common')

class goods {
    // 满减满折活动页
    static async getDiscountList(ctx, params) {
        let url = "/online-dtt-parts";
        return ctx
            .$get(ctx.baseUrl + ctx.serverPortUrl.promotion + url, params)
            .then(res => {
                return res;
            });
    }

    //  获取面包屑查询条件ids的前置接口
    static async getCrumbsGoodsIds(ctx, params) {
        params.orderFlags = JSON.parse(params.orderFlags)
        if (!params.platformCode) params.platformCode = ""
        let url = '/sp-goods-list/part-class-ids?busContsCode=' + params.busContsCode + '&companyId=' + params.companyId + '&queryNullBusFlag=1&shopId=' + params.shopId + '&platformCode=' + params.platformCode
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params, ctx.headers).then((res) => {
            return res
        });
    }

    //  商品墙/商品列表
    static async getGoodsList(ctx, params) {
        // params.filters = JSON.parse(params.filters)
        params.orderFlags = JSON.parse(params.orderFlags);
        let url =
            "/sp-goods-list/combgood_goods2?busContsCode=" +
            params.busContsCode +
            "&companyId=" +
            params.companyId +
            "&queryNullBusFlag=1&shopId=" +
            params.shopId +
            "&platformCode=" +
            params.platformCode;
        return ctx
            .$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + common.newUrlKey + url, params)
            // .$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params)
            .then(res => {
                return res;
            });
    }


    //  商品墙/商品列表 过滤掉orderFlag=1的大件商品
    static async getFilterGoodsListValue(ctx, params) {
        let url =
            "/sp-goods-list/combgood_goods2=" +
            params.busContsCode +
            "&platformCode=" +
            params.platformCode +
            "&companyId=" +
            params.companyId +
            "&queryNullBusFlag=1&shopId=" +
            params.shopId;
        return ctx
            .$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params)
            .then(res => {
                return res;
            });
    }
    //  热门商品列表
    static async getHotGoods(ctx, params) {
        let url = "/iss/bas/cms-searchword-hds?companyId=" + params.companyId;
        // if(!params.isShop) params.isShop = 2
        let data = Object.assign({isShop: 2}, params)
        return ctx
            .$get(ctx.baseUrl + ctx.serverPortUrl.baseService + url, data)
            .then(res => {
                return res;
            });
    }

    //  获取绣字颜色、字体列表
    static async getEmbFontColorListValue(ctx, params) {
        let url = "/ict-emb-hds-aggregate/fonnts-and-colors";
        return ctx
            .$get(ctx.nettyUrl + ctx.serverPortUrl.goodsService + common.newUrlKey +
                url, params)
            .then(res => {
                return res;
            });
    }

    //  获取商品可绣花、绣字部位
    static async getUseablePartValue(ctx, params) {
        let url = "/part-reg-ass-fabs/mtl-area";
        return ctx
            .$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params)
            .then(res => {
                return res;
            });
    }

    //  获取推荐商品
    static async getPutGoodsValue(ctx, params) {
        let url = "/sp-goods/what-you-want";
        return ctx
            .$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + common.newUrlKey +
                url, params)
            .then(res => {
                return res;
            });
    }

    //  查询单品推荐套餐
    static async getRecommendPackagesValue(ctx, params) {
        let url = "/pti-combpart-rela-dtts/show-list";
        return ctx
            .$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params)
            .then(res => {
                return res;
            });
    }

    //  获取购买可选套餐
    static async getBuyablePackagesValue(ctx, params) {
        let url = "/pti-combpart-rela-dts/eff-list";
        return ctx
            .$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params)
            .then(res => {
                return res;
            });
    }

    //  查询平台商品的推荐商品列表
    static async getGoodsRecommend(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl +
                ctx.serverPortUrl.shoppingCart +
                "/sp-goods/goods-recommend",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  查询猜你喜欢商品
    static async getGoodsRecommendList(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl +
                ctx.serverPortUrl.shoppingCart +
                "/sp-goods/recommend-list",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  查询猜你喜欢商品（商品详情）
    static async getHighestSellingList(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl +
                ctx.serverPortUrl.shoppingCart +
                "/sp-goods/highest-selling-list",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  查询商品详情
    static async getGoodsInfo(ctx, params) {
        return ctx
            .$get(
                ctx.nettyUrl +
                ctx.serverPortUrl.shoppingCart +
                common.newUrlKey +
                "/sp-part-goodss",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  查询组合商品详情
    static async getCombGoodsInfoValue(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl +
                ctx.serverPortUrl.shoppingCart +
                "/sp-combgood-goodss/comb-code",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  查询商品详情(定制)
    static async getGoodsInfoCusValue(ctx, params) {
        return ctx
            .$get(
                ctx.nettyUrl +
                ctx.serverPortUrl.goodsService +
                common.newUrlKey +
                "/part-hd-aggregates/good-info",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  获取绣花图片列表
    static async getEmbPicListValue(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl +
                ctx.serverPortUrl.shoppingCart +
                "/sp-goods/part-emb-prints",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  查询商品详情（组合2D展示）
    static async getGroupGoodsInfoCusValue(ctx, params) {
        return ctx
            .$get(
                ctx.nettyUrl +
                ctx.serverPortUrl.goodsService +
                common.newUrlKey +
                "/pti-combgood-hd-aggregates/combgood-info",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  查询商品详情目录列表
    static async getGoodsTitleValue(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl +
                ctx.serverPortUrl.shoppingCart +
                "/sp-part-goods-descs",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  获取商品分类
    static async getGoodsClassValue(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl +
                ctx.serverPortUrl.goodsService +
                "/part-class/simple-list",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  获取商品sku属性
    static async getGoodsSkuValue(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl +
                ctx.serverPortUrl.shoppingCart +
                "/sp-part-goodss/goods-sku-infos/skus",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  获取平台运营分类列表
    static async getPlatformListValue(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl + ctx.serverPortUrl.issBas + "/cms-busconcla-hds",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  获取商品评价综合评分
    static async getGoodsScore(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl +
                ctx.serverPortUrl.shoppingCart +
                "/sp-part-goodss/goods/comments/score",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  获取商品评价信息
    static async getGoodsComments(ctx, params) {
        return ctx
            .$get(
                ctx.nettyUrl +
                ctx.serverPortUrl.shoppingCart +
                common.newUrlKey +
                "/sp-part-goodss/goods/comments",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  获取风格选择列表
    static async getPropListValue(ctx, params) {
        let url = "/prop-hds/part-goods/" + params.code;
        return ctx
            .$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params)
            .then(res => {
                return res;
            });
    }

    //  获取商品尺寸列表
    static async getGoodsSizeValue(ctx, params) {
        let url =
            "/sp-part-goods-sizes/" +
            params.goodsCode +
            "/" +
            params.busContsCode;
        return ctx
            .$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params)
            .then(res => {
                return res;
            });
    }

    //  获取商品库存
    static async getGoodsStock(ctx, params) {
        return ctx
            .$get(
                ctx.nettyUrl +
                ctx.serverPortUrl.goodsService +
                common.newUrlKey +
                "/part-hds/whse-qty/goods-codes2",
                params
            )
            .then(res => {
                return res;
            });
    }

    // 判断大货商品库存（根据订单中间表id，查询商品库存） 建荣
    static async getGoodsFlag(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl +
                ctx.serverPortUrl.goodsService +
                "/lock-or-unlock-inv-aggregates/is-oos-order",
                params
            )
            .then(res => {
                return res;
            });
    }

    //  获取商品库存(定制单品)
    static async getGoodsStockCustValue(ctx, params) {
        let url = `/sp-goods/fabinvy-judge`;
        return ctx
            .$postUrl(
                ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url,
                params
            )
            .then(res => {
                return res;
            });
    }

    //  商品模块查询商品库存(单品、组合)
    static async getCommonStockCust(ctx, params) {
        let url = `/sp-goods/inventory-judge2?shopId=${params.shopId}&usrId=${
            params.usrId
            }&companyId=${params.companyId}&buscontsId=${params.busContsCode}`;
        return ctx
            .$post(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + common.newUrlKey +
                url, params)
            .then(res => {
                return res;
            });

    }

    //  商品分类等级查询
    static async getGoodsLayerClass(ctx, params) {
        let url = `/cms-busconcla-hds/layer`;
        return ctx
            .$get(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params)
            .then(res => {
                return res;
            });
    }

    //  判断商品是否上架
    static async getGoodSellState(ctx, params) {
        let url = "/sp-goods/part-sell-flag";
        return ctx
            .$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params)
            .then(res => {
                return res;
            });

    }

    //  获取商品部件信息，主面料id
    static async getMainFabricInfoValue(ctx, params) {
        let url = "/link-cfg-dts/gct-default-detail/part-code";
        return ctx
            .$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params)
            .then(res => {
                return res;
            });
    }

    //  大货商品详情优惠促销信息
    static async getGoodsPromotion(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl +
                ctx.serverPortUrl.memberService +
                "/coupons-aggregates/coupons-gifts",
                params,
                ctx.headers
            )
            .then(res => {
                return res;
            });
    }

    //  批量判断商品库存
    static async judgeStock(ctx, params) {
        params.inventoryJudgeSearchDto.ownCompanyId = params.companyId;
        return ctx
            .$post(
                ctx.nettyUrl +
                ctx.serverPortUrl.shoppingCart +
                common.newUrlKey +
                "/sp-goods/inventory-judge2?companyId=" +
                params.companyId +
                "&shopId=" +
                params.shopId,
                params.inventoryJudgeSearchDto
            )
            .then(res => {
                return res;
            });
    }

    //  获取销售量、虚拟销售量、收藏量
    static async getGoodsCount(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl +
                ctx.serverPortUrl.shoppingCart +
                "/sp-part-goods-sus/part-ord-count/" +
                params.ptiPartHdId,
                params,
                ctx.headers
            )
            .then(res => {
                return res;
            });
    }

    // 满减、满折、赠品
    static async getGoodPreferential(ctx, params) {
        return ctx
            .$get(
                ctx.baseUrl +
                ctx.serverPortUrl.promotion +
                "/online-hds/online-list/" +
                params.partId,
                params,
                ctx.headers
            )
            .then(res => {
                return res;
            });
    }

    // 获取商品是否上架
    static async getGoodsSellState(ctx, params) {
        let url =
            "/sp-part-goodss/batch-get-sell-flags?companyId=" +
            params.companyId;
        params.spPartGoodsSearchDtoList.forEach(item => {
            item.ownCompanyId = params.companyId;
        });
        return ctx
            .$post(
                ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url,
                params.spPartGoodsSearchDtoList,
                ctx.headers
            )
            .then(res => {
                return res;
            });
    }

    // 获取是否有搭配记录
    static async getCollocate(ctx, params) {
        let url = "/qsc/m-3d-assort-hds/is-assort";
        return ctx.$get(ctx.dpUrl + url, params).then(res => {
            return res;
        });
    }

    //  判断商品是否上架
    static async getIsShelves(ctx, params) {
        let url = "/sp-part-goodss/simple/";
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.shoppingCart + common.newUrlKey + url + params.goodsCode, params).then((res) => {
            return res
        });
    }
}

module.exports = goods;
