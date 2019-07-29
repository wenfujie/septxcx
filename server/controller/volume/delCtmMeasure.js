/*
* createTime：2018/11/14
* author：sun.jiandu
* description:  
*/

const userVolume = require('../../model/volume')

const delCtmMeasure = async function (ctx,next) {
    let res = await userVolume.delCtmMeasure(ctx,ctx.params);
    ctx.body = res;
}

module.exports = delCtmMeasure

