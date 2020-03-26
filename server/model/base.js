/*
 * createTime：2018/7/2
 * author：en.chen
 * description: 基础模块用于处理前端请求的中间层接口
 */
const fs = require('fs')
const path = require('path')
class base {
  //  获取常数值
  static async getContentValue (ctx) {
    return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + '/constants').then((res) => {
      return res
    })
  }
  //  获取门店列表
  static async getShopList (ctx, params) {
    let url = '/cud-dpts/dest-code/' + params.code
    return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params).then((res) => {
      return res
    })
  }

  //  获取省市区对应的destTypeId
  static async getDestTypeId (ctx, params) {
    return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + '/dict-ids/get-ids-by-codes', params).then((res) => {
      return res
    })
  }

  //  获取地区信息
  static async getDestnation (ctx, params) {
    return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/destinations', params).then((res) => {
      return res
    })
  }

  //  购物平台设置
  static async getPlamsetValue (ctx) {
    return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + '/glb-sp-cfgbasics/logo-url').then((res) => {
      return res
    })
  }

  // 二级域名解析
  static async getCompanyQueryValue (ctx, params) {
    params.ownCompanyId = 1
    return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + '/glb-domains', params).then((res) => {
      return res
    })
  }

  // 获取快递公司列表
  static async getExpressCompanies (ctx, params) {
    let url = '/cud-dpt-dt-shippings'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params)
  }

  // 根据id获取公司
  static async getCompanyById (ctx, params) {
    return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/cud-companys/' + params.companyId, params).then((res) => {
      return res
    })
  }

  // 通过APPID获取基础参数
  static async getBaseParams(ctx, params){
    return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.systemService + '/glb-sp-cfgbasics/multi-brand', params).then((res) => {
        res.data.ossOpenUrl = ctx.ossOpenUrl
        res.data.publicAccount = "ZLERKyJX"
        return res
    })
  }

  // 获取省市区数据
  static async getCityData(ctx, params){
    let data = fs.readFileSync(path.join(__dirname, '..') + '/assets/data/cityData.json', 'utf8')
    return data
  }
}

module.exports = base
