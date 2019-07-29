/*
* createTime：2018/12/28
* author：en.chen
* description: 讯飞语音功能路由
*/

//  合成语音
const synthesizeVoice = require('../controller/base/xf-voice')
module.exports = {
    'GET/voice': synthesizeVoice
}