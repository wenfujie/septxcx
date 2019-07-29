/*
* createTime：2018/7/4
* author：en.chen
* description: 二级域名解析
*/

const base = require('../../model/base')

const getCompanyQuery = async function(ctx,next){
    let res = await base.getCompanyQueryValue(ctx,ctx.params);
    ctx.body =  res.data;
}

module.exports = getCompanyQuery
