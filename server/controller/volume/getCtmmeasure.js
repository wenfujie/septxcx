const userVolume = require('../../model/volume')

const getCtmmeasure = async function (ctx,next) {
    let res = await userVolume.getCtmmeasure(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getCtmmeasure
