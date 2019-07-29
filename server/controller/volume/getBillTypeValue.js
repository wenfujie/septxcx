/*
* createTime：2018/11/14
* author：sun.jiandu
* description:  
*/

const userVolume = require('../../model/volume')

const getBillType = async function (ctx,next) {
    let res = await userVolume.getBillTypeValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getBillType

