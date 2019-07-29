/*
* createTime：2018/9/19
* author：en.chen
* description:  预约量体模块-提交预约量体api
*/

const userVolume = require('../../model/volume')

const saveVolume = async function (ctx,next) {
    let res = await userVolume.saveRegMeasureValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = saveVolume