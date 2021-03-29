// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
// import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../src/assets/iconfont/iconfont.css'
import './css/common.css'
import * as echarts from 'echarts';
import apis from './services/index.js'

Vue.use(ElementUI);
Vue.use(echarts);
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = apis
Vue.config.productionTip = false
// axios.defaults.baseURL = process.env.API_ROOT
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // components: { App },
  template: '<router-view />'
})
