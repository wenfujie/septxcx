/*
* createTime：2018/9/18
* author：en.chen
* description: 预约量体模块-获取量体时间api
*/

const userVolume = require('../../model/volume')
const moment = require('moment')

const getRegmeasureTime = async function (ctx,next) {
    let res = await userVolume.getRegmeasureTimeValue(ctx,ctx.params);
    let currentDate = new Date()
    let currentTime = new Date(moment(currentDate).format('YYYY-MM-DD')).getTime()
    for (let l = 0;l<res.data.length;l++){
        if(currentTime > new Date(res.data[l].ymd).getTime()){
            res.data.splice(l,1)
            --l;
        }else if(currentTime == new Date(res.data[l].ymd).getTime()){
            for(let m=0;m<res.data[l].hourList.length;m++){
                let time = moment(res.data[l].ymd + ' ' + res.data[l].hourList[m]).format('YYYY-MM-DD HH:mm')
                // console.log("time======",time)
                if(currentDate.getTime() > new Date(time).getTime()){
                    res.data[l].hourList.splice(m,1)
                    --m;
                }
            }
            if(res.data[l].hourList.length <= 0){
                res.data.splice(l,1)
                --l;
            }
        }
    }
    res.data[0].newDate= currentDate
    res.data[0].newTime= moment(currentDate).format('YYYY-MM-DD HH:mm:ss')
    res.data[0].currentTime = new Date(moment(currentDate).format('YYYY-MM-DD HH:mm:ss'))
    ctx.body =res.data;
}

module.exports = getRegmeasureTime