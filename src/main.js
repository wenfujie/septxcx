import Vue from 'vue'
import MpvueRouterPatch from 'mpvue-router-patch'
import App from '@/App'

import * as filter from './utils/filterCommon.js'
import './utils/globalFun'
import './utils/common'
import Storage from "./utils/storage";

Vue.prototype.filter =filter
Vue.prototype.Storage =Storage
global.Storage =Storage


import store from '@/store' //放在global后面

Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false


// const mpvueTrace = require('mpvue-lint/mpvue-trace')
// mpvueTrace.trace(Vue)

const app = new Vue({
  mpType: 'app',
  store,
  ...App
})
app.$mount()
