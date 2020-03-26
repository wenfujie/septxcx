/*
* createTime：2018/7/5
* author：en.chen
* description: 中间层提供给前端的内容管理模块api
*/

const cmsFun = require('../controller/cms')

module.exports = {
    "GET/getUsrCmsInfoV2": cmsFun.getUsrCmsInfoV2,
    "GET/getCrumbs": cmsFun.getCrumbs,
    "GET/getCrumbsDetail": cmsFun.getCrumbsDetail,
    "GET/getNavigation": cmsFun.getNavigation,
    "GET/webItemGoods": cmsFun.getWebItemGoods,
    "GET/getChooseBuyGoods": cmsFun.getChooseBuyGoods,
    "GET/getProperties": cmsFun.getProperties,
    "GET/getTemplate": cmsFun.getTemplate
};
