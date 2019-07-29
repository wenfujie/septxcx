/*
* createTime：2018/11/16
* author：en.chen
* description:  线下沙龙模块api
*/

import http from '../../utils/http'

/**
 * 获取线下沙龙文章列表
 * @param config
 * var param = {
    *companyId: 公司id,
    pageNum: 分页页码,
    pageSize: 分页数据
    }
 * @returns {*}
 */

export const getList = (config) => {return http.get('salon/list',config); }

/**
 * 获取线下沙龙文章详情
 * @param config
 * var param = {
    *companyId: 公司id,
    * id: '文章主键'
    }
 * @returns {*}
 */

export const getDetail = (config) => {return http.get('salon/detail',config); }