/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description:
 * @Date: 2019-03-12 19:38:14
 * @LastEditTime: 2019-06-18 11:33:06
 */

export default {
    params: {
        pageNum: 1,
        pageSize: 10,
    },
    isUpLoading: false,
    isDownLoading: false,
    finished: true,
    isEmpty: false,
    result: {
        data: {
            total: 0
        }
    },
    list: []
};
