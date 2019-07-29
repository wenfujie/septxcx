/*
* createTime：2019/05/14
* author：junyong.hong
* description: 判断大货商品库存（根据订单中间表id，查询商品库存） 建荣
*/

const goods = require('../../model/goods')

const getGoodsFlag = async function (ctx,next) {
    let res = await goods.getGoodsFlag(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getGoodsFlag
