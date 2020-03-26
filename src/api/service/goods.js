/*
 * createTime：2018/7/14
 * author：en.chen
 * description: 商品模块api聚合
 */

import http from "../../utils/http";

/**
 * 获取商品列表
 * @param config
 * var param = {
    usrId:"用户ID",
    companyId:"公司ID",
    pageNum: 1,
    pageSize: 10,
    sortParam:[{"field":"recmSeq","order":"DESC"}] //排序方式
   }
 * @returns {*}
 */
export const getGoodsList = config => {
    return http.get("goods/getGoodsList", config);
};

/**
 * 获取促销列表
 * @param config
 * @returns {*}
 */
export const getDiscountList = config => {
    return http.get("goods/getDiscountList", config);
};

/**
 * 查询平台商品的推荐商品列表
 * @param config
 * var param = {
    buscontsCode：平台编码
    partCode：商品编码
    userId：用户Id
    companyId：公司Id
    shopId: 1005423
    }
 * @returns {*}
 */
export const getGoodsRecommend = config => {
    return http.get("goods/getGoodsRecommend", config);
};

/**
 * 查询猜你喜欢商品列表（新人页面，购物车页面）（主推商品）
 * @param config
 * var param = {
    buscontsCode：平台编码
    companyId：公司Id
    userId：用户Id
    pageNum：第几页
    pageSize：页面大小
    shopDptId：店铺id
    }
 * @returns {*}
 */
export const getGoodsRecommendList = config => {
    return http.get("goods/getGoodsRecommendList", config);
};

/**
 * 查询猜你喜欢商品列表(商品详情页的)（按商品分类的销量商品）
 * @param config
 * var param = {
    buscontsCode：平台编码
    companyId：公司Id
    userId：用户Id
    pageNum：第几页
    pageSize：页面大小
    shopDptId：店铺id
    }
 * @returns {*}
 */
export const getHighestSellingList = config => {
    return http.get("goods/getHighestSellingList", config);
};

/**
 * 查询商品详情
 * @param config
 * var param = {
    busContsCode: 业务触点
    goodsCode: 平台商品编码
    userId: 用户Id
    companyId: 公司Id,
    shopCode: 门店编码
    }
 * @returns {*}
 */
export const getGoodsInfo = config => {
    return http.get("goods/getGoodsInfo", config);
};

/**
 * 查询商品分类等级
 * @param config
 * var param = {
    busContsCode：业务触点
    ownCompanyId
    companyId：公司Id
    layer: 要查询等级数
    }
 * @returns {*}
 */
export const getGoodsLayerClass = config => {
    return http.get("goods/getGoodsLayerClass", config);
};

/**
 * 大货商品详情优惠促销信息
 * @param config
 * var param = {
    ptiPartHdId: 商品id,
    busContsCode: 业务触点,
    shopId: 店铺id,
    companyId:公司id,
    usrId: 用户id
    }
 * @returns {*}
 */
export const getGoodsPromotion = config => {
    return http.get("goods/getGoodsPromotion", config);
};

/**
 * 获取商品评价
 * @param config
 * var param = {
    usrId:"用户ID",
    companyId:"公司",
    cookieId:"cookieID",
    goodsCode:"平台商品编码",
    busContsCode:"业务触点",
    pageSize:"条数",
    pageNum:"查询页"
    }
 * @returns {*}
 */
export const getGoodsComments = config => {
    return http.get("goods/getGoodsComments", config);
};

/**
 * 获取商品综合评分
 * @param config
 * var param = {
    usrId:"用户ID",
    companyId:"公司",
    cookieId:"cookieID",
    goodsCode:"平台商品编码",
    busContsCode:"业务触点",
    }
 * @returns {*}
 */
export const getGoodsScore = config => {
    return http.get("goods/getGoodsScore", config);
};

