/*
 * @Author: yongtian.hong
 * @Date: 2019-06-19 14:30:48
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-06-20 17:20:47
 * @Description: 售后类型映射表
 */
export default {
    "D_ONLYDRAWBACK": {
        returnTypeId: 10021101,
        returnTypeCode: "D_ONLYDRAWBACK",
        returnTypeName: "仅退款",
    }, "D_RETURNSALES": {
        returnTypeId: 10021102,
        returnTypeCode: "D_RETURNSALES",
        returnTypeName: "退货退款",
    }, "D_CHANGEPART": {
        returnTypeId: 10021103,
        returnTypeCode: "D_CHANGEPART",
        returnTypeName: "换货",
    }, "D_REFUSEPART": {
        returnTypeId: 10021104,
        returnTypeCode: "D_REFUSEPART",
        returnTypeName: "拒收",
    }, "D_REPAIR": {
        returnTypeId: 10021105,
        returnTypeCode: "D_REPAIR",
        returnTypeName: "返修",
    },
}