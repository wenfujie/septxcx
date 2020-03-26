/**
 * createTime: 2018/7/12 11:17
 * author: zhibin.zhao
 * description:
 */
const fileSystemFun = require('../controller/file-system')

module.exports = {
    'POST/token': fileSystemFun.getFileSystemToken, // 获取toke
    'GET/getImg/': fileSystemFun.getImgByPath,  // 通过token获取图片
    'POST/imgUpload/': fileSystemFun.imgUpload,  // 图片上传接口
    'GET/getVideo/': fileSystemFun.getVideoByPath  // 获取视频资源
}
