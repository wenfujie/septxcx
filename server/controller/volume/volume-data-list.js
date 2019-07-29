const userVolume = require('../../model/volume')

const getVolumeDataList = async function (ctx,next) {
    let res = await userVolume.getVolumeDataList(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getVolumeDataList