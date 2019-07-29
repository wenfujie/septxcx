/*
* createTime：2018/12/28
* author：en.chen
* description: 讯飞语音
*/

const xunfei = require('../../model/xf-voice')

const synthesizeVoice = async function(ctx, next){
    let res = await xunfei.synthesizeVoice(ctx, ctx.params);
    ctx.body =  res;
}

module.exports = synthesizeVoice