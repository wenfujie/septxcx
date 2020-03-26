/*
* createTime：2018/11/16
* author：en.chen
* description: 线下沙龙模块
*/

//  线下沙龙模块
const salonFun = require('../controller/salon')

module.exports = {
    "GET/getList": salonFun.getList,  // 获取文章列表
    "GET/getDetail": salonFun.getDetail,  // 获取文章详情
}
