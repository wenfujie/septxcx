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
const fissionModule = require('../../model/fission')
const goods = require('../../model/goods')
class fission {
    // 拼团列表
    static async findGrpartList(ctx, next) {
        let res = await fissionModule.findGrpartList(ctx, ctx.params)
        ctx.body = res.data
    }
    // 拼团记录
    static async findAllVipinforid(ctx, next) {
        let res = await fissionModule.findAllVipinforid(ctx, ctx.params)
        ctx.body = res.data
    }
    // 拼团记录—删除
    static async delVipDtFss(ctx, next) {
        let res = await fissionModule.delVipDtFss(ctx, ctx.params)
        ctx.body = res
    }
    // 拼团详情
    static async onlinedttbgpartInfo(ctx, next) {
        // 接口聚合
        let res = await ctx.$requestAll([
           fissionModule.onlinedttbgpartInfo(ctx, ctx.params),
           goods.getGoodsComments(ctx, ctx.params),    // 查询商品评价
        ])
        ctx.body={
           infoData: res[0].data,
           commentsData:res[1].data,
        }
        // let res = await fissionModule.onlinedttbgpartInfo(ctx, ctx.params)
        // ctx.body = res.data
    }
    // 秒杀列表
    static async getFlashSaleList(ctx, next) {
        let res = await fissionModule.getFlashSaleList(ctx, ctx.params)
        ctx.body = res.data
    }
    // 秒杀商品详情
    static async getFlashDetail(ctx, next) {
    // 接口聚合
    let res = await ctx.$requestAll([
        fissionModule.getFlashDetail(ctx, ctx.params),
        goods.getGoodsComments(ctx, ctx.params),    // 查询商品评价
      ])
      ctx.body={
        infoData: res[0].data,
        commentsData:res[1].data,
      }
    }
    // 获取砍价列表
    static async getBargainList(ctx, next) {
        let res = await fissionModule.getBargainList(ctx, ctx.params)
        ctx.body = res.data
    }
    // 发起砍价
    static async startBargain(ctx, next) {
        let res = await fissionModule.startBargain(ctx, ctx.params)
        ctx.body = res
    }
    // 帮助砍价
    static async helpBargain(ctx, next) {
        let res = await fissionModule.helpBargain(ctx, ctx.params)
        ctx.body = res
    }
    // 砍价详情
    static async getBargainDetail(ctx, next) {
        let res = await fissionModule.getBargainDetail(ctx, ctx.params)
        ctx.body = res.data
    }
    // 砍价排行榜
    static async getBargainRank(ctx, next) {
        let res = await fissionModule.getBargainRank(ctx, ctx.params)
        ctx.body = res.data
    }
    // 获取推荐列表
    static async bargainRecommendList(ctx, next) {
        let res = await fissionModule.bargainRecommendList(ctx, ctx.params)
        ctx.body = res.data
    }
    // 请求服务器时间
    static async getServerDate(ctx, next) {
        let res = await fissionModule.getServerDate(ctx, ctx.params)
        ctx.body = res.data
    }
    // 秒杀/拼团/砍价保存更新结算
    static async saveFissionCartTemp(ctx, next) {
        let res = await fissionModule.saveFissionCartTemp(ctx, ctx.params);
        ctx.body = res;
    }

    // 秒杀/拼团/砍价促销结算页信息
     static async getFissionOrderSettleInfo(ctx, next) {
        let res = await fissionModule.getFissionOrderSettleInfo(ctx, ctx.params);
        ctx.body = res.data;
    }
    // 秒杀/拼团/砍价提交订单
     static async saveFissionOrder(ctx, next) {
        let res = await fissionModule.saveFissionOrder(ctx, ctx.params);
        ctx.body = res;
    }
    // 裂变 校验库存和上下架接口
    static async checkoutSellStock(ctx, next) {
        let res = await fissionModule.checkoutSellStock(ctx, ctx.params);
        ctx.body = res;
    }
}

module.exports = fission
