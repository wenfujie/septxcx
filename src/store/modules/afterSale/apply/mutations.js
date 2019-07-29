/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description:
 * @Date: 2019-03-12 19:38:14
 * @LastEditTime: 2019-06-19 20:14:00
 */

export default {

    // 更新申请的商品
    updateApplyGood(state, good) {
        state.good = good;
    },

    //清空申请商品
    clearApplyGood() {
        state.good = {};
    }
};
