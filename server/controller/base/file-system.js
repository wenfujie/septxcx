/**
 * createTime: 2018/7/12 11:12
 * author: zhibin.zhao
 * description:
 */
const model = require('../../model/file-system')

class fileSystemObj {
    static async getFileSystemToken (ctx, next) {
        let res = await model.getFileSystemToken(ctx)
        ctx.body = res
    }
    static async getImgByPath (ctx, next) {
        let res = await model.getImgByPath(ctx)
        ctx.body = res.data
    }
    static async imgUpload(ctx) {
        let res = await model.imgUpload(ctx)
        ctx.body = res
    }
    static async getVideoByPath (ctx, next) {
        let res = await model.getVideoByPath(ctx)
        ctx.set(res.headers)
        ctx.body = res.data
    }
}

module.exports = fileSystemObj
