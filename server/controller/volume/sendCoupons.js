const userVolume = require('../../model/volume')

const sendCoupons = async function (ctx,next) {
    let res = await userVolume.sendCoupons(ctx,ctx.params);
    ctx.body = res;
}

module.exports = sendCoupons