/**
 * 获取商品库存（大货）
 * @param config
 * var param = {
    companyId：公司Id,
    busContsCode: 业务触点,
    goodsCode: 平台商品编码,
    colorCode: 颜色编码,
    sizeCode: 尺码编码,
    shopCode: 门店编码,
    orderFlag: 定制标记
    }
 * @returns {*}
 */
export const getGoodsStock = config => {
    return http.get("goods/getGoodsStock", config);
};

/**
 * 校验商品是否上架
 * @param config
 * var param = {
    ownCompanyId:,
    companyId：公司Id,
    spPartGoodsSearchDtoList: 商品编码数组[{"busContsCode":"D_BUSCONTS_B2C","goodsCode":"QZJ001","ptiPartDtskuId":3316}]
    }
 * @returns {*}
 */
export const getGoodsSellState = config => {
    return http.post("goods/getGoodsSellState", config);
};

/**
 * 查询热门商品列表
 * @param config
 * var param = {
    companyId：公司Id
    }
 * @returns {*}
 */
export const getHotGoods = config => {
    return http.get("goods/getHotGoods", config);
};

/**
 * 判断商品是否上架
 * @param config
 * var param = {
    companyId:公司Id,
    ownCompanyId:'',
    partGoodsCodeList: 单品商品编号
    combGoodsCodeList: 组合商品编号
    buscontsCode: 业务触点
    }
 * @returns {*}
 */
export const getGoodSellState = config => {
    return http.get("goods/getGoodSellState", config);
};

/**
 * 满减、满折、赠品
 * let data = {
        partId: '商品id',
        dptId: '店铺id',
    }
 * @param config
 * @returns {*|Promise}
 */
export const getGoodPreferential = config => {
    return http.get("goods/getGoodPreferential", config);
};

/**
 * 校验商品上架、库存
 * @param config
 * var param = {
    shopId：店铺Id,
    usrId：用户Id,
    [{
            "busContsCode":"业务触点",
            "goodsCode":"商品编码",
            "ptiPartDtSkuId":"sku id",
            "amount":"数量",
            "orderFlag":"是否定制标识",
            "ptiPartHdId":"商品id"
    }]
    }
 * @returns {*}
 */
export const getUseableGood = config => {
    return http.post("goods/getUseableGood", config);
};

/**
 * 获取是否有搭配记录
 * @param config
 * var param = {
    partCode：商品编码
    dptId: 店铺Id
    }
 * @returns {*}
 */
export const getCollocate = config => {
    return http.get("goods/getCollocate", config);
};
/**
 * 获取面包屑查询条件ids的前置接口
 * @param config
 * var param = {
    usrId:"用户ID",
    companyId:"公司ID",
    pageNum: 1,
    pageSize: 10，
    filters: [],  // 过滤条件
    keyword: this.$route.query.keyWord || "",  // 搜索关键词
    sortParam: // 面包屑,
    platformCode: //  分类
    queryNullBusFlag: 1,
    orderFlags: [0,1,2]  // 0，1，2代表大货、定制、组合，不传查询所有
   }
 * @returns {*}
 */
export const getCrumbsGoodsIds = (config) => {
    return http.get('goods/getCrumbsGoodsIds', config);
};

/**
 * 获取商品详情（接口聚合）
 * let data = {
        usrId: '用户id',
        busContsCode: '业务触点',
        goodsCode: '商品货号',
        shopId: '店铺id',
        pageNum: '评论页数',
        pageSize: '评论每页大小',
    }
 * @param config
 * @returns {*|Promise}
 */
export const getGoodsDetailTogether = (config) => {
    return http.get('goods/getGoodsDetailTogether', config);
};

/**
 * 查询商品是否上架
 * @param config
 * var param = {
    ownCompanyId：公司Id,
    goodsCode: 商品编码,
    buscontsCode: 平台编码
    }
 * @returns {*}
 */
export const isShelves = (config) => { return http.get('goods/getIsShelves',config); }
