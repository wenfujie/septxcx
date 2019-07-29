/*
* createTime：2018/11/21
* author：en.chen
* description:  提交企业团购
*/

class teamPurchase {

    //  提交企业团购
    static async postPurchase(ctx, params) {
        let url = '/rtl-grpcustom-hds?companyId=' + params.companyId + '&usrId=' + params.usrId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

}

module.exports = teamPurchase