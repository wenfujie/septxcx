/*
* createTime：2018/11/6
* author：en.chen
* description:  积分模块api路由
*/

//  支付功能模块
const pointFun = require('../controller/point/point')

module.exports = {
    "GET/detail": pointFun.getDetail,  // 获取积分详情
    "GET/pointFlag": pointFun.getUsePointFlag,  // 获取积分详情
    "GET/computePointer": pointFun.getComputePointer,  // 获取积分详情
    "PUT/sellCardData": pointFun.sellCardData,//  查询积分券
    "GET/getCardData": pointFun.getCardData, //  查询积分券
}