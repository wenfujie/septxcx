/*
* createTime：2018/7/2
* author：en.chen
* description: 获取门店列表
*/

const base = require('../../model/base')

const getShopList = async function(ctx,next){
    let res = await base.getShopListValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getShopList
