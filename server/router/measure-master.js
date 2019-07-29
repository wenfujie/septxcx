/*
* createTime：2018/11/13
* author：en.chen
* description: 量体师api模块路由
*/


const master = require('../controller/measure-master/measure-master')

module.exports = {
    "POST/login": master.login,  // 量体师登陆
    "GET/checkPhone": master.checkPhone,  // 通过手机号查询量体师信息
    "GET/info": master.getInfo,  // 量体师信息
    "PUT/info": master.putInfo,  //  修改量体师信息
    "GET/measureInfo": master.getMeasureData,  // 获取会员量体数据
    "GET/getCleanData":master.getCleanData,  // 获取量体工单的净体数据
    "GET/getMsrCleanData":master.getMsrCleanData,  // 获取预约工单的净体数据
    "GET/measureType": master.getMeasureType,  // 获取量体类别
    "GET/defaultMeasureType": master.getDefaultMeasureType,  // 获取量体类别(默认量体类别)
    "GET/goodsType": master.getGoodsData,  // 通过参照商品获取参照数据
    "GET/bodyData": master.getBodyData,  // 通过量体id获取实际量体数据
    "GET/goodsMeasureType": master.getGoodsMeasureType,  //  根据商品分类id获取相同量体类别的量体类别关联数据
    "GET/goodsInfo": master.getGoodsInfo,  //  通过商品货号精确查询商品信息
    "GET/getRcmdSize": master.getRcmdSize, //  根据code 查询 推荐尺码的 名称--尺码id
    "GET/getGoodsMsrInfo": master.getGoodsMsrInfo, // 根据商品id获取推荐商品类别及推荐商品的量体项信息
    "POST/getReleaseValue": master.getReleaseValue,  //  获取自动放量
    "POST/getAutoSize": master.getAutoSize,  //  自动推码（获取推荐尺码，获取可用于与成衣尺寸计算差异值的数据）
    "POST/saveMeasure": master.saveMeasure //  保存量体数据
};