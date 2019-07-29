/*
* createTime：2018/7/27
* author：en.chen
* description: 商品模块获取平台运营分类列表
*/

const goods = require('../../model/goods')

const getPlatformList = async function (ctx,next) {
    let res = await goods.getPlatformListValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getPlatformList
