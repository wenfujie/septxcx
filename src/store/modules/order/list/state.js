/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description:
 * @Date: 2019-03-12 19:38:14
 * @LastEditTime: 2019-04-18 10:23:08
 */

export default {
    userInfo: null,
    params: {
        pageNum: 1,
        pageSize: 10,
        searchCode: ""
    },
    loadFinished: true,
    isUpLoading: false,
    isDownLoading: false,
    isEmpty: false,
    total: 0,
    result: { tabs: [] },
    orderList: [],
    sIndex: 0,
    tabs: [
        {
            name: "全部",
            code: "",
            num: 0
        },
        {
            name: "待付款",
            code: "D_ORDSPAYING",
            num: 0
        },
        {
            name: "待发货",
            code: "D_ORDSSHIPPING",
            num: 0
        },
        {
            name: "待收货",
            code: "D_ORDSDELIVERY",
            num: 0
        },
        {
            name: "待评价",
            code: "D_ORDSCOMMENTING",
            num: 0
        }
        // {
        //     name: "已完成",
        //     code: "D_ORDRECEIVED"
        // }
    ]
};
