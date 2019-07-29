/**
 * createTime: 2018/7/10 21:04
 * author: zhibin.zhao
 * description: 对接微服务文件系统
 */
const fs = require('fs')
const path = require('path')
const TokenManager = require('../util/token-manager')
const FormData = require('form-data')
const axios = require('axios')

class fileSystem {
    /*
     * 通过token获取图片
     * */
    static async getImgByPath(ctx) {
        let query = ctx.query
        let options = {
            responseType: 'arraybuffer'
        }
        return ctx.$getImg(ctx.baseUrl + '/file/oss/image/' + query.fileUrl + "?companyId=" + query.companyId, {
            "ossType": "meterial",
            "ownCompanyId": query.companyId
        }, options).then((res) => {
            return res;
        })
    }

    /*
    * 获取视频资源
    * */
    static async getVideoByPath(ctx) {
        let query = ctx.query
        let options = {
            responseType: 'arraybuffer',
        }
        let params = {
            ownCompanyId: query.companyId,
            range: ctx.header.range
        }
        // return ctx.$get(ctx.baseUrl + '/file/oss/' + query.fileUrl + "?companyId=" + query.companyId, {
        return ctx.$getVideo(ctx.baseUrl + '/file/oss/' + query.fileUrl + "?companyId=" + query.companyId, params, options).then((res) => {
            return res;
        })
    }

    /*
     * 图片上传接口
     * */
    static async imgUpload(ctx) {
        let companyId = ctx.params.companyId
        let url = global.axiosBaseUrl + '/file/oss/image/mam/test?companyId=' + companyId
        let imgPath = ctx.request.files.file.path
        let imgName = ctx.request.files.file.name

        // 创建可读流
        let reader = fs.createReadStream(imgPath)

        let index = imgName.indexOf('.')
        let imgPrefix = imgName.substring(0, index)                 // 图片前缀
        let imgSuffix = imgName.substring(index, imgName.length)    // 图片后缀
        let imgNameNew = imgPrefix + '_' + Date.parse(new Date()) + imgSuffix   // 生成新图片名称

        let filePath = path.join(__dirname, '../uploads/') + `/${imgNameNew}`

        // 创建可写流
        let upStream = fs.createWriteStream(filePath)
        // 可读流通过管道写入可写流（上传图片到node）
        let stream = reader.pipe(upStream)

        // 上传图片到java
        let promise = new Promise((resolve, reject) => {
            // 图片写入本地结束
            stream.on('finish', async function () {
                // 读取上传到项目中的图片
                let file = await fs.createReadStream(path.resolve(__dirname, '../uploads/' + imgNameNew))
                let form = new FormData()
                form.append('file', file)

                // 获取token
                let token = await TokenManager.getToken()
                let option = {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'ownCompanyId': companyId,
                        'Content-Type': 'multipart/form-data'
                    }
                }

                let getHeaders = (async form => {
                    return await new Promise((resolve, reject) => {
                        form.getLength((err, length) => {
                            if (err) {
                                reject(err)
                            }

                            let headers = Object.assign({'Content-Length': length}, form.getHeaders())
                            resolve(headers)
                        })
                    })
                })

                let headers = await getHeaders(form)
                form.ownCompanyId = companyId
                let imgUploadData = await ctx.$post(url, form, {
                    headers: Object.assign(headers, option.headers)
                })

                resolve(imgUploadData)
            })
        })

        // 上传到java成功回调
        let result = await promise.then(res => {
            // 删除上传的图片
            if (res.success) {
                fs.unlink(path.resolve(__dirname, '../uploads/' + imgNameNew), function (err) {
                    if (err) {
                        throw err
                    }
                })
            }

            return res
        })

        return result
    }
}

module.exports = fileSystem
