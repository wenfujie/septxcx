/*
 * @Author: yongtian.hong
 * @Date: 2018-11-13 19:41:32
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-06-20 20:53:28
 * @Description: 售后申请API
 */
import http from "@/utils/http";
export default class {
    /***********
     * 获取售后类型
     * @params={
     *    saleOrdDtId: ""
     * }
     */
    static getWays(params) {
        return http.get("postSale/getPostSaleWays", params);
    }

    /***********
    * 获取售后类型
    * @params={
    *     pageNum: 1,
         pageSize: 10,
         effFlag: 1   //用于过滤出启用的售后原因
    * }
    */
    static getReason(params) {
        return http.get("postSale/getReason", params);
    }

    /***********
   * 获取售后原因编码
   * @params={
   *     dictCode: 'D_RETURNSALES',
         companyId: 604
   * }
   */
    static getReasonCodes(params) {
        return http.get("postSale/getReasonCodes", params);
    }

    /***********
     * 获取售后申请单列表
     * @params={
     *  pageNum: 1,
     *  pageSize: 10
     * }
     */
    static getList(params) {
        return http.get("postSale/getPostSaleList", params);
    }

    /***********
     * 获取售后申请单列表
     * @params={
     *  reApplyCode: String
     * }
     */
    static getDetail(params) {
        return http.get("postSale/getPostSaleDetail", params);

    }

    /***********
     * 获取售后可售后商品数量
     * @params={
     *  rtlOrdDtId: String(商品DtId)
     * }
     */
    static getApplyNum(params) {
        return http.get("postSale/getApplyNum", params);
    }


    /***********
    * 获取换货商品sku
    * @params={
    *  busContsCode: String,
       goodsCode:  String,
       shopCode: String
    * }
    */
    static getSku(params) {
        return http.get("goods/info", params);
    }

    /***********
    * 提交申请
    * @params={
    *           amount: 1, //退回数量
                returnsAmount: null, //退款金额
                busCountsCode: "",//业务触点
                changeReplayCode: null,//换货单号
                ordDtId: 0,//订单关联表Id
                reaSonCode: "",//售后原因
                reapplycode: "",//申请单号,修改申请时使用,默认空
                reasonMemo: "",//原因备注
                returnTypeCode: "",//退货类型编码
                savePictInfo: [],//图片
                skuInfo: [],//sku信息
                skuId: ""//skuid
    * }
    */
    static submitApply(params) {
        return http.post("postSale/submitApply", params);
    }


    /***********
   * 取消申请
   * @params={
   *    reApplyCode: String, //申请单号
   * }
   */

    static cancelApply(params) {
        return http.put("postSale/cancelApply", params);
    }

    /***********
   * 获取快递公司列表
   * @params={
   *     pageNum: 1,
         pageSize: 0,  //0表示不分页，获取全部
         effFlag: 1     //1:已启用，0:未启用
   * }
   */

    static getDeliverCompanies(params) {
        return http.get("postSale/getExpressCompanies", params);
    }



    /***********
   * 保存售后寄回物流
   * @params={
   *    reApplyCode: String,//申请单号
        returnWayCode: String,//售后类型编码
        shippingId: String,//配送方式id,
        addressId: Number,//地址id
        expressCode: String,//快递运营商代码编号,如YTO(圆通)
        shopId: Number,//门店ID
   * }
   */

    static saveLogis(params) {
        return http.post("postSale/savePostSaleLogis", params);
    }
}
