/*
 * createTime: 2019/9/21 9:27
 * author: wei.wang
 * description: 中间层提供给前端的基础模块api
 */

const base = require('../model/base');

class baseController {

  // 获取门店列表
  static async getShopList (ctx) {
    let res = await base.getShopList(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 获取地区信息
  static async getDestnation (ctx) {
    //  优先获取省、市、区对应的编码
    let arr = ['D_DISTRICTPRO','D_DISTRICTCITY','D_DISTRICTCTY']
    let data = {
      codes: arr.join(','),
      ownCompanyId: ctx.params.ownCompanyId
    }
    let cityData = await base.getDestTypeId(ctx,data)
    let res = await base.getDestnation(ctx,ctx.params);
    let response = {}
    response.list = res.data
    response.code = cityData.data
    ctx.body = response;
  }

  // 获取公司id
  static async getCompanyById (ctx) {
    let res = await base.getCompanyById(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 通过AppId获取基础参数
  static async getBaseParams (ctx) {
    let res = await base.getBaseParams(ctx, ctx.params);
    ctx.body = res.data;
  }

  // 获取省市区数据
  static async getCityData (ctx) {
    let res = await base.getCityData(ctx, ctx.params);
    ctx.body = res;
  }

}

module.exports = baseController;
