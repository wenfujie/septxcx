/*
* createTime：2018/7/3
* author：en.chen
* description: 获取购物平台设置
*/

const base = require('../../model/base')

const getPlamset = async function(ctx,next){
    let res = await base.getPlamsetValue(ctx);
    ctx.body =  res.data;
}

module.exports = getPlamset
