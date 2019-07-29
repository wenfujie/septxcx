/*
* createTime：2018/11/16
* author：en.chen
* description: 线下沙龙模块
*/

//  线下沙龙模块
const salonFun = require('../controller/salon/salon')

module.exports = {
    "GET/list": salonFun.getList,  // 获取文章列表
    "GET/detail": salonFun.getDetail,  // 获取文章详情
}