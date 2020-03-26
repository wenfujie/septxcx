/*
 * @Author: lan.chen
 * @Date: 2019-06-29 14:02:08
 * @LastEditors: lan.chen
 * @LastEditTime: 2019-08-11 14:47:52
 * @Description:
 */

/**
 * 基础业务常量，提交发版
 */
global.baseConstant = {
    ossOpenUrl: "", // OSS开放路径
    busContsCode: 'D_BUSCONTS_WSC', // 业务触点 D_BUSCONTS_B2C
    signUpTypeCode: 'D_SMP', // 小程序登陆编码
    appId: 'wxecab1b2e7d4fd145',
    // appId: 'wx9f849abeb85101d6',
    serverUrl: "https://wxxcx.qishon.com/septxcx/", //test2环境
    imgBaseUrl: "https://wxxcx.qishon.com/septapi/v2/oss/image/"

    // appId: 'wxc10fdaffc0458040',
    // serverUrl: "https://testxcx.7vipgo.com/septxcx/", //预生产环境
    // imgBaseUrl: "https://testxcx.7vipgo.com/api/file/open/"

    // appId: 'wxa27a0276e7a59fd1',
    // serverUrl: "https://xcx.7vipgo.com/septxcx/", //正式环境
    // imgBaseUrl: "https://xcx.7vipgo.com/api/file/open/"
}
// 页面编码
global.pageCode = {
    //  show页模块
    'index': {
        'name': 'index',
        'children': {
            'fflb': 'fly_ad01', // 分类轮播
            'sy_dbcd': 'sy_dbcd',// 顶部菜单
            'sy_ad01': 'sy_ad01',// 首屏背景图
            'sy_splb': 'sy_splb',// 商品轮播
            'sy_hb': 'sy_hb',// 立领20元红包
            'sy_buy': 'sy_buy',// 大家都在买
            'sy_gfy': 'sy_gfy',// 高返佣
            'sy_mrdp': 'sy_mrdp',// 每日搭配
            'sy_hd01': 'sy_hd01',// 秋季上新1
            'sy_hd02': 'sy_hd02',// 秋季上新2
            'sy_hd03': 'sy_hd03',// 秋季上新3
            'sy_hd04': 'sy_hd04',// 秋季上新4
            'sy_zstj': 'sy_zstj',// 专属推荐
            'zshd': 'zty01'//专属活动
        }
    },
    // 分销商模块
    'distribution': {
        'name': 'distribution',
        'children': {
            'spread': {
                'name': 'promote',
                'code': 'tg01'
            }, // 推广
            'task': {
                'name': 'promote5',
                'code': 'rwy_ad01'
            }
        }
    }
}
