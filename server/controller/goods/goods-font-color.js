/*
* createTime：2018/12-25
* author：fujie.wen
* description:  获取绣字颜色、字体列表
*/

const goods = require('../../model/goods')

const getEmbFontColorList = async function (ctx,next) {
    let res = await goods.getEmbFontColorListValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getEmbFontColorList
