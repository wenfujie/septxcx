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
    return http.get("goods/list", config);
};

/**
 * 获取促销列表
 * @param config
 * @returns {*}
 */
export const getDiscountList = config => {
    return http.get("goods/discount", config);
};

/**
 * 获取商品列表
 * @param config
 * var param = {
    usrId:"用户ID",
    companyId:"公司ID",
    pageNum: 1,
    pageSize: 10
    sortParam:[{"field":"recmSeq","order":"DESC"}] //排序方式
   }
 * @returns {*}
 */
export const getFilterGoodsList = config => {
    return http.get("goods/filterGoods", config);
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
    return http.get("goods/recommend", config);
};

/**
 * 查询猜你喜欢商品列表
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
    return http.get("goods/recommendList", config);
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
    return http.get("goods/info", config);
};

/**
 * 获取销售量、虚拟销售量、收藏量
 * let data = {
        ptiPartHdId: '商品id'
    }
 * @param config
 * @returns {*|Promise}
 */
export const getGoodsCount = config => {
    return http.get("goods/getGoodsCount", config);
};

/**
 * 查询组合商品详情
 * @param config
 * var param = {
    ownCompanyId: 业务触点
    goodsCode: 平台商品编码
    }
 * @returns {*}
 */
export const goodsCombgoodInfo = config => {
    return http.get("goods/goodsCombgoodInfo", config);
};

/**
 * 查询商品详情（定制）
 * @param config
 * var param = {
    partCode: 平台商品编码
    userId: 用户Id
    companyId: 公司Id,
    shopId:
    }
 * @returns {*}
 */
export const getGoodsInfoCus = config => {
    return http.get("goods/infoCus", config);
};

/**
 * 查询商品详情（组合2D展示）
 * @param config
 * var param = {
    busContsCode: 业务触点
    ptiCombgoodHdCode: 组合商品编码
    ownCompanyId
    userId: 用户Id
    companyId: 公司Id,
    shopId:
    }
 * @returns {*}
 */
export const getGroupGoodsInfoCus = config => {
    return http.get("goods/groupInfoCus", config);
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
    return http.get("goods/layer-class", config);
};

/**
 * 查询商品分类
 * @param config
 * var param = {
    goodsClassCode：商品类别编号,
    usrId：用户id,
    companyId：公司Id
    }
 * @returns {*}
 */
export const getGoodsClass = config => {
    return http.get("goods/goodsClass", config);
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
    return http.get("goods/promotion", config);
};

/**
 * 查询商品sku
 * @param config
 * var param = {
    usrId：用户id,
    companyId：公司Id,
    goodsCode: 平台商品编码,
    partCode: 商品货号,
    colorCode: 商品颜色,
    sizeCode: 尺码,
    busContsCode: 业务触点,
    shopCode: 门店编码
    }
 * @returns {*}
 */
export const getGoodsSku = config => {
    return http.get("goods/goodsSku", config);
};

/**
 * 获取平台运营分类列表
 * @param config
 * var param = {
    companyId：公司Id,
    busContsCode: 业务触点
    }
 * @returns {*}
 */
export const getPlatformList = config => {
    return http.get("goods/platformList", config);
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
    return http.get("goods/comments", config);
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
    return http.get("goods/score", config);
};

/**
 * 获取风格选择列表
 * @param config
 * var param = {
    companyId：公司Id
    code: 上级附加属性编码
    }
 * @returns {*}
 */
export const getGoodsPropList = config => {
    return http.get("goods/propList", config);
};

/**
 * 获取商品尺码列表
 * @param config
 * var param = {
    companyId：公司Id,
    busContsCode: 业务触点,
    goodsCode: 平台商品编码
    }
 * @returns {*}
 */
export const getGoodsSize = config => {
    return http.get("goods/goodsSize", config);
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
    return http.get("goods/goodsStock", config);
};

/**
 * 获取商品库存（定制单品）
 * @param config
 * var param = {
    ownCompanyId:,
    count: 1,
    usrId: ,
    companyId：公司Id,
    goodsCode: 平台商品编码,
    shopId: 门店编码,
    count: 数量
    }
 * @returns {*}
 */
