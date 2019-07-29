/*
* createTime：2018/12/28
* author：en.chen
* description:  讯飞语音
*/

const axios = require('axios')
const fs = require('fs')
const Md5 = require('../util/md5')
const Base64 = require('../util/base64')
const path = require('path')

class xunfei{
    // 在线合成语音
    static async synthesizeVoice(ctx, param){
        let fsData = fs.readFileSync(path.join(__dirname, '..') + '/properties/constant.json', 'utf8')
        let properties = JSON.parse(fsData)
        let XAppid = properties.xfAppId
        let apiKey = properties.xfAPIKey
        let timestamp = Math.round(new Date().getTime() / 1000).toString();  // 10位数时间戳
        let textParams = param.text  // encodeURI(param.text)
        let data = {
            text: textParams,  // 待合成文本，使用utf-8编码，需urlencode，长度小于1000字节
        }
        let params = {
            auf: "audio/L16;rate=16000",  // 音频采样率，可选值：audio/L16;rate=8000，audio/L16;rate=16000
            aue: "lame",  // 音频编码，可选值：raw（未压缩的pcm或wav格式），lame（mp3格式）
            voice_name: "xiaoyan",  // 发音人
            speed: "50",  // 语速，可选值：[0-100]，默认为50
            volume: "50",  // 音量，可选值：[0-100]，默认为50
            pitch: "50",  // 音高，可选值：[0-100]，默认为50
            engine_type: "intp65",  // 引擎类型，可选值：aisound（普通效果），intp65（中文），intp65_en（英文），mtts（小语种，需配合小语种发音人使用），x（优化效果），默认为intp65
            text_type: "text"  // 文本类型，可选值：text（普通格式文本），默认为text
        }
        let Xparams = Base64.encode(JSON.stringify(params))
        let CheckSum = Md5(apiKey + timestamp + Xparams)
        let url = 'https://api.xfyun.cn/v1/service/v1/tts'
        // console.log('时间戳',timestamp)
        // console.log('base64加密前的参数', params)
        // console.log('base64加密后的参数',Xparams)
        // console.log('md5加密前的参数', apiKey + timestamp + Xparams)
        // console.log('md5加密后的参数',CheckSum)
        // console.log('body文档', textParams)
        return axios.post(url,data,{
            transformRequest: [function (data) {
                // 对 data 进行任意转换处理
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'X-Appid': XAppid,  // 讯飞开放平台注册申请应用的应用ID(appid)
                'X-CurTime': timestamp,  //  当前UTC时间戳，从1970年1月1日0点0 分0 秒开始到现在的秒数
                'X-Param': Xparams,
                'X-CheckSum': CheckSum,
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
            responseType: 'arraybuffer'
        }).then((response) => {
            // 需要根据 Content-type 的头部来确定是否服务端合成成功
            if (response.headers['content-type'] == 'audio/mpeg') {
                return response.data
            }else{
                return ''
            }
        })
    }
}
module.exports = xunfei