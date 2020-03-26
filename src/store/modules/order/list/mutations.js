/*
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description:
 * @Date: 2019-03-12 19:38:14
 * @LastEditTime: 2019-04-18 10:26:53
 */

function createStatusTabs(tabs, ordNums) {
    if (!ordNums) return tabs;
    tabs[1].num = ordNums.unPayOrderNum;
    tabs[2].num = ordNums.unShippingOrderNum;
    tabs[3].num = ordNums.unReceivingGoodsOrderNum;
    tabs[4].num = ordNums.unEvaluateOrderNum;
    return tabs;
}

export default {
    //初始化订单列表请求参数
    tabChange(state, { code, index } = tab) {
      
        state.sIndex = index ? index : 0;
 
        state.params.pageNum = 1;
        state.params.searchCode = code ? code : "";
        state.total = 0;
        state.orderList = [];
        state.loadFinished = true;
    },
    resetState() {
        state.isDownLoading = true;
        state.isEmpty = false;
        state.loadFinished = true;
    },
    // 重置页码
    resetPageNum(state) {
        state.loadFinished = true;
        state.params.pageNum = 1;
    },
    // 新增页码
    pageNumIncrease(state) {
        state.params.pageNum += 1;
        state.loadFinished = false;
    },
    // 更新订单列表
    updateOrderList(state, { result, list }) {
      

        state.result = result;

        state.tabs = createStatusTabs(state.tabs, result.ordNums);

        state.orderList =  [];

        state.orderList = list || [];

        // // 判断是否加载完成
        state.loadFinished = !result.hasNextPage;
        // 判断是否空
        state.isEmpty = state.orderList.length == 0 ? true : false;
    },
    clearOrdList(state){
        state.orderList=[];
    },
    // 查看订单详情
    viewOrderDetail(state, data) {},
    //设置账号id
    setAccountId(state,{account_id}){
        state.curAccountId=account_id;
    },
};
