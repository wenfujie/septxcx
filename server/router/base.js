/*
* createTime：2018/7/2
* author：en.chen
* description: 中间层提供给前端的基础模块api
*/

//  获取常数值
const getContent = require('../controller/base/contents')

//  获取门店列表
const getShopList = require('../controller/base/shop-list')

//  获取地区信息
const getDestnation = require('../controller/base/destnation')

//  获取购物平台设置
const getPlamset = require('../controller/base/plamset')

//  获取二级域名解析
const getCompanyQuery = require('../controller/base/company-query')

//  根据id获取公司信息
const getCompanyById = require('../controller/base/company-info')

module.exports = {
    'GET/constants': getContent,
    'GET/shopList': getShopList,
    'GET/destnation': getDestnation,
    'GET/plamset': getPlamset,
    'GET/companyQuery': getCompanyQuery,
    'GET/getCompanyById': getCompanyById
};
