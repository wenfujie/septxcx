/*
* createTime：2018/10/16
* author：en.chen
* description:  发票模块
*/


//  会籍会员模块功能
const invoiceFun = require('../controller/invoice/invoice')

module.exports = {
    "POST/putInvoice": invoiceFun.putInvoice,  //  提交发票
    "GET/type": invoiceFun.getInvoiceInfo,  //  发票类型
    "GET/setInvoice": invoiceFun.canSetInvoice,  //  发票设置
    "GET/detail": invoiceFun.getDetail,  //  获取发票详情
    "PUT/cancelInvoice": invoiceFun.cancelInvoice,  // 取消发票
};
