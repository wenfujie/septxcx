/*
* createTime：2018/7/14
* author：en.chen
* description: 中间层提供给前端的登陆模块api
*/

//  登陆步骤1： 传递登陆后的url，获取code
const getAuthorizeUrl = require('../controller/login/authorize-url')

//  登陆步骤2： 通过code获取用户信息
const getAuthorizeInfo = require('../controller/login/authorize-info')

//  联合登陆： 通过传递步骤2中的openId获取用户信息
const userLoginService = require('../controller/login/usr-login')

//  通过openid和unionid判断用户是否存在
const existUser = require('../controller/login/exist-user')

//  合并授权登录接口
const mergeLogin = require('../controller/login/merge-login')

module.exports = {
  'POST/authorizeUrl': getAuthorizeUrl,
  'POST/authorizeInfo': getAuthorizeInfo,
  'GET/userLogin': userLoginService,
  'GET/existUser': existUser,
  'GET/mergeLogin': mergeLogin
};
