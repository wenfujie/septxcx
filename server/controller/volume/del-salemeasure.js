/*
* createTime：2018/11/14
* author：sun.jiandu
* description:  
*/

const userVolume = require('../../model/volume')

const delSaleMeasure = async function (ctx,next) {
    let res = await userVolume.delSaleMeasureValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = delSaleMeasure

