/*
* createTime：2018/10/16
* author：en.chen
* description:  发票模块
*/


//  会籍会员模块功能
const invoiceFun = require('../controller/invoice')

module.exports = {
    "POST/putInvoice": invoiceFun.putInvoice,  //  提交发票
    "GET/getInvoiceType": invoiceFun.getInvoiceType,  //  发票类型
    "GET/getCanSetInvoice": invoiceFun.getCanSetInvoice,  //  发票设置
    "GET/getInvoiceDetail": invoiceFun.getInvoiceDetail,  //  获取发票详情
    "PUT/cancelInvoice": invoiceFun.cancelInvoice,  // 取消发票
};
