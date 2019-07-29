/*
* createTime：2018/10/16
* author：en.chen
* description: 发票功能api
*/

const invoice = require('../../model/invoice')

class invoiceFun {

    // 提交发票
    static async putInvoice (ctx, next) {
        let res = await invoice.putInvoice(ctx,ctx.params)
        ctx.body = res
    }

    // 获取发票类型
    static async getInvoiceInfo (ctx, next) {
        let res = await invoice.getInvoiceInfo(ctx,ctx.params)
        ctx.body = res.data
    }

    // 获取发票设置
    static async canSetInvoice (ctx, next) {
        let res = await invoice.canSetInvoice(ctx,ctx.params)
        ctx.body = res.data
    }

    // 获取发票详情
    static async getDetail (ctx, next) {
        let res = await invoice.getDetail(ctx,ctx.params)
        ctx.body = res.data
    }

    // 取消发票
    static async cancelInvoice (ctx, next) {
        let res = await invoice.cancelInvoice(ctx,ctx.params)
        ctx.body = res
    }
}

module.exports = invoiceFun