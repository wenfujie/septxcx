/*
 * createTime：2018/7/5
 * author：en.chen
 * description: 内容管理模块用于处理前端请求的中间层接口
 */
const fs = require('fs')
const path = require('path')
const common = require('./common')
class cms {
    //  获取默认模板
    static async getCmsTemplateValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas +  '/cms-template-hds', params).then((res) => {
            return res
        })
    }

    //  获取千人千面模板
    static async getUsrCmsTemplateValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/cms-backpage-dt-viptags', params).then((res) => {
            return res
        })
    }

    //  获取模板内容v2
    static async getCmsInfoV2Value(ctx, params) {
        let url = '/cms-template-hds/cms-template-code/' + params.cmsTemplateCode
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.issBas + common.newUrlKey +
                url, params).then((res) => {
            return res
        })
    }

    //  获取面包屑
    static async getCrumbsValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/cms-crumbs', params).then((res) => {
            return res
        })
    }

    //  获取面包屑子内容
    static async getCrumbsDetailValue(ctx, params) {
        return ctx.$get(ctx.nettyUrl + ctx.serverPortUrl.issBas + common.newUrlKey + '/cms-crumbs/navigation', params).then((res) => {
            return res
        })
    }

    //  获取模板导航内容
    static async getNavigationValue(ctx, params) {
        let url = '/iss/bas/cms-navigat-hds/template-navigations/'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.baseService +  url, params).then((res) => {
            return res
        })
    }

    //  获取模板页面模块元素商品列表(现购)
    static async getGoodsListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/web-item-goodss/item-goods-batch', params).then((res) => {
            return res
        })
    }

    //  获取模板页面模块元素商品列表(现购列表)
    static async getGoodsItemListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/web-item-goodss/item-goods-list', params).then((res) => {
            return res
        })
    }

    //  获取wxUnionId、firameUrl、companyId
    static async getProperties(ctx, params) {
        let data = fs.readFileSync(path.join(__dirname, '..') + '/properties/constant.json', 'utf8')
        let constData = JSON.parse(data)
        let properties = constData.prod
        if(ctx.env ==='dev' || ctx.env ==='test'){
            properties = constData.dev
        }else if(ctx.env ==='preprod'){
            properties = constData.preprod
        }
        console.log("ctx.env=========================",ctx.env)
        return ctx.$get(ctx.baseUrl + '/wechat/admin/mp?mpUuid=' + properties.wxUnionid, {ownCompanyId: 1}).then((res) => {
            res.data.publicAccount = properties.publicAccount
            res.data.ossOpenUrl = ctx.ossOpenUrl
            return res
        })
    }
}

module.exports = cms
