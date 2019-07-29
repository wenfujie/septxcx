/*
* createTime：2018/11/13
* author：en.chen
* description: 量体师模块
*/

const measureMaster = require('../../model/measure-master')

class master {

    //  量体师登陆
    static async login (ctx, next) {
        let res = await measureMaster.login(ctx,ctx.params)
        ctx.body = res
    }

    //  通过手机号查询量体师信息
    static async checkPhone (ctx, next) {
        let res = await measureMaster.checkPhone(ctx,ctx.params)
        ctx.body = res.data
    }

    //  量体师信息
    static async getInfo (ctx, next) {
        let res = await measureMaster.getInfo(ctx,ctx.params)
        ctx.body = res.data
    }

    //  修改量体师信息
    static async putInfo (ctx, next) {
        let res = await measureMaster.putInfo(ctx,ctx.params)
        ctx.body = res
    }

    //  获取会员量体数据
    static async getMeasureData (ctx, next) {
        let res = await measureMaster.getMeasureData(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取量体工单的净体数据
    static async getCleanData (ctx, next) {
        let res = await measureMaster.getCleanData(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取预约工单的净体数据
    static async getMsrCleanData (ctx, next) {
        let res = await measureMaster.getMsrCleanData(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取量体类别
    static async getMeasureType (ctx, next) {
        let res = await measureMaster.getMeasureType(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取量体类别(默认量体类别)
    static async getDefaultMeasureType (ctx, next) {
        let res = await measureMaster.getDefaultMeasureType(ctx,ctx.params)
        ctx.body = res.data
    }

    //  通过参照商品获取参照数据
    static async getGoodsData (ctx, next) {
        let res = await measureMaster.getGoodsData(ctx,ctx.params)
        ctx.body = res.data
    }

    //  通过量体id获取实际量体数据
    static async getBodyData (ctx, next) {
        let res = await measureMaster.getBodyData(ctx,ctx.params)
        ctx.body = res.data
    }

    //  根据商品分类id获取相同量体类别的量体类别关联数据
    static async getGoodsMeasureType (ctx, next) {
        let res = await measureMaster.getGoodsMeasureType(ctx,ctx.params)
        ctx.body = res.data
    }

    //  通过商品货号精确查询商品信息
    static async getGoodsInfo (ctx, next) {
        let res = await measureMaster.getGoodsInfo(ctx,ctx.params)
        ctx.body = res.data
    }

    //  根据code 查询 推荐尺码的 名称--尺码id
    static async getRcmdSize (ctx, next) {
        let res = await measureMaster.getRcmdSize(ctx,ctx.params)
        let map = {}
        let arr = []
        if(res.data.length > 0) {
            res.data.forEach((item) => {
                item.sizeInfo = []
                if(item.recommendSize !== null && item.recommendSizeIds !== null) {
                    let recommendSizeList = item.recommendSize.split(',')
                    for(let i=0; i<recommendSizeList.length; i++) {
                        map.sizeName = recommendSizeList[i]
                        map.sizeId = item.recommendSizeIds[i]
                        arr.push(map)
                        map = {}
                    }
                    item.sizeInfo = arr
                    arr = []
                }
            })
        }
        ctx.body = res.data
    }

    //  根据商品id获取商品类别及量体项信息
    static async getGoodsMsrInfo (ctx, next) {
        let res = await measureMaster.getGoodsMsrInfo(ctx,ctx.params)
        ctx.body = res.data
    }

    //  获取自动放量
    static async getReleaseValue(ctx, next) {
        let response = await measureMaster.getReleaseValue(ctx,ctx.params)
        if(!!response[0] && !!response[0].multiMeasureList) {  // 存在多组数据列表
            let res = response[0]
            res.arrLen = null
            let arrLen = Object.keys(res.multiMeasureList).length || null
            let map = {}
            let menuList = []
            let codeArr = res.vitalCodes.split(',')
            let nameArr = res.vitalNames.split(',')
            for(let i=0; i<codeArr.length;i++) {
                map.codes = codeArr[i]
                map.name = nameArr[i]
                menuList.push(map)
                map = {}
            }
            for(let key in res.multiMeasureList) {
                res[key] = res.multiMeasureList[key]
            }
            res.menuList = menuList  // 渲染菜单数组
            res.arrLen = arrLen  // 可选数组个数
            res.actIndex = ''  // 选中的数组标识
        }
        ctx.body = response
    }

    //  自动推码（获取推荐尺码，获取可用于与成衣尺寸计算差异值的数据）
    static async getAutoSize(ctx, next) {
        let res = await measureMaster.getAutoSize(ctx,ctx.params)
        ctx.body = res
    }

    //  保存量体数据
    static async saveMeasure (ctx, next) {
        let res = await measureMaster.saveMeasure(ctx,ctx.params)
        ctx.body = res
    }
}

module.exports = master