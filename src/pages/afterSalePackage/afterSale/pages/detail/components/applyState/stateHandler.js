//退款信息
const refundsMsg = {
    "待审核": null,

    "处理中": null,

    "已完成": "退款资金已原路返回，以实际到账为准",

    "已关闭": null,

    "已拒绝": "拒绝原因:"
}





export default {
    // 仅退款
    "D_ONLYDRAWBACK": function () {

    },
    // 退货退款
    "D_RETURNSALES": function () { },
    // 换货
    "D_CHANGEPART": function () { },
    // 拒收
    "D_REFUSEPART": function () { },
    // 返修
    "D_REPAIR": function () { },
}