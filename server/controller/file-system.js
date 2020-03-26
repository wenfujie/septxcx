/**
 * createTime: 2018/7/12 11:12
 * author: zhibin.zhao
 * description:
 */
const fileSystem = require('../model/file-system')

class fileSystemController {

    // 获取toke
    static async getFileSystemToken (ctx, next) {
        let res = await fileSystem.getFileSystemToken(ctx)
        ctx.body = res
    }

    // 通过token获取图片
    static async getImgByPath (ctx, next) {
        let res = await fileSystem.getImgByPath(ctx)
        ctx.body = res.data
    }

    // 图片上传接口
    static async imgUpload(ctx) {
        let res = await fileSystem.imgUpload(ctx)
        ctx.body = res
    }

    // 获取视频资源
    static async getVideoByPath (ctx, next) {
        let res = await fileSystem.getVideoByPath(ctx)
        ctx.set(res.headers)
        ctx.body = res.data
    }
}

module.exports = fileSystemController
