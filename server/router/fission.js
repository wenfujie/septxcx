/**
 *
 * @description:
 * @author: junyong.hong
 * @createTime: 2019/9/24
 * @version: 1.0.0.0
 * @history:
 *    1、
 *    2、
 *
 */
//  获取常数值
const fission = require('../controller/fission/fission')
module.exports = {
    'GET/findGrpartList': fission.findGrpartList,// 拼团列表
    'GET/findAllVipinforid': fission.findAllVipinforid,// 拼团记录
    'DELETE/delVipDtFss': fission.delVipDtFss,// 拼团记录—删除
    'GET/onlinedttbgpartInfo': fission.onlinedttbgpartInfo,// 拼团详情
    'GET/getFlashSaleList': fission.getFlashSaleList,//秒杀列表
    "GET/getFlashDetail":fission.getFlashDetail,//获取秒杀商品详情
    'GET/getBargainList': fission.getBargainList,// 获取砍价列表
    'POST/startBargain': fission.startBargain,// 发起砍价
    "POST/saveFissionCartTemp":fission.saveFissionCartTemp, //  裂变促销保存更新结算
    "GET/getFissionOrderSettleInfo":fission.getFissionOrderSettleInfo, //  获取裂变促销订单结算页信息
    "POST/saveFissionOrder": fission.saveFissionOrder,//裂变促销提交订单
    'POST/helpBargain': fission.helpBargain,// 帮助砍价
    'POST/checkoutSellStock': fission.checkoutSellStock,// 裂变 校验库存和上下架接口
    'GET/getBargainDetail': fission.getBargainDetail,// 砍价详情
    'GET/getBargainRank': fission.getBargainRank,// 砍价排行榜
    'GET/bargainRecommendList': fission.bargainRecommendList,// 获取推荐列表
    'GET/getServerDate': fission.getServerDate,// 请求服务器时间
}
