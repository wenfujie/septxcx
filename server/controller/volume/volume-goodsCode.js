const userVolume = require('../../model/volume')

const getSalemeasurehdsCode = async function (ctx,next) {
    let res = await userVolume.getSalemeasurehdsCode(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getSalemeasurehdsCode