/*
* createTime：2018/7/2
* author：en.chen
* description: 获取常数值
*/

const base = require('../../model/base')

const getContent = async function(ctx,next){
    let res = await base.getContentValue(ctx);
    ctx.body =  res.data;
}

module.exports = getContent
