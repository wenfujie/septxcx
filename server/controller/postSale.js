/*
 * @Author: yongtian.hong
 * @Date: 2018-09-25 14:57:29
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-08-13 14:13:42
 * @Description: 售后申请
 */
const postSaleModel = require('../model/post-sale')
const base = require('../model/base')
const pingyin = require('../util/pinyin')

class postSaleController {

  // 获取申请单列表
  static async getPostSaleList (ctx, next) {
    let params = Object.assign({
      usrId: ctx.params.usrId,
      ctmUsrId: ctx.params.usrId,
      companyId: ctx.params.companyId,
      pageSize: ctx.params.pageSize,
      pageNum: ctx.params.pageNum,
      ownCompanyId: ctx.params.ownCompanyId,
      vipId: ctx.params.vipInfoHdId
    }, ctx.params);
    let result = await postSaleModel.getPostSaleList(ctx, params)
    ctx.body = {
      data: result.data,
      statusCode: 200
    }
  }

  // 取消售后申请单
  static async cancelApply (ctx, next) {
    let params = {
      usrId: ctx.params.usrId,
      reApplyCode: ctx.params.reApplyCode,
      companyId: ctx.params.companyId,
      ownCompanyId: ctx.params.ownCompanyId,
      vipInfoHdId: ctx.params.vipInfoHdId
    }
    let result = await postSaleModel.cancelApply(ctx, params)
    if (result === 1) result = 200
    ctx.body = {
      statusCode: result
    }
  }

  // 提交售后申请
  static async submitApply (ctx, next) {

    const { ordDtId, returnTypeCode, reaSonCode, companyId, usrId } = ctx.params

    let mergeRes = await ctx.$requestAll([
      postSaleModel.getPostSaleWay(ctx, {
        saleOrdDtId: ordDtId,
        companyId: companyId,
        ownCompanyId: companyId,
        usrId: usrId
      }),
      postSaleModel.getReasonCodes(ctx, {
        dictCode: returnTypeCode,
        companyId: companyId,
        ownCompanyId: companyId,
        usrId: usrId
      })
    ])

    // 判断类型
    let returnTypeList = mergeRes[0].data.returnTypeList || []
    let typeCodeList = []
    returnTypeList.forEach(type => {
      typeCodeList.push(type.returnTypeCode)
    })
    if (!typeCodeList.includes(returnTypeCode)) {
      ctx.body = {
        statusCode: 500,
        data: '当前订单不可提交此售后类型!'
      }
      return
    }

    // 判断原因
    let reasonList = mergeRes[1].data
    let reasonCodes = []
    reasonList.forEach(reason => {
      reasonCodes.push(reason.reasonCode)
    })

    // 判断当前选中售后原因是否在可用原因之内
    if (!reasonCodes.includes(reaSonCode)) {
      ctx.body = {
        statusCode: 500,
        data: '请重新修改售后原因!'
      }
      return
    }

    let result = await postSaleModel.submitApply(ctx, ctx.params)
    if (result.statusCode === 500 || result.status === 500) {
      ctx.body = {
        statusCode: 500,
        data: result.errorMsg,
        status: result.status
      }
    } else if (result.msg) {
      ctx.body = {
        statusCode: 200,
        data: result.msg
      }
    }
  }

  // 获取售后原因
  static async getReason (ctx, next) {
    let result = await postSaleModel.getReason(ctx, ctx.params)
    ctx.body = {
      data: result.data,
      status: result.status
    }
  }
  // 获取售后原因编码
  static async getReasonCodes (ctx, next) {
    let result = await postSaleModel.getReasonCodes(ctx, ctx.params)
    ctx.body = {
      data: result.data,
      status: result.status
    }
  }

  // 获取售后类型
  static async getPostSaleWay (ctx, next) {
    let result = await postSaleModel.getPostSaleWay(ctx, ctx.params)
    ctx.body = {
      status: result.status,
      data: result.data
    }
  }

  // 获取售后申请单详情
  static async getPostSaleDetail (ctx, next) {
    let result = await postSaleModel.getPostSaleDetail(ctx, ctx.params)
    ctx.body = {
      data: result.data
    }
  }

  // 获取快递公司列表
  static async getExpressCompanies (ctx, next) {
    let result = await base.getExpressCompanies(ctx, ctx.params)
    // let list = pingyin.sortByFirstLetter(result.data.list, "shippingName")
    ctx.body = {
      data: result.data
    }
  }

  // 保存售后物流
  static async savePostSaleLogis (ctx, next) {
    let result = await postSaleModel.savePostSaleLogis(ctx, ctx.params).catch(err => {
      return {
        data: 500
      }
    })
    ctx.body = result.data
  }

  // 获取可申请售后数量
  static async getApplyNum (ctx, next) {
    let params = Object.assign(ctx.params, {
      ownCompanyId: ctx.params.companyId
    })
    let result = await postSaleModel.getApplyNum(ctx, params)
    ctx.body = {
      applyNum: result.data,
      status: result.status
    }
  }
}
module.exports = postSaleController
