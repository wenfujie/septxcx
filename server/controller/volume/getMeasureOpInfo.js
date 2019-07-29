const userVolume = require('../../model/volume')

// const getMeasureOpInfo = async function (ctx,next) {
//     let res = await userVolume.getMeasureOpInfo(ctx,ctx.params);
//     ctx.body = res.data;
// }

module.exports = async function (ctx,next) {
    let res = await userVolume.getMeasureOpInfo(ctx,ctx.params);
    ctx.body = res.data;
}