/*
* createTime：2018-06-26
* author：yongtian.hong
* description: 文件读写
*/
const fs = require('fs')
const path = require('path')

/*
* 根据文件路径读取文件数据
* fileName：文件路径
* return：返回文件内容
*/
const readFile = function (fileName) {
    let filePath = path.resolve(__dirname, '../data') + '/' + fileName
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, function (error, data) {
            if (error) return reject(error)
            resolve(data)
        })
    })
}

/*
* 写入文件数据
* fileName：文件路径
* data: 要写入的数据
* return：返回文件内容
*/
const writeFile = function (fileName, data) {
    let filePath = path.resolve(__dirname, '../data/') + '/' + fileName;
    return new Promise(function (resolve, reject) {
        fs.writeFile(filePath, data, err => {
            if (err) return reject(err)
            resolve('写入成功!')
        })
    })
}
module.exports = {
    readFile: readFile,
    writeFile: writeFile
}