export const getGoodsStockCust = config => {
    return http.post("goods/goodsStockCust", config);
};

/**
 * 获取商品库存（单品、组合）
 * @param config
 * var param = {
    ownCompanyId:,
    usrId: ,
    companyId：公司Id,
    shopId: 门店编码,
    inventoryJudgeDtos:[
      {
        "count": 1,
        "orderFlag": 1,
        "ptiPartDtSkuId": 3478,
        "ptiPartHdCode": "HS112001",
        "ptiPartHdId": 935
      }
    ]
    }
 * @returns {*}
 */
export const getGroupGoodsStockCust = config => {
    return http.post("goods/commonStockCust", config);
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
    return http.post("goods/getSellState", config);
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
    return http.get("goods/hotGoods", config);
};
export const getPutGoods = config => {
    return http.get("goods/getPutGoods", config);
};

/**
 * 查询单品推荐套餐
 * @param config
 * var param = {
    companyId：公司Id
    ownCompanyId
    usrId
    ptiPartHdId 商品id
    }
 * @returns {*}
 */
export const getRecommendPackages = config => {
    return http.get("goods/recommendPackages", config);
};

/**
 * 获取购买可选套餐
 * @param config
 * var param = {
    companyId：公司Id
    ownCompanyId
    usrId
    shopDptId: 店铺id
    ptiPartHdId: 商品id
    buscontsId: 业务触点
    }
 * @returns {*}
 */
export const getBuyablePackages = config => {
    return http.get("goods/buyablePackages", config);
};

/**
 * 查询商品详情目录
 * @param config
 * var param = {
    companyId：公司Id,
    goodsId: 商品id
    }
 * @returns {*}
 */
export const getGoodsTitle = config => {
    return http.get("goods/infoTitle", config);
};

/**
 * 获取商品定制清单
 * @param config
 * var param = {
 *  usrId:,用户ID
    companyId:公司Id,
    ownCompanyId:'',
    billCode:"",//订单编号
    saleOrdDtIds:'',
    }
 * @returns {*}
 */
export const getCustomList = config => {
    return http.get("order/getCustomList", config);
};

/**
 * 获取商品定制清单
 * @param config
 * var param = {
    companyId:公司Id,
    ownCompanyId:'',
    goodsCode:'',商品编码
    mainFabricCode:'',主面料编码 非必传
    checkFlag:'',限定关系有没有设定到商品面料（1有，0没有），默认为0
    }
 * @returns {*}
 */
export const getMainFabricInfo = config => {
    return http.get("goods/fabricInfo", config);
};

/**
 * 获取绣字颜色、字体列表
 * @param config
 * var param = {
    companyId:公司Id,
    ownCompanyId:'',
    }
 * @returns {*}
 */
export const getEmbFontColorList = config => {
    return http.get("goods/fontColorList", config);
};

/**
 * 获取绣花图片列表
 * @param config
 * var param = {
    companyId:公司Id,
    ownCompanyId:'',
    usrId
    type  类型2、绣花;3、印花;默认2绣花
    goodsCode  商品货号
    regionCode  部件类别编码
    definedFlag  自定义标记 0为不允许用户上传图片，1为允许用户上传图片
    }
 * @returns {*}
 */
export const getEmbPicList = config => {
    return http.get("goods/embPicList", config);
};

/**
 * 获取商品可绣花、绣字部位
 * @param config
 * var param = {
    companyId:公司Id,
    ownCompanyId:'',
    type: 绣字，绣花类型
    ptiPartHdId: 商品id
    usrId:
    }
 * @returns {*}
 */
export const getUseablePart = config => {
    return http.get("goods/useablePart", config);
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
    return http.get("goods/goodSellState", config);
};

/**
 * 批量判断库存
 * @param config
 * var param = {
    }
 * @returns {*}
 */
export const judgeStock = config => {
    return http.post("goods/judgeStock", config);
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
    colorCode：颜色编码
    isThird：是否第三方
    }
 * @returns {*}
 */
export const getCollocationRecord = config => {
    return http.post("goods/getCollocationRecord", config);
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
}
