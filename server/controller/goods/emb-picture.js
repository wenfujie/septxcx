/*
* createTime：2018/12-26
* author：fujie.wen
* description:  获取绣花图片列表
*/

const goods = require('../../model/goods')

const getEmbPicList = async function (ctx,next) {
    let res = await goods.getEmbPicListValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getEmbPicList
