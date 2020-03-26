/*
* createTime：2018/10/16
* author：en.chen
* description: 发票功能api
*/

const invoice = require('../model/invoice')

class invoiceController {

    // 提交发票
    static async putInvoice (ctx, next) {
        let res = await invoice.putInvoice(ctx,ctx.params)
        ctx.body = res
    }

    // 获取发票类型
    static async getInvoiceType (ctx, next) {
        let res = await invoice.getInvoiceType(ctx,ctx.params)
        ctx.body = res.data
    }

    // 获取发票设置
    static async getCanSetInvoice (ctx, next) {
        let res = await invoice.getCanSetInvoice(ctx,ctx.params)
        ctx.body = res.data
    }

    // 获取发票详情
    static async getInvoiceDetail (ctx, next) {
        let res = await invoice.getInvoiceDetail(ctx,ctx.params)
        ctx.body = res.data
    }

    // 取消发票
    static async cancelInvoice (ctx, next) {
        let res = await invoice.cancelInvoice(ctx,ctx.params)
        ctx.body = res
    }
}

module.exports = invoiceController;
