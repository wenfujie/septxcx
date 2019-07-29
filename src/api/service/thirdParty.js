/*
 * @Author: yongtian.hong
 * @Date: 2018-10-19 10:35:35
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-10-19 10:41:49
 * @Description: 第三方相关接口
 */
import http from '@/utils/http'
class thirdParty {
    // 获取物流信息
    static getLogis(params) {
        return http.post('thirdParty/getLogis', params)
    }
}

export default thirdParty