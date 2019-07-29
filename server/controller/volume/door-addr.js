/*
* createTime：2018/8/14
* author：en.chen
* description:  预约量体模块-获取预约上门量体可用地址api
*/

const userVolume = require('../../model/volume')

const getDoorAddr = async function (ctx,next) {
    let res = await userVolume.getDoorAddrValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getDoorAddr
