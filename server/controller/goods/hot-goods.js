/*
 * createTime：2018/8/10
 * author：en.chen
 * description:  商品模块查询热门商品列表
 */

const goods = require('../../model/goods')

const getHotGoods = async function (ctx, next) {
    let res = await goods.getHotGoodsValue(ctx, ctx.params);
    let arr = []
    if (!!res.data && res.data.length > 0) {
        res.data.forEach((item) => {
            var settime = item.invalidTime
            var time = new Date(settime);
            time = time.getTime();
            var d = new Date().getTime()
            if (d < time) {
                arr.push(item);
            }
        })
        ctx.body = arr
    } else {
        ctx.body = res.data;
    }
}

module.exports = getHotGoods