/*
* createTime：2018/7/5
* author：en.chen
* description: 中间层提供给前端的内容管理模块api
*/

const Cms = require('../controller/cms')

module.exports = {
    "GET/cmsInfoV2": Cms.getCmsInfoV2,
    "GET/crumbs": Cms.getCrumbs,
    "GET/crumbsDetail": Cms.getCrumbsDetail,
    "GET/navigation": Cms.getNavigation,
    "GET/webItemGoods": Cms.getWebItemGoods,
    "GET/choosebuyGoods": Cms.getChoosebuyGoods,
    "GET/getProperties": Cms.getProperties,
    "GET/getTemplate": Cms.getTemplate
};
