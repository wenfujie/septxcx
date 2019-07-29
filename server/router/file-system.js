/**
 * createTime: 2018/7/12 11:17
 * author: zhibin.zhao
 * description:
 */
//  获取常数值
const fileSystemObj = require('../controller/base/file-system')
module.exports = {
    'POST/token': fileSystemObj.getFileSystemToken,
    'GET/getImg/': fileSystemObj.getImgByPath,
    'POST/imgUpload/': fileSystemObj.imgUpload,
    'GET/getVideo/': fileSystemObj.getVideoByPath
}
