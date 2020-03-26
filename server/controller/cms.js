/*
 * createTime: 2019/7/9 9:39
 * author: en.chen
 * description: 内容管理模块控制器
 */

const cms = require('../model/cms');

class cmsController {

    // 获取模板
    static async getTemplate(ctx) {
        let params = ctx.params
        let res = {data: null}
        if(!!params.usrId){  // 有用户信息获取千人千面模板
            res = await cms.getUsrCmsTemplateValue(ctx, ctx.params);
        }else{  // 获取默认模板
            res = await cms.getCmsTemplateValue(ctx, ctx.params);
        }
        ctx.body = res.data;
    }

    // 内容管理获取模板内容v2
    static async getUsrCmsInfoV2(ctx) {
        let res = await cms.getUsrCmsInfoV2(ctx,ctx.params);
        ctx.body = res.data;
    }

    // 获取常量
    static async getProperties(ctx) {
        let res = await cms.getProperties(ctx,ctx.params);
        ctx.body = res.data;
    }

    // 获取模板导航
    static async getNavigation(ctx) {
        let res = await cms.getNavigation(ctx,ctx.params);
        ctx.body = res.data;
    }

    // 获取现购页面模块元素商品列表
    static async getWebItemGoods(ctx) {
        let res = await cms.getGoodsListValue(ctx,ctx.params);
        ctx.body = res.data;
    }

    // 获取首页楼层商品数据
    static async getChooseBuyGoods(ctx) {
        let res = await cms.getChooseBuyGoods(ctx,ctx.params);
        ctx.body = res.data;
    }

    // 内容管理获取面包屑
    static async getCrumbs(ctx) {
        let res = await cms.getCrumbs(ctx,ctx.params);
        ctx.body = res.data;
    }

    // 内容管理获取面包屑
    static async getCrumbsDetail(ctx) {
        let res = await cms.getCrumbsDetail(ctx,ctx.params);
        ctx.body = res.data;
    }
}

module.exports = cmsController;
