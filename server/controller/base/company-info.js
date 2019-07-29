/*
* createTime：2018/7/4
* author：en.chen
* description: 二级域名解析
*/

const base = require('../../model/base')

const getCompanyById = async function(ctx,next){
    let res = await base.getCompanyById(ctx,ctx.params);
    ctx.body =  res.data;
}

module.exports = getCompanyById
