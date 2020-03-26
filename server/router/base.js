/*
* createTime：2018/7/2
* author：en.chen
* description: 中间层提供给前端的基础模块api
*/

const baseFun = require("../controller/base");

module.exports = {
    // 'GET/constants': getContent,  // 获取常数值
    'GET/getShopList': baseFun.getShopList,  // 获取门店列表
    'GET/getDestnation': baseFun.getDestnation,  // 获取地区信息
    // 'GET/plamset': getPlamset,  // 获取购物平台设置
    // 'GET/companyQuery': getCompanyQuery,  // 获取二级域名解析
    'GET/getCompanyById': baseFun.getCompanyById,  // 根据id获取公司信息
    'GET/getBaseParams': baseFun.getBaseParams,   // 通过AppId获取基础参数
    'GET/getCityData': baseFun.getCityData   // 获取省市区数据
};
