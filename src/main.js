import gio from './utils/gio-minp'
import Vue from 'vue'
import MpvueRouterPatch from 'mpvue-router-patch'
import App from '@/App'

import * as filter from './utils/filterCommon.js'
import './utils/globalFun'
import './utils/common'
import Storage from "./utils/storage";

gio('init', 'a30df84741230272', 'wxecab1b2e7d4fd145', {  //开发环境
// gio('init', 'be8060b04cbdb51b', 'wxa27a0276e7a59fd1', { // 正式环境
    version: '1.0.1',
    followShare: true,
    debug: false
});

global.gio = gio

Vue.prototype.filter =filter
Vue.prototype.Storage =Storage
global.Storage =Storage


import store from '@/store' //放在global后面

Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false

const app = new Vue({
  mpType: 'app',
  store,
  ...App
})
app.$mount()
