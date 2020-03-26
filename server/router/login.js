/*
* createTime：2018/7/14
* author：en.chen
* description: 中间层提供给前端的登陆模块api
*/

const loginFun = require("../controller/login");

module.exports = {
  // 'POST/authorizeUrl': loginFun.getAuthorizeUrl,  // 登陆步骤1： 传递登陆后的url，获取code
  // 'POST/authorizeInfo': loginFun.getAuthorizeInfo,  // 登陆步骤2： 通过code获取用户信息
  'GET/userLogin': loginFun.userLogin,  // 联合登陆： 通过传递步骤2中的openId获取用户信息
  'GET/existUser': loginFun.existUser,  // 通过openid和unionid判断用户是否存在
  'GET/mergeLogin': loginFun.mergeLogin,  // 合并授权登录接口
  'GET/getSingleCode': loginFun.getSingleCode  // 获取单点登录需要的code（搭配组件）
};
