/*
* createTime：2018/8/14
* author：en.chen
* description:  预约量体模块-获取预约金api
*/

const userVolume = require('../../model/volume')

const getMsrAmount = async function (ctx,next) {
    let res = await userVolume.getMsrAmountValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getMsrAmount

