/*
* createTime：2018/11/7
* author：en.chen
* description: 预约量体模块-获取量体列表api
*/

const userVolume = require('../../model/volume')

const getVolumeList = async function (ctx,next) {
    let res = await userVolume.getVolumeList(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getVolumeList