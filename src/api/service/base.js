/*
* createTime：2018/7/2
* author：en.chen
* description: 前端基础模块api聚合
*/

import http from '../../utils/http'

/**
 * 获取门店列表
 * @param config
 * var params = { code: 省市区编码 ,pageNo: 1 , pageSize: 10 }
 * @returns {*}
 */
export const getShopList = (config) => { return http.get('base/getShopList',config); }


/**
 * 获取地区信息
 * @param config
 * @returns {*}
 */
export const getDestnation = () => { return http.get('base/getDestnation'); }

/*
* 图片上传
* @param config
* var params = { file }
* return {*}
* */
export const imgUpload = (config) => { return http.post('file-system/imgUpload',config) }

/**
 * 根据id获取公司信息
 * @param config
 * var params = { }
 * @returns {*}
 */
export const getCompanyById = (config) => { return http.get('base/getCompanyById', config); }

/**
 * 通过APPID获取基础参数
 * @param config
 * var params = {
 *      appId: 小程序唯一标识
  * }
 * @returns {*}
 */
export const getBaseParams = (config) => { return http.get('base/getBaseParams',config); }

/**
 * 获取省市区数据
 * @returns {*}
 */
export const getCityData = (config) => { return http.get('base/getCityData'); }
