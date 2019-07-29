/*
 * createTime: 2019/4/30 16:34
 * author: wei.wang
 * description: 获取是否有搭配记录
 */

const goods = require('../../model/goods');

const getCollocationRecord = async function (ctx,next) {
    let res = await goods.getCollocationRecord(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getCollocationRecord
