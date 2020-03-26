/*
* createTime：2018/7/25
* author：en.chen
* description: 登陆模块api
*/

import http from '../../utils/http'

/**
 * 获取单点登录需要的code（搭配组件）
 * @param config
 * @returns {*}
 */
export const getSingleCode = (config) => { return http.get('login/getSingleCode',config); }
