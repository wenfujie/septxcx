/*
* createTime：2018/8/14
* author：en.chen
* description:  预约量体模块-获取到店量体可用地址api
*/

const userVolume = require('../../model/volume')

const getShopAddr = async function (ctx,next) {
    let res = await userVolume.getStoreListValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getShopAddr
