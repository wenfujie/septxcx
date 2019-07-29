/*
* createTime：2018/11/14
* author：sun.jiandu
* description:  
*/

const userVolume = require('../../model/volume')

const getMeasureType = async function (ctx,next) {
    let res = await userVolume.getMeasureTypeValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getMeasureType

