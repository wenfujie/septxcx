/*
* createTime：2018/8/14
* author：en.chen
* description:  预约量体模块-获取量体项目api
*/

const userVolume = require('../../model/volume')

const getVolumns = async function (ctx,next) {
    let res = await userVolume.getVolumnsValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getVolumns
