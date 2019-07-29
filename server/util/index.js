/*
 * createTime：2018-06-26
 * author: yongtian.hong
 * description: 工具类统一注入
 */
const http = require('./http')
const file = require('./fileRw')
const error = require('./error')
const config = require('../config/index.js')

/*
 * 工具类统一绑定到context
 * */
const moutedToContext = function (app) {
    app.context.$get = http.get
    app.context.$getImg = http.getImg
    app.context.$getVideo = http.getVideo
    app.context.$post = http.post
    app.context.$postUrl = http.postUrl
    app.context.$put = http.put
    app.context.$requestAll = http.all
    app.context.$putUrl = http.putUrl
    app.context.$delete = http.delete
    app.context.readFile = file.readFile
    app.context.writeFile = file.writeFile
    app.context.baseUrl = config.baseUrl
    app.context.nettyUrl = config.nettyUrl
    app.context.dpUrl = config.dpUrl
    app.context.ossOpenUrl = config.ossOpenUrl
    app.context.env = config.env
    app.context.serverPortUrl = config.serverPortUrl
}

module.exports = {
    moutedToContext: moutedToContext,
    errorHandler: error
}
