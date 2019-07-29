/*
* createTime：2018/7/3
* author：en.chen
* description: 获取地区信息
*/

const base = require('../../model/base')

const getDestnation = async function(ctx,next){
    //  优先获取省、市、区对应的编码
    let arr = ['D_DISTRICTPRO','D_DISTRICTCITY','D_DISTRICTCTY']
    let data = {
        codes: arr.join(','),
        ownCompanyId: ctx.params.ownCompanyId
    }
    let cityData = await base.getDestTypeId(ctx,data)
    let res = await base.getDestnationValue(ctx,ctx.params);
    let response = {}
    response.list = res.data
    response.code = cityData.data
    ctx.body = response;
}

module.exports = getDestnation
