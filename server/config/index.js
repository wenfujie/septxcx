/*
 * @Author: yongtian.hong
 * @Date: 2019-04-17 19:06:57
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-05-21 10:18:33
 * @Description: 项目配置文件
 */

const micro = require('./microservices.config')


module.exports = {
    port: 3000, // 应用端口
    viewsDirname: 'views', // HTML存放的文件夹名称
    viewEngine: 'jade', // 视图渲染引擎
    publicSourceDir: '/assets', // 公共资源的存放文件夹名称
    baseUrl: micro.baseUrl,
    nettyUrl: micro.nettyUrl,
    ossUrl: micro.ossUrl,
    ossOpenUrl: micro.ossOpenUrl,
    tokenUrl: micro.tokenUrl,
    dpUrl: micro.dpUrl,
    env: micro.environment,
    serverPortUrl: micro.microService
}
