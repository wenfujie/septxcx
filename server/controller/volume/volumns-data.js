/*
 * @Author: yongtian.hong
 * @Date: 2018-09-22 12:13:07
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-09-22 12:14:44
 * @Description: ''
 */

const volume = require('../../model/volume')

const getHistoryMeasureData = async function (ctx, next) {

    let res = await userVolume.getVolumnsValue(ctx, ctx.params);

    ctx.body = res.data;
}

module.exports = getVolumns