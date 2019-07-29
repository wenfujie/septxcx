
const goods = require('../../model/goods')

const getPutGoods = async function (ctx,next) {
    let res = await goods.getPutGoodsValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getPutGoods
