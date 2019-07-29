/*
* createTime：2018/7/2
* author：en.chen
* description: 前端基础模块api聚合
*/

import http from '../../utils/http'

/**
 * 获取常数值
 * @returns {*}
 */
export const getBase = () => { return http.get('base/constants'); }

/**
 * 获取门店列表
 * @param config
 * var params = { code: 省市区编码 ,pageNo: 1 , pageSize: 10 }
 * @returns {*}
 */
export const getShopList = (config) => { return http.get('base/shopList',config); }


/**
 * 获取地区信息
 * @param config
 * @returns {*}
 */
export const getDestnation = () => { return http.get('base/destnation'); }

/**
 * 获取购物平台设置
 * @returns {*}
 */
export const getPlamset = () => { return http.get('base/plamset'); }

/**
 * 获取二级域名解析
 * @param config
 * var params = { companyUrl: 域名 }
 * @returns {*}
 */
export const getCompanyQuery = (config) => { return http.get('base/companyQuery',config); }

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
export const getCompanyById = (config) => { return http.get('base/getCompanyById',config); }