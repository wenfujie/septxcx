/*
* createTime：2018/11/14
* author：sun.jiandu
* description:  
*/

const userVolume = require('../../model/volume')

module.exports =  async function (ctx,next) {
    let res = await userVolume.getSaleMeasureIdValue(ctx,ctx.params);
    ctx.body = res.data;
}

