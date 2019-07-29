/*
* createTime：2018/8/14
* author：en.chen
* description: 中间层提供给前端的预约量体模块api
*/

const sendCoupons = require('../controller/volume/sendCoupons')
//  根据商品ids过滤会员
const getMeasureType = require('../controller/volume/measure-type')

const getSaleMeasureId = require('../controller/volume/get-salemeasureid')

//  删除我的预约
const delSaleMeasure = require('../controller/volume/del-salemeasure')

//  删除我的预约
const delCtmMeasure = require('../controller/volume/delCtmMeasure')

//  获取预约金
const getMsrAmount = require('../controller/volume/msr-amout')


const getMeasureOpInfo = require('../controller/volume/getMeasureOpInfo')

//  获取预约金
const getVolumns = require('../controller/volume/volumns')

//  获取预约上门量体可用地址
const getDoorAddr = require('../controller/volume/door-addr')

//  获取到店量体可用地址
const getShopAddr = require('../controller/volume/shop-addr')

//  获取预约量体可用时间
const getRegmeasureTime = require('../controller/volume/volume-time')

//  获取预约量体可用goodsCode
const getSalemeasurehdsCode = require('../controller/volume/volume-goodsCode')

//  提交预约量体
const saveVolume = require('../controller/volume/save-volume')

//  获取预约量体列表
const getVolumeList = require('../controller/volume/volume-list')

//  获取预约量体列表
const getVolumeDataList = require('../controller/volume/volume-data-list')

//  查询积分券
const getCtmmeasure  = require('../controller/volume/getCtmmeasure')

//  查询订单信息
const getBillType  = require('../controller/volume/getBillTypeValue')
module.exports = {
    "GET/msrAmount": getMsrAmount,
    "GET/volumes": getVolumns,
    "GET/doorAddr": getDoorAddr,
    "GET/shopAddr": getShopAddr,
    "GET/volumeTime": getRegmeasureTime,
    "GET/volumeGoodsCode": getSalemeasurehdsCode,
    "POST/saveVolume": saveVolume,
    "POST/sendCoupons": sendCoupons,
    "GET/volumeList": getVolumeList,
    "GET/volumeDataList": getVolumeDataList,
    "GET/getMeasureType": getMeasureType,
    "GET/getBillType": getBillType,
    "GET/getSaleMeasureId": getSaleMeasureId,
    "DELETE/delSaleMeasure": delSaleMeasure,
    "DELETE/delCtmMeasure": delCtmMeasure,
    "GET/getCtmmeasure": getCtmmeasure,
    "GET/getMeasureOpInfo": getMeasureOpInfo
}
